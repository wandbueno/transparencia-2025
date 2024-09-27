const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        chavePrimaria: req.query.chavePrimaria || ''
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

// Rotas para Empenho
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/ordem-de-pagamento/data-de-atualizacao',
    req,
    res
  )
)

router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/ordem-de-pagamento/detalhe', req, res)
)

router.get('/estornos-de-ordem-de-pagamento/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/ordem-de-pagamento/estornos/paginado',
    req,
    res
  )
)

router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/ordem-de-pagamento/paginado', req, res)
)

router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/ordem-de-pagamento/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

module.exports = router
