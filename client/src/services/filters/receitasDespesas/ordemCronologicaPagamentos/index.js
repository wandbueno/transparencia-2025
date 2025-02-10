// client/src/services/filters/receitasDespesas/ordemCronologicaPagamentos/index.js

// Filtros específicos para Ordem Cronológica de Pagamentos
export const ORDEM_CRONOLOGICA_COMBO_FILTERS = [
  'orgao',
  'categoriaDeEmpenho',
  'ano'
]

// Campos de texto para os filtros
export const ORDEM_CRONOLOGICA_TEXT_FIELDS = [
  {
    id: 'nomeDoFornecedor',
    label: 'Nome do Fornecedor',
    type: 'text',
    placeholder: 'Digite o nome do fornecedor'
  },
  {
    id: 'cpfCnpjDoFornecedor',
    label: 'CPF/CNPJ',
    type: 'number',
    placeholder: 'Digite o CPF/CNPJ'
  }
]

// Campos de select para os filtros
export const ORDEM_CRONOLOGICA_SELECT_FIELDS = [
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
  }
]

// Larguras personalizadas para cada filtro
export const ORDEM_CRONOLOGICA_CUSTOM_WIDTHS = {
  ano: '25%',
  mes: '25%',
  orgao: '25%',
  categoriaDeEmpenho: '25%',
  nomeDoFornecedor: '50%',
  cpfCnpjDoFornecedor: '50%'
}

// Labels personalizados para os filtros
export const ORDEM_CRONOLOGICA_CUSTOM_LABELS = {
  categoriaDeEmpenho: 'Categoria',
  orgao: 'Órgão'
}

// Ordem dos campos para renderização
export const ORDEM_CRONOLOGICA_FIELD_ORDER = [
  'orgao',
  'categoriaDeEmpenho',
  'ano',
  'mes',
  'cpfCnpjDoFornecedor',
  'nomeDoFornecedor'
]

// Filtros obrigatórios
export const ORDEM_CRONOLOGICA_REQUIRED_FILTERS = ['ano', 'mes']
