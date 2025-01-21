const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    // Parâmetros da API de Empenho
    const params = {
      pagina: req.query.pagina || 1,
      tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
      cnpjDoFornecedor: req.query.cnpjDoFornecedor,
      codigoDaFuncao: req.query.codigoDaFuncao
        ? parseInt(req.query.codigoDaFuncao)
        : undefined,
      codigoDaModalidade: req.query.codigoDaModalidade
        ? parseInt(req.query.codigoDaModalidade)
        : undefined,
      codigoDaSubFuncao: req.query.codigoDaSubFuncao
        ? parseInt(req.query.codigoDaSubFuncao)
        : undefined,
      codigoDaUnidade: req.query.codigoDaUnidade
        ? parseInt(req.query.codigoDaUnidade)
        : undefined,
      codigoDoCliente: req.query.codigoDoCliente
        ? parseInt(req.query.codigoDoCliente)
        : undefined,
      codigoDoElemento: req.query.codigoDoElemento
        ? parseInt(req.query.codigoDoElemento)
        : undefined,
      codigoDoOrgao: req.query.codigoDoOrgao
        ? parseInt(req.query.codigoDoOrgao)
        : undefined,
      codigoDoPrograma: req.query.codigoDoPrograma
        ? parseInt(req.query.codigoDoPrograma)
        : undefined,
      codigoTituloDaFonte: req.query.codigoTituloDaFonte
        ? parseInt(req.query.codigoTituloDaFonte)
        : undefined,
      covid19: req.query.covid19,
      dataFinal: req.query.dataFinal,
      dataInicial: req.query.dataInicial,
      estadoDoCliente: req.query.estadoDoCliente,
      etapaDaDespesa: req.query.etapaDaDespesa
        ? parseInt(req.query.etapaDaDespesa)
        : undefined,
      faseDoEmpenho: req.query.faseDoEmpenho
        ? parseInt(req.query.faseDoEmpenho)
        : undefined,
      fonteDoEmpenho: req.query.fonteDoEmpenho,
      logotipoDoCliente: req.query.logotipoDoCliente,
      nomeDoFornecedor: req.query.nomeDoFornecedor,
      numeroDoTcm: req.query.numeroDoTcm,
      numeroEAnoDaLicitacao: req.query.numeroEAnoDaLicitacao,
      orgaoDoCliente: req.query.orgaoDoCliente,
      rubricaDaDespesa: req.query.rubricaDaDespesa,
      servicoDoPrestador: req.query.servicoDoPrestador,
      valorDoEmpenho: req.query.valorDoEmpenho
        ? parseFloat(req.query.valorDoEmpenho)
        : undefined,
      chavePrimaria: req.query.chavePrimaria,
      codigo: req.query.codigo
    }

    // Remove parâmetros undefined
    Object.keys(params).forEach(
      key => params[key] === undefined && delete params[key]
    )

    console.log('Requisição para API:', {
      url: `${tenant.api_url}${path}`,
      method: 'GET',
      params: params,
      tenant: tenant.name
    })

    const response = await axios.get(`${tenant.api_url}${path}`, {
      params: params,
      headers: {
        Authorization: `Bearer ${tenant.token}`,
        'cliente-integrado': tenant.cliente_integrado
      }
    })

    res.json(response.data)
  } catch (error) {
    console.error('Erro na requisição:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      path: path,
      tenant: req.tenant?.name
    })

    res.status(error.response?.status || 500).json({
      error: 'Erro ao conectar com a API externa',
      details: error.response?.data || error.message
    })
  }
}

router.get('/empenho/anulacoes-da-liquidacao/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/anulacoes-da-liquidacao/paginado?codigo=${id}`,
    req,
    res
  )
})

router.get('/anulacoes-empenho/:id', (req, res) => {
  const id = req.params.id // Código do empenho
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/anulacoes/paginado?codigo=${id}`,
    req,
    res
  )
})

router.get('/empenho/data-de-atualizacao', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/data-de-atualizacao', req, res)
)

router.get('/empenho/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/detalhe', req, res)
)

router.get('/empenho/estornos-de-ordem-de-pagamento/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/empenho/estornos-de-ordem-de-pagamento/paginado',
    req,
    res
  )
)

router.get('/empenho/itens/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/itens/paginado', req, res)
)

router.get('/empenho/liquidacoes/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/empenho/liquidacoes/paginado',
    req,
    res
  )
)

router.get('/empenho/ordens-de-pagamento/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/empenho/ordens-de-pagamento/paginado',
    req,
    res
  )
)

router.get('/empenho/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/empenho/paginado', req, res)
)

router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

router.get('/itens-empenho/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/itens/paginado?codigo=${id}`,
    req,
    res
  )
})

router.get('/estornos-empenho/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/estornos-de-ordem-de-pagamento/paginado?codigo=${id}`,
    req,
    res
  )
})

// Rota para buscar as liquidações relacionadas a um empenho
router.get('/liquidacoes-empenho/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/liquidacoes/paginado?codigo=${id}`,
    req,
    res
  )
})

// Rota para buscar as ordens de pagamento relacionadas a um empenho
router.get('/ordens-pagamento-empenho/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/empenho/ordens-de-pagamento/paginado?codigo=${id}`,
    req,
    res
  )
})

module.exports = router
