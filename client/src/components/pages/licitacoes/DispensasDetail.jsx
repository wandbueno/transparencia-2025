import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDispensasById } from "../../../services/contratosLicitacoes/dispensas";
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/LoadingSpinner'
import DataTableDetail from '../../common/DataTableDetail';
import '../PagesDetail.css';
import '../../../assets/global.css';

const DispensasDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDispensasById(id);  
        setData(result); 

        
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
    { name: 'Produto', selector: row => row.produto, sortable: true, width: '20%'  },
    { name: 'Qtd', selector: row => row.quantidade, sortable: true, width: '6%'  },
    { name: 'Und', selector: row => row.unidade, sortable: true, width: '7%'  },
    { name: 'Fornecedor Vencedor', selector: row => row.fornecedor, sortable: true, width: '20%'  },
    { name: 'Valor Unitário', selector: row => row.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '13%'  },
    { name: 'Valor Total', selector: row => row.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%'  },
    { name: 'Adjudicada', selector: row => row.adjudicada, sortable: true, width: '12%'  }
  ];

  // Definição das colunas para o DataTable dos Contratos
  const columnsContratos = [
    { name: 'Número', selector: row => row.numero, sortable: true, width: '10%' },
    { name: 'Fornecedor', selector: row => row.nomeDoFornecedor, sortable: true, width: '30%'  },
    // { name: 'Objeto', selector: row => row.objeto, sortable: true, width: '40%' },
    { name: 'Data', selector: row => row.data, sortable: true, width: '20%'  },
    { name: 'Vigência', selector: row => row.vigencia, sortable: true, width: '20%'  },
    { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '20%'  },
  ];

  // Definição das colunas para o DataTable dos Empenhos
  const columnsEmpenhos = [
    { name: 'Dotação Orçamentária', selector: row => row.classificacaoOrcamentaria, sortable: true, width: '13%' },
    { name: 'Número', selector: row => row.numero, sortable: true, width: '9%' },
    { name: 'Data', selector: row => row.data, sortable: true, width: '9%'  },
    { name: 'Fornecedor', selector: row => row.nomeDoFornecedor, sortable: true, width: '17%'  },
    { name: 'Empenho', selector: row => row.valorDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%'  },
    { name: 'Anulação', selector: row => row.valorDaAnulacaoDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%' },
    { name: 'Liquidação', selector: row => row.valorDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%'  },
    { name: 'Anulação Liquidação', selector: row => row.valorDaAnulacaoDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '16%' },
  ];

  // Definição das colunas para o DataTable dos Itens em Aberto
  const columnsItensEmAberto = [
    { name: 'Lote e Item', selector: row => row.loteEItem, sortable: true },
    { name: 'Produto', selector: row => row.produto, sortable: true },
    { name: 'Unidade', selector: row => row.unidade, sortable: true },
    { name: 'Quantidade', selector: row => row.quantidade, sortable: true },
  ];

  // Definição das colunas para o DataTable das Empresas Credenciadas
  const columnsEmpresasCredenciadas = [
    { name: 'CPF/CNPJ', selector: row => row.cpfOuCnpjDoCredenciado, sortable: true },
    { name: 'ME/EPP', selector: row => row.meEppCredenciado, sortable: true },
    { name: 'Nome', selector: row => row.nomeDoCredenciado, sortable: true },
  ];

  // Definição das colunas para o DataTable dos Itens Fracassados ou Desertos
  const columnsItensFracassadosOuDesertos = [
    { name: 'Lote e Item', selector: row => row.loteEItem, sortable: true },
    { name: 'Produto', selector: row => row.produto, sortable: true },
    { name: 'Quantidade', selector: row => row.quantidade, sortable: true },
    { name: 'Unidade', selector: row => row.unidade, sortable: true },
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


  return (
    <div className="container">
      <PageHeader
        title={data ? `DETALHES: ${data.modalidade} Nº ${data.numeroAno}` : 'Detalhes'}
        breadcrumb={[
          { label: 'Dispensas e Inexigibilidades', path: '/dispensas-e-inexigibilidades' },
          { label: data ? `${data.modalidade} Nº ${data.numeroAno}` : 'Detalhes' },
        ]}
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar detalhes: {error}</div>
      ) : (
      <div className="detalhes-geral">  
        <div className="detalhes">
            <span><p>Unidade Gestora:</p> {data.orgao}</span>
            <span><p>Modalidade:</p> {data.modalidade}</span>
            <span><p>Nº/Ano:</p> {data.numeroAno}</span>
            <span><p>Número do Protocolo:</p> {data.numeroDoProtocolo}</span>
         
            <span><p>Data de Publicação:</p> {data.dataDePublicacao}</span>
            <span><p>Data de Abertura:</p> {data.dataDeAbertura}</span>
            <span><p>Data de Julgamento:</p> {data.dataDeJulgamento}</span>
            <span><p>Data de Homologação:</p> {data.dataDeHomologacao}</span>  
          
            <span><p>Situação:</p> {data.situacao}</span>
            <span><p>Valor Total Vencedor:</p> {data.valorVencedorTotal ? data.valorVencedorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}</span> 
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
          
          <div>
            <span><p>Fundamento Legal:</p> {data.descricaoDoFundamentoLegalDispensa}</span>
            <span><p>Objeto:</p> {data.historico}</span>
          </div> 

        </div> 

        <div className="tabela-detalhes">
          {data.empresasCredenciadas && data.empresasCredenciadas.total > 0 && (
            <>
              <h2 className="titulo-tabela">Empresas Credenciadas</h2>
              <DataTableDetail
                columns={columnsEmpresasCredenciadas}
                data={data.empresasCredenciadas.registros}
              />
            </>
          )}
        </div>

        <div className="tabela-detalhes">
          {data.responsaveisPelaComissao && data.responsaveisPelaComissao.total > 0 && (
            <>
              <h2 className="titulo-tabela">Responsáveis pela Comissão</h2>
              <DataTableDetail
                columns={columnsResponsaveisPelaComissao}
                data={data.responsaveisPelaComissao.registros}
              />
            </>
          )}
        </div>

        <div className="tabela-detalhes">  
          {data.itensVencedores.total > 0 && (
            <>
              <h2 className="titulo-tabela">Itens Vencedores</h2>
              <DataTableDetail
                columns={columnsItensVencedores}
                data={data.itensVencedores.registros}
              />
            </>
          )}
        </div>

        <div className="tabela-detalhes">
          {data.itensFracassadosOuDesertos.total > 0 && (
            <>
              <h2 className="titulo-tabela">Itens Fracassados ou Desertos</h2>
              <DataTableDetail
                columns={columnsItensFracassadosOuDesertos}
                data={data.itensFracassadosOuDesertos.registros}
              />
            </>
          )}
        </div>

        <div className="tabela-detalhes">
          {data.itensCanceladosESubstituidos.total > 0 && (
            <>
              <h2 className="titulo-tabela">Itens Cancelados e Substituídos</h2>
              <DataTableDetail
                columns={columnsItensCanceladosESubstituidos}
                data={data.itensCanceladosESubstituidos.registros}
              />
            </>
          )}
        </div>

        <div className="tabela-detalhes">
          {data.contratos.total > 0 && (
            <>
              <h2 className="titulo-tabela">Contratos</h2>
              <DataTableDetail
                columns={columnsContratos}
                data={data.contratos.registros}
              />
            </>
          )}
        </div>
        <div className="tabela-detalhes">
          {data.empenhos.total > 0 && (
            <>
              <h2 className="titulo-tabela">Empenhos</h2>
              <DataTableDetail
                columns={columnsEmpenhos}
                data={data.empenhos.registros}
              />
            </>
          )}
        </div>
        <div className="tabela-detalhes">
          {data.itensEmAberto.total > 0 && (
            <>
              <h2 className="titulo-tabela">Itens em Aberto</h2>
              <DataTableDetail
                columns={columnsItensEmAberto}
                data={data.itensEmAberto.registros}
              />
            </>
          )}
        </div>
      </div> 
       

      )} 
    </div>
  );
};

export default DispensasDetail;