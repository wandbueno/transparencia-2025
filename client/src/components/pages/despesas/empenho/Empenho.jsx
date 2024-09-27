import React, { useEffect, useState } from "react";
import { getDespesas } from "../../../../services/receitasDespesas/despesas";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import './Empenho.css';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columns = [
  { name: "Número", selector: (row) => row.codigo, sortable: true, width: '9%' },
  { name: "Data", selector: (row) => row.data, sortable: true, width: '11%' },
  { name: "Fornecedor", selector: (row) => row.nomeDoFornecedor, sortable: true, width: '25%' },
  { name: "Valor Empenho", selector: (row) => row.valorDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
  { name: "Valor Liquidação", selector: (row) => row.valorDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
  { name: "Valor Pagamento", selector: (row) => row.valorDoPagamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
  {
    name: 'Detalhes',
    selector: row => row.codigo, 
    cell: row => {
      const id = row.codigo;
      return <ButtonTable path="/despesas-empenho" id={id} label="Ver Detalhes" />; // Usa o botão de detalhes
    },
    width: '11%', 
    excludeFromExport: true
  },
];


const Empenho = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Despesa/ Empenho - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getDespesas();
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
        title="Despesa/ Empenho"
        breadcrumb={[
          { label: 'Despesa/ Empenho' },
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
          title="Despesas"
          columns={columns}
          data={data}
        />
      )}

   
    </div>
  );
};

export default Empenho;
