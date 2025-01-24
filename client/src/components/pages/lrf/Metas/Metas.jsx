import React, { useEffect, useState } from "react";
import { getMetaDadosMetas, getRelatorioMetas } from "../../../../services/lrf/metasRiscos";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSectionLRF from "../../../common/FilterLRF/FilterSectionLRF";
import LoadingSpinner from '../../../common/LoadingSpinner';
import Toast from '../../../common/Toast';
import { config } from '../../../../assets/config';

const Metas = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [parametros, setParametros] = useState({
    ano: new Date().getFullYear(),
    mes: 1,
    extensao: 'pdf',
    orgao: 3,
    tipoDoRelatorio: 3
  });

  const extensoes = [
    { value: 'pdf', label: 'PDF' },
    { value: 'xlsx', label: 'Excel' },
    { value: 'docx', label: 'Word' },
    { value: 'odt', label: 'ODT' },
    { value: 'html', label: 'HTML' }
  ];

  const columnsMetas = [
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
    document.title = `Metas e Riscos Fiscais - Portal Transparência - ${config.geral.nomeOrgao}`;
    carregarMetaDados();
  }, []);

  const carregarMetaDados = async () => {
    try {
      setLoading(true);
      const dados = await getMetaDadosMetas();
      if (Array.isArray(dados)) {
        const relatoriosComAcao = dados.map(relatorio => ({
          ...relatorio,
          onDownload: baixarRelatorio
        }));
        setRelatorios(relatoriosComAcao);
      } else {
        setRelatorios([]);
        setToast({
          type: 'error',
          message: 'Formato de dados inválido'
        });
      }
    } catch (err) {
      console.error('Erro ao carregar metadados:', err);
      setToast({
        type: 'error',
        message: `Erro ao carregar dados: ${err.message}`
      });
      setRelatorios([]);
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
      const response = await getRelatorioMetas(tipo, parametros);
      
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
    try {
      setLoading(true);
      setParametros(prev => ({
        ...prev,
        ...newFilters
      }));

      const searchParams = new URLSearchParams({
        ...newFilters,
        tipoDoRelatorio: 3
      }).toString();
      
      window.history.pushState(
        null, 
        '', 
        `${window.location.pathname}?${searchParams}`
      );

      await carregarMetaDados();
      
    } catch (err) {
      console.error('Erro ao atualizar filtros:', err);
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
        title="Metas e Riscos Fiscais"
        breadcrumb={[
          { label: 'Metas e Riscos Fiscais' },
        ]}
      />

      <FilterSectionLRF 
        onFilterChange={handleFilterChange}
        initialValues={parametros}
        extensoes={extensoes}
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
          title="Relatórios de Metas e Riscos Fiscais"
          columns={columnsMetas}
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

export default Metas;