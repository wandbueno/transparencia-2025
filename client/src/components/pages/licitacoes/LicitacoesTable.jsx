import React, { useEffect, useState } from "react";
import { getLicitacoes } from "../../../services/licitacoes";
import DataTableComponent from "../../common/DataTable";
import './LicitacoesTable.css';

const columns = [
  {
    name: "Dados",
    selector: (row) => row,
    cell: (row) => (
      <span className="dados-licita">
        <p><span>{row.modalidade} Nº {row.numeroAno}</span></p>
        <p><span>Data Abertura:</span> {row.dataDeJulgamento}</p>
        <p><span>Situação:</span> {row.situacao}</p>
      </span>
    ),
  },
  {
    name: "Objeto",
    selector: (row) => row,
    cell: (row) => (
      <span className="objeto-licita">
        <p><span> {row.orgao}</span></p>
        <p>{row.historico}</p>
      </span>
    ),
  },
];

// const columns = [
//   { name: "Modalidade", selector: (row) => row.modalidade, sortable: true },
//   { name: "Número/Ano", selector: (row) => row.numeroAno, sortable: true },
//   { name: "Órgão", selector: (row) => row.orgao, sortable: true },
//   { name: "Data de Julgamento", selector: (row) => row.dataDeJulgamento, sortable: true },
//   { name: "Situação", selector: (row) => row.situacao, sortable: true },
//   { 
//     name: "Objeto", 
//     selector: (row) => row.historico, 
//     sortable: true,
//     cell: (row) => (
//       <div className="break-word">{row.historico}</div>
//     )
//   },
// ];

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
      <h2>Procedimentos Licitatórios</h2>
      <div className="breadcrumb">
        Você está aqui: <a href="/">Página inicial</a> / <a href="/transparencia">Transparência</a> / Procedimentos Licitatórios
      </div>
      <div className="container-filter">
        filtro de pesquisa
      </div>
      <a href="/">Veja Declarações Negativas e Demais Documentos Clicando Aqui</a>
         
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
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
