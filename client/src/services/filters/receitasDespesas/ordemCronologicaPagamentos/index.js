// client/src/services/filters/receitasDespesas/ordemCronologicaPagamentos/index.js

export const ORDEM_CRONOLOGICA_COMBO_FILTERS = [
  'orgao',
  'categoriaDeEmpenho',
  'ano'
]

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
    type: 'text',
    placeholder: 'Digite o CPF/CNPJ'
  }
]

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

export const ORDEM_CRONOLOGICA_CUSTOM_WIDTHS = {
  ano: '25%',
  mes: '25%',
  orgao: '25%',
  categoriaDeEmpenho: '25%',
  nomeDoFornecedor: '50%',
  cpfCnpjDoFornecedor: '50%'
}

export const ORDEM_CRONOLOGICA_CUSTOM_LABELS = {
  categoriaDeEmpenho: 'Categoria',
  orgao: 'Órgão'
}

export const ORDEM_CRONOLOGICA_FIELD_ORDER = [
  'orgao',
  'categoriaDeEmpenho',
  'ano',
  'mes',
  'cpfCnpjDoFornecedor',
  'nomeDoFornecedor'
]

export const ORDEM_CRONOLOGICA_REQUIRED_FILTERS = ['ano', 'mes']
