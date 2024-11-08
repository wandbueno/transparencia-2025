import React, { useEffect, useState } from "react";
import { getMetaDadosRelatorios, getRelatorio } from "../../../../services/lrf/metasRiscos";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import LoadingSpinner from '../../../common/LoadingSpinner';
import { config } from '../../../../assets/config';

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
        onClick={() => row.onDownload(row.path.slice(1), row.title)}
      >
        Abrir
      </button>
    ),
    width: '20%',
    center: true,
    excludeFromExport: true
  }
];

const Metas = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parametros] = useState({
    ano: new Date().getFullYear(),
    mes: 1,
    extensao: 'pdf',
    orgao: 1,
    tipoDoRelatorio: 3
  });

  useEffect(() => {
    document.title = `Metas e Riscos Fiscais - Portal Transparência - ${config.geral.nomeOrgao}`;
    carregarMetaDados();
  }, []);

  const carregarMetaDados = async () => {
    try {
      const dados = await getMetaDadosRelatorios();
      const relatoriosComAcao = dados.map(relatorio => ({
        ...relatorio,
        onDownload: baixarRelatorio
      }));
      setRelatorios(relatoriosComAcao);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const baixarRelatorio = async (tipo, titulo) => {
    try {
      const response = await getRelatorio(tipo, parametros);
      
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

  return (
    <div className="container">
      <PageHeader
        title="Metas e Riscos Fiscais"
        breadcrumb={[
          { label: 'Metas e Riscos Fiscais' },
        ]}
      />

      <FilterSection />
        
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <DataTableComponent
          title="Relatórios de Metas Fiscais"
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