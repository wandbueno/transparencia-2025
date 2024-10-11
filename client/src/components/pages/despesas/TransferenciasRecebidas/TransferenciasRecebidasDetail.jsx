import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getTransferenciasRecebidasId } from "../../../../services/receitasDespesas/TransferenciasRecebidas";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const TransferenciasRecebidasDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTransferenciasRecebidasId(id);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `${result.receita} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
  const pageTitle = data ? `Detalhes: ${data.receita} - ${data?.chave.codigoDaReceita}` : 'Detalhes';

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Transferências Voluntárias Recebidas', path: '/transferencias-voluntarias-recebidas' },
          { label: data ? `${data.receita} ${data?.chave.codigoDaReceita}` : 'Detalhes' },
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
          <span><p>Receita:</p> {data.receita}</span>
          <span><p>Natureza da Receita:</p> {data.naturezaDaReceita}</span>
          <span><p>Origem do Recurso:</p> {data.origemDoRecurso}</span>
          <span><p>Fonte da Receita:</p> {data.fonteDaReceita}</span>
          <span><p>Valor Recebido:</p> {data.valorRecebido !== undefined ? data.valorRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Data do Repasse:</p> {data.dataDoRepasse}</span>        
            
          <div className="full-width">
            <span><p>Objeto:</p> {data.objeto}</span>
          </div>          
        </div>      
        
      </div>        

      )} 
    </div>
  );
};

export default TransferenciasRecebidasDetail;