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
      tamanhoDaPagina: otherParams.tamanhoDaPagina || 2500,
      codigoDaFuncao: otherParams.codigoDaFuncao,
      codigoDaSubFuncao: otherParams.codigoDaSubFuncao,
      codigoDaUnidade: otherParams.codigoDaUnidade,
      codigoDoCliente: otherParams.codigoDoCliente,
      codigoDoElemento: otherParams.codigoDoElemento,
      codigoDoOrgao: otherParams.codigoDoOrgao,
      codigoDoPrograma: otherParams.codigoDoPrograma,
      cpfCnpjDoFornecedor: otherParams.cpfCnpjDoFornecedor,
      estadoDoCliente: otherParams.estadoDoCliente,
      faseDaLiquidacao: otherParams.faseDaLiquidacao,
      fonteTribunal: otherParams.fonteTribunal,
      nomeDoFornecedor: otherParams.nomeDoFornecedor,
      logotipoDoCliente: otherParams.logotipoDoCliente,
      numeroDaLiquidacao: otherParams.numeroDaLiquidacao,
      numeroDoEmpenho: otherParams.numeroDoEmpenho,
      orgaoDoCliente: otherParams.orgaoDoCliente,
      valorDaLiquidacao: otherParams.valorDaLiquidacao,
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

// Rotas para Despesas Fixadas

// Rota para buscar a data de atualização das despesas fixadas
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/despesas-fixadas/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar os detalhes de uma despesa fixada
router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/despesas-fixadas/detalhe', req, res)
)

// Rota para buscar os dados paginados das despesas fixadas
router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/despesas-fixadas/paginado', req, res)
)

// Rota para buscar o detalhe de uma despesa fixada específica usando o ID
router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/despesas-fixadas/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

module.exports = router
