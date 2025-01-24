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
      codigoDoCliente: otherParams.codigoDoCliente,
      codigoDoOrgao: otherParams.codigoDoOrgao,
      estadoDoCliente: otherParams.estadoDoCliente,
      logotipoDoCliente: otherParams.logotipoDoCliente,
      mes: otherParams.mes,
      ano: otherParams.ano,
      orgaoDoCliente: otherParams.orgaoDoCliente,
      tipoDeExtra: otherParams.tipoDeExtra,
      titulo: otherParams.titulo,
      codigoDaExtra: otherParams.codigoDaExtra,
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

// Rotas para Extras Orçamentárias
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/extra-orcamentaria/data-de-atualizacao',
    req,
    res
  )
)

router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/extra-orcamentaria/detalhe', req, res)
)

router.get('/movimentos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/extra-orcamentaria/movimentos/paginado',
    req,
    res
  )
)

router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/extra-orcamentaria/paginado', req, res)
)

// Rota para buscar detalhes de uma extra orçamentária usando os parâmetros ano, mes e id (no lugar de codigoDaExtra)
router.get('/:id', (req, res) => {
  const { id } = req.params // Pegamos o ID da URL (que corresponde ao codigoDaExtra)
  const { ano, mes } = req.query // Pegamos os parâmetros ano e mes da query string

  // Fazemos a requisição para a API passando os parâmetros
  fetchFromAPI(
    '/api/receitas-e-despesas/extra-orcamentaria/detalhe',
    {
      query: {
        ano,
        mes,
        codigoDaExtra: id // Usamos o ID como codigoDaExtra na requisição
      }
    },
    res
  )
})

// Rota para buscar a lista de movimentos paginada relacionada a uma extra orçamentária
router.get('/movimentos/paginado/:id', (req, res) => {
  const { id } = req.params // ID que corresponde ao codigoDaExtra
  const { ano, mes } = req.query // Parâmetros ano e mes fornecidos pela query string

  // Fazemos a requisição para a API passando o codigoDaExtra, ano e mes como parâmetros
  fetchFromAPI(
    '/api/receitas-e-despesas/extra-orcamentaria/movimentos/paginado',
    {
      query: {
        ano,
        mes,
        codigoDaExtra: id // Usamos o ID como codigoDaExtra na requisição
      }
    },
    res
  )
})

module.exports = router
