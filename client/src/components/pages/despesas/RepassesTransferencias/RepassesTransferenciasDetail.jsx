import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getRepassesTransferenciasId, getRepassesMovimentos } from "../../../../services/receitasDespesas/RepassesTransferencias";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const RepassesTransferenciasDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente
  const [movimentos, setMovimentos] = useState([]);  // Para armazenar os movimentos
  // Capturar ano e mes da URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ano = searchParams.get("ano");
  const mes = searchParams.get("mes");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRepassesTransferenciasId(id, ano, mes );  
        setData(result);

         // Busca os movimentos
         const movimentosResult = await getRepassesMovimentos(id, ano, mes);

         // Ordena os movimentos pela data em ordem decrescente
         const movimentosOrdenados = movimentosResult.registros.sort((a, b) => {
           const dateA = new Date(a.data.split('/').reverse().join('-'));
           const dateB = new Date(b.data.split('/').reverse().join('-'));
           return dateB - dateA;  // Ordem decrescente
         });
 
         setMovimentos(movimentosOrdenados);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `${result.titulo} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
  const pageTitle = data ? `Detalhes: ${data.titulo}` : 'Detalhes';

  // Definição das colunas para o DataTable dos Movimentos
  const columnsMovimentos = [
    { name: 'Data', selector: row => row.data, sortable: true, width: '10%' },
    { name: 'Histórico', selector: row => row.historico, sortable: true, width: '15%' },
    { name: 'Tipo de Movimento', selector: row => row.tipoMovimento, sortable: true, width: '10%' },
    { name: 'Beneficiário', selector: row => row.beneficiario, sortable: true, width: '25%' },
    { 
      name: 'Valor Movimento', 
      selector: row => row.valorMovimento?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', 
      sortable: true, 
      width: '15%' 
    },
    { 
      name: 'Valor Anulação', 
      selector: row => row.valorAnulacao?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
      sortable: true, 
      width: '15%' 
    },
    { 
      name: 'Subtotal', 
      selector: row => row.subtotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
      sortable: true, 
      width: '10%' 
    },
  ];  

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Repasse ou transferência de Recursos', path: '/repasse-ou-transferencia' },
          { label: data ? `${data.titulo}` : 'Detalhes' },
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
          <span><p>Órgão:</p> {data.orgao}</span>
          <span><p>Título:</p> {data.titulo}</span>
          <span><p>Tipo de Repasse:</p> {data.tipoDeLancamento}</span>
          <span><p>Valor Movimento:</p> {data.valorMovimento !== undefined ? data.valorMovimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor Anulação:</p> {data.valorAnulacao !== undefined ? data.valorAnulacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor Acumulado:</p> {data.valorAcumulado !== undefined ? data.valorAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
                   
        </div>

        <div ref={tableRef}>
          {/* Tabela de Movimentos Relacionados ao Repasse ou Transferência */}
          {movimentos.length > 0 && (
            <>
              <h2 className="titulo-tabela">Movimentos Relacionados</h2>
              <DataTableDetail
                columns={columnsMovimentos}
                data={movimentos}
              />
            </>
          )}
        </div>     
        
      </div>        

      )} 
    </div>
  );
};

export default RepassesTransferenciasDetail;