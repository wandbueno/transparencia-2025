// Filtros específicos para diárias
export const DIARIAS_COMBO_FILTERS = ['orgao']

export const DIARIAS_TEXT_FIELDS = [
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
    type: 'number'
  },
  {
    id: 'matriculaDoFuncionario',
    label: 'Matrícula',
    type: 'number'
  },
  {
    id: 'nomeDoFuncionario',
    label: 'Nome do Funcionário',
    type: 'text'
  },
  {
    id: 'numeroDoProcesso',
    label: 'Número do Processo',
    type: 'number'
  },
  {
    id: 'numeroDaPortaria',
    label: 'Número da Portaria',
    type: 'number'
  },
  {
    id: 'anoDaPortaria',
    label: 'Ano da Portaria',
    type: 'number'
  },
  {
    id: 'valor',
    label: 'Valor',
    type: 'number'
  },
  {
    id: 'numeroDoEmpenho',
    label: 'Número do Empenho',
    type: 'number'
  },
  {
    id: 'numeroDoPagamento',
    label: 'Número do Pagamento',
    type: 'number'
  },
  {
    id: 'destino',
    label: 'Local de Destino',
    type: 'text'
  }
]

export const DIARIAS_CUSTOM_WIDTHS = {
  orgao: '50%',
  dataInicial: '25%',
  dataFinal: '25%',
  numeroDaLiquidacao: '25%',
  matriculaDoFuncionario: '25%',
  nomeDoFuncionario: '50%',
  numeroDoProcesso: '25%',
  numeroDaPortaria: '25%',
  anoDaPortaria: '25%',
  valor: '25%',
  numeroDoEmpenho: '25%',
  numeroDoPagamento: '25%',
  destino: '50%'
}
