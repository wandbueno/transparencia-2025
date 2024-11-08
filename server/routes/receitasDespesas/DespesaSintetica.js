const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        codigoDaFuncao: req.query.codigoDaFuncao || '',
        codigoDoOrgao: req.query.codigoDoOrgao || '',
        mes: req.query.mes || '',
        ano: req.query.ano || '',
        codigoDaDespesa: req.query.codigoDaDespesa || ''
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

// Rotas para Despesas Sintéticas

// Rota para buscar a data de atualização das despesas sintéticas
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/despesa-sintetica/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar detalhes das despesas sintéticas
router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/despesa-sintetica/detalhe', req, res)
)

// Rota para buscar dados de despesas sintéticas paginados
router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/despesa-sintetica/paginado', req, res)
)
router.get('/:id/:mes', (req, res) => {
  const id = req.params.id
  const mes = req.params.mes // Captura o mês da URL

  fetchFromAPI(
    `/api/receitas-e-despesas/despesa-sintetica/detalhe?codigoDaDespesa=${id}&mes=${mes}`,
    req,
    res
  )
})

module.exports = router
