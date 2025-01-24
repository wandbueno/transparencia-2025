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

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) => {
  fetchFromAPI(
    '/api/planejamento-e-politicas-publicas/programa/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar detalhes do programa
router.get('/detalhe', (req, res) => {
  const chavePrimaria = req.query.chavePrimaria
  if (!chavePrimaria) {
    return res
      .status(400)
      .json({ error: 'O parâmetro chavePrimaria é obrigatório' })
  }
  fetchFromAPI(
    '/api/planejamento-e-politicas-publicas/programa/detalhe',
    req,
    res
  )
})

// Rota para buscar lista de programas paginada
router.get('/paginado', (req, res) => {
  fetchFromAPI(
    '/api/planejamento-e-politicas-publicas/programa/paginado',
    req,
    res
  )
})

// Rota para buscar o detalhe de um programa específico com código e ano
router.get('/:id', (req, res) => {
  const codigoDoPrograma = req.params.id
  const ano = req.query.ano

  if (!codigoDoPrograma || !ano) {
    return res
      .status(400)
      .json({ error: 'Os parâmetros codigoDoPrograma e ano são obrigatórios' })
  }

  fetchFromAPI(
    `/api/planejamento-e-politicas-publicas/programa/detalhe?codigoDoPrograma=${codigoDoPrograma}&ano=${ano}`,
    req,
    res
  )
})

module.exports = router
