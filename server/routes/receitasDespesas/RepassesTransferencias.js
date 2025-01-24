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
      mes: otherParams.mes,
      ano: otherParams.ano,
      codigoDoCliente: otherParams.codigoDoCliente,
      liquidacao: otherParams.liquidacao,
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

// Rotas para Repasses ou Transferências de Recursos

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/data-de-atualizacao',
    req,
    res
  )
)

// Rota para buscar detalhes de um repasse ou transferência
router.get('/detalhe', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/detalhe',
    req,
    res
  )
)

// Rota para buscar dados paginados de repasses ou transferências
router.get('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/paginado',
    req,
    res
  )
)

// Rota para buscar movimentos paginados relacionados a repasses ou transferências
router.get('/movimentos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/movimentos/paginado',
    req,
    res
  )
)

// Rota para buscar detalhes de um repasse ou transferência específico usando o ID
router.get('/:id', (req, res) => {
  const { id } = req.params // Pegamos o ID da URL (que corresponde ao codigoDaExtra)
  const { ano, mes } = req.query // Pegamos os parâmetros ano e mes da query string

  // Fazemos a requisição para a API passando os parâmetros
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/detalhe',
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

// Rota para buscar movimentos relacionados a um repasse ou transferência específico usando o ID
router.get('/movimentos/:id', (req, res) => {
  const id = req.params.id // Pegamos o ID da URL
  const { ano, mes } = req.query

  // Fazemos a requisição para a API passando os parâmetros necessários
  fetchFromAPI(
    '/api/receitas-e-despesas/repasse-ou-transferencia-de-recursos/movimentos/paginado',
    {
      query: {
        ano,
        mes,
        codigoDaExtra: id
      }
    },
    res
  )
})

module.exports = router
