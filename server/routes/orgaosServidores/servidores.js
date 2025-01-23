const express = require('express')
const router = express.Router()
const axios = require('axios')

const fetchFromAPI = async (path, req, res) => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    // Obter a data atual
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const lastMonth = currentDate.getMonth() === 0 ? 12 : currentDate.getMonth()
    const lastMonthYear =
      currentDate.getMonth() === 0 ? currentYear - 1 : currentYear

    // Prepara os parâmetros da requisição
    const params = {
      pagina: req.query.pagina || 1,
      tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,

      // Parâmetros de data - usa o mês anterior por padrão
      ano: req.query.ano || lastMonthYear,
      mes: req.query.mes || lastMonth.toString().padStart(2, '0'),

      // Parâmetros de identificação
      matriculaDoFuncionario: req.query.matriculaDoFuncionario,
      cpf: req.query.cpf,
      nomeDoFuncionario: req.query.nomeDoFuncionario,

      // Parâmetros de estrutura organizacional
      codigoDoOrgao: req.query.codigoDoOrgao,
      nomeDoDepartamento: req.query.nomeDoDepartamento,

      // Parâmetros de cargo e vínculo
      codigoDoCargo: req.query.codigoDoCargo,
      codigoDoTipoDeVinculo: req.query.codigoDoTipoDeVinculo,
      codigoDaSituacao: req.query.codigoDaSituacao,
      categoriaDoTrabalhadorNoESocial:
        req.query.categoriaDoTrabalhadorNoESocial,

      // Parâmetros do cliente
      codigoDoCliente: req.query.codigoDoCliente,
      estadoDoCliente: req.query.estadoDoCliente,
      orgaoDoCliente: req.query.orgaoDoCliente,
      logotipoDoCliente: req.query.logotipoDoCliente,

      // Parâmetros específicos para detalhes
      matricula: req.query.matricula
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
