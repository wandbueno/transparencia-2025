import React, { useEffect, useState } from "react";
import { getProgramasPaginados } from "../../../../services/PlanPolPublicas/AcompanhamentoProgramas";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsProgramas = [
  { 
    name: "Código", 
    selector: (row) => row.codigoDoPrograma, 
    sortable: true, 
    width: '7%' 
  },
  { 
    name: "Ano", 
    selector: (row) => row.ano, 
    sortable: true, 
    width: '7%' 
  },
  {
    name: "Título do Programa",
    selector: (row) => row.titulo,
    sortable: true,
    width: '36%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.titulo}
      </div>
    )
  },
  { 
    name: "Valor Previsto", 
    selector: (row) => row.valorPrevisto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '20%' 
  },
  { 
    name: "Valor Executado", 
    selector: (row) => row.valorExecutado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '20%' 
  },
  {
    name: 'Detalhes',
    cell: row => (
      <ButtonTable
        path={`/programas/${row.codigoDoPrograma}`}
        queryParams={`?ano=${row.ano}`}
        label="Ver Detalhes"
      />
    ),
    width: '10%',
    excludeFromExport: true
  }
];

const AcompanhamentoProgramas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Atualiza o título da aba do navegador
    document.title = `Acompanhamento de Programas - Portal Transparência - ${config.geral.nomeOrgao}`;

    const fetchData = async () => {
      try {
        const result = await getProgramasPaginados();
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
        title="Acompanhamento de Programas"
        breadcrumb={[
          { label: 'Acompanhamento de Programas' },
        ]}
      />      
      
      <FilterSection />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Acompanhamento de Programas: {error}</div>
      ) : (
        <DataTableComponent
          title="Acompanhamento de Programas"
          columns={columnsProgramas}
          data={data}
        />
      )}
    </div>
  );
};

export default AcompanhamentoProgramas; 