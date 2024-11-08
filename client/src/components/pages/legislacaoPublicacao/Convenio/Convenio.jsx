import React, { useEffect, useState } from "react";
import { getPublicacoesPorTipo } from "../../../../services/publicacoesWP/publicacao";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';
import ButtonTable from "../../../common/ButtonTable";

const columnsConvenio = [
  { 
    name: "Número", 
    selector: (row) => row.meta["n_convenio"] || 'R$ 0,00', // Pega o número do convênio
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Nome do Órgão", 
    selector: (row) => row.meta["nome_orgao"] || 'Não Informado', // Pega o nome do órgão responsável
    sortable: true, 
    width: '20%' 
  },
  { 
    name: "Situação", 
    selector: (row) => row.meta["situacao_"] || '', // Pega a situação
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Valor", 
    selector: (row) => {
      const valor = row.meta["valor_convenio_403"];
      
      // Verifica se o valor existe, remove pontos e vírgula e formata corretamente
      return valor 
        ? `R$ ${valor}` // Apenas insere "R$" antes do valor, que já está formatado corretamente
        : 'Não Informado'; // Se o campo estiver vazio, exibe "Não Informado"
    },
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Objeto", 
    selector: (row) => row.meta["objeto_"] ? row.meta["objeto_"] : 'Não Informado', // Exibe o objeto ou "Não Informado" se estiver vazio
    sortable: true, 
    width: '35%',
    cell: (row) => (
      <div dangerouslySetInnerHTML={{ __html: row.meta["objeto_"] || 'Não Informado' }} /> // Renderiza o HTML corretamente
    )
  },   
  { 
    name: 'Mais Detalhes', 
    selector: (row) => (
      <ButtonTable 
        path="/convenio-pre-convenio-celebrados"  // Caminho base para os detalhes
        id={row.slug}                // Usando o slug como identificador
        label="Ver Detalhes"          // Texto do botão
      />
    ),
    width: '10%',
    excludeFromExport: true
  }
  
];

const Convenio = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Convênio/Pré-Convênio Celebrados - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        
        // Usando a função genérica para buscar publicações do tipo "Terceirizados"
        const data = await getPublicacoesPorTipo('Convênio');
        setData(data); // Armazena os dados filtrados

      } catch (error) {
        console.error('Erro ao carregar Convênio/Pré-Convênio Celebrados:', error);
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
        title="Convênio/Pré-Convênio Celebrados"
        breadcrumb={[
          { label: 'Convênio/Pré-Convênio Celebrados' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Convênio/Pré-Convênio Celebrados: {error}</div>
      ) : (
        <DataTableComponent
          title="Convênio/Pré-Convênio Celebrados"
          columns={columnsConvenio}
          data={data}
        />
      )}

   
    </div>
  );
};

export default Convenio;
