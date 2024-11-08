const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        ano: req.query.ano || '',
        mes: req.query.mes || '',
        codigoDaExtra: req.query.codigoDaExtra || ''
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

// Rotas para Repasses ou Transferências de Recursos

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar detalhes de um repasse ou transferência
router.get('/detalhe', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/detalhe',
    req,
    res
  )
)

// Rota para buscar dados paginados de repasses ou transferências
router.get('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/paginado',
    req,
    res
  )
)

// Rota para buscar movimentos paginados relacionados a repasses ou transferências
router.get('/movimentos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/movimentos/paginado',
    req,
    res
  )
)

// Rota para buscar detalhes de um repasse ou transferência específico usando o ID
router.get('/:id', (req, res) => {
  const { id } = req.params // Pegamos o ID da URL (que corresponde ao codigoDaExtra)
  const { ano, mes } = req.query // Pegamos os parâmetros ano e mes da query string

  // Fazemos a requisição para a API passando os parâmetros
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/detalhe',
    {
      query: {
        ano,
        mes,
        codigoDaExtra: id // Usamos o ID como codigoDaExtra na requisição
      }
    },
    res
  )
})

// Rota para buscar movimentos relacionados a um repasse ou transferência específico usando o ID
router.get('/movimentos/:id', (req, res) => {
  const id = req.params.id // Pegamos o ID da URL
  const { ano, mes } = req.query

  // Fazemos a requisição para a API passando os parâmetros necessários
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/movimentos/paginado',
    {
      query: {
        ano,
        mes,
        codigoDaExtra: id
      }
    },
    res
  )
})

module.exports = router
