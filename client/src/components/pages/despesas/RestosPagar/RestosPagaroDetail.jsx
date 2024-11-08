import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getRestoPagarById } from "../../../../services/receitasDespesas/RestoPagar";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const RestosPagaroDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca detalhes da liquidação, incluindo anulações
        const result = await getRestoPagarById(id);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Restos a Pagar Nº ${result.codigo} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);  // Adiciona `id` como dependência do useEffect

  // Definindo o título dinamicamente com base nos dados
  const pageTitle = data ? `Detalhes: Restos a Pagar Nº ${data.codigo}` : 'Detalhes';

  // Definição das colunas para a tabela de Ordens de Pagamento
  const columnsOrdensDePagamento = [
    { name: 'Número', selector: row => row.numero, sortable: true, width: '30%' },
    { name: 'Data', selector: row => row.data, sortable: true, width: '30%' },
    { name: 'Valor', selector: row => row.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', sortable: true, width: '20%' },
    { name: 'Valor Anulado', selector: row => row.valorAnulado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', sortable: true, width: '20%' }
  ];

  // Definição das colunas para a tabela de Liquidações
  const columnsLiquidacoes = [
    { name: 'Número', selector: row => row.numero, sortable: true, width: '30%' },
    { name: 'Data', selector: row => row.data, sortable: true, width: '30%' },
    { name: 'Valor', selector: row => row.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', sortable: true, width: '20%' },
    { name: 'Valor Anulado', selector: row => row.valorAnulado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', sortable: true, width: '20%' }
  ];

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Restos a Pagar', path: '/liquidacoes' },
          { label: data ? `Restos a Pagar Nº ${data.codigo}` : 'Detalhes' },
        ]}
        showExportButton={true}  // Exibe o botão de exportação apenas aqui
        contentRef={contentRef}
        tableRef={tableRef}
        pageTitle={pageTitle}  
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar detalhes: {error}</div>
      ) : (
      <div className="detalhes-geral">  
        <div className="detalhes" ref={contentRef}>
          <span><p>Órgão:</p> {data.orgao}</span>
          <span><p>Ano:</p> {data.ano}</span>
          <span><p>Cpf/Cnpj:</p> {data.cpfCnpj}</span>
          <span><p>Fornecedor:</p> {data.fornecedor}</span>
          <span><p>Rubrica Despesa:</p> {data.rubricaDespesa}</span>
          <span><p>Fonte:</p> {data.fonte}</span>
          <span><p>Número Do Empenho:</p> {data.numeroDoEmpenho}</span> 
          <span><p>Valor Empenhado:</p> {data.valorEmpenhado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> 
          <span><p>Valor Liquidado:</p> {data.valorLiquidado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> 
          <span><p>Valor Pago:</p> {data.valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>           
        </div>

        <div ref={tableRef}>
        {/* Tabela de Ordens de Pagamento */}
        {data.ordensDePagamentos && data.ordensDePagamentos.total > 0 && (
            <>
              <h2 className="titulo-tabela">Ordens de Pagamento</h2>
              <DataTableDetail
                columns={columnsOrdensDePagamento}
                data={data.ordensDePagamentos.registros}
              />
            </>
          )}

          {/* Tabela de Liquidações */}
          {data.liquidacoes && data.liquidacoes.total > 0 && (
            <>
              <h2 className="titulo-tabela">Liquidações</h2>
              <DataTableDetail
                columns={columnsLiquidacoes}
                data={data.liquidacoes.registros}
              />
            </>
          )}

        </div>
        
      </div> 
       

      )} 
    </div>
  );
};

export default RestosPagaroDetail;