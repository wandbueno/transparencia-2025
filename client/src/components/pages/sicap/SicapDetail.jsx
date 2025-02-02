import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getProcedimentoById } from "../../../services/sicap/procedimentos";
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/LoadingSpinner';
import DataTableDetail from '../../common/DataTableDetail';
import { config } from "../../../assets/config";
import './SicapDetail.css';

const SicapDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProcedimentoById(id);
        setData(result);
        
        if (result) {
          document.title = `Procedimento ${result.id} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const pageTitle = data ? `Detalhes do Procedimento ${data.id}` : 'Detalhes do Procedimento';

  // Função para gerar URL do proxy
  const getProxyUrl = (token) => {
    const baseUrl = import.meta.env.VITE_SICAP_API_URL || 'http://localhost:2025'
    return `${baseUrl}/api/files/file/${id}/${token}`
  }

  // Atualização das colunas dos anexos para usar o proxy
  const columnsAnexos = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '10%' },
    { name: 'Fase', selector: row => row.fase, sortable: true, width: '15%' },
    { name: 'Tipo', selector: row => row.tipo, sortable: true, width: '35%' },
    { name: 'Data Anexo', selector: row => row.dataAnexo, sortable: true, width: '10%' },
    { 
      name: 'Arquivo', 
      selector: row => row.arquivo.nome,
      cell: row => {
        // Extrai o token do URL original
        const token = row.arquivo.url.split('t=')[1]?.split('&')[0]
        if (!token) return 'Link indisponível'
        
        // Gera URL do proxy
        const proxyUrl = getProxyUrl(token)
        
        return (
          <a 
            href={proxyUrl} 
            className="btn-download"
            download // Força download
          >
            <i className="fas fa-download"></i>
            {row.arquivo.nome}
          </a>
        )
      },
      width: '30%'
    }
  ];

  // Definição das colunas para a tabela de situações
  const columnsSituacoes = [
    { name: 'Situação', selector: row => row.situacao, sortable: true, width: '15%' },
    { name: 'Justificativa', selector: row => row.justificativa, sortable: true, width: '30%' },
    { name: 'Data', selector: row => row.data, sortable: true, width: '10%' },
    { name: 'Nº e-Contas', selector: row => row.numeroEContas, sortable: true, width: '15%' },
    { name: 'Adicionado Por', selector: row => row.adicionadoPor, sortable: true, width: '20%' },
    { name: 'Ativo', selector: row => row.ativo, sortable: true, width: '10%' }
  ];

  // Definição das colunas para a tabela de habilitados
  const columnsHabilitados = [
    { name: 'Resultado', selector: row => row.resultado, sortable: true, width: '15%' },
    { name: 'Licitante', selector: row => row.licitante, sortable: true, width: '45%' },
    { name: 'Adicionado Por', selector: row => row.adicionadoPor, sortable: true, width: '30%' },
    { name: 'Ativo', selector: row => row.ativo, sortable: true, width: '10%' }
  ];

  return (
    <div className="container">
      <PageHeader
        title={pageTitle}
        breadcrumb={[
          { label: 'SICAP Procedimentos', path: '/sicap' },
          { label: data ? `Procedimento ${data.id}` : 'Detalhes' }
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
            <span><p>Unidade Gestora:</p> {data.dadosPrimeiraFase.unidadeGestora}</span>
            <span><p>CNPJ:</p> {data.dadosPrimeiraFase.cnpj}</span>
            <span><p>Número SICAP:</p> {data.dadosPrimeiraFase.numeroSicap}</span>
            <span><p>Processo:</p> {data.dadosPrimeiraFase.processo}</span>
            <span><p>Tipo/Modalidade:</p> {data.dadosPrimeiraFase.tipoModalidade}</span>
            <span><p>Valor Estimado:</p> {data.dadosPrimeiraFase.valorEstimado}</span>
            
            {data.dadosPrimeiraFase.tipoModalidade === 'Licitação' && (
              <>
                <span><p>Tipo:</p> {data.dadosPrimeiraFase.tipo}</span>
                <span><p>Regime:</p> {data.dadosPrimeiraFase.regime}</span>
                <span><p>Data das Propostas:</p> {data.dadosPrimeiraFase.dataPropostas}</span>
                <span><p>Data de Julgamento:</p> {data.dadosPrimeiraFase.dataJulgamento}</span>
                <span><p>Data de Cadastro:</p> {data.dadosPrimeiraFase.dataCadastro}</span>
                <span><p>Data Base Orçamentos:</p> {data.dadosPrimeiraFase.dataBaseOrcamentos}</span>
                <span><p>Data da Publicação:</p> {data.dadosPrimeiraFase.dataPublicacao}</span>
              </>
            )}

            {(data.dadosPrimeiraFase.tipoModalidade === 'Dispensa' || 
              data.dadosPrimeiraFase.tipoModalidade === 'Inexigibilidade') && (
              <>
                <span><p>Item ou Lote:</p> {data.dadosPrimeiraFase.itemOuLote}</span>
                <span><p>Data de Cadastro:</p> {data.dadosPrimeiraFase.dataCadastro}</span>
                <span><p>Data Base Orçamento:</p> {data.dadosPrimeiraFase.dataBaseOrcamento}</span>
                <span><p>Data Primeira Publicação:</p> {data.dadosPrimeiraFase.dataPrimeiraPublicacao}</span>
                <div className="full-width">
                  <span><p>Justificativa:</p> {data.dadosPrimeiraFase.justificativa}</span>
                  <span><p>Legislação:</p> {data.dadosPrimeiraFase.legislacao}</span>
                </div>
              </>
            )}
            
            <div className="full-width">
              <span><p>Objeto:</p> {data.dadosPrimeiraFase.objeto}</span>
            </div>
          </div>

          <div ref={tableRef}>
            {data.dadosSegundaFase?.situacoes?.length > 0 && (
              <>
                <h3 className="titulo-tabela">Situação</h3>
                <DataTableDetail
                  columns={columnsSituacoes}
                  data={data.dadosSegundaFase.situacoes}
                />
              </>
            )}

            {data.dadosSegundaFase?.habilitados?.length > 0 && (
              <>
                <h3 className="titulo-tabela">Habilitados</h3>
                <DataTableDetail
                  columns={columnsHabilitados}
                  data={data.dadosSegundaFase.habilitados}
                />
              </>
            )}

            {data.anexos?.length > 0 && (
              <>
                <h3 className="titulo-tabela">Anexos</h3>
                <DataTableDetail
                  columns={columnsAnexos}
                  data={data.anexos}
                />
              </>
            )}

            {data.contratos?.length > 0 && (
              <div className="contratos-section">
                <h3 className="titulo-tabela">Contratos</h3>
                {data.contratos.map((contrato, index) => (
                  <div key={index} className="contrato-card">
                    <h4>Contrato {contrato.numero}</h4>
                    <div className="contrato-details">
                      <span><p>Contratado:</p> {contrato.contratado}</span>
                      <span><p>Procedimento:</p> {contrato.procedimento}</span>
                      <span><p>Valor:</p> {contrato.valorContrato}</span>
                      <span><p>Data Assinatura:</p> {contrato.dataAssinatura}</span>
                      <span><p>Data Vigência:</p> {contrato.dataVigencia}</span>
                      <span><p>Forma de Pagamento:</p> {contrato.formaPagamento}</span>
                      <span><p>Unidade Org:</p> {contrato.unidadeOrg}</span>
                      <span><p>Número Contrato Execução:</p> {contrato.numeroContratoExecucao}</span>
                      <span><p>Contrato Principal:</p> {contrato.contratoPrincipal}</span>
                      <span><p>Adicionado Por:</p> {contrato.adicionadoPor}</span>
                      <span><p>Ativo:</p> {contrato.ativo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SicapDetail;