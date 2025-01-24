const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    // Se não houver ano e mês na query, use o ano atual e mês atual
    const currentDate = new Date()
    const defaultYear = currentDate.getFullYear()
    const defaultMonth = String(currentDate.getMonth() + 1).padStart(2, '0')

    // Prepara os parâmetros da requisição
    const params = {
      pagina: req.query.pagina || 1,
      tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
      ano: req.query.ano || defaultYear,
      mes: req.query.mes || defaultMonth,
      codigoDoNivel: req.query.codigoDoNivel,
      nomeDoCargo: req.query.nomeDoCargo,
      tipoDeCargo: req.query.tipoDeCargo,
      chavePrimaria: req.query.chavePrimaria
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
        'cliente-integrado': tenant.cliente_integrado,
        Accept: 'application/json'
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
    '/api/orgaos-e-servidores/estrutura-de-remuneracao/data-de-atualizacao',
    req,
    res
  )
})

// Rota para buscar dados paginados
router.get('/paginado', (req, res) => {
  fetchFromAPI(
    '/api/orgaos-e-servidores/estrutura-de-remuneracao/paginado',
    req,
    res
  )
})

// Rota para buscar detalhes
router.get('/detalhe', (req, res) => {
  const { ano, mes } = req.query
  if (!ano || !mes) {
    return res.status(400).json({
      error: 'Parâmetros obrigatórios ausentes',
      details: 'ano e mes são obrigatórios'
    })
  }
  fetchFromAPI(
    '/api/orgaos-e-servidores/estrutura-de-remuneracao/detalhe',
    req,
    res
  )
})

// Rota para buscar detalhes por ID
router.get('/:codigoDoNivel', (req, res) => {
  const { codigoDoNivel } = req.params
  const { ano, mes } = req.query

  // Verifica se todos os parâmetros necessários estão presentes
  if (!codigoDoNivel || !ano || !mes) {
    return res.status(400).json({
      error: 'Parâmetros obrigatórios ausentes',
      details: 'codigoDoNivel, ano e mes são obrigatórios'
    })
  }

  fetchFromAPI(
    '/api/orgaos-e-servidores/estrutura-de-remuneracao/detalhe',
    {
      ...req,
      query: {
        ...req.query,
        codigoDoNivel
      }
    },
    res
  )
})

module.exports = router
