import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonLink from "../../../common/ButtonLink";

// Função utilitária para decodificar entidades HTML
function decodeHtmlEntities(text) {
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent;
}

const columnsParceirasAcordos = [
  { 
    name: "Publicação", 
    selector: (row) => row.date ? new Date(row.date).toLocaleDateString('pt-BR') : 'Não informado', // Formata a data para dd/mm/yyyy ou exibe 'Não informado'
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Tipo", 
    selector: (row) => row.meta["tipo-acordo"] || 'Não informado', // Verifica o campo "tipo-acordo" ou exibe 'Não informado' se estiver vazio
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Origem", 
    selector: (row) => row.meta["origem"] || 'Não informado', // Verifica o campo "tipo-acordo" ou exibe 'Não informado' se estiver vazio
    sortable: true, 
    width: '15%' 
  },

  { 
    name: "Destino", 
    selector: (row) => row.meta["destino"] || '', // Verifica o campo "tipo-acordo" ou exibe 'Não informado' se estiver vazio
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Vigência", 
    selector: (row) => row.meta["data-fim"] || '', // Verifica o campo "tipo-acordo" ou exibe 'Não informado' se estiver vazio
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
      <ButtonLink link={row.meta["link-externo"]} label="Ver Detalhes" /> // Usa ButtonLink diretamente, sem verificação
    ),
    width: '10%',
    excludeFromExport: true
  }
  
];

const ParceirasAcordos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Parceiras e Acordos Firmados - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        
        // Usando a função genérica para buscar publicações do tipo "Terceirizados"
        const data = await getPublicacoesPorTipo('Parceiras e Acordos');
        setData(data); // Armazena os dados filtrados

      } catch (error) {
        console.error('Erro ao carregar Parceiras e Acordos Firmados:', error);
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
        title="Parceiras e Acordos Firmados"
        breadcrumb={[
          { label: 'Parceiras e Acordos Firmados' },
        ]}
      />      
      <FilterSection  />
      
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
          data={data}
        />
      )}   
    </div>
  );
};

export default ParceirasAcordos;
