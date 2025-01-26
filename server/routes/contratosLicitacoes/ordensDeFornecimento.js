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
      headers: {
        Authorization: `Bearer ${tenant.token}`,
        'cliente-integrado': tenant.cliente_integrado,
        Accept: 'application/json'
      }
    }

    // Se for POST, usa o body da requisição
    if (method === 'post') {
      const requestBody = {
        pagina: req.body.pagina || 1,
        tamanhoDaPagina: req.body.tamanhoDaPagina || -1,
        codigoDoCliente: req.body.codigoDoCliente,
        codigosDasModalidades: req.body.codigosDasModalidades,
        cpfOuCnpj: req.body.cpfOuCnpj,
        dataFinal: req.body.dataFinal,
        dataInicial: req.body.dataInicial,
        estadoDoCliente: req.body.estadoDoCliente,
        fornecedor: req.body.fornecedor,
        licitacao: req.body.licitacao,
        logotipoDoCliente: req.body.logotipoDoCliente,
        numeroDaCompra: req.body.numeroDaCompra,
        ordenacao: req.body.ordenacao,
        orgaoDoCliente: req.body.orgaoDoCliente
      }

      // Remove campos undefined
      Object.keys(requestBody).forEach(key => {
        if (requestBody[key] === undefined) {
          delete requestBody[key]
        }
      })

      console.log('POST request:', {
        url: `${tenant.api_url}${path}`,
        body: requestBody
      })

      const response = await axios.post(
        `${tenant.api_url}${path}`,
        requestBody,
        config
      )
      return res.json(response.data)
    }

    // Se for GET, usa query params
    const params = {
      pagina: req.query.pagina || 1,
      tamanhoDaPagina: req.query.tamanhoDaPagina || -1,
      chavePrimaria: req.query.chavePrimaria || '',
      codigo: req.query.codigo || ''
    }

    console.log('GET request:', {
      url: `${tenant.api_url}${path}`,
      params: params
    })

    const response = await axios.get(`${tenant.api_url}${path}`, {
      ...config,
      params
    })

    res.json(response.data)
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

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar detalhes de uma ordem de fornecimento
router.get('/detalhe', (req, res) => {
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/detalhe`,
    req,
    res
  )
})

router.get('/detalhe/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

// Rota POST para dados paginados
router.post('/paginado', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/paginado',
    req,
    res,
    'post'
  )
})

// Rota para buscar produtos relacionados a uma ordem de fornecimento
router.get('/produtos/paginado', (req, res) => {
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/produtos/paginado`,
    req,
    res
  )
})

// Rota para buscar lista de produtos by id
router.get('/produtos/paginado/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/produtos/paginado?codigo=${id}`,
    req,
    res
  )
})

module.exports = router
