import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonTable from "../../../common/ButtonTable";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Prestação de Contas e Parecer Prévio do TCE - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        
        // Usando a função genérica para buscar publicações do tipo "Terceirizados"
        const data = await getPublicacoesPorTipo('Prestação de Contas');
        setData(data); // Armazena os dados filtrados

      } catch (error) {
        console.error('Erro ao carregar Prestação de Contas e Parecer Prévio do TCE:', error);
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
        title="Prestação de Contas e Parecer Prévio do TCE"
        breadcrumb={[
          { label: 'Prestação de Contas e Parecer Prévio do TCE' },
        ]}
      />      
      <FilterSection  />
      
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
          data={data}
        />
      )}

   
    </div>
  );
};

export default PrestacaoContas;
