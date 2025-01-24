const express = require('express')
const router = express.Router()
const axios = require('axios')

const formatDate = dateString => {
  if (!dateString) return undefined

  try {
    // Converte de YYYY-MM-DD para DD/MM/YYYY
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Erro ao formatar data:', error)
    return undefined
  }
}

const fetchFromAPI = async (path, req, res) => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    // Extrai e formata as datas
    const { dataInicial, dataFinal, ...otherParams } = req.query

    // Prepara os parâmetros da requisição
    const params = {
      pagina: otherParams.pagina || 1,
      tamanhoDaPagina: otherParams.tamanhoDaPagina || '-1',
      cnpjDoFornecedor: otherParams.cnpjDoFornecedor,
      codigoDaFuncao: otherParams.codigoDaFuncao,
      codigoDaModalidade: otherParams.codigoDaModalidade,
      codigoDaSubFuncao: otherParams.codigoDaSubFuncao,
      codigoDaUnidade: otherParams.codigoDaUnidade,
      codigoDoCliente: otherParams.codigoDoCliente,
      codigoDoElemento: otherParams.codigoDoElemento,
      codigoDoOrgao: otherParams.codigoDoOrgao,
      codigoDoPrograma: otherParams.codigoDoPrograma,
      codigoTituloDaFonte: otherParams.codigoTituloDaFonte,
      covid19: otherParams.covid19,
      estadoDoCliente: otherParams.estadoDoCliente,
      etapaDaDespesa: otherParams.etapaDaDespesa,
      faseDoEmpenho: otherParams.faseDoEmpenho,
      fonteDoEmpenho: otherParams.fonteDoEmpenho,
      logotipoDoCliente: otherParams.logotipoDoCliente,
      nomeDoFornecedor: otherParams.nomeDoFornecedor,
      numeroDoTcm: otherParams.numeroDoTcm,
      numeroEAnoDaLicitacao: otherParams.numeroEAnoDaLicitacao,
      orgaoDoCliente: otherParams.orgaoDoCliente,
      rubricaDaDespesa: otherParams.rubricaDaDespesa,
      servicoDoPrestador: otherParams.servicoDoPrestador,
      valorDoEmpenho: otherParams.valorDoEmpenho,
      // Adiciona as datas formatadas se existirem
      ...(dataInicial && { dataInicial: formatDate(dataInicial) }),
      ...(dataFinal && { dataFinal: formatDate(dataFinal) })
    }

    // Remove parâmetros undefined
    Object.keys(params).forEach(
      key => params[key] === undefined && delete params[key]
    )

    console.log('Parâmetros da requisição:', {
      url: `${tenant.api_url}${path}`,
      params: params
    })

    const response = await axios.get(`${tenant.api_url}${path}`, {
      params,
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
      path: path
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
