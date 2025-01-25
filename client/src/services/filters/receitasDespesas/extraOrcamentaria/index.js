// Filtros específicos para Extra Orçamentária
export const EXTRA_COMBO_FILTERS = ['ano', 'orgao', 'tipoDeExtra']

// Campos de texto para os filtros
export const EXTRA_TEXT_FIELDS = [
  {
    id: 'titulo',
    label: 'Título',
    type: 'text',
    placeholder: 'Digite o título'
  }
]

// Campos de select para os filtros
export const EXTRA_SELECT_FIELDS = [
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
export const EXTRA_CUSTOM_WIDTHS = {
  ano: '25%',
  mes: '25%',
  orgao: '25%',
  tipoDeExtra: '25%',
  titulo: '100%'
}

// Labels personalizados para os filtros
export const EXTRA_CUSTOM_LABELS = {
  tipoDeExtra: 'Tipo Extra'
}

// Ordem dos campos para renderização
export const EXTRA_FIELD_ORDER = [
  'orgao',
  'ano',
  'mes',
  'tipoDeExtra',
  'titulo'
]
