import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonLink from "../../../common/ButtonLink";

const columnsConcursosSeletivos = [
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
    width: '60%' 
  },
  { 
    name: "Situação", 
    selector: (row) => row.meta["situacao_pss"] || 'Sem título', 
    sortable: true, 
    width: '20%' 
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

const ConcursosSeletivos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Concursos e Processos Seletivos - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        
        // Usando a função genérica para buscar publicações do tipo "Terceirizados"
        const data = await getPublicacoesPorTipo('Processo Seletivo');
        setData(data); // Armazena os dados filtrados

      } catch (error) {
        console.error('Erro ao carregar Concursos e Processos Seletivos:', error);
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
        title="Concursos e Processos Seletivos"
        breadcrumb={[
          { label: 'Concursos e Processos Seletivos' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Concursos e Processos Seletivos: {error}</div>
      ) : (
        <DataTableComponent
          title="Concursos e Processos Seletivos"
          columns={columnsConcursosSeletivos}
          data={data}
        />
      )}

   
    </div>
  );
};

export default ConcursosSeletivos;
