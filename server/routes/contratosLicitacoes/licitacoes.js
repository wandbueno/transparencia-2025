const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    // console.log('Parâmetros recebidos:', {
    //   pagina: req.query.pagina,
    //   tamanhoDaPagina: req.query.tamanhoDaPagina,
    //   tipoDeConsultaDeModalidade: req.query.tipoDeConsultaDeModalidade,
    //   ano: req.query.ano,
    //   codigoDoOrgao: req.query.codigoDoOrgao,
    //   codigoDaModalidade: req.query.codigoDaModalidade,
    //   situacoes: req.query.situacoes,
    //   cpfCnpj: req.query.cpfCnpj,
    //   fornecedor: req.query.fornecedor,
    //   objeto: req.query.objeto
    // })

    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        tipoDeConsultaDeModalidade: req.query.tipoDeConsultaDeModalidade || '',
        ano: req.query.ano || '',
        codigoDoOrgao: req.query.codigoDoOrgao || '',
        codigoDaModalidade: req.query.codigoDaModalidade || '',
        situacoes: req.query.situacoes || '',
        cpfCnpj: req.query.cpfCnpj || '',
        fornecedor: req.query.fornecedor || '',
        objeto: req.query.objeto || '',
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

router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/data-de-atualizacao',
    req,
    res
  )
)

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

// Rota para buscar contratos relacionados ao procedimento licitatório usando o :id
router.get('/contratos/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/contratos/paginado?codigo=${id}`,
    req,
    res
  )
})

// Rota para buscar empenhos relacionados ao procedimento licitatório usando o :id
router.get('/empenhos/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/empenhos/paginado?codigo=${id}`,
    req,
    res
  )
})

// Rota para buscar empresas credenciadas usando o :id
router.get('/empresas-credenciadas/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/empresas-credenciadas/paginado?codigo=${id}`,
    req,
    res
  )
})

// Rota para buscar itens cancelados e substituídos usando o :id
router.get('/itens-cancelados-e-substituidos/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/itens-cancelados-e-substituidos/paginado?codigo=${id}`,
    req,
    res
  )
})

// Rota para buscar itens em aberto usando o :id
router.get('/itens-em-aberto/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/itens-em-aberto/paginado?codigo=${id}`,
    req,
    res
  )
})

// Rota para buscar itens fracassados ou desertos usando o :id
router.get('/itens-fracassados-ou-desertos/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/itens-fracassados-ou-desertos/paginado?codigo=${id}`,
    req,
    res
  )
})

router.post('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/paginado',
    req,
    res
  )
)

// Rota para buscar itens vencedores relacionados a um procedimento licitatório usando o :id
router.get('/itens-vencedores/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/itens-vencedores/paginado?codigo=${id}`,
    req,
    res
  )
})

module.exports = router
