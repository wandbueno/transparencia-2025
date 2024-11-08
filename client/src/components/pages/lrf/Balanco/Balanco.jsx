import React, { useEffect, useState } from "react";
import { getMetaDadosBalanco, getRelatorioBalanco } from "../../../../services/lrf/balancoAnual";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSectionLRF from "../../../common/FilterLRF/FilterSectionLRF";
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';

const BalancoAnual = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelatorio, setLoadingRelatorio] = useState({});
  const [errorRelatorio, setErrorRelatorio] = useState({});
  const [error, setError] = useState(null);
  const [parametros, setParametros] = useState({
    ano: new Date().getFullYear() - 1,
    mes: 12,
    extensao: 'pdf',
    orgao: 1,
    tipoDoRelatorio: 5
  });

  const columnsBalanco = [
    { 
      name: "Relatórios", 
      selector: (row) => row.title,
      sortable: true, 
      width: '80%'
    },
    { 
      name: "Visualizar",
      selector: (row) => row.path,
      cell: (row) => {
        if (loadingRelatorio[row.path]) {
          return <span>Carregando...</span>;
        }
        if (errorRelatorio[row.path]) {
          return <span className="text-danger">Relatório não publicado</span>;
        }
        return (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => baixarRelatorio(row.path.slice(1), row.title, row.path)}
          >
            Abrir
          </button>
        );
      },
      width: '20%',
      center: true
    }
  ];

  useEffect(() => {
    document.title = `Balanço Anual - Portal Transparência - ${config.geral.nomeOrgao}`;
    carregarMetaDados();
  }, []);

  const carregarMetaDados = async () => {
    try {
      setLoading(true);
      const dados = await getMetaDadosBalanco();
      const relatoriosComAcao = dados.map(relatorio => ({
        ...relatorio,
        onDownload: baixarRelatorio
      }));
      setRelatorios(relatoriosComAcao);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const baixarRelatorio = async (tipo, titulo, path) => {
    try {
      setLoadingRelatorio(prev => ({ ...prev, [path]: true }));
      setErrorRelatorio(prev => ({ ...prev, [path]: null }));
      
      const response = await getRelatorioBalanco(tipo, parametros);
      
      if (response.data instanceof Blob && response.data.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = async () => {
          const errorData = JSON.parse(reader.result);
          setErrorRelatorio(prev => ({ 
            ...prev, 
            [path]: errorData.error || 'Relatório não publicado'
          }));
        };
        reader.readAsText(response.data);
        return;
      }
      
      const blob = new Blob([response.data], { 
        type: parametros.extensao === 'pdf' 
          ? 'application/pdf'
          : parametros.extensao === 'xlsx' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : parametros.extensao === 'docx'
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/octet-stream'
      });
      
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (err) {
      setErrorRelatorio(prev => ({ 
        ...prev, 
        [path]: err.response?.data?.error || 'Erro ao abrir relatório'
      }));
    } finally {
      setLoadingRelatorio(prev => ({ ...prev, [path]: false }));
    }
  };

  const handleFilterChange = async (newFilters) => {
    setLoading(true);
    try {
      // Atualiza os parâmetros imediatamente
      setParametros(prev => ({
        ...prev,
        ...newFilters
      }));

      // Atualiza a URL
      const searchParams = new URLSearchParams({
        ...newFilters,
        tipoDoRelatorio: 5
      }).toString();
      
      window.history.pushState(
        null, 
        '', 
        `${window.location.pathname}?${searchParams}`
      );

      // Recarrega os dados
      await carregarMetaDados();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <PageHeader
        title="Balanço Anual"
        breadcrumb={[
          { label: 'Balanço Anual' },
        ]}
      />

      <FilterSectionLRF 
        onFilterChange={handleFilterChange}
        initialValues={parametros}
        hideMonth={true}
      />
        
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <DataTableComponent
          title="Relatórios de Balanço Anual"
          columns={columnsBalanco}
          data={relatorios}
          pagination
          responsive
          striped
          highlightOnHover
        />
      )}
    </div>
  );
};

export default BalancoAnual;