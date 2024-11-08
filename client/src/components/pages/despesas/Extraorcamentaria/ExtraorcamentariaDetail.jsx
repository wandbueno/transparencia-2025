import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getExtraById, getExtraMovimentos } from "../../../../services/receitasDespesas/extraorcamentaria";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const ExtraorcamentariaDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente
  const [movimentos, setMovimentos] = useState([]); // Estado para armazenar os movimentos

   // Capturar ano e mes da URL
   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);
   const ano = searchParams.get("ano");
   const mes = searchParams.get("mes");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca detalhes da liquidação, incluindo anulações
        const result = await getExtraById(id, ano, mes);  
        setData(result);

         // Busca os movimentos relacionados à extra orçamentária
         const movimentosResult = await getExtraMovimentos(id, ano, mes);
         setMovimentos(movimentosResult.registros);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Extra Orçamentária - ${result.titulo} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
  const pageTitle = data ? `Extra Orçamentária - ${data.titulo}` : 'Detalhes';

  const columnsMovimentos = [
    { name: 'Data', selector: row => row.data || 'Sem data', sortable: true, width: '30%' },
    { name: 'Valor Movimento', selector: row => row.valorMovimento?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', sortable: true, width: '30%' },
    { name: 'Descrição', selector: row => row.descricao || 'Sem descrição', sortable: true, width: '40%' },
  ];
  
  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Extra Orçamentária', path: '/extra-orcamentaria' },
          { label: data ? `Extra Orçamentária - ${data.titulo}` : 'Detalhes' },
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
          <span><p>Tipo Extra:</p> {data.tipoDoLancamento}</span>
          <span><p>Tipo Retenção:</p> {data.tipoDeRetencao}</span>
          <span><p>Valor Movimento (Mês):</p> {data.valorMovimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>  
          <span><p>Valor Anulação (Mês):</p> {data.valorAnulacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>  
          <span><p>Valor Acumulado:</p> {data.valorAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>  
                    
        </div> 
        <div ref={tableRef}>
          {/* Tabela de Movimentos Relacionados à Extra Orçamentária */}          
          {movimentos.length > 0 && (
            <>
              <h2 className="titulo-tabela">Movimentos Relacionados à Extra Orçamentária</h2>
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

export default ExtraorcamentariaDetail;