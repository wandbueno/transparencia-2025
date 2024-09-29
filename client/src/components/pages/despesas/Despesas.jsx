import React, { useEffect, useState } from "react";
import { getDespesas } from "../../../services/despesas";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import './Despesas.css';

const columns = [
  { name: "Número", selector: (row) => row.codigo, sortable: true, width: '9%' },
  { name: "Data", selector: (row) => row.data, sortable: true, width: '11%' },
  { name: "Fornecedor", selector: (row) => row.nomeDoFornecedor, sortable: true, width: '35%' },
  { name: "Valor Empenho", selector: (row) => row.valorDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
  { name: "Valor Liquidação", selector: (row) => row.valorDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
  { name: "Valor Pagamento", selector: (row) => row.valorDoPagamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
];


const Despesas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // Estado para armazenar os filtros

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDespesas(filters); // Passando os filtros para a API
        setData(result.registros); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]); // Atualiza os dados quando os filtros mudarem

  // Função para aplicar os filtros recebidos
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container">
      <PageHeader
        title="Despesas"
        breadcrumb={[
          { label: 'Página Inicial', path: '/' },
          { label: 'Transparência', path: '/Despesas' },
          { label: 'Despesas' },
        ]}
      />
            
      {/* Passando a função de aplicar filtros para o componente FilterSection */}
      <FilterSection onFilterChange={applyFilters} />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Despesas: {error}</div>
      ) : (
        <DataTableComponent
          title="Despesas"
          columns={columns}
          data={data}
        />
      )}
    </div>
  );
};

export default Despesas;
