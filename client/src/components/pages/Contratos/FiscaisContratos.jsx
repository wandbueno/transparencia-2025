import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFiscaisPaginados } from "../../../services/contratosLicitacoes/fiscaisContratos";
import DataTableComponent from "../../common/DataTable";
import LoadingSpinner from '../../common/LoadingSpinner';
import '../../../assets/global.css';
import PageContent from "../../layout/pageContent";
import { config } from '../../../assets/config';
import ButtonTable from '../../common/ButtonTable';
import InfoText from "../../common/InfoText";

const FiscaisContratos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Fiscais de Contratos - Portal Transparência - ${config.geral.nomeOrgao}`;
    
    // Filtro simplificado
    const filtro = {
      pagina: 1,
      tamanhoDaPagina: 2500
    };

    const fetchData = async () => {
      try {
        const result = await getFiscaisPaginados(filtro);
        setData(result.registros);
      } catch (err) {
        console.error('Erro ao buscar fiscais de contratos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      name: "Nome do Fiscal",
      selector: (row) => row.nomeDoFiscal,
      sortable: true, width: '90%'
    },
    {
      name: 'Detalhes',
      selector: row => row.codigoDoFiscal,
      cell: row => {
        const id = row.codigoDoFiscal;
        return <ButtonTable path={`/lista-de-fiscal-de-contrato/${id}`}
        label="Ver Detalhes" />;
      },
      excludeFromExport: true,
    },
    // Adicione outras colunas conforme necessário
  ];

  return (
    <div className="container">
      <PageContent 
        title="Fiscais de Contratos"
        breadcrumb={[
          { label: 'Fiscais de Contratos' },
        ]}
        infoTextHref="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/teste" 
      />
      
     
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar fiscais de contratos: {error}</div>
      ) : (
        <DataTableComponent
          columns={columns}
          data={data}
        />
      )}
    </div>
  );
};

export default FiscaisContratos;