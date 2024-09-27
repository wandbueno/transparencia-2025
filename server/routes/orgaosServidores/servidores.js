const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        ano: req.query.ano || ''
        // codigoDoOrgao: req.query.codigoDoOrgao || ''
        // categoriaDoTrabalhadorNoESocial:
        // req.query.categoriaDoTrabalhadorNoESocial,
        // codigoDaSituacao: req.query.codigoDaSituacao,
        // codigoDoCargo: req.query.codigoDoCargo,
        // codigoDoCliente: req.query.codigoDoCliente,
        // codigoDoTipoDeVinculo: req.query.codigoDoTipoDeVinculo,
        // cpf: req.query.cpf,
        // estadoDoCliente: req.query.estadoDoCliente,
        // logotipoDoCliente: req.query.logotipoDoCliente,
        // matriculaDoFuncionario: req.query.matriculaDoFuncionario,
        // mes: req.query.mes,
        // nomeDoDepartamento: req.query.nomeDoDepartamento,
        // nomeDoFuncionario: req.query.nomeDoFuncionario,
        // orgaoDoCliente: req.query.orgaoDoCliente
      },
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO
      }
    })
    res.json(response.data)
  } catch (error) {
    console.error('Erro ao conectar com a API externa:', error.message)
    res.status(500).json({ error: 'Erro ao conectar com a API externa' })
  }
}

// Rotas para Servidores
router.get('/data-de-atualizacao', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/data-de-atualizacao',
    req,
    res
  )
)

router.get('/detalhe', (req, res) =>
  fetchFromAPI('/api/orgaos-e-servidores/servidor/detalhe', req, res)
)

// Ajuste específico para a rota paginado
router.get('/paginado', (req, res) =>
  fetchFromAPI('/api/orgaos-e-servidores/servidor/paginado', req, res)
)

// Outras rotas
router.get('/movimento-complementar/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento-complementar/paginado',
    req,
    res
  )
)

router.get('/movimento-ferias/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento-ferias/paginado',
    req,
    res
  )
)

router.get('/movimento-rescisao/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento-rescisao/paginado',
    req,
    res
  )
)

router.get('/movimento-sessoes-extraordinarias/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento-sessoes-extraordinarias/paginado',
    req,
    res
  )
)

router.get('/movimento-vencimentos/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento-vencimentos/paginado',
    req,
    res
  )
)

router.get('/movimento13-salario/paginado', (req, res) =>
  fetchFromAPI(
    '/api/orgaos-e-servidores/servidor/movimento13-salario/paginado',
    req,
    res
  )
)

router.get('/:id', (req, res) => {
  const id = req.params.id
  fetchFromAPI(
    `/api/orgaos-e-servidores/servidor/detalhe?chavePrimaria=${id}`,
    req,
    res
  )
})

module.exports = router
