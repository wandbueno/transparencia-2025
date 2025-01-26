import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getExtra } from "../../../../services/receitasDespesas/extraorcamentaria";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import MultiComboSelect from '../../../common/MultiComboSelect/MultiComboSelect';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import Toast from '../../../common/Toast';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';
import {
  EXTRA_COMBO_FILTERS,
  EXTRA_TEXT_FIELDS,
  EXTRA_SELECT_FIELDS,
  EXTRA_CUSTOM_WIDTHS,
  EXTRA_CUSTOM_LABELS,
  EXTRA_FIELD_ORDER
} from '../../../../services/filters/receitasDespesas/extraOrcamentaria';

const columnsExtra = [
  { name: "Órgão", selector: (row) => row.orgao, sortable: true, width: '15%' },
  { name: "Título", selector: (row) => row.titulo, sortable: true, width: '15%' },
  { name: "Tipo Extra", selector: (row) => row.tipoDoLancamento, sortable: true, width: '15%' },
  { name: "Valor Movimento (Mês)", selector: (row) => row.valorMovimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '17%' },
  { name: "Valor Anulação (Mês)", selector: (row) => row.valorAnulacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '16%' },
  { name: "Valor Acumulado", selector: (row) => row.valorAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '11%' },
  {
    name: "Detalhes",
    selector: (row) => row.chave.codigoDaExtra,
    cell: (row) => {
      const id = row.chave.codigoDaExtra;
      const ano = row.chave.ano;
      const mes = row.chave.mes.toString().padStart(2, '0');
    
      return (
        <ButtonTable
          path="/extra-orcamentaria"
          id={id}
          queryParams={`?ano=${ano}&mes=${mes}`}
          label="Ver Detalhes"
        />
      );
    },
    width: '11%',
    excludeFromExport: true
  }
];

const Extraorcamentaria = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Get initial filters from URL
  const getInitialFilters = () => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value;
    }
    return filters;
  };

  useEffect(() => {
    document.title = `Extra Orçamentária - Portal Transparência - ${config.geral.nomeOrgao}`;
    const initialFilters = getInitialFilters();
    
    // Only fetch with filters if they exist in URL
    if (Object.keys(initialFilters).length > 0) {
      fetchData(initialFilters);
    } else {
      // Otherwise fetch without filters
      fetchData();
    }
  }, []);

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('Buscando dados com filtros:', filters);
      
      const result = await getExtra(filters);
      setData(result.registros);
      
      if (Object.keys(filters).length > 0) {
        setToast({
          type: 'success',
          message: 'Filtros aplicados com sucesso!'
        });
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
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
        title="Extra Orçamentária"
        breadcrumb={[
          { label: 'Extra Orçamentária' },
        ]}
      />      
      
      <MultiComboSelect
        title="Filtros de Pesquisa"
        availableFilters={EXTRA_COMBO_FILTERS}
        textFields={EXTRA_TEXT_FIELDS}
        selectFields={EXTRA_SELECT_FIELDS}
        customWidths={EXTRA_CUSTOM_WIDTHS}
        customLabels={EXTRA_CUSTOM_LABELS}
        onFilterChange={handleFilterChange}
        fieldOrder={EXTRA_FIELD_ORDER}
        initialValues={getInitialFilters()}
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
        <div>Erro ao carregar Despesas Extra Orçamentária: {error}</div>
      ) : (
        <DataTableComponent
          title="Extra Orçamentária"
          columns={columnsExtra}
          data={data}
        />
      )}
    </div>
  );
};

export default Extraorcamentaria;