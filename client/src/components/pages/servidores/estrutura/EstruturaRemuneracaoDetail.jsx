import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getEstruturaRemuneracaoId } from "../../../../services/orgãosServidores/estruturaRemuneracao";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const EstruturaRemuneracaoDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente

  // Capturar ano e mes da URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ano = searchParams.get("ano");
  const mes = searchParams.get("mes");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getEstruturaRemuneracaoId(id, ano, mes);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Diaria ${result.cargo} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, ano, mes]);  // Adiciona `id` como dependência do useEffect

  // Definindo o título dinamicamente com base nos dados
  const pageTitle = data ? `Estrutura de Remuneração - ${data.cargo}` : 'Detalhes';

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Estrutura de Remuneração', path: '/estrutura-de-remuneracao' },
          { label: data ? `Estrutura de Remuneração - ${data.cargo}` : 'Detalhes' },
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
          <span><p>Mês/Ano:</p> {data.chave.mes}/{data.chave.ano}</span>
          <span><p>Cargo:</p> {data.cargo}</span>
          <span><p>Nível:</p> {data.nivel}</span>
          <span><p>CBO:</p> {data.cbo}</span>
          <span><p>Código:</p> {data.codigo}</span>
          <span><p>Lei:</p> {data.lei}</span>
          <span><p>Data da Lei:</p> {data.dataDaLei}</span>
          <span><p>Qtd. Total Vagas:</p> {data.vagas}</span>
          <span><p>Vagas Providas:</p> {data.vagasProvidas}</span>
          <span><p>Vagas Não Providas:</p> {data.vagasNaoProvidas}</span>          
          <span><p>Salário:</p> {data.salario !== undefined ? data.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>   
        </div> 
      </div>       

      )} 
    </div>
  );
};

export default EstruturaRemuneracaoDetail;