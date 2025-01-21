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

// Function to decode HTML entities
function decodeHtmlEntities(text) {
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent;
}

const columnsParceirasAcordos = [
  { 
    name: "Publicação", 
    selector: (row) => row.date ? new Date(row.date).toLocaleDateString('pt-BR') : 'Não informado',
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Tipo", 
    selector: (row) => row.meta["tipo-acordo"] || 'Não informado',
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Origem", 
    selector: (row) => row.meta["origem"] || 'Não informado',
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Destino", 
    selector: (row) => row.meta["destino"] || '',
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Vigência", 
    selector: (row) => row.meta["data-fim"] || '',
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Descrição", 
    selector: (row) => row.title?.rendered ? decodeHtmlEntities(row.title?.rendered) : 'Sem título',
    sortable: true, 
    width: '25%' 
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

const ParceirasAcordos = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `Parceiras e Acordos Firmados - ${config.geral.nomeOrgao}`;
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getPublicacoesPorTipo('Parceiras e Acordos');
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Erro ao carregar Parceiras e Acordos Firmados:', error);
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
          item.meta?.["tipo-acordo"],
          item.meta?.origem,
          item.meta?.destino,
          item.meta?.["data-fim"],
          item.meta?.objeto_
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
        title="Parceiras e Acordos Firmados"
        breadcrumb={[
          { label: 'Parceiras e Acordos Firmados' },
        ]}
      />      
      <FilterWP 
        onFilterChange={handleFilterChange}
        enabledFilters={[TAXONOMIES.ANO, META_FIELDS.TIPO_ACORDO]} 
        customWidths={{
          [TAXONOMIES.ANO]: '20%',
          [META_FIELDS.TIPO_ACORDO]: '20%',
          'searchTerm': '60%'
        }}
      />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/?jsf=jet-data-table:filter_declaracao&tax=tipo-declaracao:116">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Parceiras e Acordos Firmados: {error}</div>
      ) : (
        <DataTableComponent
          title="Parceiras e Acordos Firmados"
          columns={columnsParceirasAcordos}
          data={filteredData}
        />
      )}
    </div>
  );
};

export default ParceirasAcordos;