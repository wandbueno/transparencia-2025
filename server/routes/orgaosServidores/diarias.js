const express = require('express')
const router = express.Router()
const { fetchFromAPI } = require('../../services/apiService')

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) => {
  fetchFromAPI('/api/orgaos-e-servidores/diaria/data-de-atualizacao', req, res)
})

// Rota para buscar detalhes
router.get('/detalhe', (req, res) => {
  fetchFromAPI('/api/orgaos-e-servidores/diaria/detalhe', req, res)
})

// Rota para buscar dados paginados
router.get('/paginado', (req, res) => {
  fetchFromAPI('/api/orgaos-e-servidores/diaria/paginado', req, res)
})

// Rota para buscar anulações de liquidações paginadas
router.get('/anulacoes-de-liquidacoes/paginado', (req, res) => {
  fetchFromAPI(
    '/api/orgaos-e-servidores/diaria/anulacoes-de-liquidacoes/paginado',
    req,
    res
  )
})

module.exports = router
