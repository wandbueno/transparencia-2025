import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContratosById } from "../../../services/contratosLicitacoes/contratos";
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/LoadingSpinner';
import '../../../assets/global.css';
import './Contratos.css';
import DataTableDetail from "../../common/DataTableDetail";

const ContratosDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getContratosById(id);  
        setData(result); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);  

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

  return (
    <div className="container">
      <PageHeader
        title={data ? `DETALHES: CONTRATO Nº ${data.numero}` : 'Detalhes'}
        breadcrumb={[
          { label: 'Página Inicial', path: '/' },
          { label: 'Transparência', path: '/transparencia' },
          { label: 'Contratos', path: '/Contratos' },
          { label: data ? `CONTRATO Nº ${data.numero}` : 'Detalhes' },
        ]}
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar detalhes: {error}</div>
      ) : (
      <div className="detalhes-geral">  
        <div className="detalhes-contrato">
          <div>
            <p><span>Número do Contrato:</span> {data.numero}</p>
            <p><span>Nome do(a) contratado(a):</span> {data.nomeDoFornecedor}</p>
            <p><span>CPF/CNPJ do(a) contratado(a):</span> {data.cpfOuCnpjDoFornecedor}</p>
            <p><span>Órgão:</span> {data.nomeDoOrgao}</p>
          </div>
          <div>
            <p><span>Valor Original:</span> {data.valor ? data.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}</p> 
            <p><span>Valor Aditado:</span> {data.valor ? data.valorAditado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}</p> 
            <p><span>Valor Executado:</span> {data.valor ? data.valorExecutado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}</p> 
            <p><span>Valor Total:</span> {data.valor ? data.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}</p>  
          </div> 
          <div>
            <p><span>Saldo do Contrato:</span> {data.saldo}</p>
            <p><span>Data de Publicação:</span> {data.dataDaPublicacao}</p>  
            <p><span>Data de Início de Vigência:</span> {data.data}</p>
            <p><span>Data Fim de Vigência:</span> {data.vigencia}</p>
          </div> 
          <div>
            <p><span>Período:</span> {data.periodo}</p>
            <p><span>Modalidade</span> {data.modalidade}</p>
            <p><span>Licitação/Ano:</span> {data.numeroEAnoDaLicitacao}</p>
            <p><span>Processo de aquisição ou Contratação:</span> {data.numeroDoProcesso}</p>  
          </div> 
          <div>
            <p><span>Fiscal do Contrato:</span> {data.nomeDoFiscalDoContrato}</p>
            <p><span>Local da execução ou entrega no contrato:</span> {data.localDaExecucaoOuEntrega}</p>
            <p><span>Situação:</span> {data.situacao}</p>
            <p><span>Finalidade:</span> {data.finalidade}</p>
          </div>
          <div>
            <p><span>Objeto:</span> {data.objeto}</p>
          </div> 

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
       

      )} 
    </div>
  );
};

export default ContratosDetail;
