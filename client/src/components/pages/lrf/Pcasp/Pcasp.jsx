import React, { useEffect, useState } from "react";
import { 
  getMetaDadosPcasp, 
  getRelatorioPcasp,
  getAnosDisponiveis,
  getUltimoMesPublicado,
  getUltimoAnoPublicado
} from "../../../../services/lrf/pcasp";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSectionLRF from "../../../common/FilterLRF/FilterSectionLRF";
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';

const columnsPcasp = [
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
        onClick={() => row.onDownload(row.path.slice(1), row.title)}
      >
        Abrir
      </button>
    ),
    width: '20%',
    center: true
  }
];

const Pcasp = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parametros, setParametros] = useState({
    ano: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    extensao: 'pdf',
    orgao: 1,
    tipoDoRelatorio: 6
  });

  useEffect(() => {
    document.title = `Relatório PCASP - Portal Transparência - ${config.geral.nomeOrgao}`;
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      setLoading(true);
      
      // Carrega os metadados primeiro
      await carregarMetaDados();

      // Depois verifica o último mês disponível
      const anoDisponivel = await getUltimoAnoPublicado();
      const ultimoMes = await getUltimoMesPublicado(anoDisponivel);
      
      // Atualiza os parâmetros sem recarregar a tabela
      setParametros(prev => ({
        ...prev,
        ano: anoDisponivel,
        mes: ultimoMes
      }));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarMetaDados = async () => {
    try {
      setLoading(true);
      const dados = await getMetaDadosPcasp();
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

  const baixarRelatorio = async (tipo, titulo) => {
    try {
      const response = await getRelatorioPcasp(tipo, parametros);
      
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
      setError(`Erro ao abrir relatório: ${err.message}`);
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
        tipoDoRelatorio: 6
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
        title="Relatório PCASP"
        breadcrumb={[
          { label: 'Relatório PCASP' },
        ]}
      />

      <FilterSectionLRF 
        onFilterChange={handleFilterChange}
        initialValues={parametros}
      />
        
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <DataTableComponent
          title="Relatórios PCASP"
          columns={columnsPcasp}
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

export default Pcasp;