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
        codigo: req.query.codigo || ''
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
    '/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar detalhes de uma ordem de fornecimento
router.get('/detalhe', (req, res) => {
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/detalhe`,
    req,
    res
  )
})

router.get('/detalhe/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

// Rota para buscar dados paginados de ordens de fornecimento
router.post('/paginado', async (req, res) => {
  try {
    const filtro = req.body
    const response = await axios.post(
      `${process.env.SERVER}/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/paginado`,
      filtro,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          'cliente-integrado': process.env.CLIENTE_INTEGRADO
        }
      }
    )
    res.json(response.data)
  } catch (error) {
    console.error('Erro ao buscar dados paginados:', error)
    res.status(500).json({ error: 'Erro ao buscar dados paginados' })
  }
})

// Rota para buscar produtos relacionados a uma ordem de fornecimento
router.get('/produtos/paginado', (req, res) => {
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/produtos/paginado`,
    req,
    res
  )
})

// Rota para buscar lista de produtos by id
router.get('/produtos/paginado/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/ordem-de-fornecimento/produtos/paginado?codigo=${id}`,
    req,
    res
  )
})

module.exports = router
