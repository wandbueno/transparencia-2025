import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import { TAXONOMIES } from "../../../../services/publicacoesWP/taxonomies";
import FilterWP from '../../../common/FilterWP/FilterWP';
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonLink from "../../../common/ButtonLink";

const columnsIncentivosProjetos = [
  { 
    name: "Ano", 
    selector: (row) => new Date(row.date).getFullYear(), // Extrai o ano diretamente do campo "date"
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Descrição", 
    selector: (row) => row.title?.rendered || 'Sem título', 
    sortable: true, 
    width: '80%' 
  },
    
  { 
    name: 'Mais Detalhes', 
    selector: (row) => (
      <ButtonLink link={row.meta["link-externo"]} label="Ver Detalhes" /> // Usa ButtonLink diretamente, sem verificação
    ),
    width: '10%',
    excludeFromExport: true
  }
  
];

const IncentivosProjetos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Relação de Incentivos a Projetos Culturais / Esportivos - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        
        // Usando a função genérica para buscar publicações do tipo "Terceirizados"
        const result = await getPublicacoesPorTipo('Incentivo à cultura');
        setData(result); // Armazena os dados filtrados
        setFilteredData(result);

      } catch (error) {
        console.error('Erro ao carregar Relação de Incentivos a Projetos Culturais / Esportivos:', error);
        setError('Erro ao carregar dados da API');
      } finally {
        setLoading(false); // Garantir que o carregamento termine após sucesso ou erro
      }
    };
    
    fetchData();
  }, []);

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
        title="Relação de Incentivos a Projetos Culturais / Esportivos"
        breadcrumb={[
          { label: 'Relação de Incentivos a Projetos Culturais / Esportivos' },
        ]}
      />      
      <FilterWP 
        onFilterChange={handleFilterChange}
        enabledFilters={[TAXONOMIES.ANO]} // Apenas filtros adicionais
        customWidths={{
          [TAXONOMIES.ANO]: '30%',
          'searchTerm': '70%', 
        }}
      />
      
      <InfoText href="/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Relação de Incentivos Relacionados a Projetos Culturais / Esportivos: {error}</div>
      ) : (
        <DataTableComponent
          title="Relação de Incentivos a Projetos Culturais / Esportivos"
          columns={columnsIncentivosProjetos}
          data={filteredData}
        />
      )}

   
    </div>
  );
};

export default IncentivosProjetos;
