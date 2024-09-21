import React, { useEffect, useState } from "react";
import { getLicitacoes  } from "../../../services/contratosLicitacoes/licitacoes";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import './LicitacoesTable.css';
import '../../../assets/global.css';
import columnsLicitacao from "./columnsLicitacao";

import { config } from '../../../assets/config';

const LicitacoesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Atualiza o título da aba do navegador
    document.title = `Procedimentos Licitatórios - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getLicitacoes();
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
        title="Procedimentos Licitatórios"
        breadcrumb={[
          { label: 'Página Inicial', path: '/' },
          { label: 'Transparência', path: '/transparencia' },
          { label: 'Procedimentos Licitatórios' },
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
          title="Licitações"
          columns={columnsLicitacao}
          data={data}
        />
      )}
    </div>
  );
};

export default LicitacoesTable;
