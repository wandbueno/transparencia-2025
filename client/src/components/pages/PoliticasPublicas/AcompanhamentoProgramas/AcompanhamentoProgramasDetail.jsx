import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDetalhesProgramaPorParametros } from "../../../../services/PlanPolPublicas/AcompanhamentoProgramas";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const AcompanhamentoProgramasDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();
  const tableRef = useRef();
  const anoAtual = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const codigoDoPrograma = id;

        if (!codigoDoPrograma) {
          throw new Error('Código do programa está ausente.');
        }

        // Busca detalhes do programa
        const result = await getDetalhesProgramaPorParametros(codigoDoPrograma);
        setData(result);

        if (result) {
          document.title = `Programa ${result.codigoDoPrograma} - ${result.titulo} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const pageTitle = data ? `Detalhes: Programa ${data.codigoDoPrograma} - ${data.titulo}` : 'Detalhes';

  return (
    <div className="container">
      <PageHeader
        title={pageTitle}
        breadcrumb={[
          { label: 'Programas', path: '/programas' },
          { label: data ? `Programa ${data.codigoDoPrograma} - ${data.titulo}` : 'Detalhes' },
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
            <span><p>Código:</p> {data?.codigoDoPrograma || '-'}</span>
            <span><p>Ano:</p> {data?.ano || anoAtual}</span>
            <span><p>Título do Programa:</p> {data?.titulo || '-'}</span>            
            <span><p>Valor Previsto:</p> {
              data?.valorPrevisto?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'
            }</span>
            <span><p>Valor Executado:</p> {
              data?.valorExecutado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'
            }</span>
            <span><p>Público Alvo:</p> {data?.publicoAlvo || '-'}</span>
            
            <div className="full-width">
              <span><p>Objetivo:</p> {data?.objetivo || '-'}</span>
            </div>
          </div>
          <div className="tabela-detalhes" ref={tableRef}>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcompanhamentoProgramasDetail; 