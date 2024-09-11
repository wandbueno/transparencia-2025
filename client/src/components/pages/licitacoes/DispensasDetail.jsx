import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDispensasById } from "../../../services/dispensas";
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/LoadingSpinner'
import DataTableDetail from '../../common/DataTableDetail';
import './LicitacaoDetail.css';
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

  return (
    <div className="container">
      <PageHeader
        title={data ? `DETALHES: ${data.modalidade} Nº ${data.numeroAno}` : 'Detalhes'}
        breadcrumb={[
          { label: 'Página Inicial', path: '/' },
          { label: 'Transparência', path: '/transparencia' },
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
          <div>
            <p><span>Unidade Gestora:</span> {data.orgao}</p>
            <p><span>Modalidade:</span> {data.modalidade}</p>
            <p><span>Nº/Ano:</span> {data.numeroAno}</p>
            <p><span>Número do Protocolo:</span> {data.numeroDoProtocolo}</p>
          </div>
          <div>
            <p><span>Data de Publicação:</span> {data.dataDePublicacao}</p>
            <p><span>Data de Abertura:</span> {data.dataDeAbertura}</p>
            <p><span>Data de Julgamento:</span> {data.dataDeJulgamento}</p>
            <p><span>Data de Homologação:</span> {data.dataDeHomologacao}</p>  
          </div> 
          <div>
            <p><span>Situação:</span> {data.situacao}</p>
            <p><span>Valor Total Vencedor:</span> {data.valorVencedorTotal ? data.valorVencedorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}</p> 
            <p><span>Atendimento ao covid-19:</span> {data.despesaCovid}</p>
            <p><span>Finalidade:</span> {data.naturezaDoObjeto}</p>
          </div>
          <div>
            <p><span>Natureza do procedimento:</span> {data.naturezaDoProcedimento}</p>
            <p><span>Número de Envio ao PNCP:</span> {data.numeroDeEnvioAoPncp}</p>
            <p><span>Data de Envio ao PNCP:</span> {data.dataDeEnvioAoPncp}</p>
            <p>
              <span>Link Comprovante:</span> 
              {data.urlDoComprovanteDoEnvioAoPncp ? (
                <a href={data.urlDoComprovanteDoEnvioAoPncp} target="_blank" rel="noopener noreferrer">
                  Acessar
                </a>
              ) : (
                ""
              )}
            </p>
          </div>
          <div>
            <p><span>Fundamento Legal:</span> {data.descricaoDoFundamentoLegalDispensa}</p>
            <p><span>Objeto:</span> {data.historico}</p>
          </div> 

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