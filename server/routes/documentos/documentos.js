const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    // Prepara os parâmetros da requisição
    const params = {
      pagina: req.query.pagina || 1,
      tamanhoDaPagina: req.query.tamanhoDaPagina || 10,
      tabela: req.query.tabela,
      codigoDoRegistro: req.query.codigoDoRegistro
    }

    // Remove parâmetros undefined
    Object.keys(params).forEach(
      key => params[key] === undefined && delete params[key]
    )

    console.log('Parâmetros da requisição:', {
      url: `${tenant.api_url}${path}`,
      params: params
    })

    // Adiciona a barra no final do path se não existir
    const normalizedPath = path.endsWith('/') ? path : `${path}/`

    const response = await axios.get(`${tenant.api_url}${normalizedPath}`, {
      params,
      headers: {
        Authorization: `Bearer ${tenant.token}`,
        'cliente-integrado': tenant.cliente_integrado,
        Accept: 'application/json'
      }
    })

    // Mapeia a resposta para o formato do DTO
    const mappedData = Array.isArray(response.data.registros)
      ? {
          total: response.data.total,
          registros: response.data.registros.map(doc => ({
            codigo: doc.codigo,
            descricao: doc.descricao,
            extensao: doc.extensao,
            nome: doc.nome,
            quantidadeDownloads: doc.quantidadeDownloads
          }))
        }
      : response.data

    res.json(mappedData)
  } catch (error) {
    console.error('Erro na requisição:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      path: path
    })

    res.status(error.response?.status || 500).json({
      error: 'Erro ao conectar com a API externa',
      details: error.response?.data || error.message
    })
  }
}

// Função específica para baixar documento
const downloadDocumento = async (req, res) => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    const { codigo } = req.params

    const response = await axios({
      method: 'GET',
      url: `${tenant.api_url}/api/gestao-eletronica-de-documentos/baixar-documento/${codigo}`,
      headers: {
        Authorization: `Bearer ${tenant.token}`,
        'cliente-integrado': tenant.cliente_integrado
      },
      responseType: 'arraybuffer'
    })

    // Define os headers da resposta
    res.setHeader('Content-Type', response.headers['content-type'])

    // Preserva o Content-Disposition original da API
    if (response.headers['content-disposition']) {
      res.setHeader(
        'Content-Disposition',
        response.headers['content-disposition']
      )
    }

    // Envia o arquivo
    res.send(response.data)
  } catch (error) {
    console.error('Erro ao baixar documento:', error)
    res.status(500).json({
      error: 'Erro ao baixar documento',
      details: error.message
    })
  }
}

// Rota para listar documentos
router.get('/', (req, res) => {
  fetchFromAPI('/api/gestao-eletronica-de-documentos', req, res)
})

// Rota para buscar nome do documento
router.get('/nome-pelo-codigo/:codigo', (req, res) => {
  const { codigo } = req.params
  fetchFromAPI(
    `/api/gestao-eletronica-de-documentos/nome-pelo-codigo/${codigo}`,
    req,
    res
  )
})

// Rota para baixar documento
router.get('/baixar-documento/:codigo', downloadDocumento)

module.exports = router
