const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res, method = 'get') => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    const config = {
      method,
      url: `${tenant.api_url}${path}`,
      headers: {
        Authorization: `Bearer ${tenant.token}`,
        'cliente-integrado': tenant.cliente_integrado
      }
    }

    // Se for POST, adiciona o body
    if (method === 'post') {
      config.data = req.body
    }
    // Se for GET, adiciona os parâmetros na query
    else if (method === 'get') {
      config.params = {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        chavePrimaria: req.query.chavePrimaria || '',
        ...req.query
      }
    }

    console.log('Requisição para API:', {
      url: config.url,
      method: config.method,
      params: method === 'get' ? config.params : undefined,
      data: method === 'post' ? config.data : undefined
    })

    const response = await axios(config)
    res.json(response.data)
  } catch (error) {
    console.error('Erro ao conectar com a API externa:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })

    res.status(error.response?.status || 500).json({
      error: 'Erro ao conectar com a API externa',
      details: error.response?.data || error.message
    })
  }
}

// Rotas para contratos
router.get('/aditivos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/aditivos/paginado',
    req,
    res
  )
)

router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/data-de-atualizacao',
    req,
    res
  )
)

router.get('/detalhe', (req, res) => {
  const id = req.query.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/contrato/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

router.get('/detalhes-paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/detalhes-paginado',
    req,
    res
  )
)

router.get('/empenhos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/empenhos/paginado',
    req,
    res
  )
)

router.get('/itens-licitados/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/itens-licitados/paginado',
    req,
    res
  )
)

router.post('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/paginado',
    req,
    res,
    'post'
  )
)

module.exports = router
