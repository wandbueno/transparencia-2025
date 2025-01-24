import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../services/publicacoesWP/publicacao";
import { TAXONOMIES } from "../../../services/publicacoesWP/taxonomies";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterWP from '../../common/FilterWP/FilterWP';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import { config } from '../../../assets/config';
import ButtonLink from "../../common/ButtonLink";

const columnsDividaAtiva = [
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
    name: 'Ação', 
    selector: (row) => row.meta["link-externo"], 
    cell: row => (
      <ButtonLink 
        link={row.meta["link-externo"]}  // Passa o link externo para o botão
        label="Ver Detalhes"
      />
    ),
    width: '20%',
    excludeFromExport: true
  }
  
];

const DividaAtiva = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `Dívida Ativa e Cobranças - ${config.geral.nomeOrgao}`;
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getPublicacoesPorTipo('Divida Ativa');
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Erro ao carregar Dívida Ativa e Cobranças:', error);
      setError('Erro ao carregar dados da API');
    } finally {
      setLoading(false);
    }
  };

  const searchInObject = (obj, searchTerm) => {
    if (!obj) return false;
    
    searchTerm = searchTerm.toLowerCase();
    
    if (typeof obj === 'string' || typeof obj === 'number') {
      return obj.toString().toLowerCase().includes(searchTerm);
    }
    
    if (Array.isArray(obj)) {
      return obj.some(item => searchInObject(item, searchTerm));
    }
    
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
        return (
          searchInObject(item.title?.rendered, filters.searchTerm) ||
          searchInObject(item.content?.rendered, filters.searchTerm) ||
          searchInObject(item.excerpt?.rendered, filters.searchTerm) ||
          searchInObject(item.meta, filters.searchTerm) ||
          searchInObject(item.slug, filters.searchTerm)
        );
      });
    }

    setFilteredData(filtered);
  };

  return (
    <div className="container">
      <PageHeader
        title="Dívida Ativa e Cobranças"
        breadcrumb={[
          { label: 'Dívida Ativa e Cobranças' },
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
        <div>Erro ao carregar Dívida Ativa e Cobranças: {error}</div>
      ) : (
        <DataTableComponent
          title="Dívida Ativa e Cobranças"
          columns={columnsDividaAtiva}
          data={filteredData}
        />
      )}
    </div>
  );
};

export default DividaAtiva;
