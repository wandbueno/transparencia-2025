const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        ano: req.query.ano || '',
        mes: req.query.mes || '',
        liquidacao: req.query.liquidacao || ''
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

// Rotas para Ordem Cronológica de Pagamentos

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/relatorio-de-ordem-cronologica-de-pagamentos/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar dados paginados
router.get('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/relatorio-de-ordem-cronologica-de-pagamentos/paginado',
    req,
    res
  )
)

// Rota para buscar detalhes de uma liquidação específica
router.get('/detalhe', (req, res) => {
  const { ano, mes, liquidacao } = req.query
  fetchFromAPI(
    `/api/receitas-e-despesas/relatorio-de-ordem-cronologica-de-pagamentos/detalhe?ano=${ano}&mes=${mes}&liquidacao=${liquidacao}`,
    req,
    res
  )
})

module.exports = router
