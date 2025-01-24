import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDespesasSinteticaById } from "../../../../services/receitasDespesas/DespesasSintetica";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const DespesasSinteticaDetail = () => {
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
        const result = await getDespesasSinteticaById(id);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `${result.classificacaoOrcamentaria} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
  const pageTitle = data ? `Detalhes: ${data.classificacaoOrcamentaria}` : 'Detalhes';


  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Despesa Sintética', path: '/despesa-sintetica' },
          { label: data ? `${data.classificacaoOrcamentaria}` : 'Detalhes' },
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
          <span><p>Classificação Orçamentária:</p> {data.orgao}</span>
          <span><p>Mês/Ano:</p> {data.ano}</span>
          <span><p>Ação:</p> {data.elemento}</span>
          <span><p>Função:</p> {data.codigoDaAcao}</span>
          <span><p>Programa:</p> {data.codigoDoPrograma}</span>
          <span><p>Elemento:</p> {data.codigoDaFuncao}</span>
          <span><p>Valor Orçado:</p> {data.valorOrcado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> 
          <span><p>Empenhado(Mês):</p> {data.valorEmpenhado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> 
          <span><p>Anulado Acumulado:</p> {data.valorAnuladoAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> 
          <span><p>Empenhado Acumulado:</p> {data.valorEmpenhadoAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>                  
        </div>
        
      </div> 
       

      )} 
    </div>
  );
};

export default DespesasSinteticaDetail;