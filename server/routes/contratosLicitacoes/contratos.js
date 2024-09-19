const express = require('express')
const router = express.Router()
const { fetchFromAPI } = require('../../services/apiService')

// Definindo as rotas específicas para contratos
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
    res
  )
)

module.exports = router
