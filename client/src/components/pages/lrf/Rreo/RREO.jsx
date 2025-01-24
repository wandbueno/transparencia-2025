import React, { useEffect, useState } from "react";
import { 
  getMetaDadosRREO, 
  getRelatorioRREO,
  getAnosDisponiveis,
  getUltimoBimestrePublicado,
  getUltimoAnoPublicado,
  getBimestresDisponiveis
} from "../../../../services/lrf/rreo";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSectionLRF from "../../../common/FilterLRF/FilterSectionLRF";
import LoadingSpinner from '../../../common/LoadingSpinner';
import Toast from '../../../common/Toast';
import { config } from '../../../../assets/config';

const columnsRREO = [
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
        onClick={() => row.onDownload(row.path.slice(1), row.title, row.path)}
      >
        Abrir
      </button>
    ),
    width: '20%',
    center: true
  }
];

const RREO = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [parametros, setParametros] = useState({
    ano: new Date().getFullYear(),
    bimestre: Math.ceil((new Date().getMonth() + 1) / 2),
    extensao: 'pdf',
    orgao: 1,
    tipoDoRelatorio: 1
  });

  useEffect(() => {
    document.title = `Relatório Resumido da Execução Orçamentária - RREO - Portal Transparência - ${config.geral.nomeOrgao}`;
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      setLoading(true);
      await carregarMetaDados();

      const anoDisponivel = await getUltimoAnoPublicado();
      const ultimoBimestre = await getUltimoBimestrePublicado(anoDisponivel);
      
      setParametros(prev => ({
        ...prev,
        ano: anoDisponivel,
        bimestre: ultimoBimestre
      }));
      
    } catch (err) {
      setToast({
        type: 'error',
        message: `Erro ao carregar dados iniciais: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const carregarMetaDados = async () => {
    try {
      setLoading(true);
      const dados = await getMetaDadosRREO();
      const relatoriosComAcao = dados.map(relatorio => ({
        ...relatorio,
        onDownload: baixarRelatorio
      }));
      setRelatorios(relatoriosComAcao);
    } catch (err) {
      setToast({
        type: 'error',
        message: `Erro ao carregar metadados: ${err.message}`
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
      const response = await getRelatorioRREO(tipo, parametros);
      
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
        tipoDoRelatorio: 1
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
        title="Relatório Resumido da Execução Orçamentária - RREO"
        breadcrumb={[
          { label: 'Relatório Resumido da Execução Orçamentária - RREO' },
        ]}
      />

      <FilterSectionLRF 
        onFilterChange={handleFilterChange}
        initialValues={parametros}
        useBimestre={true}
        bimestresDisponiveis={getBimestresDisponiveis()}
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
          title="Relatório Resumido da Execução Orçamentária - RREO"
          columns={columnsRREO}
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

export default RREO;