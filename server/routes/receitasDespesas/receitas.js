const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res, params = {}) => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    // Obter o ano e o mês atuais automaticamente
    const currentYear = new Date().getFullYear()
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0') // Mês formatado com dois dígitos

    const requestParams = {
      pagina: req.query.pagina || 1,
      tamanhoDaPagina: req.query.tamanhoDaPagina || 3000,
      codigoDaReceita: req.query.codigoDaReceita || '',
      codigoDoOrgao: req.query.codigoDoOrgao || '',
      ano: req.query.ano || currentYear, // Ano atual automaticamente
      mes: req.query.mes || currentMonth, // Mês atual automaticamente
      ...params // Adiciona os parâmetros dinamicamente
    }

    // Log da requisição para debug
    console.log('Requisição para API:', {
      url: `${tenant.api_url}${path}`,
      params: requestParams,
      tenant: tenant.name
    })

    const response = await axios.get(`${tenant.api_url}${path}`, {
      params: requestParams,
      headers: {
        Authorization: `Bearer ${tenant.token}`,
        'cliente-integrado': tenant.cliente_integrado,
        Accept: 'application/json'
      }
    })

    // Log da resposta para debug
    console.log('Resposta da API:', {
      status: response.status,
      data: response.data ? 'Dados recebidos' : 'Sem dados'
    })

    res.json(response.data)
  } catch (error) {
    console.error('Erro na requisição:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      path: path,
      tenant: req.tenant?.name
    })

    // Retorna o erro original da API se disponível
    if (error.response?.data) {
      return res.status(error.response.status).json(error.response.data)
    }

    res.status(500).json({
      error: 'Erro ao conectar com a API externa',
      details: error.message
    })
  }
}

// Rota para buscar combo de receitas
router.get('/combo', (req, res) => {
  fetchFromAPI('/api/receitas-e-despesas/receita/combo', req, res)
})

// Rota para buscar combo por tipo de natureza detalhada
router.get('/combo-pelo-tipo-de-natureza-detalhada/:ano', (req, res) => {
  const { ano } = req.params
  fetchFromAPI(
    `/api/receitas-e-despesas/receita/combo-pelo-tipo-de-natureza-detalhada/${ano}`,
    req,
    res
  )
})

// Rota para buscar data de atualização
router.get('/data-de-atualizacao', (req, res) => {
  fetchFromAPI('/api/receitas-e-despesas/receita/data-de-atualizacao', req, res)
})

// Rota para buscar detalhes
router.get('/detalhe', (req, res) => {
  fetchFromAPI('/api/receitas-e-despesas/receita/detalhe', req, res)
})

// Rota para buscar estornos paginados
router.get('/estornos/paginado', (req, res) => {
  fetchFromAPI('/api/receitas-e-despesas/receita/estornos/paginado', req, res)
})

// Rota para buscar movimentos paginados
router.get('/movimentos/paginado', (req, res) => {
  fetchFromAPI('/api/receitas-e-despesas/receita/movimentos/paginado', req, res)
})

// Rota para buscar dados paginados
router.get('/paginado', (req, res) => {
  fetchFromAPI('/api/receitas-e-despesas/receita/paginado', req, res)
})

// Rota para buscar detalhes da receita usando a chave correta
router.get('/:id', (req, res) => {
  const id = req.params.id
  const { ano, mes, codigoDoOrgao } = req.query

  // Verifica se todos os parâmetros necessários estão presentes
  if (!id || !ano || !mes || !codigoDoOrgao) {
    return res
      .status(400)
      .json({ error: 'Faltando parâmetros para buscar os detalhes da receita' })
  }

  // Chama a API com todos os parâmetros
  fetchFromAPI('/api/receitas-e-despesas/receita/detalhe', req, res, {
    codigoDaReceita: id,
    ano,
    mes,
    codigoDoOrgao
  })
})

// Rota para buscar os movimentos de uma receita específica
router.get('/movimentos/:id', (req, res) => {
  const id = req.params.id
  const { ano, mes, codigoDoOrgao } = req.query

  // Verifica se os parâmetros necessários estão presentes
  if (!id || !ano || !mes || !codigoDoOrgao) {
    return res.status(400).json({
      error: 'Faltando parâmetros para buscar os movimentos da receita'
    })
  }

  // Chama a API com os parâmetros necessários
  fetchFromAPI(
    '/api/receitas-e-despesas/receita/movimentos/paginado',
    req,
    res,
    {
      codigoDaReceita: id,
      ano,
      mes,
      codigoDoOrgao
    }
  )
})

module.exports = router
