import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonLink from "../../../common/ButtonLink";

const columnsJulgamentoContas = [
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
    width: '40%' 
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
    width: '20%' 
  },
  { 
    name: "Julgamento do Legislativo", 
    selector: (row) => {
      let linkJulgamento = row.meta["link-julgamento-legislativo"]; // Pega o link do campo meta
      
      return linkJulgamento 
        ? <a href={encodeURI(linkJulgamento)} target="_blank" rel="noopener noreferrer">Julgamento Realizado</a> // Renderiza o link se presente
        : 'Aguardando Análise'; // Mensagem caso o link esteja ausente
    },
    sortable: true, 
    width: '20%' 
  }, 
  { 
    name: 'Ação', 
    selector: (row) => (
      <ButtonLink link={row.meta["link-externo"]} label="Ver Detalhes" /> // Usa ButtonLink diretamente, sem verificação
    ),
    width: '10%',
    excludeFromExport: true
  }
  
];

const JulgamentoContas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Julgamento de Contas pelo Legislativo - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        
        // Usando a função genérica para buscar publicações do tipo "Terceirizados"
        const data = await getPublicacoesPorTipo('Julgamento de Contas');
        setData(data); // Armazena os dados filtrados

      } catch (error) {
        console.error('Erro ao carregar Julgamento de Contas pelo Legislativo:', error);
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
        title="Julgamento de Contas pelo Legislativo"
        breadcrumb={[
          { label: 'Julgamento de Contas pelo Legislativo' },
        ]}
      />      
      <FilterSection  />
      
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
          data={data}
        />
      )}

   
    </div>
  );
};

export default JulgamentoContas;
