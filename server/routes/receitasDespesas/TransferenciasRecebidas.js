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
      ano: otherParams.ano,
      codigoDaFonte: otherParams.codigoDaFonte,
      codigoDoCliente: otherParams.codigoDoCliente,
      dataDoRepasse: otherParams.dataDoRepasse,
      estadoDoCliente: otherParams.estadoDoCliente,
      orgaoDoCliente: otherParams.orgaoDoCliente,
      origemDoRecurso: otherParams.origemDoRecurso,
      rubricaDaReceita: otherParams.rubricaDaReceita,
      tituloDeReceita: otherParams.tituloDeReceita,
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

// Rotas para Empenho
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/transferencias-voluntarias-recebidas/data-de-atualizacao',
    req,
    res
  )
)

router.get('/detalhe', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/transferencias-voluntarias-recebidas/detalhe',
    req,
    res
  )
)

router.get('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/receitas-e-despesas/transferencias-voluntarias-recebidas/paginado',
    req,
    res
  )
)

// Rota para obter os detalhes de uma transferência específica apenas com o código da receita
router.get('/:id', (req, res) => {
  const { id } = req.params // O 'id' será o código da receita

  // Agora, a URL que você está montando para a requisição externa usa apenas o código da receita
  fetchFromAPI(
    `/api/receitas-e-despesas/transferencias-voluntarias-recebidas/detalhe?codigoDaReceita=${id}`,
    req,
    res
  )
})

module.exports = router
