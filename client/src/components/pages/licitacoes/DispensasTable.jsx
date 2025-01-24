import React, { useEffect, useState } from "react";
import { getDispensas  } from "../../../services/contratosLicitacoes/dispensas";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import './LicitacoesTable.css';
import '../../../assets/global.css';
import columnsDispensa from "./columnsDispensa";
import { config } from "../../../assets/config";


const DispensasTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Atualiza o título da aba do navegador
    document.title = `Dispensas e Inexigibilidades - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getDispensas();
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
        title="Dispensas e Inexigibilidades"
        breadcrumb={[
          { label: 'Dispensas e Inexigibilidades' },
        ]}
      />
      
      <FilterSection  />

      <InfoText href="/transparencia/declaracoes/">
        <p>Veja Declarações Negativas e Demais Documentos Clicando Aqui</p>
      </InfoText>
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar licitações: {error}</div>
      ) : (
        <DataTableComponent
          title="Dispensas e Inexigibilidades"
          columns={columnsDispensa}
          data={data}
        />
      )}
    </div>
  );
};

export default DispensasTable;
