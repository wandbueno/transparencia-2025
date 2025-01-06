import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import { TAXONOMIES } from "../../../../services/publicacoesWP/taxonomies";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterWP from '../../../common/FilterWP/FilterWP';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonLink from "../../../common/ButtonLink";

const columnsJulgamentoContas = [
  { 
    name: "Ano", 
    selector: (row) => new Date(row.date).getFullYear(),
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Descrição", 
    selector: (row) => row.title?.rendered || 'Sem título', 
    sortable: true, 
    width: '40%' 
  },
  { 
    name: "Parecer Prévio do TCE", 
    selector: (row) => {
      let linkTCE = row.meta["link-parecer-do-tce"];
      return linkTCE 
        ? <a href={encodeURI(linkTCE)} target="_blank" rel="noopener noreferrer">Parecer Emitido</a>
        : 'Aguardando TCE';
    },
    sortable: true, 
    width: '20%' 
  },
  { 
    name: "Julgamento do Legislativo", 
    selector: (row) => {
      let linkJulgamento = row.meta["link-julgamento-legislativo"];
      return linkJulgamento 
        ? <a href={encodeURI(linkJulgamento)} target="_blank" rel="noopener noreferrer">Julgamento Realizado</a>
        : 'Aguardando Análise';
    },
    sortable: true, 
    width: '20%' 
  }, 
  { 
    name: 'Ação', 
    selector: (row) => (
      <ButtonLink link={row.meta["link-externo"]} label="Ver Detalhes" />
    ),
    width: '10%',
    excludeFromExport: true
  }
];

const JulgamentoContas = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `Julgamento de Contas pelo Legislativo - ${config.geral.nomeOrgao}`;
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getPublicacoesPorTipo('Julgamento de Contas');
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Erro ao carregar Julgamento de Contas pelo Legislativo:', error);
      setError('Erro ao carregar dados da API');
    } finally {
      setLoading(false);
    }
  };

  const searchInObject = (obj, searchTerm) => {
    if (!obj) return false;
    
    // Convert search term to lower case for case-insensitive search
    searchTerm = searchTerm.toLowerCase();
    
    // Search in strings and numbers directly
    if (typeof obj === 'string' || typeof obj === 'number') {
      return obj.toString().toLowerCase().includes(searchTerm);
    }
    
    // Search in arrays
    if (Array.isArray(obj)) {
      return obj.some(item => searchInObject(item, searchTerm));
    }
    
    // Search in objects
    if (typeof obj === 'object') {
      return Object.values(obj).some(value => searchInObject(value, searchTerm));
    }
    
    return false;
  };

  const handleFilterChange = (filters) => {
    let filtered = [...data];

    // Filtrar por taxonomias
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'searchTerm') {
        filtered = filtered.filter(item => 
          item[key]?.includes(Number(value))
        );
      }
    });

    // Filtrar por termo de busca
    if (filters.searchTerm) {
      filtered = filtered.filter(item => {
        // Search in all fields
        return (
          // Search in title
          searchInObject(item.title?.rendered, filters.searchTerm) ||
          // Search in content
          searchInObject(item.content?.rendered, filters.searchTerm) ||
          // Search in excerpt
          searchInObject(item.excerpt?.rendered, filters.searchTerm) ||
          // Search in meta fields
          searchInObject(item.meta, filters.searchTerm) ||
          // Search in slug
          searchInObject(item.slug, filters.searchTerm) ||
          // Search in object field
          searchInObject(item.meta?.objeto_, filters.searchTerm)
        );
      });
    }

    setFilteredData(filtered);
  };

  return (
    <div className="container">
      <PageHeader
        title="Julgamento de Contas pelo Legislativo"
        breadcrumb={[
          { label: 'Julgamento de Contas pelo Legislativo' },
        ]}
      />
       
      <FilterWP 
        onFilterChange={handleFilterChange}
        
        customWidths={{
          [TAXONOMIES.ANO]: '30%',
          'searchTerm': '70%'
        }}
        enabledFilters={[TAXONOMIES.ANO]} 
      />
      
      <InfoText href="/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Julgamento de Contas pelo Legislativo: {error}</div>
      ) : (
        <DataTableComponent
          title="Julgamento de Contas pelo Legislativo"
          columns={columnsJulgamentoContas}
          data={filteredData}
        />
      )}
    </div>
  );
};

export default JulgamentoContas;