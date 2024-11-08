const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 10000,
        chavePrimaria: req.query.chavePrimaria || '',
        ano: req.query.ano || ''
      },
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO
      }
    })
    res.json(response.data)
  } catch (error) {
    console.error(
      'Erro ao conectar com a API externa:',
      error.response ? error.response.data : error.message
    )
    res.status(500).json({ error: 'Erro ao conectar com a API externa' })
  }
}

// Rotas para Despesas Fixadas

// Rota para buscar a data de atualização das despesas fixadas
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/despesas-fixadas/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar os detalhes de uma despesa fixada
router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/despesas-fixadas/detalhe', req, res)
)

// Rota para buscar os dados paginados das despesas fixadas
router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/despesas-fixadas/paginado', req, res)
)

// Rota para buscar o detalhe de uma despesa fixada específica usando o ID
router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/despesas-fixadas/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

module.exports = router
