import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDespesas } from "../../../../services/receitasDespesas/despesas";
import { COMBO_FILTERS } from "../../../../services/combo/comboService";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import Toast from '../../../common/Toast';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';
import FonteDadosMega from "../../../common/FonteDadosMega";
import FilterSection from '../../../common/FilterSection/FilterSection';


const columns = [
  { name: "Número", selector: (row) => row.codigo, sortable: true, width: '9%' },
  { name: "Data", selector: (row) => row.data, sortable: true, width: '11%' },
  { name: "Fornecedor", selector: (row) => row.nomeDoFornecedor, sortable: true, width: '25%' },
  { name: "Valor Empenho", selector: (row) => row.valorDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
  { name: "Valor Liquidação", selector: (row) => row.valorDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
  { name: "Valor Pagamento", selector: (row) => row.valorDoPagamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
  {
    name: 'Detalhes',
    selector: row => row.codigo, 
    cell: row => {
      const id = row.codigo;
      return <ButtonTable path="/despesas-empenho" id={id} label="Ver Detalhes" />;
    },
    width: '11%', 
    excludeFromExport: true
  },
];

const Empenho = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Get initial filters - if no year in URL, use current year
  const getInitialFilters = () => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value;
    }
    
    // If no year filter exists, add current year
    if (!filters.ano) {
      filters.ano = new Date().getFullYear().toString();
    }
    
    return filters;
  };

  useEffect(() => {
    document.title = `Despesa/ Empenho - Portal Transparência - ${config.geral.nomeOrgao}`;
    const initialFilters = getInitialFilters();
    
    // Always update URL with initial filters
    const params = new URLSearchParams(searchParams);
    if (!params.has('ano')) {
      params.set('ano', initialFilters.ano);
      setSearchParams(params);
    }
    
    // Always fetch data with initial filters
    fetchData(initialFilters);
  }, []);

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('Fetching data with filters:', filters);
      const result = await getDespesas(filters);
      setData(result.registros);
      
      if (Object.keys(filters).length > 0) {
        setToast({
          type: 'success',
          message: 'Filtros aplicados com sucesso!'
        });
      }
    } catch (err) {
      console.error('Erro ao buscar empenhos:', err);
      setError(err.message);
      setToast({
        type: 'error',
        message: 'Erro ao aplicar filtros: ' + err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);

    // Fetch data with new filters
    fetchData(filters);
  };

  return (
    <div className="container">
      <PageHeader
        title="Despesa/ Empenho"
        breadcrumb={[
          { label: 'Despesa/ Empenho' },
        ]}
      />      
      
      <FilterSection 
        enabledFilters={[
          COMBO_FILTERS.ANO,
          COMBO_FILTERS.ORGAO,
          COMBO_FILTERS.UNIDADE,
          COMBO_FILTERS.MODALIDADE,
          COMBO_FILTERS.ELEMENTO,
          COMBO_FILTERS.FUNCAO,
          COMBO_FILTERS.SUBFUNCAO,
          COMBO_FILTERS.PROGRAMA,
          COMBO_FILTERS.CATEGORIA_EMPENHO,
          COMBO_FILTERS.FONTE_EMPENHO,
          
        ]}
        customWidths={{
          [COMBO_FILTERS.ANO]: '25%',
          [COMBO_FILTERS.ORGAO]: '25%',
          [COMBO_FILTERS.UNIDADE]: '25%',
          [COMBO_FILTERS.MODALIDADE]: '25%', 
          [COMBO_FILTERS.ELEMENTO]: '25%',
          [COMBO_FILTERS.FUNCAO]: '25%',
          [COMBO_FILTERS.SUBFUNCAO]: '25%',
          [COMBO_FILTERS.PROGRAMA]: '25%',
          [COMBO_FILTERS.CATEGORIA_EMPENHO]: '25%',
          [COMBO_FILTERS.FONTE_EMPENHO]: '25%',
        }}
        onFilterChange={handleFilterChange}
        initialFilters={getInitialFilters()}
      />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
      
      {toast && (
        <Toast 
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
         
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

      <FonteDadosMega />
    </div>
  );
};

export default Empenho;