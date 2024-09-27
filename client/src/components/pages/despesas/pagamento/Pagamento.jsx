import React, { useEffect, useState } from "react";
import { getPagamentos } from "../../../../services/receitasDespesas/pagamentos";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
// import './Empenho.css';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsPagamento = [
  { name: "Data", selector: (row) => row.dataPagamento, sortable: true, width: '9%' },
  { name: "Número", selector: (row) => row.numero, sortable: true, width: '8%' },
  {
    name: "Órgão",
    selector: (row) => row.nomeDoOrgao,
    sortable: true,
    width: '15%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.nomeDoOrgao}
      </div>
    )
  },
  {
    name: "Fornecedor",
    selector: (row) => row.nomeDoFornecedor,
    sortable: true,
    width: '17%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.nomeDoFornecedor}
      </div>
    )
  },
  // { name: "CPF/CNPJ", selector: (row) => row.cpfOuCnpjDoFornecedor, sortable: true, width: '10%' },
  // { name: "Empenho", selector: (row) => row.numeroDoEmpenho, sortable: true, width: '8%' },
  // { name: "Liquidação", selector: (row) => row.numeroDaLiquidacao, sortable: true, width: '8%' },
  { name: "Fase", selector: (row) => row.fase, sortable: true, width: '7%' },
  { name: "Valor Pago", selector: (row) => row.valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '11%' },
  { name: "Valor Anulação", selector: (row) => row.valorAnulacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '11%' },
  { name: "Valor Total", selector: (row) => row.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '11%' },
  {
    name: 'Detalhes',
    selector: row => row.codigo, 
    cell: row => {
      const id = row.codigo;
      return <ButtonTable path="/pagamentos" id={id} label="Ver Detalhes" />; // Usa o botão de detalhes
    },
    width: '11%', 
    excludeFromExport: true
  },
];


const Pagamento = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Pagamentos - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getPagamentos();
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
        title="Pagamentos"
        breadcrumb={[
          { label: 'Pagamentos' },
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
          title="Pagamentos"
          columns={columnsPagamento}
          data={data}
        />
      )}

   
    </div>
  );
};

export default Pagamento;
