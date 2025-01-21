// Filtros específicos para diárias
export const DIARIAS_COMBO_FILTERS = ['orgao']

export const DIARIAS_TEXT_FIELDS = [
  {
    id: 'matriculaDoFuncionario',
    label: 'Matrícula',
    type: 'text'
  },
  {
    id: 'nomeDoFuncionario',
    label: 'Nome do Funcionário',
    type: 'text'
  },
  {
    id: 'destino',
    label: 'Destino',
    type: 'text'
  },
  {
    id: 'dataInicial',
    label: 'Data Inicial',
    type: 'date'
  },
  {
    id: 'dataFinal',
    label: 'Data Final',
    type: 'date'
  },
  {
    id: 'numeroDaLiquidacao',
    label: 'Número da Liquidação',
    type: 'text'
  },
  {
    id: 'valor',
    label: 'Valor',
    type: 'text'
  }
]

export const DIARIAS_CUSTOM_WIDTHS = {
  orgao: '25%',
  matriculaDoFuncionario: '25%',
  nomeDoFuncionario: '50%',
  destino: '50%',
  dataInicial: '25%',
  dataFinal: '25%',
  numeroDaLiquidacao: '25%',
  valor: '25%'
}
