import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import { TAXONOMIES, META_FIELDS, isMetaField } from "../../../../services/publicacoesWP/taxonomies";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterWP from '../../../common/FilterWP/FilterWP';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonLink from "../../../common/ButtonLink";

// Função utilitária para decodificar entidades HTML
function decodeHtmlEntities(text) {
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent;
}

const columnsRolInformacoes = [
  { 
    name: "Publicação", 
    selector: (row) => row.date ? new Date(row.date).toLocaleDateString('pt-BR') : 'Não informado',
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Tipo", 
    selector: (row) => row.meta["tipo-de-informacao"] || 'Não informado',
    sortable: true, 
    width: '20%' 
  },
  { 
    name: "Descrição", 
    selector: (row) => row.title?.rendered ? decodeHtmlEntities(row.title?.rendered) : 'Sem título',
    sortable: true, 
    width: '55%' 
  },
  { 
    name: 'Mais Detalhes', 
    selector: (row) => (
      <ButtonLink link={row.meta["link-externo"]} label="Ver Detalhes" />
    ),
    width: '10%',
    excludeFromExport: true
  }
];

const RolInformacoes = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `Rol de Informações - ${config.geral.nomeOrgao}`;
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getPublicacoesPorTipo('Rol de Informações');
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Erro ao carregar Rol de Informações:', error);
      setError('Erro ao carregar dados da API');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...data];

    // Filtrar por taxonomias e campos meta
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'searchTerm') {
        if (isMetaField(key)) {
          // Filtrar por campo meta
          filtered = filtered.filter(item => 
            item.meta[key] === value
          );
        } else {
          // Filtrar por taxonomia
          filtered = filtered.filter(item => 
            item[key]?.includes(Number(value))
          );
        }
      }
    });

    // Filtrar por termo de busca
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const searchableFields = [
          item.title?.rendered,
          item.content?.rendered,
          item.meta?.["tipo-de-informacao"]
        ];

        return searchableFields.some(field => 
          field?.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredData(filtered);
  };

  return (
    <div className="container">
      <PageHeader
        title="Rol de Informações"
        breadcrumb={[
          { label: 'Rol de Informações' },
        ]}
      />      
      <FilterWP 
        onFilterChange={handleFilterChange}
        enabledFilters={[TAXONOMIES.ANO, META_FIELDS.TIPO_INFORMACAO]} 
        customWidths={{
          [TAXONOMIES.ANO]: '20%',
          [META_FIELDS.TIPO_INFORMACAO]: '20%',
          'searchTerm': '60%'
        }}
      />
      
      <InfoText href="/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Rol de Informações: {error}</div>
      ) : (
        <DataTableComponent
          title="Rol de Informações"
          columns={columnsRolInformacoes}
          data={filteredData}
        />
      )}
    </div>
  );
};

export default RolInformacoes;