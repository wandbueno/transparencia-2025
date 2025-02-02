const express = require('express')
const axios = require('axios')
const { getProcedimentoById } = require('./scraper')
const router = express.Router()

const BASE_URL = 'https://app.tce.to.gov.br/lo_publico'

router.get('/file/:procedimentoId/:token', async (req, res) => {
  try {
    const { token, procedimentoId } = req.params
    const tenant = process.env.TENANT_ID

    console.log(
      `📥 Iniciando download de arquivo - Procedimento: ${procedimentoId}, Token: ${token}`
    )

    // 1. Obter metadados da sessão
    const { sessionData } = await getProcedimentoById(procedimentoId)

    // 2. Configurar headers específicos
    const headers = {
      Referer: sessionData.referer,
      Cookie: sessionData.cookies,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }

    // 3. Fazer requisição para o TCE
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/castor/arquivo`,
      params: { t: token },
      responseType: 'arraybuffer',
      headers,
      maxRedirects: 0
    })

    // 4. Processar o Content-Disposition para obter o nome do arquivo original
    const contentDisposition = response.headers['content-disposition']
    let filename = 'download'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      )
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, '')
      }
    }

    // 5. Determinar o Content-Type correto
    const contentType = response.headers['content-type']

    // 6. Configurar headers da resposta
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': response.data.length
    })

    // 7. Enviar o arquivo
    res.send(response.data)
  } catch (error) {
    console.error('❌ Erro no proxy de arquivo:', {
      message: error.message,
      response: error.response?.status,
      headers: error.response?.headers
    })

    res.status(error.response?.status || 500).json({
      error: 'Falha ao recuperar arquivo',
      details: error.message
    })
  }
})

module.exports = router
