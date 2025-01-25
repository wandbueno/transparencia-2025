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
      codigoDaSituacao: otherParams.codigoDaSituacao,
      codigoDoCliente: otherParams.codigoDoCliente,
      codigoDoOrgao: otherParams.codigoDoOrgao,
      codigoDoTipoDeDocumento: otherParams.codigoDoTipoDeDocumento,
      dataDaPublicacao: otherParams.dataDaPublicacao,
      descricao: otherParams.descricao,
      estadoDoCliente: otherParams.estadoDoCliente,
      logotipoDoCliente: otherParams.logotipoDoCliente,
      nomeDoDocumento: otherParams.nomeDoDocumento,
      numeroDoDocumento: otherParams.numeroDoDocumento,
      orgaoDoCliente: otherParams.orgaoDoCliente,
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

// Rotas para Empenho
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/legislacao-e-publicacoes/legislacao-municipal/data-de-atualizacao',
    req,
    res
  )
)

router.get('/detalhe', (req, res) =>
  fetchFromAPI(
    '/api/legislacao-e-publicacoes/legislacao-municipal/detalhe',
    req,
    res
  )
)

router.get('/paginado', (req, res) =>
  fetchFromAPI(
    '/api/legislacao-e-publicacoes/legislacao-municipal/paginado',
    req,
    res
  )
)

router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/legislacao-e-publicacoes/legislacao-municipal/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

module.exports = router
