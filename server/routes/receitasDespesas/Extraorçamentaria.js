const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 800,
        ano: req.query.ano || '',
        mes: req.query.mes || '',
        codigoDaExtra: req.query.codigoDaExtra || '',
        codigoDoCliente: req.query.codigoDoCliente,
        codigoDoOrgao: req.query.codigoDoOrgao,
        estadoDoCliente: req.query.estadoDoCliente,
        logotipoDoCliente: req.query.logotipoDoCliente,
        orgaoDoCliente: req.query.orgaoDoCliente,
        tipoDeExtra: req.query.tipoDeExtra
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
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/extra-orcamentaria/data-de-atualizacao',
    req,
    res
  )
)

router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/extra-orcamentaria/detalhe', req, res)
)

router.get('/movimentos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/extra-orcamentaria/movimentos/paginado',
    req,
    res
  )
)

router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/extra-orcamentaria/paginado', req, res)
)

// Rota para buscar detalhes de uma extra orçamentária usando os parâmetros ano, mes e id (no lugar de codigoDaExtra)
router.get('/:id', (req, res) => {
  const { id } = req.params // Pegamos o ID da URL (que corresponde ao codigoDaExtra)
  const { ano, mes } = req.query // Pegamos os parâmetros ano e mes da query string

  // Fazemos a requisição para a API passando os parâmetros
  fetchFromAPI(
    '/api/receitas-e-despesas/extra-orcamentaria/detalhe',
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

// Rota para buscar a lista de movimentos paginada relacionada a uma extra orçamentária
router.get('/movimentos/paginado/:id', (req, res) => {
  const { id } = req.params // ID que corresponde ao codigoDaExtra
  const { ano, mes } = req.query // Parâmetros ano e mes fornecidos pela query string

  // Fazemos a requisição para a API passando o codigoDaExtra, ano e mes como parâmetros
  fetchFromAPI(
    '/api/receitas-e-despesas/extra-orcamentaria/movimentos/paginado',
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

module.exports = router
