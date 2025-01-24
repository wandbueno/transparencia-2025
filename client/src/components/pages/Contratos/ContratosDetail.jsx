import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getContratosById } from "../../../services/contratosLicitacoes/contratos";
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/LoadingSpinner';
import '../../../assets/global.css';
import '../PagesDetail.css';
import DataTableDetail from "../../common/DataTableDetail";
import { config } from "../../../assets/config";

const ContratosDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getContratosById(id);  
        setData(result); 

         // Atualizando o título da página com base nos dados recebidos
         if (result) {
          document.title = `Contrato Nº ${result.numero} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
   const pageTitle = data ? `Detalhes: Contrato Nº ${data.numero}` : 'Detalhes';
  
  // Função para formatar CPF com substituição dos números por 'x'
  const formatCpf = (cpf) => {
    const cleaned = (cpf || '').replace(/\D/g, '');

    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, 'xxx.$1.$2-$3.xx');
    }
    
    return cpf;
  };

  // Função para formatar CNPJ
  const formatCnpj = (cnpj) => {
    const cleaned = (cnpj || '').replace(/\D/g, '');

    if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return cnpj;
  };

  // Função para formatar CPF ou CNPJ
  const formatCpfCnpj = (cpfCnpj) => {
    const cleaned = (cpfCnpj || '').replace(/\D/g, '');
    return cleaned.length === 11 ? formatCpf(cpfCnpj) : formatCnpj(cpfCnpj);
  };

  // Definição das colunas para o DataTable dos Empenhos
  const columnsEmpenhosContrato = [
    { name: 'Dotação Orçamentária', selector: row => row.dotacaoOrcamentaria, sortable: true, width: '15%' },
    { name: 'Número', selector: row => row.numero, sortable: true, width: '10%' },
    { name: 'Data', selector: row => row.data, sortable: true, width: '10%'  },
    { 
      name: 'Descrição', 
      selector: row => row.descricao, 
      sortable: true, 
      width: '35%', 
      cell: row => (
        <div className="descricao-col">{row.descricao}</div>
      )
    },
    { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%'  },
    { name: 'Saldo', selector: row => row.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
  ];

  // Definição das colunas para o DataTable dos Aditivos
    const columnsAditivos = [
      { name: 'Número', selector: row => row.numero, sortable: true, width: '9%'},
      { name: 'Data da Firmatura', selector: row => row.dataDaFirmatura, sortable: true, width: '15%' },
      { name: 'Data Final', selector: row => row.dataFinal, sortable: true, width: '10%' },
      { 
        name: 'Tipo de Aditivo', 
        selector: row => row.tipoDeAditivo, 
        sortable: true, 
        width: '12%', 
        cell: row => (
          <div className="descricao-col">{row.tipoDeAditivo}</div>
        )
      },
      { 
        name: 'Descrição', 
        selector: row => row.descricao, 
        sortable: true, 
        width: '23%', 
        cell: row => (
          <div className="descricao-col">{row.descricao}</div>
        )
      },
      
      { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '10%' },
      { name: 'Acréscimo', selector: row => row.valorDoAcrescimo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '10%' },
      { name: 'Decrescimo', selector: row => row.valorDoDecrescimo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '11%' }
    ];
    
    // Definição das colunas para o DataTable dos Apostilamentos
    const columnsApostilamentos = [
      { name: 'Número', selector: row => row.numero, sortable: true },
      { name: 'Tipo de Apostilamento', selector: row => row.tipoDeApostilamento, sortable: true },
      { name: 'Tipo de Alteração', selector: row => row.tipoDeAlteracao, sortable: true },
      { name: 'Data', selector: row => row.data, sortable: true },
      { name: 'Data Final', selector: row => row.dataFinal, sortable: true },
      { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true },
      { name: 'Valor Atualizado do Contrato', selector: row => row.valorAtualizadoDoContrato.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true }
    ];


  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Contratos', path: '/Contratos' },
          { label: data ? `CONTRATO Nº ${data.numero}` : 'Detalhes' },
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
            <span><p>Número do Contrato:</p> {data.numero}</span>
            <span><p>Nome do(a) contratado(a):</p> {data.nomeDoFornecedor}</span>
            <span><p>CPF/CNPJ do(a) contratado(a):</p> 
              {formatCpfCnpj(data.cpfOuCnpjDoFornecedor)}
            </span>
            <span><p>Órgão:</p> {data.nomeDoOrgao}</span>
            <span><p>Valor Original:</p> {data.valor !== undefined ? data.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
            <span><p>Valor Aditado:</p> {data.valorAditado !== undefined ? data.valorAditado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
            <span><p>Valor Total:</p> {data.valorTotal !== undefined ? data.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
            <span><p>Valor Executado:</p> {data.valorExecutado !== undefined ? data.valorExecutado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
            <span><p>Saldo do Contrato:</p> {data.saldo !== undefined ? data.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
  
            <span><p>Data de Publicação:</p> {data.dataDaPublicacao}</span>  
            <span><p>Data de Início de Vigência:</p> {data.data}</span>
            <span><p>Data Fim de Vigência:</p> {data.vigencia}</span>
            <span><p>Período:</p> {data.periodo}</span>
            <span><p>Modalidade</p> {data.modalidade}</span>
            <span>
            <p>Licitação/Ano:</p> 
            {data.numeroEAnoDaLicitacao ? (
              <a href={`/licitacoes/${data.codigoDaLicitacao}`} target="_blank" rel="noopener noreferrer">
                {data.numeroEAnoDaLicitacao}
              </a>
            ) : 'N/A'}
          </span>
            <span><p>Processo de aquisição ou Contratação:</p> {data.numeroDoProcesso}</span>  
            <span><p>Fiscal do Contrato:</p> {data.nomeDoFiscalDoContrato}</span>
            <span><p>Local da execução ou entrega no contrato:</p> {data.localDaExecucaoOuEntrega}</span>
            <span><p>Situação:</p> {data.situacao}</span>
            <span><p>Finalidade:</p> {data.finalidade}</span>
          
          <div className="full-width">
            <span><p>Objeto:</p> {data.objeto}</span>
          </div> 
       
        </div> 
        <div ref={tableRef}>
          <div className="tabela-detalhes">
            {data.aditivos.total > 0 && (
              <>
                <h2 className="titulo-tabela">Aditivos</h2>
                <DataTableDetail
                  columns={columnsAditivos}
                  data={data.aditivos.registros}
                />
              </>
            )}
          </div>

          <div className="tabela-detalhes">
            {data.apostilamentos.total > 0 && (
              <>
                <h2 className="titulo-tabela">Apostilamentos</h2>
                <DataTableDetail
                  columns={columnsApostilamentos}
                  data={data.apostilamentos.registros}
                />
              </>
            )}
          </div>

          <div className="tabela-detalhes">
            {data.empenhos.total > 0 && (
              <>
                <h2 className="titulo-tabela">Empenhos</h2>
                <DataTableDetail
                  columns={columnsEmpenhosContrato}
                  data={data.empenhos.registros}
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

export default ContratosDetail;
