import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom"; 
import { getContratos  } from "../../../services/contratosLicitacoes/contratos";
import DataTableComponent from "../../common/DataTable";
// import PageHeader from '../../common/PageHeader';
// import FilterSection from '../../common/FilterSection';
// import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import './contratos.css';
import '../../../assets/global.css';
import PageContent from "../../layout/pageContent";
import columnsContratos from "./columnsContratos";
import { config } from '../../../assets/config';

const Contratos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Atualiza o título da aba do navegador
    document.title = `Contratos e Aditivos - Portal Transparência - ${config.geral.nomeOrgao}`
    
    const fetchData = async () => {
      try {
        const result = await getContratos();
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

      <PageContent 
        title="Contratos e Aditivos"
        breadcrumb={[
          { label: 'Contratos e Aditivos' },
        ]}
        infoTextHref="/transparencia/contratos/declaracoes" // URL específica para esta página
      />
               
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar contratos: {error}</div>
      ) : (
        <DataTableComponent
          columns={columnsContratos}
          data={data}
        />
      )}
    </div>
  );
};

export default Contratos;
