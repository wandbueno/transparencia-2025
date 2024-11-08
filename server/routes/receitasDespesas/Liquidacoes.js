const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        codigoDaFuncao: req.query.codigoDaFuncao || ''
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

// Rotas para Liquidações

// Rota para buscar anulações de liquidações paginadas
router.get('/anulacoes/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/liquidacao/anulacoes/paginado',
    req,
    res
  )
)

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/liquidacao/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar os detalhes de uma liquidação
router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/liquidacao/detalhe', req, res)
)

// Rota para buscar dados de liquidações paginados
router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/liquidacao/paginado', req, res)
)

// Rota para buscar o detalhe de uma liquidação específica com o ID
router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/liquidacao/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

module.exports = router
