import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTableComponent from "../../common/DataTable";
import './LicitacoesTable.css';

const columns = [
   { name: "Modalidade", selector: (row) => row.modalidade, sortable: true },
  { name: "Número/Ano", selector: (row) => row.numeroAno, sortable: true },
  { name: "Órgão", selector: (row) => row.orgao, sortable: true },
  { name: "Data de Julgamento", selector: (row) => row.dataDeJulgamento, sortable: true },
  { name: "Situação", selector: (row) => row.situacao, sortable: true },
  { 
    name: "Objeto", 
    selector: (row) => row.historico, 
    sortable: true,
    cell: row => (
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
        const response = await axios.get("http://localhost:5000/api/licitacoes");
        setData(response.data.registros); 
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar licitações: {error}</div>;

  return (
    <div className="container">
      <div className="breadcrumb">
        Você está aqui: <a href="/">Portal da Transparência</a>  <a href="/receitas-e-despesas">Receitas e Despesas</a>  Receitas
      </div>
      <DataTableComponent
        title="Contratos"
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default LicitacoesTable;
