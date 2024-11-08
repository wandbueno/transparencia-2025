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

router.get('/empenho/anulacoes-da-liquidacao/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/anulacoes-da-liquidacao/paginado?codigo=${id}`,
    req,
    res
  )
})

router.get('/anulacoes-empenho/:id', (req, res) => {
  const id = req.params.id // Código do empenho
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/anulacoes/paginado?codigo=${id}`,
    req,
    res
  )
})

router.get('/empenho/data-de-atualizacao', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/data-de-atualizacao', req, res)
)

router.get('/empenho/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/detalhe', req, res)
)

router.get('/empenho/estornos-de-ordem-de-pagamento/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/empenho/estornos-de-ordem-de-pagamento/paginado',
    req,
    res
  )
)

router.get('/empenho/itens/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/itens/paginado', req, res)
)

router.get('/empenho/liquidacoes/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/empenho/liquidacoes/paginado',
    req,
    res
  )
)

router.get('/empenho/ordens-de-pagamento/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/empenho/ordens-de-pagamento/paginado',
    req,
    res
  )
)

router.get('/empenho/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/paginado', req, res)
)

router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

router.get('/itens-empenho/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/itens/paginado?codigo=${id}`,
    req,
    res
  )
})

router.get('/estornos-empenho/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/estornos-de-ordem-de-pagamento/paginado?codigo=${id}`,
    req,
    res
  )
})

// Rota para buscar as liquidações relacionadas a um empenho
router.get('/liquidacoes-empenho/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/liquidacoes/paginado?codigo=${id}`,
    req,
    res
  )
})

// Rota para buscar as ordens de pagamento relacionadas a um empenho
router.get('/ordens-pagamento-empenho/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/ordens-de-pagamento/paginado?codigo=${id}`,
    req,
    res
  )
})

module.exports = router
