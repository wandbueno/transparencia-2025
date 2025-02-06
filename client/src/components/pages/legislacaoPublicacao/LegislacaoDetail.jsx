import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getLegislacaoId } from "../../../services/legislacaoPublicacoes/legislacao";
import { getDocumentos, visualizarDocumento } from '../../../services/documentos/documentos';
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/LoadingSpinner'
import DataTableDetail from '../../common/DataTableDetail';
import ButtonDownloadAnexos from '../../common/ButtonDownloadAnexos/ButtonDownloadAnexos';
import '../PagesDetail.css';
import '../../../assets/global.css';
import { config } from "../../../assets/config";

const LegislacaoDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  
  const tableRef = useRef(); 
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLegislacaoId(id);  
        setData(result);
        
        // Busca os documentos usando o codigoDoDocumento
        try {
          const docsResponse = await getDocumentos('DOCUMENTO_PORTAL_DA_TRANSPARENCIA', result.codigoDoDocumento);
          setDocumentos(docsResponse.registros);
        } catch (docError) {
          console.error('Erro ao buscar documentos:', docError);
        }
        
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
  }, [id]);

  // Definindo o título dinamicamente com base nos dados
  const pageTitle = data ? `Detalhes: ${data.tipoDoDocumento} Nº ${data.numeroDoDocumento}` : 'Detalhes';

  // Função para visualizar documento
  const handleVisualizarDocumento = async (codigo, extensao) => {
    try {
      await visualizarDocumento(codigo, extensao, 'DOCUMENTO_PORTAL_DA_TRANSPARENCIA')
    } catch (error) {
      console.error('Erro ao visualizar documento:', error)
    }
  }

  // Definição das colunas para o DataTable dos Documentos
  const columnsDocumentos = [
    { name: 'Nome', selector: row => row.nome, sortable: true, width: '35%' },
    { name: 'Descrição', selector: row => row.descricao, sortable: true, width: '35%' },
    { name: 'Extensão', selector: row => row.extensao, sortable: true, width: '15%' },
    { 
      name: 'Ação',
      selector: row => row.codigo,
      cell: row => {
        const extensao = row.extensao?.toLowerCase()
        const isPdf = extensao === 'pdf'
        return (
          <ButtonDownloadAnexos 
            onClick={() => handleVisualizarDocumento(row.codigo, row.extensao)}
            label={isPdf ? 'Visualizar' : 'Baixar'}
          />
        )
      },
      width: '15%',
      excludeFromExport: true
    }
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Erro ao carregar detalhes: {error}</div>;
  if (!data) return <div>Nenhum dado encontrado.</div>;

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Leis Municípais', path: '/leis' },
          { label: data ? `${data.tipoDoDocumento} Nº ${data.numeroDoDocumento}` : 'Detalhes' },
        ]}
        showExportButton={true}
        contentRef={contentRef}
        tableRef={tableRef}
        pageTitle={pageTitle}  
      />

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

        <div ref={tableRef}>
          {/* Documentos */}
          {documentos && documentos.length > 0 && (
            <>
              <h2 className="titulo-tabela">Documentos Anexos</h2>
              <DataTableDetail
                columns={columnsDocumentos}
                data={documentos}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegislacaoDetail;
