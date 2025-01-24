import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDespesasFixadasById } from "../../../../services/receitasDespesas/DespesasFixadas";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const DespesasFixadasDetail = () => {
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
        const result = await getDespesasFixadasById(id);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `${result.elemento} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
  const pageTitle = data ? `Detalhes: ${data.elemento}` : 'Detalhes';


  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Despesas Fixadas', path: '/despesas-fixadas' },
          { label: data ? `${data.elemento}` : 'Detalhes' },
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
          <span><p>Unidade Gestora/Órgão:</p> {data.orgao}</span>
          <span><p>Exercício/Ano:</p> {data.ano}</span>
          <span><p>Dotação Inicial:</p> {data.valorOrcado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> 
          <span><p>Rubrica Despesa:</p> {data.elemento}</span>
          <span><p>Ação:</p> {data.codigoDaAcao}</span>
          <span><p>Programa:</p> {data.codigoDoPrograma}</span>
          <span><p>Função:</p> {data.codigoDaFuncao}</span>
          <span><p>Subfunção:</p> {data.codigoDaSubFuncao}</span>
          <div className="full-width">
            <span><p>Fonte:</p> {data.fonte}</span>
          </div>                   
        </div>
        
      </div> 
       

      )} 
    </div>
  );
};

export default DespesasFixadasDetail;