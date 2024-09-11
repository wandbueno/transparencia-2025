const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        ano: req.query.ano,
        codigoDoCliente: req.query.codigoDoCliente,
        codigoDoOrgao: req.query.codigoDoOrgao,
        estadoDoCliente: req.query.estadoDoCliente,
        logotipoDoCliente: req.query.logotipoDoCliente,
        mes: req.query.mes,
        orgaoDoCliente: req.query.orgaoDoCliente,
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 800
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

// Rotas para Extras Orçamentárias
router.get('/extra-orcamentaria/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/extra-orcamentaria/data-de-atualizacao',
    req,
    res
  )
)

router.get('/extra-orcamentaria/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/extra-orcamentaria/detalhe', req, res)
)

router.get('/extra-orcamentaria/movimentos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/extra-orcamentaria/movimentos/paginado',
    req,
    res
  )
)

router.get('/extra-orcamentaria/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/extra-orcamentaria/paginado', req, res)
)

module.exports = router
