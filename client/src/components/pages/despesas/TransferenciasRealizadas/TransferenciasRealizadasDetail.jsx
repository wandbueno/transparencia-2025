import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getTransferenciasRealizadasId } from "../../../../services/receitasDespesas/TransferenciasRealizadas";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const TransferenciasRealizadasDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTransferenciasRealizadasId(id);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `${result.beneficiario} - Portal Transparência - ${config.geral.nomeOrgao}`;
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
  const pageTitle = data ? `Detalhes: ${data.beneficiario}` : 'Detalhes';

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Transferências Voluntárias Realizadas', path: '/transferencias-voluntarias-realizadas' },
          { label: data ? `${data.beneficiario}` : 'Detalhes' },
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
          <span><p>Beneficiário:</p> {data.beneficiario}</span>
          <span><p>CPF/CNPJ::</p> {data.cpfCnpjDoBeneficiario}</span>
          <span><p>Valor Concedido:</p> {data.valorConcedido !== undefined ? data.valorConcedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Data do Repasse::</p> {data.dataDoRepasse}</span>
          
          <div className="full-width">
            <span><p>Objeto:</p> {data.objeto}</span>
          </div>          
        </div>      
        
      </div>        

      )} 
    </div>
  );
};

export default TransferenciasRealizadasDetail;