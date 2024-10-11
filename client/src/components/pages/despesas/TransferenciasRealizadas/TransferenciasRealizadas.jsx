import React, { useEffect, useState } from "react";
import { getTransferenciasRealizadas } from "../../../../services/receitasDespesas/TransferenciasRealizadas";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
// import './Empenho.css';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsTransferenciasRealizadas = [
  { name: "Beneficiário", selector: (row) => row.beneficiario, sortable: true, width: '36%' },
  { name: "CPF/CNPJ", selector: (row) => row.cpfCnpjDoBeneficiario, sortable: true, width: '17%' },
  // {
  //   name: "Órgão",
  //   selector: (row) => row.nomeDoOrgao,
  //   sortable: true,
  //   width: '15%',
  //   cell: (row) => (
  //     <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
  //       {row.nomeDoOrgao}
  //     </div>
  //   )
  // },
  { 
    name: "Valor Concedido", 
    selector: (row) => row.valorConcedido ? row.valorConcedido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
    sortable: true, 
    width: '17%' 
  },
  { name: "Data do Repasse", selector: (row) => row.dataDoRepasse, sortable: true, width: '17%' },
  {
    name: 'Detalhes',
    selector: row => row.codigoDoEmpenho, 
    cell: row => {
      const id = row.codigoDoEmpenho;
      return <ButtonTable path="/transferencias-voluntarias-realizadas" id={id} label="Ver Detalhes" />; // Usa o botão de detalhes
    },
    width: '13%', 
    excludeFromExport: true
  },
];


const TransferenciasRealizadas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Transferências Voluntárias Realizadas - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getTransferenciasRealizadas();
        setData(result.registros); 
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
        title="Transferências Voluntárias Realizadas"
        breadcrumb={[
          { label: 'Transferências Voluntárias Realizadas' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Despesas: {error}</div>
      ) : (
        <DataTableComponent
          title="Transferências Voluntárias Realizadas"
          columns={columnsTransferenciasRealizadas}
          data={data}
        />
      )}

   
    </div>
  );
};

export default TransferenciasRealizadas;
