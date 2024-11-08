import React, { useEffect, useState } from "react";
import { getMetaDadosBalanco, getRelatorioBalanco } from "../../../../services/lrf/balancoAnual";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSectionLRF from "../../../common/FilterLRF/FilterSectionLRF";
import LoadingSpinner from '../../../common/LoadingSpinner';
import Toast from '../../../common/Toast';
import { config } from '../../../../assets/config';

const BalancoAnual = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
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
      cell: (row) => (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => baixarRelatorio(row.path.slice(1), row.title, row.path)}
        >
          Abrir
        </button>
      ),
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
    } catch (err) {
      setToast({
        type: 'error',
        message: `Erro ao carregar dados: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const baixarRelatorio = async (tipo, titulo, path) => {
    setToast({
      type: 'loading',
      message: 'Carregando relatório...'
    });

    try {
      const response = await getRelatorioBalanco(tipo, parametros);
      
      if (response.data instanceof Blob && response.data.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = async () => {
          const errorData = JSON.parse(reader.result);
          setToast({
            type: 'error',
            message: errorData.error || 'Relatório não publicado'
          });
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

      setToast({
        type: 'success',
        message: 'Relatório aberto com sucesso!'
      });
      
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.error || 'Erro ao abrir relatório'
      });
    }
  };

  const handleFilterChange = async (newFilters) => {
    setLoading(true);
    try {
      setParametros(prev => ({
        ...prev,
        ...newFilters
      }));

      const searchParams = new URLSearchParams({
        ...newFilters,
        tipoDoRelatorio: 5
      }).toString();
      
      window.history.pushState(
        null, 
        '', 
        `${window.location.pathname}?${searchParams}`
      );

      await carregarMetaDados();
      
    } catch (err) {
      setToast({
        type: 'error',
        message: `Erro ao atualizar filtros: ${err.message}`
      });
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

      {toast && (
        <Toast 
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
        
      {loading ? (
        <LoadingSpinner />
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