// Filtros específicos para receitas
export const RECEITAS_COMBO_FILTERS = ['orgao', 'ano', 'fonteDaReceita']

// Campos de select para os filtros
export const RECEITAS_SELECT_FIELDS = [
  {
    id: 'mes',
    label: 'Mês',
    type: 'select',
    options: [
      { value: '01', label: 'Janeiro' },
      { value: '02', label: 'Fevereiro' },
      { value: '03', label: 'Março' },
      { value: '04', label: 'Abril' },
      { value: '05', label: 'Maio' },
      { value: '06', label: 'Junho' },
      { value: '07', label: 'Julho' },
      { value: '08', label: 'Agosto' },
      { value: '09', label: 'Setembro' },
      { value: '10', label: 'Outubro' },
      { value: '11', label: 'Novembro' },
      { value: '12', label: 'Dezembro' }
    ]
  },
  {
    id: 'naturezaDaReceita',
    label: 'Natureza da Receita Por',
    type: 'select',
    options: [
      { value: 1, label: 'Categoria Econômica' },
      { value: 2, label: 'Origem da Receita' },
      { value: 3, label: 'Espécie' },
      { value: 4, label: 'Detalhamento' }
    ]
  },
  {
    id: 'origemDoRecurso',
    label: 'Origem do Recurso',
    type: 'select',
    options: [
      { value: 1, label: 'Rendas Locais do Município' },
      { value: 2, label: 'Operações de Crédito' },
      { value: 3, label: 'Transferências Municipais' },
      { value: 4, label: 'Transferências Estaduais' },
      { value: 5, label: 'Transferências Federais' },
      { value: 6, label: 'Outras Fontes de Recursos' }
    ]
  },
  {
    id: 'covid19',
    label: 'Covid 19',
    type: 'select',
    options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Não' }
    ]
  },
  {
    id: 'totalizarReceitas',
    label: 'Totalizar Receitas',
    type: 'select',
    options: [
      { value: 'true', label: 'Sim' },
      { value: 'false', label: 'Não' }
    ]
  }
]

// Campos de texto para os filtros
export const RECEITAS_TEXT_FIELDS = [
  {
    id: 'detalhamentoDaNaturezaDaReceita',
    label: 'Detalhamento',
    type: 'text',
    placeholder: 'Digite o detalhamento'
  }
]

// Larguras personalizadas para cada filtro
export const RECEITAS_CUSTOM_WIDTHS = {
  orgao: '25%',
  ano: '25%',
  mes: '25%',
  naturezaDaReceita: '25%',
  origemDoRecurso: '25%',
  fonteDaReceita: '50%',
  covid19: '25%'
}

// Labels personalizados para os filtros
export const RECEITAS_CUSTOM_LABELS = {
  orgao: 'Órgão',
  ano: 'Ano',
  fonteDaReceita: 'Fonte de Recurso',
  origemDoRecurso: 'Origem do Recurso'
}

// Ordem dos campos para renderização
export const RECEITAS_FIELD_ORDER = [
  'orgao', // Órgão (combo)
  'ano', // Ano * (combo)
  'mes', // Mês * (select)
  'naturezaDaReceita', // Natureza da Receita Por (select)
  'fonteDaReceita', // Fonte de Recurso (combo)
  'origemDoRecurso', // Origem do Recurso (select)
  'covid19' // Covid 19 (select)
]

// Filtros obrigatórios
export const RECEITAS_REQUIRED_FILTERS = ['ano', 'mes']
