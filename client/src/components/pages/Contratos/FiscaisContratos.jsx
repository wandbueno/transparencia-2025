import React, { useEffect, useState } from "react";
import { getFiscaisContratos } from "../../../services/contratosLicitacoes/fiscaisContratos";
import DataTableComponent from "../../common/DataTable";
import LoadingSpinner from '../../common/LoadingSpinner';

import '../../../assets/global.css';
import PageContent from "../../layout/pageContent";
import { config } from '../../../assets/config';

const FiscaisContratos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = `Fiscais de Contratos - Portal Transparência - ${config.geral.nomeOrgao}`;

    const fetchData = async () => {
      try {
        const result = await getFiscaisContratos();
        setData(result.registros);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <PageContent 
        title="Fiscais de Contratos"
        breadcrumb={[
          { label: 'Fiscais de Contratos' },
        ]}
        infoTextHref="/transparencia/fiscais/declaracoes"
      />
               
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar fiscais de contratos: {error}</div>
      ) : (
        <DataTableComponent
          columns={columnsFiscaisContratos}
          data={data}
        />
      )}
    </div>
  );
};

export default FiscaisContratos;