const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        tipoDeConsultaDeModalidade: req.query.tipoDeConsultaDeModalidade || ''
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

// Rotas adicionais
router.get('/contratos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/contratos/paginado',
    req,
    res
  )
)

router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/data-de-atualizacao',
    req,
    res
  )
)

router.get('/empenhos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/empenhos/paginado',
    req,
    res
  )
)

router.get('/empresas-credenciadas/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/empresas-credenciadas/paginado',
    req,
    res
  )
)

router.get('/itens-cancelados-e-substituidos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/itens-cancelados-e-substituidos/paginado',
    req,
    res
  )
)

router.get('/itens-em-aberto/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/itens-em-aberto/paginado',
    req,
    res
  )
)

router.get('/itens-fracassados-ou-desertos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/itens-fracassados-ou-desertos/paginado',
    req,
    res
  )
)

router.get('/itens-vencedores/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/itens-vencedores/paginado',
    req,
    res
  )
)

router.post('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/paginado',
    req,
    res
  )
)

module.exports = router
