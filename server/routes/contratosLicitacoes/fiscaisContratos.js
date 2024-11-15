const express = require('express')
const router = express.Router()
const axios = require('axios')

// Função para buscar dados da API externa
const fetchFromAPI = async (method, path, req, res, config) => {
  try {
    const token = req.headers.authorization
    const response = await axios({
      method: method,
      url: `${process.env.SERVER}${path}`,
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO
      },
      ...config
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
    'GET',
    '/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar detalhes
router.get('/detalhe', (req, res) => {
  fetchFromAPI(
    'GET',
    '/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/detalhe',
    req,
    res
  )
})

// Rota para buscar fiscais paginados
router.post('/paginado', (req, res) => {
  const filtro = req.body.filtro || {}
  console.log('Filtro recebido:', filtro)
  fetchFromAPI(
    'POST',
    '/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/paginado',
    req,
    res,
    { data: filtro }
  )
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    'GET',
    `/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

module.exports = router
