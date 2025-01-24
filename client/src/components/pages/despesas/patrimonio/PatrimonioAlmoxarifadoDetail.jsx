import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getPatrimonioAlmoxarifadoId } from "../../../../services/receitasDespesas/PatrimonioAlmoxarifado";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const PagamentoDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPatrimonioAlmoxarifadoId(id);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Tombamento Nº ${result.numeroDeTombamento} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
   const pageTitle = data ? `Detalhes: Tombamento Nº ${data.numeroDeTombamento}` : 'Detalhes';

  // Definição das colunas para o DataTable dos Estornos
  const columnsMovimentacoes = [
    { name: 'Data', selector: row => row.data, sortable: true, width: '15%' },
    { name: 'Tipo', selector: row => row.tipo, sortable: true, width: '15%' },
    { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '30%' },
    { name: 'Descrição', selector: row => row.descricao, sortable: true, width: '40%' },
  ];

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Patrimônio e Almoxarifado', path: '/transparencia/patrimonio-e-almoxarifado' },
          { label: data ? `Tombamento Nº ${data.numeroDeTombamento}` : 'Detalhes' },
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
          <span><p>Código:</p> {data.codigoDoPatrimonio}</span>
          <span><p>Número Tombamento:</p> {data.numeroDeTombamento}</span>
          <span><p>Data de Aquisição:</p> {data.dataDeAquisicao}</span>
          <span><p>Exercício/Ano:</p> {data.ano}</span> 
          <span><p>Mês:</p> {data.mes}</span>
          <span><p>Órgão:</p> {data.nomeDoOrgao}</span>
          
          <span><p>Departamento:</p> {data.nomeDoDepartamento}</span>
          <span><p>Tipo do Bem:</p> {data.tipoDeBem}</span>
          <span><p>Natureza Do Item:</p> {data.subCategoria}</span>
          <span><p>Quantidade:</p> {data.quantidade}</span>
          <span><p>Fornecedor:</p> {data.fornecedor}</span> 
          <span><p>CPF/CNPJ:</p> {data.cpfOuCnpj}</span>       
          
          <span><p>Valor Original:</p> {data.valorOriginal !== undefined ? data.valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor Atual:</p> {data.valorAtual !== undefined ? data.valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
      
          <div className="full-width">
            <span><p>Descrição:</p> {data.descricao}</span>
          </div>         
        </div>

        <div ref={tableRef}>
          {/* Tabela de Movimentações */}
          <div className="tabela-detalhes">
            {data.movimentacoes && data.movimentacoes.total > 0 && (
              <>
                <h2 className="titulo-tabela">Movimentações</h2>
                <DataTableDetail
                  columns={columnsMovimentacoes}
                  data={data.movimentacoes.registros}
                />
              </>
            )}
          </div>
        </div>


        
        
      </div> 
       

      )} 
    </div>
  );
};

export default PagamentoDetail;