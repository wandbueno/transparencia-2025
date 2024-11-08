import React, { useEffect, useState } from "react";
import { getDespesasSintetica } from "../../../../services/receitasDespesas/DespesasSintetica";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsDespesasSintetica = [
  { name: "Classificação Orcamentária", selector: (row) => row.classificacaoOrcamentaria, sortable: true, width: '20%' },
  { name: "Mês/Ano", selector: (row) => row.mesAno, sortable: true, width: '10%' },
  { name: "Valor Orçado", 
    selector: (row) => row.valorOrcado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '15%' 
  },
  { name: "Empenhado", 
    selector: (row) => row.valorEmpenhado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '12%' 
  },
  { name: "Anulado/ Acumulado", 
    selector: (row) => row.valorAnuladoAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '15%' 
  },
  { name: "Empenhado/ Acumulado", 
    selector: (row) => row.valorEmpenhadoAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '18%' 
  },
  {
    name: 'Detalhes',
    selector: row => row.codigoDaDespesa.codigoDaDespesa, // Seleciona o código da despesa
    cell: row => {
      const id = row.codigoDaDespesa.codigoDaDespesa; // Obtém o ID da despesa
      const mes = row.codigoDaDespesa.mes; // Obtém o mês da despesa
      return (
        <ButtonTable 
          path={`/despesa-sintetica/${id}?mes=${mes}`} // Passa o ID e o mês na URL
          id={id} 
          label="Ver Detalhes" // Rótulo do botão
        />
      ); // Usa o botão de detalhes
    },
    width: '10%', 
    excludeFromExport: true
  }
  
];

const DespesasSintetica = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Despesa Sintética - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getDespesasSintetica();
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
        title="Despesa Sintética"
        breadcrumb={[
          { label: 'Despesa Sintética' },
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
          title="Despesa Sintética"
          columns={columnsDespesasSintetica}
          data={data}
        />
      )}

    </div>
    
  );
};

export default DespesasSintetica;
