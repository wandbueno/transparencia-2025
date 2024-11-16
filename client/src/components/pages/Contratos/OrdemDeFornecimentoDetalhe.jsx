import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getOrdemDeFornecimentoById, getProdutosPaginados } from "../../../services/contratosLicitacoes/ordensDeFornecimento"; 
import PageHeader from '../../common/PageHeader'; 
import LoadingSpinner from '../../common/LoadingSpinner';
import DataTableDetail from '../../common/DataTableDetail';
import '../../../assets/global.css';
import { config } from '../../../assets/config';

const OrdemDeFornecimentoDetalhe = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [produtos, setProdutos] = useState([]); 
  const contentRef = useRef();  
  const tableRef = useRef(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca detalhes da ordem de fornecimento
        const result = await getOrdemDeFornecimentoById(id);  
        setData(result);

         // Busca produtos relacionados à ordem de fornecimento
         const produtosResult = await getProdutosPaginados(id);
         setProdutos(produtosResult.registros);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Detalhes da Ordem de Fornecimento ${result.codigoDaCompra} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
  const pageTitle = data ? `Ordem de Fornecimento - ${data.codigoDaCompra}` : 'Detalhes';

  // Definindo as colunas da tabela de produtos
  const columnsProdutos = [
    { name: 'Nome', selector: row => row.nome || 'Sem nome', sortable: true, width: '32%' },
    { name: 'Unidade', selector: row => row.unidade || 'N/A', sortable: true, width: '10%' },
    { name: 'Quantidade', selector: row => row.quantidade || 0, sortable: true, width: '10%' },
    { name: 'Valor Unitário', selector: row => row.valorUnitario?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', sortable: true, width: '12%' },
    { name: 'Valor Total', selector: row => row.valorTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', sortable: true, width: '12%' },
    { name: 'Valor Anulado', selector: row => row.valorAnulado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', sortable: true, width: '12%' },
    { name: 'Valor Final', selector: row => row.valorFinal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', sortable: true, width: '12%' },
  ];

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Ordens de Fornecimentos', path: '/ordem-de-fornecimento' },
          { label: data ? `Ordem de Fornecimento - ${data.codigoDaCompra}` : 'Detalhes' },
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
            <span><p>Código da Compra:</p> {data.codigoDaCompra}</span>
            <span><p>Modalidade:</p> {data.modalidade}</span>
            <span><p>Licitacao:</p> {data.licitacao}</span>
            <span><p>Data:</p> {data.data}</span>
            <span><p>Departamento:</p> {data.departamento}</span>
            <span><p>Fornecedor:</p> {data.fornecedor}</span>
            <span><p>Tipo de Compra:</p> {data.tipoDeCompra}</span>
            <span><p>Valor Total Geral:</p> {data.valorTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>           
            <span><p>Valor Total Anulado:</p> {data.valorTotalAnulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span><p>Desconto Geral:</p> {data.descontoGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span><p>Valor Final:</p> {data.valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        
            <div className="full-width">
              <span><p>Histórico:</p> {data.historico}</span>
            </div> 
            
          </div> 
          <div ref={tableRef}>
            {/* Renderizando a tabela de produtos  */}          
            {produtos.length > 0 && (
              <>
                <h2 className="titulo-tabela">Produtos Relacionados à Ordem de Fornecimento</h2>
                <DataTableDetail
                  columns={columnsProdutos}
                  data={produtos}
                />
              </>
            )}
          </div>
         
        </div> 
      )}
    </div>
  );
};

export default OrdemDeFornecimentoDetalhe; 