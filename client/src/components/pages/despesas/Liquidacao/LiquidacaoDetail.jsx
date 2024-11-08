import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getLiquidacaoById } from "../../../../services/receitasDespesas/liquidacoes";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const LiquidacaoDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca detalhes da liquidação, incluindo anulações
        const result = await getLiquidacaoById(id);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Liquidação Nº ${result.numeroDoTcm} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
  const pageTitle = data ? `Detalhes: Liquidação Nº ${data.numeroDoTcm}` : 'Detalhes';

  // Definição das colunas para o DataTable das Anulações
  const columnsAnulacoes = [
    { name: 'Data', selector: row => row.data, sortable: true, width: '30%' },
    { name: 'Valor', selector: row => row.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', sortable: true, width: '30%' },
    { name: 'Motivo', selector: row => row.motivo || 'Sem motivo', sortable: true, width: '40%' },
  ];

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Liquidação', path: '/liquidacoes' },
          { label: data ? `Liquidação Nº ${data.numeroDoTcm}` : 'Detalhes' },
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
          <span><p>Liquidação:</p> {data.numeroDoTcm}</span>
          <span><p>Data:</p> {data.data}</span>
          <span><p>Programa:</p> {data.numeroDoPrograma}</span>
          <span><p>Código/Fonte::</p> {data.codigoETituloDaFonte}</span>
          <span><p>Código/Elemento::</p> {data.codigoEtituloDoElemento}</span>
          <span><p>Dotação Orçamentária:</p> {data.dotacaoOrcamentaria}</span>
          <span><p>Valor da Liquidação:</p> {data.valorDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>  
          <div className="full-width">
            <span><p>Histórico:</p> {data.historico}</span>
          </div>            
        </div>

        <div ref={tableRef}>
          {/* Tabela de Anulações de Liquidação */}          
          {data.anulacoes && data.anulacoes.total > 0 && (
            <>
              <h2 className="titulo-tabela">Detalhamento das Anulações de Liquidações</h2>
              <DataTableDetail
                columns={columnsAnulacoes}
                data={data.anulacoes.registros}
              />
            </>
          )}

        </div>
        
      </div> 
       

      )} 
    </div>
  );
};

export default LiquidacaoDetail;