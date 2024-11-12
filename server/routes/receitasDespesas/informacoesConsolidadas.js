const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        chavePrimaria: req.query.chavePrimaria || '',
        codigoDoEmpenho: req.query.codigoDoEmpenho || '',
        ano: req.query.ano || '',
        mes: req.query.mes || ''
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

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) => {
  fetchFromAPI(
    '/api/receitas-e-despesas/informacoes-consolidadas/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar detalhes
router.get('/detalhe', (req, res) => {
  const chavePrimaria = req.query.chavePrimaria
  if (!chavePrimaria) {
    return res
      .status(400)
      .json({ error: 'O parâmetro chavePrimaria é obrigatório' })
  }
  fetchFromAPI(
    '/api/receitas-e-despesas/informacoes-consolidadas/detalhe',
    req,
    res
  )
})

// Rota para buscar liquidações paginadas
router.get('/liquidacoes/paginado', (req, res) => {
  fetchFromAPI(
    '/api/receitas-e-despesas/informacoes-consolidadas/liquidacoes/paginado',
    req,
    res
  )
})

// Rota para buscar ordens de pagamento paginadas
router.get('/ordens-de-pagamento/paginado', (req, res) => {
  fetchFromAPI(
    '/api/receitas-e-despesas/informacoes-consolidadas/ordens-de-pagamento/paginado',
    req,
    res
  )
})

// Rota para buscar dados paginados
router.get('/paginado', (req, res) => {
  fetchFromAPI(
    '/api/receitas-e-despesas/informacoes-consolidadas/paginado',
    req,
    res
  )
})

// Rota para buscar detalhes por ID
router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/informacoes-consolidadas/detalhe?codigoDoEmpenho=${id}`,
    req,
    res
  )
})

module.exports = router
