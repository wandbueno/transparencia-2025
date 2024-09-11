const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: 1,
        tamanhoDaPagina: 500,
        ano: 2024,
        mes: 8,
        mesInteger: 8,
        orgaoDoCliente: 2
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

// Rotas para Servidores
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/data-de-atualizacao',
    req,
    res
  )
)

router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/orgaos-e-servidores/servidor/detalhe', req, res)
)

router.get('/movimento-complementar/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento-complementar/paginado',
    req,
    res
  )
)

router.get('/movimento-ferias/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento-ferias/paginado',
    req,
    res
  )
)

router.get('/movimento-rescisao/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento-rescisao/paginado',
    req,
    res
  )
)

router.get('/movimento-sessoes-extraordinarias/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento-sessoes-extraordinarias/paginado',
    req,
    res
  )
)

router.get('/movimento-vencimentos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento-vencimentos/paginado',
    req,
    res
  )
)

router.get('/movimento13-salario/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento13-salario/paginado',
    req,
    res
  )
)

router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/orgaos-e-servidores/servidor/paginado', req, res)
)

module.exports = router
