const express = require('express')
const router = express.Router()
const { fetchFromAPI } = require('../../services/apiService')

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/lista-inscritos-divida-ativa/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar detalhes
router.get('/detalhe', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/lista-inscritos-divida-ativa/detalhe',
    req,
    res
  )
)

// Rota para buscar dados paginados
router.get('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/lista-inscritos-divida-ativa/paginado',
    req,
    res
  )
)

module.exports = router
