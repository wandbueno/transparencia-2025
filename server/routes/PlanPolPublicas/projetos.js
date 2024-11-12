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
        acaoCodigo: req.query.acaoCodigo || '',
        ano: req.query.ano || '',
        mes: req.query.mes || ''
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
    '/api/planejamento-e-politicas-publicas/projeto/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar detalhes do projeto
router.get('/detalhe', (req, res) => {
  const chavePrimaria = req.query.chavePrimaria
  if (!chavePrimaria) {
    return res
      .status(400)
      .json({ error: 'O parâmetro chavePrimaria é obrigatório' })
  }
  fetchFromAPI(
    '/api/planejamento-e-politicas-publicas/projeto/detalhe',
    req,
    res
  )
})

// Rota para buscar metas do projeto paginadas
router.get('/metas/paginado', (req, res) => {
  fetchFromAPI(
    '/api/planejamento-e-politicas-publicas/projeto/metas/paginado',
    req,
    res
  )
})

// Rota para buscar lista de projetos paginada
router.get('/paginado', (req, res) => {
  fetchFromAPI(
    '/api/planejamento-e-politicas-publicas/projeto/paginado',
    req,
    res
  )
})

router.get('/:acaoCodigo/:ano/:mes', (req, res) => {
  const { acaoCodigo, ano, mes } = req.params
  fetchFromAPI(
    '/api/planejamento-e-politicas-publicas/projeto/detalhe',
    {
      ...req,
      query: {
        ...req.query,
        acaoCodigo,
        ano,
        mes
      }
    },
    res
  )
})

module.exports = router
