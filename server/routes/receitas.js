const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: 1,
        tamanhoDaPagina: 250,
        ano: 2024,
        mes: 7
      },
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO
      }
    })
    res.json(response.data)
  } catch (error) {
    console.error('Erro ao conectar com a API externa:', error.message)
    res.status(500).json({ error: 'Erro ao conectar com a API externa' })
  }
}

// Rota para buscar a data de atualização
router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/receita/paginado', req, res)
)

// Rota para buscar detalhes
router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/receita/detalhe', req, res)
)

// Rota para buscar dados paginados
router.get('/combo', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/receita/combo', req, res)
)

// Rota para buscar dados paginados
router.get('/movimentos', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/receita/movimentos/paginado', req, res)
)

module.exports = router
