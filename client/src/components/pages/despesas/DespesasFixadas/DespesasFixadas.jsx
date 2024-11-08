import React, { useEffect, useState } from "react";
import { getDespesasFixadas } from "../../../../services/receitasDespesas/DespesasFixadas";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsDespesasFixadas = [
  { name: "Ano", selector: (row) => row.ano, sortable: true, width: '6%' },
  { name: "Órgão", selector: (row) => row.orgao, sortable: true, width: '22%' },
  {
    name: "Rubrica Despesa",
    selector: (row) => row.elemento,
    sortable: true,
    width: '25%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.elemento}
      </div>
    )
  },
  {
    name: "Fonte",
    selector: (row) => row.fonte,
    sortable: true,
    width: '25%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
        {row.fonte.replace(/<br>/g, '\n')}
      </div>
    )
  },
  { name: "Dotação Inicial", 
    selector: (row) => row.valorOrcado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '12%' 
  },
  {
    name: 'Detalhes',
    selector: row => row.codigo, 
    cell: row => {
      const id = row.codigo;
      return <ButtonTable path="/despesas-fixadas" id={id} label="Ver Detalhes" />; // Usa o botão de detalhes
    },
    width: '10%', 
    excludeFromExport: true
  },
];

const DespesasFixadas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Despesas Fixadas - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getDespesasFixadas();
        
        // Ordena os dados pela coluna "ano" em ordem decrescente
        const sortedData = result.registros.sort((a, b) => b.ano - a.ano);

        setData(sortedData); 

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
        title="Despesas Fixadas"
        breadcrumb={[
          { label: 'Despesas Fixadas' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Despesas Fixadas: {error}</div>
      ) : (
        <DataTableComponent
          title="Despesas Fixadas"
          columns={columnsDespesasFixadas}
          data={data}
        />
      )}

    </div>
    
  );
};

export default DespesasFixadas;
