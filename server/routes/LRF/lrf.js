const express = require('express')
const router = express.Router()
const { fetchFromLRFAPI } = require('../../services/lrfApiService')

// Função para validar parâmetros obrigatórios
const validateRequiredParams = req => {
  const { ano, mes, extensao, orgao, tipoDoRelatorio } = req.query
  const errors = []

  // Validação do ano (obrigatório)
  if (!ano) {
    errors.push('Ano é obrigatório')
  } else if (
    ![2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].includes(
      Number(ano)
    )
  ) {
    errors.push('Ano inválido. Use: 2015 até 2024')
  }

  // Validação do mês (obrigatório)
  if (!mes) {
    errors.push('Mês é obrigatório')
  } else if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(Number(mes))) {
    errors.push('Mês inválido. Use valores de 1 a 12')
  }

  // Validação da extensão (obrigatório)
  if (!extensao) {
    errors.push('Extensão é obrigatória')
  } else if (!['pdf', 'docx', 'xlsx', 'odt', 'html'].includes(extensao)) {
    errors.push('Extensão inválida. Use: pdf, docx, xlsx, odt ou html')
  }

  // Validação do órgão (obrigatório)
  if (!orgao) {
    errors.push('Código do Órgão é obrigatório')
  }

  // Validação do tipo de relatório (obrigatório)
  if (!tipoDoRelatorio) {
    errors.push('Tipo do Relatório é obrigatório')
  } else if (![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(tipoDoRelatorio))) {
    errors.push('Tipo de Relatório inválido. Use valores de 1 a 9')
  }

  return errors
}

// Rota para buscar anos disponíveis
router.get('/anos-disponiveis', (req, res) => {
  fetchFromLRFAPI(
    '/portal-da-transparencia/api/lrf/buscar-anos-disponiveis',
    req,
    res
  )
})

// Rota para buscar relatórios publicados
router.get('/relatorios-publicados', (req, res) => {
  const queryParams = {
    ano: req.query.ano || new Date().getFullYear(),
    mes: req.query.mes || new Date().getMonth() + 1,
    orgao: req.query.orgao || 1,
    tipoDoRelatorio: req.query.tipoDoRelatorio || 1
  }

  console.log('Buscando relatórios com parâmetros:', queryParams) // Log para debug

  req.query = queryParams
  fetchFromLRFAPI(
    '/portal-da-transparencia/api/lrf/relatorios-publicados',
    req,
    res,
    data => {
      if (!data || data.length === 0) {
        return res.status(404).json({
          message: 'Nenhum relatório encontrado para os parâmetros informados',
          parametros: queryParams
        })
      }
      return res.json(data)
    }
  )
})

// Rotas para Metas e Riscos Fiscais
const metasRiscosRoutes = [
  {
    path: '/metas-anuais',
    endpoint: '41',
    title: 'Anexo I - Metas Anuais'
  },
  {
    path: '/avaliacao-metas-anteriores',
    endpoint: '42',
    title:
      'Anexo II - Avaliação do Cumprimento das Metas Fiscais do Exercício Anterior'
  },
  {
    path: '/metas-comparadas',
    endpoint: '43',
    title: 'Anexo III - Metas Fiscais Atuais Comparadas'
  },
  {
    path: '/evolucao-patrimonio',
    endpoint: '44',
    title: 'Anexo IV - Evolução do Patrimônio Líquido'
  },
  {
    path: '/alienacao-ativos',
    endpoint: '45',
    title:
      'Anexo V - Origem e Aplicação dos Recursos Obtidos com a Alienação de Ativos'
  },
  {
    path: '/avaliacao-rpps',
    endpoint: '46',
    title: 'Anexo VI - Avaliação da Situação Financeira e Atuarial do RPPS'
  },
  {
    path: '/renuncia-receita',
    endpoint: '47',
    title: 'Anexo VII - Estimativa e Compensação da Renúncia de Receita'
  },
  {
    path: '/margem-expansao',
    endpoint: '48',
    title: 'Anexo VIII - Margem de Expansão das Despesas Obrigatórias'
  },
  {
    path: '/resultado-primario',
    endpoint: '49',
    title: 'Anexo IX - Resultado Primário Consolidado'
  },
  {
    path: '/riscos-fiscais',
    endpoint: '50',
    title: 'Riscos Fiscais'
  }
]

