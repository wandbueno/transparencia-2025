import React, { useEffect, useState } from "react";
import { getProjetosPaginados } from "../../../../services/PlanPolPublicas/AcompanhamentoProjetos";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsProjetos = [
  { 
    name: "Cod. Ação", 
    selector: (row) => row.codigoDaAcao, 
    sortable: true, 
    width: '8%' 
  },
  { 
    name: "Mês/Ano", 
    selector: (row) => row.mesAno, 
    sortable: true, 
    width: '8%' 
  },
  {
    name: "Título da Ação",
    selector: (row) => row.tituloDaAcao,
    sortable: true,
    width: '44%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.tituloDaAcao}
      </div>
    )
  },
  { 
    name: "Valor Previsto", 
    selector: (row) => row.valorPrevisto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Valor Executado", 
    selector: (row) => row.valorExecutado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '15%' 
  },
  {
    name: 'Detalhes',
    selector: row => row.codigoDoProjeto,
    cell: row => {
      const { acaoCodigo, ano, mes } = row.codigoDoProjeto;
      return (
        <ButtonTable
          path="/acoes-e-projetos"
          id={acaoCodigo}
          queryParams={`?ano=${ano}&mes=${mes}`}
          label="Ver Detalhes"
        />
      );
    },
    width: '10%',
    excludeFromExport: true
  }
];

const AcompanhamentoProjetos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Atualiza o título da aba do navegador
    document.title = `Acompanhamento de Projetos - Portal Transparência - ${config.geral.nomeOrgao}`;

    const fetchData = async () => {
      try {
        const result = await getProjetosPaginados();
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
        title="Acompanhamento de Projetos"
        breadcrumb={[
          { label: 'Acompanhamento de Projetos' },
        ]}
      />      
      
      <FilterSection />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Acompanhamento de Projetos: {error}</div>
      ) : (
        <DataTableComponent
          title="Acompanhamento de Projetos"
          columns={columnsProjetos}
          data={data}
        />
      )}
    </div>
  );
};

export default AcompanhamentoProjetos;