import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { getLicitacoes } from "../../../services/licitacoes";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import './LicitacoesTable.css';
import '../../../assets/global.css';


// const columns = [
//   {
//     name: "Dados",
//     selector: (row) => row,
//     cell: (row) => (
//       <span className="dados-licita">
//         <p><span>{row.modalidade} Nº {row.numeroAno}</span></p>
//         <p><span>Data Abertura:</span> {row.dataDeJulgamento}</p>
//         <p><span>Situação:</span> {row.situacao}</p>
//       </span>
//     ),
//   },
//   {
//     name: "Objeto",
//     selector: (row) => row,
//     cell: (row) => (
//       <span className="objeto-licita">
//         <p><span> {row.orgao}</span></p>
//         <p>{row.historico}</p>
//       </span>
//     ),
//   },
// ];

const columns = [
  { name: "Modalidade", selector: (row) => row.modalidade, sortable: true, width: '15%' },
  { name: "Número/Ano", selector: (row) => row.numeroAno, sortable: true, width: '11%' },
  { name: "Órgão", selector: (row) => row.orgao, sortable: true, width: '18%' },
  { name: "Data de Julgamento", selector: (row) => row.dataDeJulgamento, sortable: true, width: '16%' },
  { name: "Situação", selector: (row) => row.situacao, sortable: true, width: '10%' },
  { 
    name: "Objeto", 
    selector: (row) => row.historico, 
    sortable: true, width: '30%',
    cell: (row) => (
      <div className="break-word">{row.historico}</div>
    )
  },
];

const LicitacoesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLicitacoes();
        setData(result.registros); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <PageHeader
        title="Procedimentos Licitatórios"
        breadcrumb={[
          { label: 'Página Inicial', path: '/' },
          { label: 'Transparência', path: '/transparencia' },
          { label: 'Procedimentos Licitatórios' },
        ]}
      />
      
      <FilterSection  />

      <InfoText>
        <p>
          <a href="/">Veja Declarações Negativas e Demais Documentos Clicando Aqui</a>.
        </p>
      </InfoText>
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar licitações: {error}</div>
      ) : (
        <DataTableComponent
          title="Licitações"
          columns={columns}
          data={data}
        />
      )}
    </div>
  );
};

export default LicitacoesTable;