// Criar rotas dinamicamente para cada relatório
metasRiscosRoutes.forEach(route => {
  router.get(route.path, (req, res) => {
    // Ajusta o nome do parâmetro antes da validação
    if (req.query.tipoRelatorio) {
      req.query.tipoDoRelatorio = req.query.tipoRelatorio
      delete req.query.tipoRelatorio
    }

    // Valida parâmetros obrigatórios
    const errors = validateRequiredParams(req)
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Parâmetros inválidos',
        details: errors
      })
    }

    // Se passou na validação, faz a requisição
    fetchFromLRFAPI(
      `/portal-da-transparencia/api/lrf/${route.endpoint}`,
      req,
      res
    )
  })
})

// Rota para obter metadados dos relatórios (útil para o frontend)
router.get('/meta-dados-relatorios', (req, res) => {
  res.json(metasRiscosRoutes)
})

// Rotas para Balanço Anual
const balancoAnualRoutes = [
  {
    path: '/balanco-anexo-10',
    endpoint: '80',
    title: 'COMPARATIVO DA RECEITA PREVISTA COM A REALIZADA - ANEXO 10'
  },
  {
    path: '/balanco-anexo-11',
    endpoint: '81',
    title: 'COMPARATIVO DA DESPESA ORÇADA COM A REALIZADA - ANEXO 11'
  },
  {
    path: '/balanco-anexo-12',
    endpoint: '82',
    title: 'BALANÇO ORÇAMENTÁRIO - ANEXO 12'
  },
  {
    path: '/balanco-anexo-13',
    endpoint: '83',
    title: 'BALANÇO FINANCEIRO - ANEXO 13'
  },
  {
    path: '/balanco-anexo-14',
    endpoint: '84',
    title: 'BALANÇO PATRIMONIAL - ANEXO 14'
  },
  {
    path: '/balanco-anexo-15',
    endpoint: '85',
    title: 'DEMONSTRATIVO DAS VARIAÇÕES PATRIMONIAIS - ANEXO 15'
  }
]

// Criar rotas dinamicamente para cada relatório de balanço
balancoAnualRoutes.forEach(route => {
  router.get(route.path, (req, res) => {
    // Ajusta o nome do parâmetro antes da validação
    if (req.query.tipoRelatorio) {
      req.query.tipoDoRelatorio = req.query.tipoRelatorio
      delete req.query.tipoRelatorio
    }

    // Valida parâmetros obrigatórios
    const errors = validateRequiredParams(req)
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Parâmetros inválidos',
        details: errors
      })
    }

    // Se passou na validação, faz a requisição
    fetchFromLRFAPI(
      `/portal-da-transparencia/api/lrf/${route.endpoint}`,
      req,
      res
    )
  })
})

// Rota para obter metadados dos relatórios de balanço (útil para o frontend)
router.get('/meta-dados-balanco', (req, res) => {
  res.json(balancoAnualRoutes)
})

// Rotas para PCASP
const pcaspRoutes = [
  {
    path: '/pcasp-anexo-12',
    endpoint: '90',
    title: 'Anexo XII - Balanço Orçamentário - PCASP'
  },
  {
    path: '/pcasp-anexo-13',
    endpoint: '91',
    title: 'Anexo XIII - Balanço Financeiro'
  },
  {
    path: '/pcasp-anexo-14',
    endpoint: '92',
    title: 'Anexo XIV - Balanço Patrimonial'
  },
  {
    path: '/pcasp-anexo-15',
    endpoint: '93',
    title: 'Anexo XV - Demonstrativo das Variações Patrimoniais'
  },
  {
    path: '/pcasp-balancete',
    endpoint: '94',
    title: 'Balancete de Verificação'
  }
]

// Criar rotas dinamicamente para cada relatório PCASP
pcaspRoutes.forEach(route => {
  router.get(route.path, (req, res) => {
    if (req.query.tipoRelatorio) {
      req.query.tipoDoRelatorio = req.query.tipoRelatorio
      delete req.query.tipoRelatorio
    }

    const errors = validateRequiredParams(req)
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Parâmetros inválidos',
        details: errors
      })
    }

    fetchFromLRFAPI(
      `/portal-da-transparencia/api/lrf/${route.endpoint}`,
      req,
      res
    )
  })
})

