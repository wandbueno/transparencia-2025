// Filtros específicos para estrutura de remuneração
export const ESTRUTURA_REMUNERACAO_COMBO_FILTERS = ['tipoDeCargo', 'ano']

// Campos de texto para os filtros
export const ESTRUTURA_REMUNERACAO_TEXT_FIELDS = [
  {
    id: 'nomeDoCargo',
    label: 'Cargo',
    type: 'text'
  }
]

// Campos de select para os filtros
export const ESTRUTURA_REMUNERACAO_SELECT_FIELDS = [
  {
    id: 'mes',
    label: 'Mês de Referência',
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
export const ESTRUTURA_REMUNERACAO_CUSTOM_WIDTHS = {
  nomeDoCargo: '25%',
  tipoDeCargo: '25%',
  mes: '25%',
  ano: '25%'
}

// Labels personalizados para os filtros
export const ESTRUTURA_REMUNERACAO_CUSTOM_LABELS = {
  tipoDeCargo: 'Tipo de Cargo',
  ano: 'Ano de Referência *'
}
// Ordem dos campos para renderização
export const ESTRUTURA_REMUNERACAO_FIELD_ORDER = [
  'nomeDoCargo', // Cargo (text field)
  'tipoDeCargo', // Tipo de Cargo (combo)
  'mes', // Mês de Referência * (select)
  'ano' // Ano de Referência * (combo)
]
