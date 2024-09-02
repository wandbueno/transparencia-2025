const express = require('express')
const router = express.Router()
const axios = require('axios')

// Função para buscar dados da API externa
const fetchFromAPI = async (path, req, res) => {
  try {
    // Construir a URL completa da API
    const url = `${process.env.SERVER}${path}`

    // Realizar a solicitação para a API externa
    const response = await axios.get(url, {
      params: {
        pagina: 1,
        tamanhoDaPagina: 25
      },

      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`, // Token de autenticação
        'cliente-integrado': process.env.CLIENTE_INTEGRADO // Header adicional
      }
    })

    // Enviar a resposta para o cliente
    res.json(response.data)
  } catch (error) {
    // Logar o erro e enviar uma resposta de erro para o cliente
    console.error('Erro ao conectar com a API externa:', error.message)
    res.status(500).json({ error: 'Erro ao conectar com a API externa' })
  }
}

// Rota para buscar a data de atualização
router.get('/data-de-atualizacao', (req, res) => {
  fetchFromAPI('/api/orgaos-e-servidores/diaria/data-de-atualizacao', req, res)
})

// Rota para buscar detalhes
router.get('/detalhe', (req, res) => {
  fetchFromAPI('/api/orgaos-e-servidores/diaria/detalhe', req, res)
})

// Rota para buscar dados paginados
router.get('/paginado', (req, res) => {
  fetchFromAPI('/api/orgaos-e-servidores/diaria/paginado', req, res)
})

// Rota para buscar anulações de liquidações paginadas
router.get('/anulacoes-de-liquidacoes/paginado', (req, res) => {
  fetchFromAPI(
    '/api/orgaos-e-servidores/diaria/anulacoes-de-liquidacoes/paginado',
    req,
    res
  )
})

module.exports = router
