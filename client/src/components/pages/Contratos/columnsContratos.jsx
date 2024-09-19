// components/columns/columnsContratos.js
import ButtonTable from '../../common/ButtonTable'

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

const columnsContratos = [
  { name: 'Número', selector: row => row.numero, sortable: true, width: '9%' },
  {
    name: 'Ano',
    selector: row => row.exercicioAno,
    sortable: true,
    width: '7%'
  },
  {
    name: 'Fornecedor',
    selector: row => row.nomeDoFornecedor,
    sortable: true,
    width: '20%'
  },
  {
    name: 'Valor',
    selector: row =>
      row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    sortable: true,
    width: '10%'
  },
  {
    name: 'Situação',
    selector: row => row.situacao,
    sortable: true,
    width: '10%'
  },
  {
    name: 'Objeto',
    selector: row => row.historico,
    sortable: true,
    width: '34%',
    cell: row => (
      <div className="break-word">{truncateText(row.objeto, 150)}</div>
    )
  },
  {
    name: 'Detalhes',
    selector: row => row.codigo,
    cell: row => {
      const id = row.codigo
      return <ButtonTable path="/contratos" id={id} label="Ver Detalhes" /> // Passa a rota e o ID
    },
    width: '11%'
  }
]

// Verifique se a exportação está correta
export default columnsContratos
