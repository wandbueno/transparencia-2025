import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getLicitacaoById, getItensVencedores, getItensFracassadosOuDesertos, getItensEmAberto, getItensCanceladosESubstituidos, getEmpresasCredenciadas, getEmpenhos, getContratos } from "../../../services/contratosLicitacoes/licitacoes";
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/LoadingSpinner'
import DataTableDetail from '../../common/DataTableDetail';
import '../PagesDetail.css';
import '../../../assets/global.css';
import { config } from "../../../assets/config";
import ButtonTable from '../../common/ButtonTable'

const LicitacaoDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente
  const [itensVencedores, setItensVencedores] = useState(null);  // Estado para armazenar os Itens Vencedores
  const [itensFracassados, setItensFracassados] = useState([]);
  const [itensEmAberto, setItensEmAberto] = useState([]);
  const [itensCancelados, setItensCancelados] = useState([]);
  const [empresasCredenciadas, setEmpresasCredenciadas] = useState([]);
  const [empenhos, setEmpenhos] = useState([]);
  const [contratos, setContratos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLicitacaoById(id);  
        setData(result);

        // Buscando os itens relacionados
        const itensVencedoresResult = await getItensVencedores(id);
        setItensVencedores(itensVencedoresResult.registros);

        const itensFracassadosResult = await getItensFracassadosOuDesertos(id);
        setItensFracassados(itensFracassadosResult.registros);

        const itensEmAbertoResult = await getItensEmAberto(id);
        setItensEmAberto(itensEmAbertoResult.registros);

        const itensCanceladosResult = await getItensCanceladosESubstituidos(id);
        setItensCancelados(itensCanceladosResult.registros);

        const empresasCredenciadasResult = await getEmpresasCredenciadas(id);
        setEmpresasCredenciadas(empresasCredenciadasResult.registros);

        const empenhosResult = await getEmpenhos(id);
        setEmpenhos(empenhosResult.registros);

        const contratosResult = await getContratos(id);
        setContratos(contratosResult.registros);
                
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `${result.modalidade} Nº ${result.numeroAno} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);  // Adiciona `id` como dependência do useEffect

  // Definição das colunas para o DataTable dos Itens Vencedores
  const columnsItensVencedores = [
    { name: 'Lote/Item', selector: row => row.loteEItem, sortable: true, width: '10%' },
    { name: 'Produto', selector: row => row.produto, sortable: true, width: '22%'  },
    { name: 'Fornecedor Vencedor', selector: row => row.fornecedor, sortable: true, width: '20%'  },
    { name: 'Und', selector: row => row.unidade, sortable: true, width: '5%'  },
    { name: 'Qtd', selector: row => row.quantidade, sortable: true, width: '6%'  },
    { name: 'Valor Unitário', selector: row => row.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '13%'  },
    { name: 'Valor Total', selector: row => row.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%'  },
    { name: 'Adjudicada', selector: row => row.adjudicada, sortable: true, width: '12%'  }
  ];

  // Definição das colunas para o DataTable dos Contratos
  const columnsContratos = [
    { name: 'Número', selector: row => row.numero, sortable: true, width: '10%' },
    { name: 'Fornecedor', selector: row => row.nomeDoFornecedor, sortable: true, width: '42%'  },
    // { name: 'Objeto', selector: row => row.objeto, sortable: true, width: '40%' },
    { name: 'Data', selector: row => row.data, sortable: true, width: '10%'  },
    { name: 'Vigência', selector: row => row.vigencia, sortable: true, width: '10%'  },
    { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '20%'  },
    {
      name: 'Detalhes',
      selector: row => row.codigo,
      cell: row => {
        const id = row.codigo;
        return <ButtonTable path="/contratos" id={id} label="Abrir" target="_blank"/>; // Abre em nova aba
      },
      width: '8%',
      excludeFromExport: true
    },
  ];

  // Definição das colunas para o DataTable dos Empenhos
  const columnsEmpenhos = [
    { name: 'Dotação Orçamentária', selector: row => row.classificacaoOrcamentaria, sortable: true, width: '16%' },
    { name: 'Número', selector: row => row.numero, sortable: true, width: '7%' },
    { name: 'Data', selector: row => row.data, sortable: true, width: '8%'  },
    { name: 'Fornecedor', selector: row => row.nomeDoFornecedor, sortable: true, width: '19%'  },
    { name: 'Empenho', selector: row => row.valorDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '9%'  },
    { name: 'Anulação', selector: row => row.valorDaAnulacaoDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '9%' },
    { name: 'Liquidação', selector: row => row.valorDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '9%'  },
    { name: 'Anulação Liquidação', selector: row => row.valorDaAnulacaoDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '15%' },
    {
      name: 'Detalhes',
      selector: row => row.codigo,
      cell: row => {
        const id = row.codigo;
        return <ButtonTable path="/despesas-empenho" id={id} label="Abrir" target="_blank"/>; // Abre em nova aba
      },
      width: '8%',
      excludeFromExport: true
    },
  ];

  // Definição das colunas para o DataTable dos Itens em Aberto
  const columnsItensEmAberto = [
    { name: 'Lote e Item', selector: row => row.loteEItem, sortable: true, width: '20%' },
    { name: 'Produto', selector: row => row.produto, sortable: true, width: '40%' },
    { name: 'Unidade', selector: row => row.unidade, sortable: true, width: '20%' },
    { name: 'Quantidade', selector: row => row.quantidade, sortable: true, width: '20%' },
  ];

  // Definição das colunas para o DataTable das Empresas Credenciadas
    const columnsEmpresasCredenciadas = [
      { name: 'CPF/CNPJ', selector: row => row.cpfOuCnpjDoCredenciado, sortable: true, width: '32%' },
      { name: 'Nome', selector: row => row.nomeDoCredenciado, sortable: true, width: '56%' },
      { name: 'ME/EPP', selector: row => row.meEppCredenciado, sortable: true, width: '12%' },
     
    ];

  // Definição das colunas para o DataTable dos Itens Fracassados ou Desertos
  const columnsItensFracassadosOuDesertos = [
    { name: 'Lote/Item', selector: row => row.loteEItem, sortable: true, width: '10%' },
    { name: 'Produto', selector: row => row.produto, sortable: true, width: '50%' },
    { name: 'Quantidade', selector: row => row.quantidade, sortable: true, width: '28%' },
    { name: 'Unidade', selector: row => row.unidade, sortable: true, width: '12%' },
  ];

  // Definição das colunas para o DataTable dos Itens Cancelados e Substituídos
  const columnsItensCanceladosESubstituidos = [
    { name: 'Data', selector: row => row.data, sortable: true },
    { name: 'Fornecedor', selector: row => row.fornecedor, sortable: true },
    { name: 'Lote e Item', selector: row => row.loteEItem, sortable: true },
    { name: 'Produto', selector: row => row.produto, sortable: true },
    { name: 'Quantidade', selector: row => row.quantidade, sortable: true },
    { name: 'Unidade', selector: row => row.unidade, sortable: true },
    { name: 'Valor Total', selector: row => row.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true },
  ];

  // Definição das colunas para o DataTable dos Responsáveis pela Comissão
    const columnsResponsaveisPelaComissao = [
      { name: 'Nome', selector: row => row.nome, sortable: true },
      { name: 'Função', selector: row => row.funcao, sortable: true },
      { name: 'Decreto', selector: row => row.decreto, sortable: true },
      { name: 'Data do Decreto', selector: row => row.dataDoDecreto, sortable: true },
    ];

    // Definindo o título dinamicamente com base nos dados
   const pageTitle = data ? `Detalhes: ${data.modalidade} Nº ${data.numeroAno}` : 'Detalhes';

   

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Procedimentos Licitatório', path: '/licitacoes' },
          { label: data ? `${data.modalidade} Nº ${data.numeroAno}` : 'Detalhes' },
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
            <span><p>Unidade Gestora:</p> {data.orgao}</span>
            <span><p>Modalidade:</p> {data.modalidade}</span>
            <span><p>Nº/Ano:</p> {data.numeroAno}</span>
            <span><p>Número do Protocolo:</p> {data.numeroDoProtocolo}</span>
              
            <span><p>Data de Publicação:</p> {data.dataDePublicacao}</span>
            <span><p>Data de Abertura:</p> {data.dataDeAbertura}</span>
            <span><p>Data de Julgamento:</p> {data.dataDeJulgamento}</span>
            <span><p>Data de Homologação:</p> {data.dataDeHomologacao}</span>  
          
            <span><p>Situação:</p> {data.situacao}</span>
            <span><p>Valor Total Vencedor:</p> {data.valorVencedorTotal !== undefined ? data.valorVencedorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
            <span><p>Atendimento ao covid-19:</p> {data.despesaCovid}</span>
            <span><p>Finalidade:</p> {data.naturezaDoObjeto}</span>
          
            <span><p>Natureza do procedimento:</p> {data.naturezaDoProcedimento}</span>
            <span><p>Número de Envio ao PNCP:</p> {data.numeroDeEnvioAoPncp}</span>
            <span><p>Data de Envio ao PNCP:</p> {data.dataDeEnvioAoPncp}</span>
            <span><p>Link Comprovante:</p> 
              {data.urlDoComprovanteDoEnvioAoPncp ? (
                <a href={data.urlDoComprovanteDoEnvioAoPncp} target="_blank" rel="noopener noreferrer">
                  Acessar
                </a>
              ) : (
                ""
              )}
            </span>
          
          <div className="full-width">
            <span><p>Fundamento Legal:</p> {data.descricaoDoFundamentoLegalDispensa}</span>
            <span><p>Objeto:</p> {data.historico}</span>
          </div> 
        </div> 

        <div ref={tableRef}>
          
          {/* Empresas Credenciadas */}
          {empresasCredenciadas && empresasCredenciadas.length > 0 && (
              <>
                <h2 className="titulo-tabela">Empresas Credenciadas</h2>
                <DataTableDetail
                  columns={columnsEmpresasCredenciadas}
                  data={empresasCredenciadas}
                />
              </>
            )}
          
            {data.responsaveisPelaComissao && data.responsaveisPelaComissao.total > 0 && (
              <>
                <h2 className="titulo-tabela">Responsáveis pela Comissão</h2>
                <DataTableDetail
                  columns={columnsResponsaveisPelaComissao}
                  data={data.responsaveisPelaComissao.registros}
                />
              </>
            )}
          
            {/* Itens em Aberto */}
            {itensEmAberto && itensEmAberto.length > 0 && (
              <>
                <h2 className="titulo-tabela">Itens em Aberto</h2>
                <DataTableDetail
                  columns={columnsItensEmAberto}
                  data={itensEmAberto}
                />
              </>
            )}
          

          {/* Itens Vencedores */}
          {itensVencedores && itensVencedores.length > 0 && (
              <>
                <h2 className="titulo-tabela">Itens Vencedores</h2>
                <DataTableDetail
                  columns={columnsItensVencedores}
                  data={itensVencedores}
                />
              </>
            )}
          
            {/* Itens Fracassados ou Desertos */}
            {itensFracassados && itensFracassados.length > 0 && (
              <>
                <h2 className="titulo-tabela">Itens Fracassados ou Desertos</h2>
                <DataTableDetail
                  columns={columnsItensFracassadosOuDesertos}
                  data={itensFracassados}
                />
              </>
            )}
          
            {/* Itens Cancelados e Substituídos */}
            {itensCancelados && itensCancelados.length > 0 && (
              <>
                <h2 className="titulo-tabela">Itens Cancelados e Substituídos</h2>
                <DataTableDetail
                  columns={columnsItensCanceladosESubstituidos}
                  data={itensCancelados}
                />
              </>
            )}
          
            {/* Contratos */}
            {contratos && contratos.length > 0 && (
              <>
                <h2 className="titulo-tabela">Contratos</h2>
                <DataTableDetail
                  columns={columnsContratos}
                  data={contratos}
                />
              </>
            )}
          
            {/* Empenhos */}
            {empenhos && empenhos.length > 0 && (
              <>
                <h2 className="titulo-tabela">Empenhos</h2>
                <DataTableDetail
                  columns={columnsEmpenhos}
                  data={empenhos}
                />
              </>
            )}
          
        </div>
        
        
      </div> 

      )} 
    </div>
  );
};

export default LicitacaoDetail;