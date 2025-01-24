import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getDetalhesConsolidado,
  getLiquidacoesPaginadas,
  getOrdensPagamentoPaginadas
} from "../../../../services/receitasDespesas/InformacoesConsolidadas";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner';
import DataTable from '../../../common/DataTable';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";
import ButtonTable from "../../../common/ButtonTable";

const InformacoesConsolidadasDetail = () => {
  const { id } = useParams();
  const [detalhes, setDetalhes] = useState(null);
  const [liquidacoes, setLiquidacoes] = useState(null);
  const [ordensPagamento, setOrdensPagamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();
  const tableRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca detalhes do empenho
        const detalhesData = await getDetalhesConsolidado(id);
        setDetalhes(detalhesData);

        // Busca liquidações relacionadas
        const liquidacoesData = await getLiquidacoesPaginadas({ codigoDoEmpenho: id });
        setLiquidacoes(liquidacoesData);

        // Busca ordens de pagamento relacionadas
        const ordensData = await getOrdensPagamentoPaginadas({ codigoDoEmpenho: id });
        
        setOrdensPagamento(ordensData);

        if (detalhesData) {
          document.title = `Empenho Nº ${detalhesData.numeroDoEmpenhoFormatado} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const pageTitle = detalhes ? 
    `Detalhes: Informação Consolidada Nº ${detalhes.codigoDoEmpenho}` : 
    'Detalhes';

  const columnsLiquidacoes = [
    { 
      name: 'Número', 
      selector: row => row.numeroDaLiquidacao, 
      sortable: true, 
      width: '20%' 
    },
    { 
      name: 'Data', 
      selector: row => row.dataDaLiquidacao, 
      sortable: true, 
      width: '20%' 
    },
    { 
      name: 'Valor Liquidado', 
      selector: row => row.valorLiquidado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
      sortable: true, 
      width: '20%' 
    },
    { 
      name: 'Valor Anulado', 
      selector: row => row.valorLiquidadoAnulado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
      sortable: true, 
      width: '30%' 
    },
    
    {
      name: 'Ação',
      selector: row => row.codigoDaLiquidacao,
      cell: row => (
        <ButtonTable 
          path="/liquidacoes" 
          id={row.codigoDaLiquidacao} 
          label="Abrir"
        />
      ),
      width: '10%',
      excludeFromExport: true
    }
  ];

  const columnsOrdensPagamento = [
    { 
      name: 'Número', 
      selector: row => row.codigoDaOrdemDePagamento, 
      sortable: true, 
      width: '25%' 
    },
    { 
      name: 'Data', 
      selector: row => row.dataDaOrdemDePagamento, 
      sortable: true, 
      width: '25%' 
    },
    { 
      name: 'Valor Pago', 
      selector: row => row.valorPago?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
      sortable: true, 
      width: '25%' 
    },
    { 
      name: 'Valor do Estorno', 
      selector: row => row.valorDoEstorno?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
      sortable: true, 
      width: '25%' 
    },
    // {
    //   name: 'Ação',
    //   selector: row => row.codigo,
    //   cell: row => (
    //     <ButtonTable 
    //       path="/pagamentos" 
    //       id={row.codigo} 
    //       label="Abrir"
    //     />
    //   ),
    //   width: '10%',
    //   excludeFromExport: true
    // }
    
  ];

  return (
    <div className="container">
      <PageHeader
        title={pageTitle}
        breadcrumb={[
          { label: 'Informações Consolidadas', path: '/informacoes-consolidadas' },
          { label: detalhes ? `Informação Consolidada Nº ${detalhes.codigoDoEmpenho}` : 'Detalhes' },
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
            <span><p>Número do Empenho:</p> {detalhes.numeroDoEmpenhoFormatado}</span>
            <span><p>Órgão:</p> {detalhes.nomeDoOrgao}</span>
            <span><p>Ano:</p> {detalhes.anoDoEmpenho}</span>
            <span><p>Fornecedor:</p> {detalhes.fornecedor}</span>
            <span><p>Rubrica:</p> {detalhes.rubricaFormatada}</span>
            <span><p>Fonte:</p> {detalhes.fonteFormatada}</span>
            <span><p>Valor Empenhado:</p> {
              detalhes.valorEmpenhado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'
            }</span>
            <span><p>Valor Liquidado:</p> {
              detalhes.valorLiquidado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'
            }</span>
            <span><p>Valor Pago:</p> {
              detalhes.valorPago?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'
            }</span>
          </div>

          <div ref={tableRef}>
            {/* Tabela de Liquidações */}
            {liquidacoes?.registros?.length > 0 && (
              <>
                <h2 className="titulo-tabela">Liquidações</h2>
                <DataTable
                  columns={columnsLiquidacoes}
                  data={liquidacoes.registros}
                  pagination
                  paginationTotalRows={liquidacoes.total}
                  noHeader={true}
                  striped={true}
                  highlightOnHover={true}
                  responsive={true}
                />
              </>
            )}

            {/* Tabela de Ordens de Pagamento */}
            {ordensPagamento?.registros?.length > 0 && (
              <>
                <h2 className="titulo-tabela">Ordens de Pagamento</h2>
                <DataTable
                  columns={columnsOrdensPagamento}
                  data={ordensPagamento.registros}
                  pagination
                  paginationTotalRows={ordensPagamento.total}
                  noHeader={true}
                  striped={true}
                  highlightOnHover={true}
                  responsive={true}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InformacoesConsolidadasDetail;