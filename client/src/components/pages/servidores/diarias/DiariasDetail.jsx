import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDiariasId } from "../../../../services/orgãosServidores/diarias";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const DiariasDetail = () => {
  const { id } = useParams();  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDiariasId(id);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `Diaria ${result.codigoDaViagem} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);  // Adiciona `id` como dependência do useEffect

  // Definição das colunas para Anulações de Liquidações
  const columnsAnulacoesDeLiquidacoes = [
    { name: 'Data', selector: row => row.data, sortable: true, width: '30%' },
    { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '30%' },
    { name: 'Motivo', selector: row => row.motivo, sortable: true, width: '40%' },
  ];

  // Definição das colunas para Ordens de Pagamento
  const columnsOrdensDePagamento = [
    { name: 'Número', selector: row => row.numero, sortable: true, width: '30%' },
    { name: 'Data de Pagamento', selector: row => row.dataPagamento, sortable: true, width: '40%' },
    { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '30%' },
  ];

  return (
    <div className="container">
      <PageHeader
        title={data ? `DETALHES: Diária ${data.codigoDaViagem}` : 'Detalhes'}
        breadcrumb={[
          { label: 'Diárias Pagas a Servidores', path: '/diarias' },
          { label: data ? `Diária ${data.codigoDaViagem}` : 'Detalhes' },
        ]}
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar detalhes: {error}</div>
      ) : (
      <div className="detalhes-geral">  
        <div className="detalhes">
          <span><p>Órgão:</p> {data.nomeDoOrgao}</span>
          <span><p>Matrícula:</p> {data.matriculaDoFuncionario}</span>
          <span><p>Funcionário:</p> {data.nomeDoFuncionario}</span>
          <span><p>Cargo do Funcionário:</p> {data.cargoDoFuncionario}</span>
          
          <span><p>Destino:</p> {data.destino}</span>
          <span><p>Dias Afastados:</p> {data.numeroDeDiarias}</span>
          <span><p>Valor da Diária:</p> {data.valorDaDiaria !== undefined ? data.valorDaDiaria.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}</span>
          <span><p>Valor da Devolução:</p> {data.valorDaDevolucao}</span>
          <span><p>Tipo de Devolução:</p> {data.tipoDeDevolucao}</span> 
          
          <span><p>Histórico da Devolução:</p> {data.historicoDaDevolucao}</span>
          <span><p>Processo:</p> {data.numeroDoProcesso}</span>
          <span><p>Empenho:</p> {data.numeroDoEmpenho}</span>
          <span><p>Código da Liquidação:</p> {data.codigoDaLiquidacao}</span>
          <span><p>Número da Liquidação:</p> {data.numeroDaLiquidacao}</span>
          <span><p>Portaria:</p> {data.portaria}</span>
          <span><p>Saída:</p> {data.dataDaSaida}</span>
          <span><p>Chegada:</p> {data.dataDaChegada}</span>
          <span><p>Número de Diárias:</p> {data.numeroDeDiarias}</span>
        
          <div className="full-width">
            <span><p>Motivo da Viagem:</p> {data.motivoDaViagem}</span>
          </div>         
        </div> 

        {/* Tabela de Anulações de Liquidações */}
        <div className="tabela-detalhes">
          {data.anulacoesDeLiquidacoes && data.anulacoesDeLiquidacoes.total > 0 && (
            <>
              <h2 className="titulo-tabela">Anulações de Liquidações</h2>
              <DataTableDetail
                columns={columnsAnulacoesDeLiquidacoes}
                data={data.anulacoesDeLiquidacoes.registros}
              />
            </>
          )}
        </div>
          
        {/* Tabela de Ordens de Pagamento */}
        <div className="tabela-detalhes">
          {data.ordensDePagamento && data.ordensDePagamento.total > 0 && (
            <>
              <h2 className="titulo-tabela">Ordens de Pagamento</h2>
              <DataTableDetail
                columns={columnsOrdensDePagamento}
                data={data.ordensDePagamento.registros}
              />
            </>
          )}
        </div>
        
      </div> 
       

      )} 
    </div>
  );
};

export default DiariasDetail;