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
        codigoDoOrgao: req.query.codigoDoOrgao || ''
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

// Rotas para Informação Consolidada Resto a Pagar

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/informacao_consolidada_resto_a_pagar/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar detalhes de "Informação Consolidada Resto a Pagar"
router.get('/detalhe', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/informacao_consolidada_resto_a_pagar/detalhe',
    req,
    res
  )
)

// Rota para buscar dados paginados de "Informação Consolidada Resto a Pagar"
router.get('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/informacao_consolidada_resto_a_pagar/paginado',
    req,
    res
  )
)

// Rota para buscar o detalhe de uma informação consolidada específica usando o ID
router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/informacao_consolidada_resto_a_pagar/detalhe?chavePrimaria=${id}`, // Use o parâmetro correto se necessário
    req,
    res
  )
})

module.exports = router
