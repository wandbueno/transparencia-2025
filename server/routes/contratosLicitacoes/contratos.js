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

// Definindo as rotas específicas para contratos
router.get('/aditivos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/aditivos/paginado',
    req,
    res
  )
)

router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/data-de-atualizacao',
    req,
    res
  )
)

router.get('/detalhe', (req, res) => {
  const id = req.query.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/contrato/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

router.get('/detalhes-paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/detalhes-paginado',
    req,
    res
  )
)

router.get('/empenhos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/empenhos/paginado',
    req,
    res
  )
)

router.get('/itens-licitados/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/itens-licitados/paginado',
    req,
    res
  )
)

router.post('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/contrato/paginado',
    req,
    res
  )
)

module.exports = router
