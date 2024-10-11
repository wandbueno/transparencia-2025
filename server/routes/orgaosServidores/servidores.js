const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params: {
        pagina: req.query.pagina || 1,
        tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
        ano: req.query.ano || '',
        mes: req.query.mes || '',
        matricula: req.query.matricula || ''
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

// router.get('/:id', (req, res) => {
//   const id = req.params.id
//   fetchFromAPI(
//     `/api/orgaos-e-servidores/servidor/detalhe?matricula=${id}`,
//     req,
//     res
//   )
// })

// Rota para acessar detalhes de um servidor pela matrícula, ano e mês
router.get('/:matricula', (req, res) => {
  const { matricula } = req.params
  const { ano, mes } = req.query // Recebe ano e mes como query parameters
  // console.log(
  //   `Recebido no back-end: matricula=${matricula}, ano=${ano}, mes=${mes}`
  // )

  fetchFromAPI(
    `/api/orgaos-e-servidores/servidor/detalhe`,
    {
      query: {
        ano,
        mes,
        matricula
      }
    },
    res
  )
})

// Rota para acessar detalhes de um servidor pela matrícula, ano e mês
router.get('/ferias/:matricula', (req, res) => {
  const { matricula } = req.params
  const { ano, mes } = req.query // Recebe ano e mes como query parameters
  // console.log(
  //   `Recebido no back-end: matricula=${matricula}, ano=${ano}, mes=${mes}`
  // )

  fetchFromAPI(
    `/api/orgaos-e-servidores/servidor/movimento-ferias/paginado`,
    {
      query: {
        ano,
        mes,
        matricula
      }
    },
    res
  )
})

// Rota para acessar detalhes de um servidor pela matrícula, ano e mês
router.get('/movimento-vencimentos/:matricula', (req, res) => {
  const { matricula } = req.params
  const { ano, mes } = req.query // Recebe ano e mes como query parameters
  // console.log(
  //   `Recebido no back-end: matricula=${matricula}, ano=${ano}, mes=${mes}`
  // )

  fetchFromAPI(
    `/api/orgaos-e-servidores/servidor/movimento-vencimentos/paginado`,
    {
      query: {
        ano,
        mes,
        matricula
      }
    },
    res
  )
})

module.exports = router
