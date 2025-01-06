import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonTable from "../../../common/ButtonTable";
import { TAXONOMIES } from "../../../../services/publicacoesWP/taxonomies";
import FilterWP from '../../../common/FilterWP/FilterWP';

const columnsPrestacaoContas = [
  { 
    name: "Ano", 
    selector: (row) => new Date(row.date).getFullYear(), // Extrai o ano diretamente do campo "date"
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Descrição", 
    selector: (row) => (
      <div dangerouslySetInnerHTML={{ __html: row.title?.rendered || 'Sem título' }} />
    ), 
    sortable: true, 
    width: '50%' 
  },
  { 
    name: "Parecer Prévio do TCE", 
    selector: (row) => {
      let linkTCE = row.meta["link-parecer-do-tce"]; // Pega o link do campo meta

      return linkTCE 
        ? <a href={encodeURI(linkTCE)} target="_blank" rel="noopener noreferrer">Parecer Emitido</a> // Renderiza o link se presente
        : 'Aguardando TCE'; // Mensagem caso o link esteja ausente
    },
    sortable: true, 
    width: '30%' 
  },
  
  { 
    name: 'Mais Detalhes', 
    selector: (row) => (
      <ButtonTable 
        path="/prestacao-de-contas"  // Caminho base para os detalhes
        id={row.slug}                // Usando o slug como identificador
        label="Ver Detalhes"          // Texto do botão
      />
    ),
    width: '10%',
    excludeFromExport: true
  }
  
];

const PrestacaoContas = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `Prestação de Contas e Parecer Prévio do TCE - ${config.geral.nomeOrgao}`
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getPublicacoesPorTipo('Prestação de Contas');
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Erro ao carregar Prestação de Contas e Parecer Prévio do TCE:', error);
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
        title="Prestação de Contas e Parecer Prévio do TCE"
        breadcrumb={[
          { label: 'Prestação de Contas e Parecer Prévio do TCE' },
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
        <div>Erro ao carregar Prestação de Contas e Parecer Prévio do TCE: {error}</div>
      ) : (
        <DataTableComponent
          title="Prestação de Contas e Parecer Prévio do TCE"
          columns={columnsPrestacaoContas}
          data={filteredData}
        />
      )}
    </div>
  );
};

export default PrestacaoContas;
