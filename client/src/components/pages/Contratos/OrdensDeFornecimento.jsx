import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { postOrdensDeFornecimentoPaginadas } from "../../../services/contratosLicitacoes/ordensDeFornecimento";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import MultiComboSelect from '../../common/MultiComboSelect/MultiComboSelect';
import LoadingSpinner from '../../common/LoadingSpinner';
import Toast from '../../common/Toast';
import ButtonTable from "../../common/ButtonTable";
import { config } from '../../../assets/config';
import { FILTER_TYPES } from '../../common/MultiComboSelect/filterTypes';

const OrdensDeFornecimento = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const columns = [
    {
      name: "Compra",
      selector: (row) => row.codigoDaCompra,
      sortable: true, 
      width: '7%'
    },
    {
      name: "Data",
      selector: (row) => row.data,
      sortable: true, 
      width: '10%'
    },
    {
      name: "Modalidade",
      selector: (row) => row.modalidade,
      sortable: true, 
      width: '13%'
    },
    {
      name: "Licitação",
      selector: (row) => row.licitacao,
      sortable: true, 
      width: '10%'
    },
    {
      name: "Fornecedor",
      selector: (row) => row.fornecedor,
      sortable: true, 
      width: '30%'
    },
    { 
      name: "Valor Final", 
      selector: (row) => row.valorTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
      sortable: true, 
      width: '10%' 
    },    
    {
      name: "Situação",
      selector: (row) => row.situacao,
      sortable: true, 
      width: '10%'
    },
    {
      name: "Detalhes",
      selector: row => row.codigoDaCompra,
      cell: row => {
        const id = row.codigoDaCompra;
        return <ButtonTable path={`/ordem-de-fornecimento/${id}`} label="Ver Detalhes" />;
      },
      excludeFromExport: true, 
      width: '10%'
    }
  ];

  // Recupera os filtros iniciais da URL
  const getInitialFilters = () => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value;
    }
    return filters;
  };

  useEffect(() => {
    document.title = `Ordens de Fornecimentos - Portal Transparência - ${config.geral.nomeOrgao}`;
    const initialFilters = getInitialFilters();
    if (Object.keys(initialFilters).length > 0) {
      fetchData(initialFilters);
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      const result = await postOrdensDeFornecimentoPaginadas(filters);
      setData(result.registros);
      
      if (Object.keys(filters).length > 0) {
        setToast({
          type: 'success',
          message: 'Filtros aplicados com sucesso!'
        });
      }
    } catch (err) {
      console.error('Erro ao buscar ordens de fornecimento:', err);
      setToast({
        type: 'error',
        message: 'Erro ao buscar dados: ' + err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    // Atualiza a URL com os novos filtros
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);

    // Busca os dados com os novos filtros
    fetchData(filters);
  };

  return (
    <div className="container">
      <PageHeader
        title="Ordens de Fornecimentos"
        breadcrumb={[
          { label: 'Ordens de Fornecimentos' },
        ]}
      />

      <MultiComboSelect
        availableFilters={[
          FILTER_TYPES.MODALIDADE,
        ]}
        textFields={[
          { id: 'codigoDaCompra', label: 'Código da Compra', type: 'text' },
          { id: 'cpfCnpj', label: 'CPF/CNPJ', type: 'text' },
          { id: 'fornecedor', label: 'Fornecedor', type: 'text' },
          { id: 'dataInicial', label: 'Data Inicial', type: 'date' },
          { id: 'dataFinal', label: 'Data Final', type: 'date' }
        ]}
        customWidths={{
          ano: '25%',
          mes: '25%',
          orgao: '25%',
          modalidade: '25%',
          situacaoDoContrato: '25%',
          codigoDaCompra: '33%',
          cpfCnpj: '33%',
          fornecedor: '33%',
          dataInicial: '50%',
          dataFinal: '50%'
        }}
        customLabels={{
          situacaoDoContrato: 'Situação'
        }}
        onFilterChange={handleFilterChange}
        initialValues={getInitialFilters()}
      />
      
      {toast && (
        <Toast 
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
        
      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTableComponent
          title="Ordens de Fornecimentos"
          columns={columns}
          data={data}
          pagination
          responsive
          striped
          highlightOnHover
        />
      )}
    </div>
  );
};

export default OrdensDeFornecimento;
