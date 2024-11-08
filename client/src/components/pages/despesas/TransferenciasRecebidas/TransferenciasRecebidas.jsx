import React, { useEffect, useState } from "react";
import { getTransferenciasRecebidas } from "../../../../services/receitasDespesas/TransferenciasRecebidas";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
// import './Empenho.css';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsTransferenciasRecebidas = [
  {
    name: "Natureza da Receita",
    selector: (row) => row.receita,
    sortable: true,
    width: '24%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.receita}
      </div>
    )
  },
  { name: "Código da Natureza", selector: (row) => row.naturezaDaReceita, sortable: true, width: '15%' },
  { name: "Origem dos Recursos", selector: (row) => row.origemDoRecurso, sortable: true, width: '14%' },
  { name: "Fonte da Receita", selector: (row) => row.fonteDaReceita, sortable: true, width: '15%' },
  
  { 
    name: "Valor Recebido", 
    selector: (row) => row.valorRecebido ? row.valorRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
    sortable: true, 
    width: '11%' 
  },
  { name: "Data do Repasse", selector: (row) => row.dataDoRepasse, sortable: true, width: '12%' },
  {
    name: 'Detalhes',
    selector: row => row.chave.codigoDaReceita, 
    cell: row => {
      const id = row.chave.codigoDaReceita;
      return <ButtonTable path="/transferencias-voluntarias-recebidas" id={id} label="Ver Detalhes" />; // Usa o botão de detalhes
    },
    width: '10%', 
    excludeFromExport: true
  },
];


const TransferenciasRecebidas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Transferências Voluntárias Recebidas - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getTransferenciasRecebidas();

         // Ordena os dados pela dataDoRepasse em ordem decrescente
          const sortedData = result.registros.sort((a, b) => {
            // Convertendo as datas de dd/mm/yyyy para yyyy-mm-dd antes de comparar
            const dataA = a.dataDoRepasse.split('/').reverse().join('-');
            const dataB = b.dataDoRepasse.split('/').reverse().join('-');
            
            return new Date(dataB) - new Date(dataA);
          });

        setData(sortedData); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
    <PageHeader
        title="Transferências Voluntárias Recebidas"
        breadcrumb={[
          { label: 'Transferências Voluntárias Recebidas' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/?jsf=jet-data-table:filter_declaracao&tax=tipo-declaracao:133">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Transferencia: {error}</div>
      ) : (
        <DataTableComponent
          title="Transferências Voluntárias Recebidas"
          columns={columnsTransferenciasRecebidas}
          data={data}
        />
      )}

   
    </div>
  );
};

export default TransferenciasRecebidas;
