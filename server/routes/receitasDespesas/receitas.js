const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res, params = {}) => {
  try {
    // Obter o ano e o mês atuais automaticamente
    const currentYear = new Date().getFullYear()
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0') // Mês formatado com dois dígitos

    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 3000,
        codigoDaReceita: req.query.codigoDaReceita || '',
        codigoDoOrgao: req.query.codigoDoOrgao || '',
        ano: req.query.ano || currentYear, // Ano atual automaticamente
        mes: req.query.mes || currentMonth, // Mês atual automaticamente
        ...params // Adiciona os parâmetros dinamicamente
      },
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO,
        Accept: 'application/json'
      }
    })
    res.json(response.data)
  } catch (error) {
    console.error('Erro ao conectar com a API externa:', error.message)
    res.status(500).json({ error: 'Erro ao conectar com a API externa' })
  }
}

// Rota para buscar a data de atualização
router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/receita/paginado', req, res)
)

// Rota para buscar detalhes
router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/receita/detalhe', req, res)
)

// Rota para buscar dados paginados
router.get('/combo', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/receita/combo', req, res)
)

// Rota para buscar dados paginados
router.get('/movimentos', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/receita/movimentos/paginado', req, res)
)

// Rota para buscar a listagem paginada das receitas
router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/receitas-e-despesas/receita/paginado', req, res)
)

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
