import React, { useEffect, useState } from "react";
import { getReceitas } from "../../../services/receitas";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import './Receitas.css';

const columns = [
  // { name: "Ano", selector: (row) => row.chave.ano, sortable: true },
  { name: "Receita", selector: (row) => row.receita, sortable: true },
  // {
  //   name: "Natureza da Receita",
  //   selector: (row) => `${row.naturezaDaReceita} - ${row.receita}`,
  //   sortable: true,
  // },
  { name: "Fonte da Receita", selector: (row) => row.fonteDaReceita, sortable: true },
  // { name: "Origem dos Recursos", selector: (row) => row.origemDoRecurso, sortable: true },
  { name: "Valor Orçado", selector: (row) => row.valorOrcado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true },
  { name: "Valor Arrecadado (Mês)", selector: (row) => row.arrecadacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true },
  { name: "Valor Arrecadado (Anual)", selector: (row) => row.valorAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true },
];

const Receitas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getReceitas();
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
        title="Receitas"
        breadcrumb={[
          { label: 'Página Inicial', path: '/' },
          { label: 'Transparência', path: '/receitas' },
          { label: 'Receitas' },
        ]}
      />      
      <FilterSection  />
      <InfoText>
        <p>
          <a href="/">Veja Declarações Negativas e Demais Documentos Clicando Aqui</a>.
        </p>
      </InfoText>      
         
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div>Erro ao carregar Receitas: {error}</div>
      ) : (
        <DataTableComponent
          title="Receitas"
          columns={columns}
          data={data}
        />
      )}
    </div>
  );
};

export default Receitas;
