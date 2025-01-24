import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getDetalhesProjetoPorParametros, getMetasPaginadas } from "../../../../services/PlanPolPublicas/AcompanhamentoProjetos";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner';
import DataTable from '../../../common/DataTable';
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const AcompanhamentoProjetosDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [metas, setMetas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ano = searchParams.get('ano');
        const mes = searchParams.get('mes');
        const acaoCodigo = id;

        if (!ano || !mes || !acaoCodigo) {
          throw new Error('Parâmetros de ano, mês ou código da ação estão ausentes.');
        }

        // Busca detalhes do projeto
        const result = await getDetalhesProjetoPorParametros(acaoCodigo, ano, mes);
        setData(result);

        // Busca as metas do projeto
        const metasResult = await getMetasPaginadas({
          acaoCodigo,
          ano,
          mes,
          pagina: 1,
          tamanhoDaPagina: 2500
        });
        
        if (metasResult && metasResult.registros) {
          setMetas(metasResult);
        }

        if (result) {
          document.title = `Projeto ${result.codigoDaAcao} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, searchParams]);

  const pageTitle = data ? `Detalhes: Projeto ${data.codigoDaAcao}` : 'Detalhes';

  const columnsMetasDetalhe = [
    { 
      name: 'Código Item PPA', 
      selector: row => row?.codigoDoItemPpa || '-', 
      sortable: true, 
      width: '10%' 
    },
    { 
      name: 'Meta Fiscal Ano 1', 
      selector: row => row?.metaFiscalAno1 ? `${row.metaFiscalAno1}%` : '-', 
      sortable: true, 
      width: '11%' 
    },
    { 
      name: 'Meta Fiscal Ano 2', 
      selector: row => row?.metaFiscalAno2 ? `${row.metaFiscalAno2}%` : '-', 
      sortable: true, 
      width: '11%' 
    },
    { 
      name: 'Meta Fiscal Ano 3', 
      selector: row => row?.metaFiscalAno3 ? `${row.metaFiscalAno3}%` : '-', 
      sortable: true, 
      width: '11%' 
    },
    { 
      name: 'Meta Fiscal Ano 4', 
      selector: row => row?.metaFiscalAno4 ? `${row.metaFiscalAno4}%` : '-', 
      sortable: true, 
      width: '11%' 
    },
    { 
      name: 'Meta Financeira Ano 1', 
      selector: row => row?.metaFinanceiraAno1 ? 
        row.metaFinanceiraAno1.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 
        'R$ 0,00', 
      sortable: true, 
      width: '11.5%' 
    },
    { 
      name: 'Meta Financeira Ano 2', 
      selector: row => row?.metaFinanceiraAno2 ? 
        row.metaFinanceiraAno2.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 
        'R$ 0,00', 
      sortable: true, 
      width: '11.5%' 
    },
    { 
      name: 'Meta Financeira Ano 3', 
      selector: row => row?.metaFinanceiraAno3 ? 
        row.metaFinanceiraAno3.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 
        'R$ 0,00', 
      sortable: true, 
      width: '11.5%' 
    },
    { 
      name: 'Meta Financeira Ano 4', 
      selector: row => row?.metaFinanceiraAno4 ? 
        row.metaFinanceiraAno4.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 
        'R$ 0,00', 
      sortable: true, 
      width: '11.5%' 
    }
  ];

  return (
    <div className="container">
      <PageHeader
        title={pageTitle}
        breadcrumb={[
          { label: 'Projetos', path: '/acoes-e-projetos' },
          { label: data ? `Projeto ${data.codigoDaAcao}` : 'Detalhes' },
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
            <span><p>Código da Ação:</p> {data?.codigoDaAcao || '-'}</span>
            <span><p>Mês/Ano:</p> {data?.mesAno || '-'}</span>
            <span><p>Título da Ação:</p> {data?.tituloDaAcao || '-'}</span>
            <span><p>Valor Previsto:</p> {
              data?.valorPrevisto?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'
            }</span>
            <span><p>Valor Executado:</p> {
              data?.valorExecutado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'
            }</span>
          </div>

          <div className="tabela-detalhes" ref={tableRef}>
            {/* Primeira tabela - Metas do detalhe do projeto */}
            {data?.metas?.registros?.length > 0 && (
              <>
                <h2 className="titulo-tabela">Detalhamento</h2>
                <DataTableDetail
                  columns={columnsMetasDetalhe}
                  data={data.metas.registros}
                />
              </>
            )}

            {/* Segunda tabela - Todas as metas */}
            {/* {metas && metas.total > 0 && (
              <>
                <h2 className="titulo-tabela">Todas as Metas do Projeto</h2>
                <DataTable
                  columns={columnsMetasDetalhe}
                  data={metas.registros}
                  noHeader={true}
                  striped={true}
                  highlightOnHover={true}
                  responsive={true}
                />
              </>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AcompanhamentoProjetosDetail;