import React, { useEffect, useState } from "react";
import { getLiquidacoes } from "../../../../services/receitasDespesas/liquidacoes";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsLiquidacao = [
  { name: "Data", selector: (row) => row.data, sortable: true, width: '10%' },
  { name: "Número", selector: (row) => row.numeroDoTcm, sortable: true, width: '12%' },
  { name: "Fornecedor", selector: (row) => row.nomeDoFornecedor, sortable: true, width: '28%' },
  { name: "CPF/CNPJ", selector: (row) => row.cpfOuCnpjDoFornecedor, sortable: true, width: '15%' },
  { name: "Valor da Liquidação", 
    selector: (row) => row.valorDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '15%' 
  },
  { name: "Fase", selector: (row) => row.faseDaLiquidacao, sortable: true, width: '10%' },
  {
    name: 'Detalhes',
    selector: row => row.codigoDaLiquidacao, 
    cell: row => {
      const id = row.codigoDaLiquidacao;
      return <ButtonTable path="/liquidacoes" id={id} label="Ver Detalhes" />; // Usa o botão de detalhes
    },
    width: '10%', 
    excludeFromExport: true
  },
];


const Liquidacao = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Liquidacao - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getLiquidacoes();
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
        title="Liquidacao"
        breadcrumb={[
          { label: 'Liquidacao' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Despesas: {error}</div>
      ) : (
        <DataTableComponent
          title="Liquidacao"
          columns={columnsLiquidacao}
          data={data}
        />
      )}

   
    </div>
  );
};

export default Liquidacao;
