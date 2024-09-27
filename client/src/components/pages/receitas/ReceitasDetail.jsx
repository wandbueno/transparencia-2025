import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getReceitasId } from "../../../services/receitasDespesas/receitas";
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/LoadingSpinner'
import DataTableDetail from '../../common/DataTableDetail';
import '../PagesDetail.css';
import '../../../assets/global.css';
import { config } from "../../../assets/config";
import ExportDetailToPDF from "../../common/ExportDetailToPDF";

const ReceitasDetail = () => {
  const { id } = useParams();  
  const [searchParams] = useSearchParams(); // Para pegar os parâmetros ano, mes, e codigoDoOrgao
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo a ser exportado

  // Definição das colunas para o DataTable de Movimentos
  const columnsMovimentos = [
    { name: 'Data', selector: row => row.data, sortable: true, width: '50%' },
    { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '50%' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ano = searchParams.get('ano');
        const mes = searchParams.get('mes');
        const codigoDoOrgao = searchParams.get('codigoDoOrgao');

        if (!ano || !mes || !codigoDoOrgao) {
          setError('Parâmetros de ano, mês e código do órgão estão ausentes.');
          setLoading(false);
          return;
        }

        const result = await getReceitasId(id, ano, mes, codigoDoOrgao);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Receita Nº ${result.receita} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, searchParams]);  // Adiciona `id` e `searchParams` como dependências do useEffect

  return (
    <div className="container">
      <PageHeader
        title={data ? `DETALHES: Receita - ${data.receita}` : 'Detalhes'}
        breadcrumb={[
          { label: 'Receitas', path: '/receitas' },
          { label: data ? `Receita - ${data.receita}` : 'Detalhes' },
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
            <span><p>Órgão/Unidade Gestora:</p> {data.orgaoUnidadeGestora}</span>
            <span><p>Mês/Ano:</p> {data.mesAno}</span>
            <span><p>Receita:</p> {data.receita}</span>
            <span><p>Fonte da Receita:</p> {data.fonteDaReceita}</span>
            
            <span><p>Origem do Recurso:</p> {data.origemDoRecurso}</span>
            <span><p>Natureza da Receita:</p> {data.naturezaDaReceita}</span>
            <span><p>Valor Orçado (Previsão):</p> {data.valorOrcado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span><p>Valor Arrecadado (Mês):</p> {data.arrecadacao?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span><p>Valor Anulado:</p> {data.valorAnulado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span><p>Valor Acumulado (Anual):</p> {data.valorAcumulado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span><p>Tipo de Conta:</p> {data.tipoDeConta}</span>
          </div>
 
            {/* Tabela de Anulações de Liquidações */}
            <div className="tabela-detalhes">
              {data.movimentos && data.movimentos.total > 0 && (
                <>
                  <h2 className="titulo-tabela">Detalhamento (Movimentos)</h2>
                  <DataTableDetail
                    columns={columnsMovimentos}
                    data={data.movimentos.registros}
                  />
                </>
              )}
            </div>

        </div>
      )}
    </div>
  );
  
};

export default ReceitasDetail;
