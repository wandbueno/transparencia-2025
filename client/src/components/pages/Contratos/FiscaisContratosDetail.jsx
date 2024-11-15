import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getFiscalContratosById, getContratosByFiscal } from "../../../services/contratosLicitacoes/fiscaisContratos"; 
import '../PagesDetail.css';
import '../../../assets/global.css';
import { config } from "../../../assets/config";
import PageHeader from "../../common/PageHeader";
import LoadingSpinner from "../../common/LoadingSpinner";
import DataTable from "../../common/DataTable";
import ButtonTable from "../../common/ButtonTable";

const FiscaisContratosDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente
  const [contratos, setContratos] = useState(null); // Estado para os contratos do fiscal

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca detalhes do fiscal de contrato
        const result = await getFiscalContratosById(id);  
        setData(result);

        // Busca contratos do fiscal
        const contratosDoFiscal = await getContratosByFiscal(result.codigoDoFiscal);
        setContratos(contratosDoFiscal); // Armazene os contratos no estado

        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Fiscal de Contrato ${result.nomeDoFiscal} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
  const pageTitle = data ? `Detalhes: Fiscal de Contrato ${data.nomeDoFiscal}` : 'Detalhes';

  // Função para truncar texto
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'; // Adiciona reticências se o texto for muito longo
  }
  return text;
};

  // Definição das colunas para o DataTable dos Contratos
  const columnsContratos = [
    { name: 'Número', selector: row => row.numeroDoContrato, sortable: true, width: '7%' },
    { name: 'Fornecedor', selector: row => row.nomeDoFornecedor, sortable: true, width: '15%' },
    { name: 'Órgão', selector: row => truncateText(row.nomeDoOrgao, 25), sortable: true, width: '16%' },
    { name: 'Data', selector: row => row.data, sortable: true, width: '7%' },
    { name: 'Vigência', selector: row => row.vigencia, sortable: true, width: '7%' },
    { name: 'Situação', selector: row => row.situacao, sortable: true, width: '8%' },
    { name: 'Objeto', selector: row => truncateText(row.objeto, 40), sortable: true, width: '25%' },
    { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '10%' },
    {
      name: 'Abrir',
      selector: row => row.codigo,
      cell: row => {
        const id = row.codigo
        return <ButtonTable path="/contratos" id={id} label="Abrir" /> // Passa a rota e o ID
      },
      width: '5%',
      excludeFromExport: true
    }

  ];

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Fiscais de Contratos', path: '/lista-de-fiscal-de-contrato' },
          { label: data ? `Fiscal de Contrato Nº ${data.nomeDoFiscal}` : 'Detalhes' },
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
          <span><p>Nome do Fiscal:</p> {data.nomeDoFiscal}</span>
        </div> 
            
        <div className="tabela-detalhes" ref={tableRef}> 
          {/* Tabela de Contratos do Fiscal de Contrato */}            
          {contratos && contratos.total > 0 && (
            <>
              <h2 className="titulo-tabela">Contratos Relacionados ao Fiscal</h2>
              <DataTable
                columns={columnsContratos}
                data={contratos.registros}
              />
            </>
          )}
        </div>
      </div> 
      )} 
    </div>
  );
};

export default FiscaisContratosDetail; 