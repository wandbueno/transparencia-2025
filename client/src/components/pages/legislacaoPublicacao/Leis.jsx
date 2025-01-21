import React, { useEffect, useState } from "react";
import { getLegislacao } from "../../../services/legislacaoPublicacoes/legislacao";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
// import './Empenho.css';
import ButtonTable from "../../common/ButtonTable";
import { config } from '../../../assets/config';

const columnsLeis = [
  
  { name: "Tipo", selector: (row) => row.tipoDoDocumento, sortable: true, width: '5%' },
  { name: "Número", selector: (row) => row.numeroDoDocumento, sortable: true, width: '8%' },
  { name: "Data", selector: (row) => row.dataDaPublicacao, sortable: true, width: '10%' },
  {
    name: "Descrição",
    selector: (row) => row.descricao,
    sortable: true,
    width: '66%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.descricao}
      </div>
    )
  },
  {
    name: 'Detalhes',
    selector: row => row.codigoDoDocumento, 
    cell: row => {
      const id = row.codigoDoDocumento;
      return <ButtonTable path="/leis" id={id} label="Ver Detalhes" />; // Usa o botão de detalhes
    },
    width: '11%', 
    excludeFromExport: true
  },
];


const Leis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Pagamentos - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getLegislacao();
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
        title="Leis Municípais"
        breadcrumb={[
          { label: 'Leis Municípais' },
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
          title="Leis Municípais"
          columns={columnsLeis}
          data={data}
        />
      )}

   
    </div>
  );
};

export default Leis;
