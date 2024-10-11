import React, { useEffect, useState } from "react";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import ButtonTable from "../../common/ButtonTable";
import { config } from "../../../assets/config";
import { getObrasParalisadas } from "../../../services/PlanPolPublicas/acompanhamentoObras";
import './Obras.css';
import '../../../assets/global.css';


// Definição das colunas para a tabela de obras
const columnsObrasParalisadas = [
  {
    name: "Ordem de serviço",
    selector: (row) => {
      const ordemServico = row.meta["ordem-de-servico"];
      if (ordemServico) {
        const date = new Date(ordemServico); // Converte a string em um objeto de data
        if (!isNaN(date)) {
          // Se a data for válida, formata no padrão dd/mm/yyyy
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é zero-indexado
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
      }
      return 'Aguardando'; // Retorna 'Aguardando' se não houver data válida
    },
    sortable: true,
    width: '12%',
  },
  { 
    name: "Descrição", 
    selector: (row) => row.meta["descricao"] || 'Não informado', 
    sortable: true, 
    width: '20%', 
    cell: (row) => (
      <div className="break-word"> {/* Aplica o estilo de quebra de linha */}
        {row.meta["descricao"] || 'Não informado'}
      </div>
    ),
  },
  { 
    name: "Motivo da Paralisação", 
    selector: (row) => row.meta["motivo-da-paralisacao"] || 'Não informado', 
    sortable: true, 
    width: '20%' 
  },
  { 
    name: "Valor da Obra", 
    selector: (row) => row.meta["valor-obra"] || 'R$ 0,00', 
    sortable: true, 
    width: '12%' 
  }, 
  { 
    name: "Percentual (%)", 
    selector: (row) => row.meta.percentual || '0,00%', 
    sortable: true, 
    width: '11%' 
  },
  { 
    name: "Previsão Retorno", 
    selector: (row) => row.meta["previsao-de-retorno"] || 'Não há', 
    sortable: true, 
    width: '15%' 
  },
  {
    name: 'Detalhes',
    selector: (row) => row.meta["mais-informacoes"],
    cell: row => {
      const link = row.meta["mais-informacoes"]; // Pega o link do campo "mais-informacoes"
      return (
        <a 
          href={link || '#'} // Se o link existir, usa-o; senão, previne ação
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Ver Detalhes
        </a>
      );
    },
    width: '10%',
    excludeFromExport: true
},

];


const ObrasParalisadas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Atualiza o título da aba do navegador
    document.title = `Relação de Obras paralisadas - Portal Transparência - ${config.geral.nomeOrgao}`;

    const fetchData = async () => {
      try {
        const result = await getObrasParalisadas(); // Chamada para o serviço de obras
        setData(result); // Define os dados da API
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
    <PageHeader
        title="Relação de Obras paralisadas"
        breadcrumb={[
          { label: 'Relação de Obras paralisadas' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Despesas Extra Orçamentária: {error}</div>
      ) : (
        <DataTableComponent
          title="Relação de Obras paralisadas"
          columns={columnsObrasParalisadas}
          data={data}
          responsive={true} // Garante que a tabela seja responsiva
          noWrap={false} // Permite que o texto seja quebrado em múltiplas linhas
        />
      )}

   
    </div>
  );
};

export default ObrasParalisadas;
