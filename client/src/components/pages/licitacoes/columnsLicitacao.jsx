import ButtonTable from '../../common/ButtonTable'

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

const columnsLicitacao = [
  { name: "Modalidade", selector: (row) => row.modalidade, sortable: true, width: '14%' },
  { name: "Nº/Ano", selector: (row) => row.numeroAno, sortable: true, width: '8%' },
  { name: "Órgão", selector: (row) => row.orgao, sortable: true, width: '18%' },
  { name: "Julgamento", selector: (row) => row.dataDeJulgamento, sortable: true, width: '11%' },
  { name: "Situação", selector: (row) => row.situacao, sortable: true, width: '9%' },
  { 
    name: "Objeto", 
    selector: (row) => row.historico, 
    sortable: true, width: '29%',
    cell: (row) => (
      <div className="break-word">
        {truncateText(row.historico, 130)}
      </div>
    )
  },
  
  {
    name: 'Detalhes',
    selector: row => row.codigo,
    cell: row => {
      const id = row.codigo
      return <ButtonTable path="/licitacoes" id={id} label="Ver Detalhes" /> // Passa a rota e o ID
    },
    width: '11%',
    excludeFromExport: true
  }
];

export default columnsLicitacao