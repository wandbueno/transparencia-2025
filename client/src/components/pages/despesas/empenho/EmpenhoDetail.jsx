import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDespesasId, getItensEmpenho } from "../../../../services/receitasDespesas/despesas";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";
import ExportDetailToPDF from "../../../common/ExportDetailToPDF";


const EmpenhoDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo a ser exportado
  const [itens, setItens] = useState(null); // Estado para os itens do empenho

  useEffect(() => {
    const fetchData = async () => {
      try {
       // Busca detalhes do empenho
        const result = await getDespesasId(id);  
        setData(result);

        // Busca itens do empenho
        const itensEmpenho = await getItensEmpenho(id);
        setItens(itensEmpenho);  // Armazene os itens separadamente no estado
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Empenho Nº ${result.numeroDoTcm} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);  // Adiciona `id` como dependência do useEffect

  // Definição das colunas para o DataTable do Detalhamento das Liquidações
  const columnsLiquidacoes = [
    { name: 'Data', selector: row => row.data, sortable: true, width: '20%' },
    { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '20%' },
    {
      name: 'Motivo',
      selector: row => row.motivo,
      sortable: true,
      width: '60%',
      cell: row => <div className="text-wrap">{row.motivo}</div> // Aplicando a classe CSS para quebra de linha
    }
  ];

   // Definição das colunas para o DataTable da Detalhamento das Ordem de Pagamentos
   const columnsOrdemPagamentos = [
    { name: 'Data', selector: row => row.data, sortable: true, width: '20%' },
    { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '20%' },
    {
      name: 'Motivo',
      selector: row => row.motivo,
      sortable: true,
      width: '60%',
      cell: row => <div className="text-wrap">{row.motivo}</div> // Aplicando a classe CSS para quebra de linha
    },
   
    
  ];

   // Definição das colunas para o DataTable do Detalhamento Itens do Empenho
   const columnsItensEmpenho = [
    { name: 'Código', selector: row => row.codigoDoProduto, sortable: true, width: '15%' },
    { name: 'Nome', selector: row => row.tituloDoProduto, sortable: true, width: '30%' },
    { name: 'Quantidade', selector: row => row.quantidade, sortable: true, width: '15%' },
    { name: 'Valor Unitário', selector: row => row.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '20%' },
    { name: 'Valor Total', selector: row => row.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '20%' }
  ];


  return (
    <div className="container">
      <PageHeader
        title={data ? `DETALHES: Empenho Nº ${data.numeroDoTcm}` : 'Detalhes'}
        breadcrumb={[
          { label: 'Despesa/ Empenho', path: '/despesas-empenho' },
          { label: data ? `Empenho Nº ${data.numeroDoTcm}` : 'Detalhes' },
        ]}
      />

      {/* Botão para exportar os detalhes para PDF */}
      <ExportDetailToPDF contentRef={contentRef} />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar detalhes: {error}</div>
      ) : (
      <div className="detalhes-geral" ref={contentRef}>  
        <div className="detalhes">
          <span><p>Data:</p> {data.data}</span>
          <span><p>Fonte:</p> {data.tituloDaFonte}</span>
          <span><p>Fornecedor:</p> {data.cnpjENomeDoFornecedor}</span>
          <span><p>Órgão/Unidade Gestora:</p> {data.codigoENomeDoOrgao}</span>
          
          <span><p>Unidade:</p> {data.codigoENomeDaUnidade}</span>
          <span><p>Função:</p> {data.codigoENomeDaFuncao}</span>
          <span><p>Subfunção:</p> {data.codigoENomeDaSubfuncao}</span>
          <span><p>Programa:</p> {data.codigoENomeDoProgarama}</span> 
          
          <span><p>Ação:</p> {data.codigoENomeDaAcao}</span>
          <span><p>Dotação Orçamentária:</p> {data.classificacaoOrcamentaria}</span>
          <span><p>Natureza de Despesa:</p> {data.codigoENomeDaNaturezaDespesa}</span>
          <span><p>Valor Empenhado:</p> {data.valorDoEmpenho !== undefined ? data.valorDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>

          <span><p>Valor Anulação do Empenho:</p> {data.valorDaAnulacaoDoEmpenho !== undefined ? data.valorDaAnulacaoDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor Total do Empenho:</p> {data.valorTotalDoEmpenho !== undefined ? data.valorTotalDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor da Liquidacao:</p> {data.valorDaLiquidacao !== undefined ? data.valorDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor da Anulação da Liquidacao:</p> {data.valorDaAnulacaoDaLiquidacao !== undefined ? data.valorDaAnulacaoDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>

          <span><p>Valor Total da Liquidação:</p> {data.valorTotalDaLiquidacao !== undefined ? data.valorTotalDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor da Ordem de Pagamento:</p> {data.valorDoPagamento !== undefined ? data.valorDoPagamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor da Anulação da Ordem de Pagamento:</p> {data.valorAnulacaoDoPagamento !== undefined ? data.valorAnulacaoDoPagamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor Total do Pagamento:</p> {data.valorTotalDoPagamento !== undefined ? data.valorTotalDoPagamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
                                                     
          <span><p>Processo Administrativo:</p> {data.codigoDoProcesso}</span>
          <span><p>Modalidade:</p> {data.codigoENomeDaModalidade}</span>
          <span>
              <p>Licitação/Ano:</p> 
              {data.numeroEAnoDaLicitacao ? (
                <a href={`/licitacoes/${data.codigoDaLicitacao}`} target="_blank" rel="noopener noreferrer">
                  {data.numeroEAnoDaLicitacao}
                </a>
              ) : 'N/A'}
            </span>
          <span><p>Elemento de Despesa:</p> {data.rubricaDaDespesa}</span>
          
          <span><p>Número Do Contrato:</p> {data.dataDePublicacao}</span>
          <span><p>Tipo do Empenho:</p> {data.tipoDoEmpenho}</span>
          
          <div className="full-width">
            <span><p>Bem Fornecido ou Serviço Prestado:</p> {data.historico}</span>
          </div>         

        </div> 

        {/* Tabela de Itens do Empenho */}
        <div className="tabela-detalhes">  
          {itens && itens.total > 0 && (
            <>
              <h2 className="titulo-tabela">Detalhamento Itens do Empenho</h2>
              <DataTableDetail
                columns={columnsItensEmpenho}
                data={itens.registros}
              />
            </>
          )}
        </div>

        {/* Tabela de Liquidações */}
        <div className="tabela-detalhes">
          {data.liquidacoes.total > 0 && (
            <>
              <h2 className="titulo-tabela">Detalhamento das Liquidações</h2>
              <DataTableDetail
                columns={columnsLiquidacoes}
                data={data.liquidacoes.registros}
              />
            </>
          )}
        </div>

        {/* Tabela de Ordens de Pagamento */}
        <div className="tabela-detalhes">
          {data.ordensDePagamento.total > 0 && (
            <>
              <h2 className="titulo-tabela">Detalhamento das Ordem de Pagamentos</h2>
              <DataTableDetail
                columns={columnsOrdemPagamentos}
                data={data.ordensDePagamento.registros}
              />
            </>
          )}
        </div>
        
      </div> 
       

      )} 
    </div>
  );
};

export default EmpenhoDetail;