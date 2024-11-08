import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonTable from "../../../common/ButtonTable";

const columnsRelAnualGestao = [
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
      <ButtonTable 
        path="/relatorio-anual-de-gestao"  // Caminho base para os detalhes
        id={row.slug}                // Usando o slug como identificador
        label="Ver Detalhes"          // Texto do botão
      />
    ),
    width: '10%',
    excludeFromExport: true
  }
  
];

const RelAnualGestao = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Relatório Anual de Gestão ou Atividades - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        
        // Usando a função genérica para buscar publicações do tipo "Terceirizados"
        const data = await getPublicacoesPorTipo('Relatório Anual de Gestão');
        setData(data); // Armazena os dados filtrados

      } catch (error) {
        console.error('Erro ao carregar Relatório Anual de Gestão ou Atividades:', error);
        setError('Erro ao carregar dados da API');
      } finally {
        setLoading(false); // Garantir que o carregamento termine após sucesso ou erro
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="container">
    <PageHeader
        title="Relatório Anual de Gestão ou Atividades"
        breadcrumb={[
          { label: 'Relatório Anual de Gestão ou Atividades' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Relatório Anual de Gestão ou Atividades: {error}</div>
      ) : (
        <DataTableComponent
          title="Relatório Anual de Gestão ou Atividades"
          columns={columnsRelAnualGestao}
          data={data}
        />
      )}

   
    </div>
  );
};

export default RelAnualGestao;