// Rota para obter metadados dos relatórios PCASP
router.get('/meta-dados-pcasp', (req, res) => {
  res.json(pcaspRoutes)
})

// Rotas para Relatório Resumido da Execução Orçamentária (RREO)
const rreoRoutes = [
  {
    path: '/rreo-anexo-1',
    endpoint: '1',
    title: 'RREO - Anexo I - Balanço Orçamentário'
  },
  {
    path: '/rreo-anexo-2',
    endpoint: '2',
    title:
      'RREO - Anexo II - Demonstrativo da Execução das Despesas por Função/Subfunção'
  },
  {
    path: '/rreo-anexo-8',
    endpoint: '10',
    title:
      'RREO - Anexo VIII - Demonstrativo das Receitas e Despesas com Manutenção e Desenvolvimento do Ensino - MDE'
  },
  {
    path: '/rreo-anexo-12',
    endpoint: '16',
    title:
      'RREO - Anexo XII - Demonstrativo das Receitas e Despesas com Ações e Serviços Públicos de Saúde'
  }
]

// Criar rotas dinamicamente para cada relatório RREO
rreoRoutes.forEach(route => {
  router.get(route.path, (req, res) => {
    // Ajusta o nome do parâmetro antes da validação
    if (req.query.tipoRelatorio) {
      req.query.tipoDoRelatorio = req.query.tipoRelatorio
      delete req.query.tipoRelatorio
    }

    // Valida parâmetros obrigatórios
    const errors = validateRequiredParams(req)
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Parâmetros inválidos',
        details: errors
      })
    }

    // Se passou na validação, faz a requisição
    fetchFromLRFAPI(
      `/portal-da-transparencia/api/lrf/${route.endpoint}`,
      req,
      res
    )
  })
})

// Rota para obter metadados dos relatórios RREO
router.get('/meta-dados-rreo', (req, res) => {
  res.json(rreoRoutes)
})

// Rotas para Relatório de Gestão Fiscal (RGF)
const rgfRoutes = [
  {
    path: '/rgf-anexo-1',
    endpoint: '21',
    title: 'RGF - Anexo I - Demonstrativo da Despesa com Pessoal'
  },
  {
    path: '/rgf-anexo-2',
    endpoint: '22',
    title: 'RGF - Anexo II - Demonstrativo da Dívida Consolidada Líquida - DCL'
  },
  {
    path: '/rgf-anexo-3',
    endpoint: '23',
    title:
      'RGF - Anexo III - Demonstrativo das Garantias e Contragarantias de Valores'
  },
  {
    path: '/rgf-anexo-4',
    endpoint: '24',
    title: 'RGF - Anexo IV - Demonstrativo das Operações de Crédito'
  },
  {
    path: '/rgf-anexo-6',
    endpoint: '27',
    title:
      'RGF - Anexo VI - Demonstrativo Simplificado do Relatório de Gestão Fiscal'
  }
  // {
  //   path: '/rgf-anexo-7',
  //   endpoint: '28',
  //   title: 'RGF - Anexo VII - Relatório de Gestão Fiscal Consolidado'
  // }
]

// Criar rotas dinamicamente para cada relatório RGF
rgfRoutes.forEach(route => {
  router.get(route.path, (req, res) => {
    // Ajusta o nome do parâmetro antes da validação
    if (req.query.tipoRelatorio) {
      req.query.tipoDoRelatorio = req.query.tipoRelatorio
      delete req.query.tipoRelatorio
    }

    // Valida parâmetros obrigatórios
    const errors = validateRequiredParams(req)
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Parâmetros inválidos',
        details: errors
      })
    }

    // Se passou na validação, faz a requisição
    fetchFromLRFAPI(
      `/portal-da-transparencia/api/lrf/${route.endpoint}`,
      req,
      res
    )
  })
})

// Rota para obter metadados dos relatórios RGF
router.get('/meta-dados-rgf', (req, res) => {
  res.json(rgfRoutes)
})

module.exports = router
