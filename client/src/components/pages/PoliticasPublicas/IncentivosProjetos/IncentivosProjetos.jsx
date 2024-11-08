import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
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

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Relação de Incentivos a Projetos Culturais / Esportivos - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        
        // Usando a função genérica para buscar publicações do tipo "Terceirizados"
        const data = await getPublicacoesPorTipo('Incentivo à cultura');
        setData(data); // Armazena os dados filtrados

      } catch (error) {
        console.error('Erro ao carregar Relação de Incentivos a Projetos Culturais / Esportivos:', error);
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
        title="Relação de Incentivos a Projetos Culturais / Esportivos"
        breadcrumb={[
          { label: 'Relação de Incentivos a Projetos Culturais / Esportivos' },
        ]}
      />      
      <FilterSection  />
      
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
          data={data}
        />
      )}

   
    </div>
  );
};

export default IncentivosProjetos;
