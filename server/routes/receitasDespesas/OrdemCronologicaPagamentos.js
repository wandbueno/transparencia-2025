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
      pagina: req.query.pagina || 1,
      tamanhoDaPagina: req.query.tamanhoDaPagina || -1,
      ano: req.query.ano,
      mes: req.query.mes,
      codigoDoOrgao: req.query.codigoDoOrgao
        ? parseInt(req.query.codigoDoOrgao)
        : undefined,
      categoriaDeEmpenho: req.query.categoriaDeEmpenho
        ? parseInt(req.query.categoriaDeEmpenho)
        : undefined,
      nomeDoFornecedor: req.query.nomeDoFornecedor,
      cpfCnpjDoFornecedor: req.query.cpfCnpjDoFornecedor?.replace(/[^\d]/g, ''), // Remove non-digits
      ordenarPor: req.query.ordenarPor || 'dataDaExigibilidade',
      ordem: req.query.ordem || 'asc',

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
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/relatorio-de-ordem-cronologica-de-pagamentos/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar dados paginados
router.get('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/relatorio-de-ordem-cronologica-de-pagamentos/paginado',
    req,
    res
  )
)

// Rota para buscar detalhes de uma ordem cronológica específica
router.get('/detalhe', (req, res) => {
  const { ano, mes, liquidacao } = req.query

  // Validação dos parâmetros obrigatórios
  if (!ano || !mes || !liquidacao) {
    return res.status(400).json({
      error: 'Parâmetros inválidos',
      details: 'ano, mes e liquidacao são obrigatórios'
    })
  }

  fetchFromAPI(
    '/api/receitas-e-despesas/relatorio-de-ordem-cronologica-de-pagamentos/detalhe',
    req,
    res
  )
})

module.exports = router
