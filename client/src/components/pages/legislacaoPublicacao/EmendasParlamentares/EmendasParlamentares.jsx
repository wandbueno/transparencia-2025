import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import { TAXONOMIES } from "../../../../services/publicacoesWP/taxonomies";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterWP from '../../../common/FilterWP/FilterWP';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonTable from "../../../common/ButtonTable";

const columnsEmendasParlamentares = [
  { 
    name: "Mês/Ano", 
    selector: (row) => {
      const date = new Date(row.date);
      const year = date.getFullYear();
      const month = (`0${date.getMonth() + 1}`).slice(-2); // Adiciona zero à esquerda se o mês for menor que 10
      return `${month}/${year}`; // Formato Ano/Mês
    },
    sortable: true, 
    width: '8%' 
  },
  { 
    name: "Nº Emenda", 
    selector: (row) => row.meta["n_emenda"] || '', // Pega a situação
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Autor", 
    selector: (row) => row.meta["autor-da-emenda"] || 'Não Informado', // Pega o nome do órgão responsável
    sortable: true, 
    width: '15%' 
  },
 
  
  { 
    name: "Valor", 
    selector: (row) => {
      const valor = row.meta["valor_convenio"];
      
      // Verifica se o valor existe, remove pontos e vírgula e formata corretamente
      return valor 
        ? `${valor}` // Apenas insere "R$" antes do valor, que já está formatado corretamente
        : 'Não Informado'; // Se o campo estiver vazio, exibe "Não Informado"
    },
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Objeto", 
    selector: (row) => row.meta["objeto_"] ? row.meta["objeto_"] : 'Não Informado', // Exibe o objeto ou "Não Informado" se estiver vazio
    sortable: true, 
    width: '47%',
    cell: (row) => (
      <div dangerouslySetInnerHTML={{ __html: row.meta["objeto_"] || 'Não Informado' }} /> // Renderiza o HTML corretamente
    )
  },   
  { 
    name: 'Mais Detalhes', 
    selector: (row) => (
      <ButtonTable 
        path="/emendas-parlamentares"  // Caminho base para os detalhes
        id={row.slug}                // Usando o slug como identificador
        label="Ver Detalhes"          // Texto do botão
      />
    ),
    width: '10%',
    excludeFromExport: true
  }
  
];

const EmendasParlamentares = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `Emendas Parlamentares - ${config.geral.nomeOrgao}`
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getPublicacoesPorTipo('Emenda Parlamentar');
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Erro ao carregar Emendas Parlamentares:', error);
      setError('Erro ao carregar dados da API');
    } finally {
      setLoading(false);
    }
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
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        // Busca em vários campos incluindo os campos meta específicos de emendas parlamentares
        return (
          item.title?.rendered.toLowerCase().includes(searchLower) ||
          item.content?.rendered.toLowerCase().includes(searchLower) ||
          item.meta?.n_emenda?.toLowerCase().includes(searchLower) ||
          item.meta?.autor_da_emenda?.toLowerCase().includes(searchLower) ||
          item.meta?.valor_convenio?.toLowerCase().includes(searchLower) ||
          item.meta?.objeto_?.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredData(filtered);
  };

  return (
    <div className="container">
      <PageHeader
        title="Emendas Parlamentares"
        breadcrumb={[
          { label: 'Emendas Parlamentares' },
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
        <div>Erro ao carregar Emendas Parlamentares: {error}</div>
      ) : (
        <DataTableComponent
          title="Emendas Parlamentares"
          columns={columnsEmendasParlamentares}
          data={filteredData}
        />
      )}
    </div>
  );
};

export default EmendasParlamentares;
