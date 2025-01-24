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
      ano: otherParams.ano,
      codigoDaRubricaDespesa: otherParams.codigoDaRubricaDespesa,
      codigoDoCliente: otherParams.codigoDoCliente,
      codigoDoOrgao: otherParams.codigoDoOrgao,
      cpfOuCnpjDoFornecedor: otherParams.cpfOuCnpjDoFornecedor,
      estadoDoCliente: otherParams.estadoDoCliente,
      fonte: otherParams.fonte,
      logotipoDoCliente: otherParams.logotipoDoCliente,
      nomeDoFornecedor: otherParams.nomeDoFornecedor,
      orgaoDoCliente: otherParams.orgaoDoCliente,
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

// Rotas para Informação Consolidada Resto a Pagar

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/informacao_consolidada_resto_a_pagar/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar detalhes de "Informação Consolidada Resto a Pagar"
router.get('/detalhe', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/informacao_consolidada_resto_a_pagar/detalhe',
    req,
    res
  )
)

// Rota para buscar dados paginados de "Informação Consolidada Resto a Pagar"
router.get('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/informacao_consolidada_resto_a_pagar/paginado',
    req,
    res
  )
)

// Rota para buscar o detalhe de uma informação consolidada específica usando o ID
router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/informacao_consolidada_resto_a_pagar/detalhe?chavePrimaria=${id}`, // Use o parâmetro correto se necessário
    req,
    res
  )
})

module.exports = router
