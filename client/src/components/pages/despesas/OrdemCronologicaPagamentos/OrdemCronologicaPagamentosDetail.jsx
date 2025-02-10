import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getOrdemCronologicaById } from "../../../../services/receitasDespesas/ordemCronologicaPagamentos";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const OrdemCronologicaPagamentosDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ano = searchParams.get("ano");
  const mes = searchParams.get("mes");
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id || !ano || !mes) {
          throw new Error('Parâmetros obrigatórios ausentes');
        }

        const result = await getOrdemCronologicaById(id, ano, mes);
        setData(result);
        
        if (result) {
          document.title = `Liquidação Nº ${result.liquidacao} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, ano, mes]);

  // Definindo o título dinamicamente com base nos dados
  const pageTitle = data ? `Detalhes: Liquidação Nº ${data.liquidacao}` : 'Detalhes';

 return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Ordem Cronológica de Pagamentos', path: '/ordem-cronologica-de-pagamentos' },
          { label: data ? `Liquidação Nº ${data.liquidacao}` : 'Detalhes' },
        ]}
        showExportButton={true}
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
            <span><p>Órgão:</p> {data.nomeDoOrgao}</span>
            <span><p>Categoria:</p> {data.descricaoDaCategoria}</span>
            <span><p>Fornecedor:</p> {data.nomeDoFornecedor}</span>            
            <span><p>CPF/CNPJ:</p> {data.cpfCnpjDoFornecedor}</span>
            <span><p>Processo:</p> {data.processo}</span>
            
            <span><p>Nota Fiscal:</p> {data.notaFiscal}</span>
            
            <span><p>Número do Empenho:</p> {data.empenho}</span>
            <span><p>Data do Empenho:</p> {data.dataDoEmpenho}</span>
            <span><p>Fonte de Recurso:</p> {data.fonteDeRecurso}</span>
            <span><p>Número da Liquidação:</p> {data.liquidacao}</span>
            
            <span><p>Data da Liquidação:</p> {data.dataDaLiquidacao}</span>
            <span><p>Data da Exigibilidade:</p> {data.dataDaExigibilidade}</span>
            <span><p>Valor a Ser Pago:</p> {data.valorASerPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span><p>Valor Pago:</p> {data.valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            
            <span><p>Ano de Referência:</p> {data.anoDeReferencia}</span>
            <span><p>Mês de Referência:</p> {data.mesDeReferencia}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdemCronologicaPagamentosDetail;