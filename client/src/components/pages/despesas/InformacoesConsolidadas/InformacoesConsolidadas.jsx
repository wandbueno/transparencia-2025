import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getConsolidadosPaginados } from "../../../../services/receitasDespesas/InformacoesConsolidadas";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import MultiComboSelect from '../../../common/MultiComboSelect/MultiComboSelect';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config'; 
import {
  INFO_CONSOLIDADAS_COMBO_FILTERS,
  INFO_CONSOLIDADAS_TEXT_FIELDS,
  INFO_CONSOLIDADAS_CUSTOM_WIDTHS,
  INFO_CONSOLIDADAS_CUSTOM_LABELS,
  INFO_CONSOLIDADAS_FIELD_ORDER
} from '../../../../services/filters/receitasDespesas/informacoesConsolidadas';

// Função auxiliar para truncar texto
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const columnsConsolidados = [
  // { 
  //   name: "Código do Empenho", 
  //   selector: (row) => row.numeroDoEmpenhoFormatado, 
  //   sortable: true, 
  //   width: '10%' 
  // },
  { 
    name: "Órgão", 
    selector: (row) => truncateText(row.nomeDoOrgao, 25), // Limita a 25 caracteres
    sortable: true, 
    width: '16%',
    cell: row => (
      <div title={row.nomeDoOrgao}> {/* Mostra o texto completo no tooltip */}
        {truncateText(row.nomeDoOrgao, 25)}
      </div>
    )
  },
  { 
    name: "Ano", 
    selector: (row) => row.anoDoEmpenho, 
    sortable: true, 
    width: '5%' 
  },
  { 
    name: "Fornecedor", 
    selector: (row) => row.fornecedor, 
    sortable: true, 
    width: '28%' 
  },
  { 
    name: "Rubrica", 
    selector: (row) => row.rubricaFormatada, 
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Empenhado", 
    selector: (row) => row.valorEmpenhado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
    sortable: true, 
    width: '9%' 
  },
  { 
    name: "Liquidado", 
    selector: (row) => row.valorLiquidado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
    sortable: true, 
    width: '9%' 
  },
  { 
    name: "Pago", 
    selector: (row) => row.valorPago?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
    sortable: true, 
    width: '9%' 
  },
  {
    name: 'Detalhes',
    selector: row => row.codigoDoEmpenho,
    cell: row => (
      <ButtonTable
        path="/informacoes-consolidadas"
        id={row.codigoDoEmpenho}
        label="Ver Detalhes"
      />
    ),
    width: '10%',
    excludeFromExport: true
  }
];

const InformacoesConsolidadas = () => {
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

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('Buscando dados com filtros:', filters);
      
      const result = await getConsolidadosPaginados(filters);
      setData(result.registros);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Atualiza o título da aba do navegador
    document.title = `Informações Consolidadas - Portal Transparência - ${config.geral.nomeOrgao}`;

    const initialFilters = getInitialFilters();
    
    // Only fetch with filters if they exist in URL
    if (Object.keys(initialFilters).length > 0) {
      fetchData(initialFilters);
    } else {
      // Otherwise fetch without filters
      fetchData();
    }
  }, []);

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
        title="Informações Consolidadas"
        breadcrumb={[
          { label: 'Informações Consolidadas' },
        ]}
      />
      
      <MultiComboSelect
        title="Filtros de Pesquisa"
        availableFilters={INFO_CONSOLIDADAS_COMBO_FILTERS}
        textFields={INFO_CONSOLIDADAS_TEXT_FIELDS}
        customWidths={INFO_CONSOLIDADAS_CUSTOM_WIDTHS}
        customLabels={INFO_CONSOLIDADAS_CUSTOM_LABELS}
        onFilterChange={handleFilterChange}
        initialValues={getInitialFilters()}
        fieldOrder={INFO_CONSOLIDADAS_FIELD_ORDER}
      />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Informações Consolidadas: {error}</div>
      ) : (
        <DataTableComponent
          title="Informações Consolidadas"
          columns={columnsConsolidados}
          data={data}
        />
      )}
    </div>
  );
};

export default InformacoesConsolidadas; 