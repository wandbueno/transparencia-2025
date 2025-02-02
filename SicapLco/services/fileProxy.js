const express = require('express')
const axios = require('axios')
const { getProcedimentoById } = require('./scraper')
const router = express.Router()

const BASE_URL = 'https://app.tce.to.gov.br/lo_publico'

router.get('/file/:procedimentoId/:token/:hash', async (req, res) => {
  try {
    const { token, hash, procedimentoId } = req.params
    const tenant = process.env.TENANT_ID

    console.log(
      `📥 Iniciando download de arquivo - Procedimento: ${procedimentoId}`
    )

    // 1. Primeiro abre o procedimento para obter uma sessão válida
    const procedimento = await getProcedimentoById(procedimentoId)

    if (!procedimento || !procedimento.sessionData) {
      throw new Error('Não foi possível obter uma sessão válida')
    }

    // 2. Configurar headers específicos usando os cookies da sessão
    const headers = {
      Accept:
        'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.*,application/octet-stream',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      Cookie: procedimento.sessionData.cookies,
      Pragma: 'no-cache',
      Referer: `${BASE_URL}/pesquisar/detalhes?idProcedimento=${procedimentoId}`,
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }

    // 3. Fazer requisição para o TCE
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/castor/arquivo`,
      params: {
        t: token,
        h: hash
      },
      responseType: 'arraybuffer',
      headers,
      maxRedirects: 5,
      validateStatus: status => status < 400,
      timeout: 30000
    })

    // 4. Verificar se a resposta é HTML (erro)
    const contentType = response.headers['content-type']
    if (contentType.includes('text/html')) {
      throw new Error(
        'Recebido HTML ao invés do arquivo. Possível erro de autenticação.'
      )
    }

    // 5. Processar o Content-Disposition para obter o nome do arquivo original
    const contentDisposition = response.headers['content-disposition']
    let filename = 'download'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      )
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, '')
        // Se o nome do arquivo não tiver extensão, tenta inferir do Content-Type
        if (!filename.includes('.')) {
          if (contentType.includes('pdf')) filename += '.pdf'
          else if (contentType.includes('msword')) filename += '.doc'
          else if (contentType.includes('officedocument.wordprocessingml'))
            filename += '.docx'
          else if (contentType.includes('officedocument.spreadsheetml'))
            filename += '.xlsx'
        }
      }
    }

    // 6. Configurar headers da resposta
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': response.data.length,
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    })

    // 7. Enviar o arquivo
    res.send(response.data)

    console.log(`✅ Arquivo baixado com sucesso: ${filename}`)
  } catch (error) {
    console.error('❌ Erro no proxy de arquivo:', {
      message: error.message,
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data?.toString()
    })

    // Se for erro 404, retorna mensagem específica
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: 'Arquivo não encontrado',
        message:
          'O arquivo solicitado não está mais disponível ou requer nova autenticação'
      })
    }

    res.status(error.response?.status || 500).json({
      error: 'Falha ao recuperar arquivo',
      details: error.message
    })
  }
})

module.exports = router
