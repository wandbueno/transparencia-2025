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
      tamanhoDaPagina: otherParams.tamanhoDaPagina || -1,
      ano: otherParams.ano,

      codigoDoCliente: otherParams.codigoDoCliente,
      codigoDoOrgao: otherParams.codigoDoOrgao,
      cpfOuCnpj: otherParams.cpfOuCnpj,
      estadoDoCliente: otherParams.estadoDoCliente,
      fonte: otherParams.fonte,
      fonteDoEmpenho: otherParams.fonteDoEmpenho,
      fornecedor: otherParams.fornecedor,
      logotipoDoCliente: otherParams.logotipoDoCliente,
      orgaoDoCliente: otherParams.orgaoDoCliente,
      rubricaDaDespesa: otherParams.rubricaDaDespesa,
      chavePrimaria: otherParams.chavePrimaria,
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

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) => {
  fetchFromAPI(
    '/api/receitas-e-despesas/informacoes-consolidadas/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar detalhes
router.get('/detalhe', (req, res) => {
  const chavePrimaria = req.query.chavePrimaria
  if (!chavePrimaria) {
    return res
      .status(400)
      .json({ error: 'O parâmetro chavePrimaria é obrigatório' })
  }
  fetchFromAPI(
    '/api/receitas-e-despesas/informacoes-consolidadas/detalhe',
    req,
    res
  )
})

// Rota para buscar liquidações paginadas
router.get('/liquidacoes/paginado', (req, res) => {
  fetchFromAPI(
    '/api/receitas-e-despesas/informacoes-consolidadas/liquidacoes/paginado',
    req,
    res
  )
})

// Rota para buscar ordens de pagamento paginadas
router.get('/ordens-de-pagamento/paginado', (req, res) => {
  fetchFromAPI(
    '/api/receitas-e-despesas/informacoes-consolidadas/ordens-de-pagamento/paginado',
    req,
    res
  )
})

// Rota para buscar dados paginados
router.get('/paginado', (req, res) => {
  fetchFromAPI(
    '/api/receitas-e-despesas/informacoes-consolidadas/paginado',
    req,
    res
  )
})

// Rota para buscar detalhes por ID
router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/receitas-e-despesas/informacoes-consolidadas/detalhe?codigoDoEmpenho=${id}`,
    req,
    res
  )
})

module.exports = router
