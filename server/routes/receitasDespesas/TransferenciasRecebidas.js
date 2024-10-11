const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        codigoDaReceita: req.query.codigoDaReceita || '',
        ano: req.query.ano || '',
        codigoDoOrgao: req.query.codigoDoOrgao || ''
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
    '/api/receitas-e-despesas/transferencias-voluntarias-recebidas/data-de-atualizacao',
    req,
    res
  )
)

router.get('/detalhe', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/transferencias-voluntarias-recebidas/detalhe',
    req,
    res
  )
)

router.get('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/transferencias-voluntarias-recebidas/paginado',
    req,
    res
  )
)

// Rota para obter os detalhes de uma transferência específica apenas com o código da receita
router.get('/:id', (req, res) => {
  const { id } = req.params // O 'id' será o código da receita

  // Agora, a URL que você está montando para a requisição externa usa apenas o código da receita
  fetchFromAPI(
    `/api/receitas-e-despesas/transferencias-voluntarias-recebidas/detalhe?codigoDaReceita=${id}`,
    req,
    res
  )
})

module.exports = router
