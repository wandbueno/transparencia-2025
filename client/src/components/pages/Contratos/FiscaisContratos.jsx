import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Fiscais de Contratos - Portal Transparência - ${config.geral.nomeOrgao}`
    
    const fetchData = async () => {
      try {
        const result = await getFiscaisContratos();
        setData(result.registros); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      header: 'Nome do Fiscal',
      accessorKey: 'nomeFiscal',
    },
    {
      header: 'CPF/CNPJ',
      accessorKey: 'cpfCnpj',
    },
    {
      header: 'Cargo',
      accessorKey: 'cargo',
    },
    {
      header: 'Ações',
      cell: ({ row }) => (
        <button
          onClick={() => navigate(`/fiscais-contratos/${row.original.codigo}/contratos`)}
          className="btn-details"
        >
          Ver Contratos
        </button>
      ),
    }
  ];

  return (
    <div className="container">
      <PageContent 
        title="Fiscais de Contratos"
        breadcrumb={[
          { label: 'Fiscais de Contratos' },
        ]}
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