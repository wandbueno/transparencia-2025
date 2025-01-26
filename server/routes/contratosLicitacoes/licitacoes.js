const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res, method = 'get') => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${tenant.token}`,
        'cliente-integrado': tenant.cliente_integrado,
        Accept: 'application/json'
      }
    }

    // Se for POST, usa o body da requisição
    if (method === 'post') {
      const requestBody = {
        pagina: req.body.pagina || 1,
        tamanhoDaPagina: req.body.tamanhoDaPagina || 2500,
        ano: req.body.ano,
        anoDoProcesso: req.body.anoDoProcesso,
        codigoDaLicitacao: req.body.codigoDaLicitacao,
        codigoDoOrgao: req.body.codigoDoOrgao,
        codigosDasModalidades: req.body.codigosDasModalidades,
        covid19: req.body.covid19,
        cpfCnpj: req.body.cpfCnpj,
        dataDeAberturaFinal: req.body.dataDeAberturaFinal,
        dataDeAberturaInicial: req.body.dataDeAberturaInicial,
        dataDeHomologacaoFinal: req.body.dataDeHomologacaoFinal,
        dataDeHomologacaoInicial: req.body.dataDeHomologacaoInicial,
        dataDeJulgamentoFinal: req.body.dataDeJulgamentoFinal,
        dataDeJulgamentoInicial: req.body.dataDeJulgamentoInicial,
        dataDePublicacaoFinal: req.body.dataDePublicacaoFinal,
        dataDePublicacaoInicial: req.body.dataDePublicacaoInicial,
        estadoDoCliente: req.body.estadoDoCliente,
        fornecedor: req.body.fornecedor,
        isLicitacaoJulgada: req.body.isLicitacaoJulgada,
        logotipoDoCliente: req.body.logotipoDoCliente,
        naturezaDoProcedimento: req.body.naturezaDoProcedimento,
        numero: req.body.numero,
        numeroAno: req.body.numeroAno,
        numeroDoProcesso: req.body.numeroDoProcesso,
        objeto: req.body.objeto,
        ordenacao: req.body.ordenacao,
        orgaoDoCliente: req.body.orgaoDoCliente,
        produto: req.body.produto,
        situacoes: req.body.situacoes,
        tipoDeConsultaDeModalidade: req.body.tipoDeConsultaDeModalidade,
        valorTotalEstimadoFinal: req.body.valorTotalEstimadoFinal,
        valorTotalEstimadoInicial: req.body.valorTotalEstimadoInicial
      }

      // Remove campos undefined
      Object.keys(requestBody).forEach(key => {
        if (requestBody[key] === undefined) {
          delete requestBody[key]
        }
      })

      console.log('POST request:', {
        url: `${tenant.api_url}${path}`,
        body: requestBody
      })

      const response = await axios.post(
        `${tenant.api_url}${path}`,
        requestBody,
        config
      )
      return res.json(response.data)
    }

    // Se for GET, usa query params
    const params = {
      pagina: req.query.pagina || 1,
      tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
      tipoDeConsultaDeModalidade: req.query.tipoDeConsultaDeModalidade || '',
      codigo: req.query.codigo || '',
      chavePrimaria: req.query.chavePrimaria || ''
    }

    console.log('GET request:', {
      url: `${tenant.api_url}${path}`,
      params: params
    })

    const response = await axios.get(`${tenant.api_url}${path}`, {
      ...config,
      params
    })

    res.json(response.data)
  } catch (error) {
    console.error('Erro na requisição:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      path: path
    })

    res.status(error.response?.status || 500).json({
      error: 'Erro ao conectar com a API externa',
      details: error.response?.data || error.message
    })
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
