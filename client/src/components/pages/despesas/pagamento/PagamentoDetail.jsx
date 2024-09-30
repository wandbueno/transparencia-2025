import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getPagamentosId } from "../../../../services/receitasDespesas/pagamentos";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";
import ExportDetailToPDF from "../../../common/ExportDetailToPDF";

const PagamentoDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPagamentosId(id);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Pagamento Nº ${result.numero} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);  // Adiciona `id` como dependência do useEffect

  // Definição das colunas para o DataTable dos Estornos
  const columnsEstornos = [
    { name: 'Data', selector: row => row.dataDoEstorno, sortable: true, width: '30%' },
    { name: 'Valor', selector: row => row.valorDoEstorno.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '30%' },
    { name: 'Motivo', selector: row => row.motivoDoEstorno, sortable: true, width: '40%' },

  ];

  return (
    <div className="container">
      <PageHeader
        title={data ? `DETALHES: Pagamento Nº ${data.numero}` : 'Detalhes'}
        breadcrumb={[
          { label: 'Pagamentos', path: '/pagamentos' },
          { label: data ? `Pagamento Nº ${data.numero}` : 'Detalhes' },
        ]}
      />

      {/* Botão para exportar os detalhes para PDF */}
      <ExportDetailToPDF contentRef={contentRef} tableRef={tableRef} pageTitle={`Pagamento Nº ${data?.numero}`} />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar detalhes: {error}</div>
      ) : (
      <div className="detalhes-geral">  
        <div className="detalhes" ref={contentRef}>
          <span><p>Data:</p> {data.dataPagamento}</span>
          <span><p>Número:</p> {data.numero}</span>
          <span><p>Órgão:</p> {data.nomeDoOrgao}</span>
          <span><p>Fornecedor:</p> {data.nomeDoFornecedor}</span>
          
          <span><p>CPF/CNPJ:</p> {data.cpfOuCnpjDoFornecedor}</span>
          <span><p>Empenho:</p> {data.numeroDoEmpenho}</span>
          <span><p>Liquidação:</p> {data.numeroDaLiquidacao}</span>
          <span><p>Fase:</p> {data.fase}</span> 
          
          <span><p>Número Documento:</p> {data.numeroDoDocumento}</span>
          <span><p>Banco/Agência/Conta:</p> {data.bancoAgenciaConta}</span>
          <span><p>Valor Pago:</p> {data.valorPago !== undefined ? data.valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor Anulação:</p> {data.valorAnulacao !== undefined ? data.valorAnulacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor Total:</p> {data.valorTotal !== undefined ? data.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
        
          <div className="full-width">
            <span><p>Histórico:</p> {data.historico}</span>
          </div>         
        </div>

        <div ref={tableRef}>
          {/* Tabela de Estornos */}
          <div className="tabela-detalhes">
            {data.estornos.total > 0 && (
              <>
                <h2 className="titulo-tabela">Ordem Pagamento Anulação</h2>
                <DataTableDetail
                  columns={columnsEstornos}
                  data={data.estornos.registros}
                />
              </>
            )}
          </div>
        </div>
        
      </div> 
       

      )} 
    </div>
  );
};

export default PagamentoDetail;