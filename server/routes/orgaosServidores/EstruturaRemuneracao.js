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
        codigoDoNivel: req.query.codigoDoNivel || ''
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
    '/api/orgaos-e-servidores/estrutura-de-remuneracao/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar detalhes da estrutura de remuneração
router.get('/detalhe', (req, res) => {
  fetchFromAPI(
    '/api/orgaos-e-servidores/estrutura-de-remuneracao/detalhe',
    req,
    res
  )
})

// Rota para buscar dados paginados da estrutura de remuneração
router.get('/paginado', (req, res) => {
  fetchFromAPI(
    '/api/orgaos-e-servidores/estrutura-de-remuneracao/paginado',
    req,
    res
  )
})

// Rota para buscar detalhes de uma estrutura de remuneração usando os parâmetros ano, mes e codigoDoNivel
router.get('/:codigoDoNivel', (req, res) => {
  const { codigoDoNivel } = req.params // Pegamos o código do nível da URL
  const { ano, mes } = req.query // Pegamos os parâmetros ano e mes da query string

  // Fazemos a requisição para a API passando os parâmetros
  fetchFromAPI(
    '/api/orgaos-e-servidores/estrutura-de-remuneracao/detalhe',
    {
      query: {
        ano,
        mes,
        codigoDoNivel
      }
    },
    res
  )
})

module.exports = router
