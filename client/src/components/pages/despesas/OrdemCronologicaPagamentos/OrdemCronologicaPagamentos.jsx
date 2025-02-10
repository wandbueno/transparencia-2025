import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getOrdensCronologicasPagas } from "../../../../services/receitasDespesas/ordemCronologicaPagamentos";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import MultiComboSelect from '../../../common/MultiComboSelect/MultiComboSelect';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import Toast from '../../../common/Toast';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';
import {
  ORDEM_CRONOLOGICA_COMBO_FILTERS,
  ORDEM_CRONOLOGICA_TEXT_FIELDS,
  ORDEM_CRONOLOGICA_SELECT_FIELDS,
  ORDEM_CRONOLOGICA_CUSTOM_WIDTHS,
  ORDEM_CRONOLOGICA_CUSTOM_LABELS,
  ORDEM_CRONOLOGICA_FIELD_ORDER,
  ORDEM_CRONOLOGICA_REQUIRED_FILTERS
} from '../../../../services/filters/receitasDespesas/ordemCronologicaPagamentos';

const columnsOrdensCronologicas = [
  { name: "Órgão", selector: (row) => row.nomeDoOrgao, sortable: true, width: '20%' },
  // { name: "Categoria", selector: (row) => row.descricaoDaCategoria, sortable: true, width: '15%' },
  { name: "Fornecedor", selector: (row) => row.nomeDoFornecedor, sortable: true, width: '25%' },
  { 
    name: "Data da Exigibilidade", 
    selector: (row) => row.dataDaExigibilidade, 
    sortable: true, 
    width: '15%',
    sortFunction: (a, b) => {
      // Converte as datas do formato DD/MM/YYYY para objetos Date
      const dateA = a.dataDaExigibilidade.split('/').reverse().join('-');
      const dateB = b.dataDaExigibilidade.split('/').reverse().join('-');
      return new Date(dateB) - new Date(dateA); // Ordem decrescente (mais recente primeiro)
    }
  },
  { name: "Valor a Ser Pago", 
    selector: (row) => row.valorASerPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '15%' 
  },
  { name: "Data do Pagamento", selector: (row) => row.dataDoPagamento, sortable: true, width: '15%' },
  {
    name: 'Detalhes',
    selector: row => row.chave.liquidacao,
    cell: row => {
      const { ano, mes, liquidacao } = row.chave;
      return (
        <ButtonTable 
          path="/ordem-cronologica-pagamentos"
          id={liquidacao}
          queryParams={`?ano=${ano}&mes=${mes}`}
          label="Ver Detalhes"
        />
      );
    },
    width: '10%',
    excludeFromExport: true
  }
];

const OrdemCronologicaPagamentos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Get initial filters - if no year/month in URL, use current year/month
  const getInitialFilters = () => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value;
    }
    
    // If no year filter exists, add current year
    if (!filters.ano) {
      filters.ano = new Date().getFullYear().toString();
    }
    
    // If no month filter exists, add current month
    if (!filters.mes) {
      filters.mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
    }
    
    return filters;
  };

  useEffect(() => {
    document.title = `Ordem Cronológica de Pagamentos - Portal Transparência - ${config.geral.nomeOrgao}`;
    const initialFilters = getInitialFilters();
    
    // Always update URL with initial filters
    const params = new URLSearchParams(searchParams);
    if (!params.has('ano')) {
      params.set('ano', initialFilters.ano);
      params.set('mes', initialFilters.mes);
      setSearchParams(params);
    }
    
    // Always fetch data with initial filters
    fetchData(initialFilters);
  }, []);

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('Buscando ordens cronológicas com filtros:', filters);
      
      const result = await getOrdensCronologicasPagas(filters);
      // Ordena os dados por data de exigibilidade (mais recente primeiro)
      const sortedData = result.registros.sort((a, b) => {
        const dateA = a.dataDaExigibilidade.split('/').reverse().join('-');
        const dateB = b.dataDaExigibilidade.split('/').reverse().join('-');
        return new Date(dateB) - new Date(dateA);
      });
      setData(sortedData);
      
      if (Object.keys(filters).length > 0) {
        setToast({
          type: 'success',
          message: 'Filtros aplicados com sucesso!'
        });
      }
    } catch (err) {
      console.error('Erro ao buscar ordens cronológicas:', err);
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
    console.log('Filtros recebidos:', filters);
    
    // Atualiza a URL com os novos filtros
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);

    // Busca os dados com os novos filtros
    fetchData(filters);
  };

  return (
    <div className="container">
      <PageHeader
        title="Ordem Cronológica de Pagamentos"
        breadcrumb={[
          { label: 'Ordem Cronológica de Pagamentos' },
        ]}
      />      
      
      <MultiComboSelect
        title="Filtros de Pesquisa"
        availableFilters={ORDEM_CRONOLOGICA_COMBO_FILTERS}
        textFields={ORDEM_CRONOLOGICA_TEXT_FIELDS}
        selectFields={ORDEM_CRONOLOGICA_SELECT_FIELDS}
        customWidths={ORDEM_CRONOLOGICA_CUSTOM_WIDTHS}
        customLabels={ORDEM_CRONOLOGICA_CUSTOM_LABELS}
        onFilterChange={handleFilterChange}
        initialValues={getInitialFilters()}
        requiredFilters={ORDEM_CRONOLOGICA_REQUIRED_FILTERS}
        fieldOrder={ORDEM_CRONOLOGICA_FIELD_ORDER}
      />
      
      <InfoText href="/transparencia/declaracoes/">
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
        <div>Erro ao carregar ordens cronológicas de pagamento: {error}</div>
      ) : (
        <DataTableComponent
          title="Ordens Cronológicas de Pagamento"
          columns={columnsOrdensCronologicas}
          data={data}
          defaultSortFieldId="dataDaExigibilidade"
          defaultSortAsc={false}
        />
      )}
    </div>
  );
};

export default OrdemCronologicaPagamentos;