import React, { useEffect, useState } from "react";
import { getOrdensCronologicasPagas } from "../../../../services/receitasDespesas/ordemCronologicaPagamentos"; 
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsOrdensCronologicas = [
  { name: "Órgão", selector: (row) => row.nomeDoOrgao, sortable: true, width: '20%' },
  { name: "Categoria", selector: (row) => row.descricaoDaCategoria, sortable: true, width: '15%' },
  { name: "Fornecedor", selector: (row) => row.nomeDoFornecedor, sortable: true, width: '25%' },

  { name: "Data da Exigibilidade", selector: (row) => row.dataDaExigibilidade, sortable: true, width: '15%' },

  { name: "Valor a Ser Pago", 
    selector: (row) => row.valorASerPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '15%' 
  },
  
  {
    name: 'Detalhes',
    selector: row => row.chave.liquidacao, 
    cell: row => {
      const { ano, mes, liquidacao } = row.chave;
      return <ButtonTable path={`/ordem-cronologica-pagamentos/${ano}/${mes}/${liquidacao}`} label="Ver Detalhes" />; // Usa o botão de detalhes
    },
    width: '10%', 
    excludeFromExport: true
  },
];

const OrdemCronologicaPagamentos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Atualiza o título da aba do navegador
    document.title = `Ordem Cronológica de Pagamentos - Portal Transparência - ${config.geral.nomeOrgao}`;

    const fetchData = async () => {
      try {
        const result = await getOrdensCronologicasPagas();
        setData(result.registros); 
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
        title="Ordem Cronológica de Pagamentos"
        breadcrumb={[
          { label: 'Ordem Cronológica de Pagamentos' },
        ]}
         infoTextHref="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/teste"
      />  
               
      <FilterSection  />     
             
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar ordens cronológicas de pagamento: {error}</div>
      ) : (
        <DataTableComponent
          title="Ordens Cronológicas de Pagamento"
          columns={columnsOrdensCronologicas}
          data={data}
        />
      )}
    </div>
  );
};

export default OrdemCronologicaPagamentos;