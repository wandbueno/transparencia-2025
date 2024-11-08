import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getLegislacaoId } from "../../../services/legislacaoPublicacoes/legislacao";
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/LoadingSpinner'
import '../PagesDetail.css';
import '../../../assets/global.css';
import { config } from "../../../assets/config";

const LegislacaoDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLegislacaoId(id);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `${result.tipoDoDocumento} Nº ${result.numeroDoDocumento} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
  const pageTitle = data ? `Detalhes: ${data.tipoDoDocumento} Nº ${data.numeroDoDocumento}` : 'Detalhes';

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Erro ao carregar detalhes: {error}</div>;
  if (!data) return <div>Nenhum dado encontrado.</div>;  // Adicione uma verificação para garantir que `data` exista

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Leis Municípais', path: '/leis' },
          { label: data ? `${data.tipoDoDocumento} Nº ${data.numeroDoDocumento}` : 'Detalhes' },
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
          <span><p>Tipo do Documento:</p> {data.tipoDoDocumento}</span>
          <span><p>Número do Documento:</p> {data.numeroDoDocumento}</span>
          <span><p>Ano:</p> {data.ano}</span>
          <span><p>Situação:</p> {data.situacao}</span>
          
          <span><p>Data da Publicação:</p> {data.dataDaPublicacao}</span>
          <span><p>Nome do Documento:</p> {data.nomeDoDocumento}</span>
                  
          <div className="full-width">
            <span><p>Descrição:</p> {data.descricao}</span>
          </div>         
        </div>

        
      </div> 
       

      )} 
    </div>
  );
};

export default LegislacaoDetail;