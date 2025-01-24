// Filtros específicos para servidores
export const SERVIDORES_COMBO_FILTERS = [
  'ano',
  'orgao',
  'cargo',
  'situacaoFuncionario',
  'tipoDeVinculo',
  'categoriaDoTrabalhadorNoESocial'
]

// Campos de texto para os filtros
export const SERVIDORES_TEXT_FIELDS = [
  {
    id: 'matriculaDoFuncionario',
    label: 'Matrícula',
    type: 'text',
    placeholder: 'Digite a matrícula'
  },
  {
    id: 'cpf',
    label: 'CPF',
    type: 'text',
    placeholder: 'Digite o CPF'
  },
  {
    id: 'nomeDoFuncionario',
    label: 'Nome do Servidor',
    type: 'text',
    placeholder: 'Digite o nome'
  },
  {
    id: 'nomeDoDepartamento',
    label: 'Departamento',
    type: 'text',
    placeholder: 'Digite o departamento'
  }
]

// Campos de select para os filtros
export const SERVIDORES_SELECT_FIELDS = [
  {
    id: 'mes',
    label: 'Mês de Referência *',
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
export const SERVIDORES_CUSTOM_WIDTHS = {
  ano: '25%',
  mes: '25%',
  orgao: '25%',
  cargo: '25%',
  matriculaDoFuncionario: '25%',
  cpf: '25%',
  nomeDoFuncionario: '50%',
  nomeDoDepartamento: '25%',
  situacaoFuncionario: '25%',
  tipoDeVinculo: '25%',
  categoriaDoTrabalhadorNoESocial: '25%'
}

// Labels personalizados para os filtros
export const SERVIDORES_CUSTOM_LABELS = {
  ano: 'Ano de Referência *',
  orgao: 'Órgão',
  cargo: 'Cargo',
  situacaoFuncionario: 'Situação',
  tipoDeVinculo: 'Tipo de Admissão',
  categoriaDoTrabalhadorNoESocial: 'Categorias de Trabalhadores'
}

// Ordem dos campos para renderização
export const SERVIDORES_FIELD_ORDER = [
  'ano', // Ano de Referência * (combo)
  'mes', // Mês de Referência * (select)
  'orgao', // Órgão (combo)
  'cargo', // Cargo (combo)
  'nomeDoFuncionario', // Nome do Servidor (text)
  'matriculaDoFuncionario', // Matrícula (text)
  'cpf', // CPF (text)
  'nomeDoDepartamento', // Departamento (text)
  'situacaoFuncionario', // Situação (combo)
  'tipoDeVinculo', // Tipo de Admissão (combo)
  'categoriaDoTrabalhadorNoESocial' // Categorias de Trabalhadores (combo)
]
