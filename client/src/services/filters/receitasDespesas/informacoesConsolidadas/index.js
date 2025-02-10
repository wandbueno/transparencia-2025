// Filtros específicos para Informações Consolidadas
export const INFO_CONSOLIDADAS_COMBO_FILTERS = [
  'orgao',
  'ano',
  'fonteDoEmpenho'
]

// Campos de select para os filtros
export const INFO_CONSOLIDADAS_TEXT_FIELDS = [
  {
    id: 'fornecedor',
    label: 'Nome do Fornecedor',
    type: 'text',
    placeholder: 'Digite o nome do fornecedor'
  },
  {
    id: 'cpfOuCnpj',
    label: 'CPF/CNPJ',
    type: 'text',
    placeholder: 'Digite o CPF/CNPJ'
  },
  {
    id: 'rubricaDaDespesa',
    label: 'Rubrica da Despesa',
    type: 'text'
  }
]

// Larguras personalizadas para cada filtro
export const INFO_CONSOLIDADAS_CUSTOM_WIDTHS = {
  orgao: '25%',
  ano: '25%',
  cpfOuCnpj: '25%',
  fonteDoEmpenho: '25%',
  fornecedor: '50%',
  rubricaDaDespesa: '50%'
}

// Labels personalizados para os filtros
export const INFO_CONSOLIDADAS_CUSTOM_LABELS = {
  orgao: 'Órgão',
  rubricaDaDespesa: 'Rubrica da Despesa',
  fonteDoEmpenho: 'Fonte'
}

// Ordem dos campos para renderização
export const INFO_CONSOLIDADAS_FIELD_ORDER = [
  'orgao',
  'ano',
  'cpfOuCnpj',
  'fonteDoEmpenho',
  'fornecedor',
  'rubricaDaDespesa'
]
