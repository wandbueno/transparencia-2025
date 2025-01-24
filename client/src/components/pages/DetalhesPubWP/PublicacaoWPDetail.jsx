import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation  } from "react-router-dom";
import { getPublicacaoBySlug, getDocumentsWithUrls } from "../../../services/publicacoesWP/publicacao"; 
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/LoadingSpinner';
import '../PagesDetail.css';
import '../../../assets/global.css';
import { config } from "../../../assets/config";
import DataTableDetail from "../../common/DataTableDetail";
import ButtonLink from "../../common/ButtonLink";
import { breadcrumbMap } from "./BreadcrumbMap";

// Função utilitária para decodificar entidades HTML
function decodeHtmlEntities(text) {
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent;
}

const PublicacaoWPDetail = () => {
  const { slug } = useParams(); // Captura o slug da URL
  const { pathname } = useLocation(); // Captura o caminho da URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente
  const [documentsData, setDocumentsData] = useState([]); // Adicionando state para documentos com URLs

  // Determinar qual é a rota atual para ajustar o breadcrumb
  const currentBreadcrumb = Object.keys(breadcrumbMap).find(route =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPublicacaoBySlug(slug);  // Busca a publicação pelo slug
        setData(result);

        // Atualiza o título da página dinamicamente
        if (result) {
          document.title = `${decodeHtmlEntities(result.title.rendered)} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }

        // Se houver documentos, buscar os URLs
        if (result.meta.documentos) {
          const docsWithUrls = await getDocumentsWithUrls(result.meta.documentos);
          setDocumentsData(docsWithUrls);  // Armazena os documentos com URLs
        }

      } catch (err) {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Definindo o título dinamicamente com base no title
  const pageTitle = data ? `Detalhes: ${decodeHtmlEntities(data.title?.rendered)}` : 'Detalhes do Concursos e Processos Seletivos';

  // Definição das colunas para o DataTable dos anexos e documentos combinados
  const columns = [
    { name: 'Título', selector: row => row.titulo || row.tipo, sortable: true, width: '60%' },
    {
      name: 'Link para Documento',
      selector: row => row.url || row.urlArquivo,
      cell: row => row.urlArquivo || row.url !== 'Não disponível' ? (
        <ButtonLink link={row.urlArquivo || row.url} label="Ver Documento" />
      ) : 'Documento não disponível',
      width: '40%'
    }
  ];

  // Definição das colunas para o DataTable da lista de aprovados
  const columnsAprovados = [
    { name: 'Nome', selector: row => row.nome, sortable: true, width: '60%' },
    { name: 'Situação', selector: row => row.situacao, sortable: true, width: '40%' }
  ];

  // Transformar a lista de aprovados em um array utilizável para o DataTable
    const aprovadosDataArray = data?.meta?.lista_aprovados
    ? Object.keys(data.meta.lista_aprovados).map(key => ({
        nome: data.meta.lista_aprovados[key].nome,
        situacao: data.meta.lista_aprovados[key].situacao
      }))
    : [];

  // Transformar os documentos em um array utilizável para o DataTable
  const documentosDataArray = documentsData.map(doc => ({
    tipo: doc.tipo,
    url: doc.url
  }));

  // Transformar os anexos em um array utilizável para o DataTable
  const anexosDataArray = data?.meta?.anexos_600
    ? Object.keys(data.meta.anexos_600).map(key => ({
        titulo: data.meta.anexos_600[key].titulo,
        urlArquivo: data.meta.anexos_600[key]["url-arquivo"]
      }))
    : [];

  // Mesclar os dois arrays (anexos e documentos)
  const combinedData = [...anexosDataArray, ...documentosDataArray];

  return (
    <div className="container">
      {/* Carrega o spinner enquanto está carregando ou exibe erro se houver */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar detalhes: {error}</div>
      ) : (
        <>
          {/* PageHeader renderizado quando os dados estão carregados */}
          <PageHeader
            title={pageTitle}
            breadcrumb={[
              breadcrumbMap[currentBreadcrumb] || { label: 'Detalhes', path: pathname }, // Ajusta dinamicamente
              { label: data.title?.rendered ? decodeHtmlEntities(data.title?.rendered) : 'Detalhes' } // Decodificando caracteres especiais
            ]}
            
            showExportButton={true}  // Exibe o botão de exportação
            contentRef={contentRef}
            tableRef={tableRef}
            pageTitle={pageTitle}
          />

          {/* Conteúdo da página, exibido após os dados serem carregados */}
          <div className="detalhes-geral">
          <div className="detalhes" ref={contentRef}>
            {data.title?.rendered && (
              <span>
                <p>Documento:</p> {decodeHtmlEntities(data.title?.rendered)}
              </span>
            )}

            {data.date && (
              <span>
                <p>Ano:</p> {new Date(data.date).getFullYear()}
              </span>
            )}

            {data.date && (
              <span>
                <p>Data Publicação:</p> {new Date(data.date).toLocaleDateString('pt-BR')}
              </span>
            )}
            
            {data.meta["inscricoes"] && (
              <span>
                <p>Inscrição até:</p> {data.meta["inscricoes"]}
              </span>
            )}

            {data.meta["data-fim"] && (
              <span>
                <p>Data Fim:</p> {data.meta["data-fim"]}
              </span>
            )}

            {data.meta["n-vagas"] && (
              <span>
                <p>Nº Vagas:</p> {data.meta["n-vagas"]}
              </span>
            )}

            {data.meta["situacao_pss"] && (
              <span>
                <p>Situação PSS:</p> {data.meta["situacao_pss"]}
              </span>
            )}

            {data.meta["autor-da-emenda"] && (
              <span>
                <p>Autor da Emenda:</p> {data.meta["autor-da-emenda"]}
              </span>
            )}

            {data.meta["n_emenda"] && (
              <span>
                <p>Nº Emenda:</p> {data.meta["n_emenda"]}
              </span>
            )}

            {data.meta["n_convenio"] && (
              <span>
                <p>Nº Convênio:</p> {data.meta["n_convenio"]}
              </span>
            )}

            {data.meta["valor_convenio"] && (
              <span>
                <p>Valor Convênio:</p> {data.meta["valor_convenio"]}
              </span>
            )}

            {data.meta["nome-favorecido"] && (
              <span>
                <p>Favorecido:</p> {data.meta["nome-favorecido"]}
              </span>
            )}

            {data.meta["tipo-emenda"] && (
              <span>
                <p>Tipo de Emenda:</p> {data.meta["tipo-emenda"]}
              </span>
            )}

            {data.meta["situacao_"] && (
              <span>
                <p>Situação:</p> {data.meta["situacao_"]}
              </span>
            )}

            {/* Verificação condicional para "tipo-de-informacao" e "tipo-de-documento" */}
            {data.meta["tipo-de-documento"] === "Rol de Informações" && 
              ["Informações Desclassificadas", "Documentos Classificados"].includes(data.meta["tipo-de-informacao"]) && (
                <span>
                  <p>Tipo de Informação:</p> {data.meta["tipo-de-informacao"]}
                </span>
              )}


            {data.meta["origem"] && (
              <span>
                <p>Origem:</p> {data.meta["origem"]}
              </span>
            )}

            {data.meta["destino"] && (
              <span>
                <p>Destino:</p> {data.meta["destino"]}
              </span>
            )}

            <div className="full-width">
              {data.meta["objeto_"] && (
                <span>
                  <p>Objeto:</p>{" "}
                  <span dangerouslySetInnerHTML={{ __html: data.meta["objeto_"] }} />
                </span>
              )}
            </div>
          </div>

           {/* Tabela de Aprovados */}
           <div ref={tableRef}>
              {aprovadosDataArray.length > 0 && (
                <>
                  <h2 className="titulo-tabela">Lista de Inscritos</h2>
                  <DataTableDetail
                    columns={columnsAprovados}
                    data={aprovadosDataArray}
                  />
                </>
              )}

              {combinedData.length > 0 && (
                <>
                  <h2 className="titulo-tabela">Documentos e Anexos</h2>
                  <DataTableDetail
                    columns={columns}
                    data={combinedData}
                  />
                </>
              )}

              <div className="font-dados">
                <span>Dados obtidos de: <a href="https://publixel.com.br/" target="_blank">Publixel</a></span>
              </div>
            </div>
            
          </div>
              
        </>
      )}
    </div>
  );
};

export default PublicacaoWPDetail;
