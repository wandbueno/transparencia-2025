const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: 1,
        tamanhoDaPagina: 2500
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

// Definindo as rotas específicas
router.get('/', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/detalhes-paginado',
    req,
    res
  )
)

router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

module.exports = router
