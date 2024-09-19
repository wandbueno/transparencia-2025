const express = require('express')
const router = express.Router()
const { fetchFromAPI } = require('../../services/apiService')

// Rotas para Empenho
router.get('/empenho/anulacoes-da-liquidacao/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/empenho/anulacoes-da-liquidacao/paginado',
    req,
    res
  )
)

router.get('/empenho/anulacoes/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/anulacoes/paginado', req, res)
)

router.get('/empenho/data-de-atualizacao', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/data-de-atualizacao', req, res)
)

router.get('/empenho/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/detalhe', req, res)
)

router.get('/empenho/estornos-de-ordem-de-pagamento/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/empenho/estornos-de-ordem-de-pagamento/paginado',
    req,
    res
  )
)

router.get('/empenho/itens/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/itens/paginado', req, res)
)

router.get('/empenho/liquidacoes/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/empenho/liquidacoes/paginado',
    req,
    res
  )
)

router.get('/empenho/ordens-de-pagamento/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/empenho/ordens-de-pagamento/paginado',
    req,
    res
  )
)

router.get('/empenho/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/paginado', req, res)
)

module.exports = router
