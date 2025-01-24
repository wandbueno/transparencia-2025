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
    '/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar detalhes
router.get('/detalhe', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/detalhe',
    req,
    res
  )
})

// Rota para buscar dados paginados
router.post('/paginado', async (req, res) => {
  try {
    const filtro = req.body
    const response = await axios.post(
      `${process.env.SERVER}/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/paginado`,
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

// Rota para buscar contratos do fiscal paginados
router.get('/contratos-do-fiscal/paginado', (req, res) => {
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/contratos-do-fiscal/paginado',
    req,
    res
  )
})

// Rota para buscar contratos do fiscal by id
router.get('/contratos-do-fiscal/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/contratos-do-fiscal/paginado?codigo=${id}`,
    req,
    res
  )
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

module.exports = router
