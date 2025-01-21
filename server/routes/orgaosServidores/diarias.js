const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    const response = await axios.get(`${tenant.api_url}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        anoDaPortaria: req.query.anoDaPortaria,
        codigoDoOrgao: req.query.codigoDoOrgao,
        data: req.query.data,
        dataFinal: req.query.dataFinal,
        dataInicial: req.query.dataInicial,
        destino: req.query.destino,
        matriculaDoFuncionario: req.query.matriculaDoFuncionario,
        nomeDoFuncionario: req.query.nomeDoFuncionario,
        numeroDaLiquidacao: req.query.numeroDaLiquidacao,
        numeroDaPortaria: req.query.numeroDaPortaria,
        numeroDoEmpenho: req.query.numeroDoEmpenho,
        numeroDoPagamento: req.query.numeroDoPagamento,
        numeroDoProcesso: req.query.numeroDoProcesso,
        valor: req.query.valor,
        chavePrimaria: req.query.chavePrimaria
      },
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

// Rotas
router.get('/data-de-atualizacao', (req, res) => {
  fetchFromAPI('/api/orgaos-e-servidores/diaria/data-de-atualizacao', req, res)
})

router.get('/detalhe', (req, res) => {
  fetchFromAPI('/api/orgaos-e-servidores/diaria/detalhe', req, res)
})

router.get('/paginado', (req, res) => {
  fetchFromAPI('/api/orgaos-e-servidores/diaria/paginado', req, res)
})

router.get('/anulacoes-de-liquidacoes/paginado', (req, res) => {
  fetchFromAPI(
    '/api/orgaos-e-servidores/diaria/anulacoes-de-liquidacoes/paginado',
    req,
    res
  )
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/orgaos-e-servidores/diaria/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

module.exports = router
