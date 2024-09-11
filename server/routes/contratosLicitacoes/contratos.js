const express = require('express')
const router = express.Router()
const axios = require('axios')

// Função para buscar dados da API externa
const fetchFromAPI = async (path, req, res) => {
  try {
    const url = `${process.env.SERVER}${path}`

    const response = await axios.get(url, {
      params: {
        pagina: 1,
        tamanhoDaPagina: 25
      },

      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO
      }
    })

    console.log('Resposta da API externa:', response.data)
    res.json(response.data)
  } catch (error) {
    console.error('Erro ao conectar com a API externa:', error.message)
    res.status(500).json({
      error: 'Erro ao conectar com a API externa',
      details: error.message
    })
  }
}

// Rota para buscar aditivos relacionados ao contrato
router.get('/aditivos/paginado', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/aditivos/paginado',
    req,
    res
  )
})

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar detalhes do contrato
router.get('/detalhe', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/detalhe',
    req,
    res
  )
})

// Rota para buscar dados paginados utilizados por terceiros
router.get('/detalhes-paginado', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/detalhes-paginado',
    req,
    res
  )
})

// Rota para buscar empenhos relacionados ao contrato
router.get('/empenhos/paginado', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/empenhos/paginado',
    req,
    res
  )
})

// Rota para buscar itens licitados relacionados ao contrato
router.get('/itens-licitados/paginado', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/itens-licitados/paginado',
    req,
    res
  )
})

// Rota para busca paginada de contratos
router.post('/paginado', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/paginado',
    req,
    res
  )
})

module.exports = router
