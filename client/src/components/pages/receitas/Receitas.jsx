import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getReceitas } from "../../../services/receitasDespesas/receitas";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import MultiComboSelect from '../../common/MultiComboSelect/MultiComboSelect';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import Toast from '../../common/Toast';
import ButtonTable from "../../common/ButtonTable";
import { config } from '../../../assets/config';
import {
  RECEITAS_COMBO_FILTERS,
  RECEITAS_TEXT_FIELDS,
  RECEITAS_SELECT_FIELDS,
  RECEITAS_CUSTOM_WIDTHS,
  RECEITAS_CUSTOM_LABELS,
  RECEITAS_FIELD_ORDER,
  RECEITAS_REQUIRED_FILTERS
} from '../../../services/filters/receitasDespesas/receitas';

const columns = [
  // { name: "Ano", selector: (row) => row.chave.ano, sortable: true, width: '6%' },
  {
    name: "Mês/Ano",
    selector: (row) => `${row.chave.mes}/${row.chave.ano}`, // Certifica-se de acessar corretamente os dados
    sortable: true,
    width: '8%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {`${row.chave.mes}/${row.chave.ano}`} {/* Mostra o mês/ano corretamente */}
      </div>
    )
  },
  // {
  //   name: "Órgão",
  //   selector: (row) => row.orgaoUnidadeGestora,
  //   sortable: true,
  //   width: '17%',
  //   cell: (row) => (
  //     <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
  //       {row.orgaoUnidadeGestora}
  //     </div>
  //   )
  // },
  {
    name: "Natureza da Receita",
    selector: (row) => `${row.naturezaDaReceita} - ${row.receita}`, // Combina os dois valores
    sortable: true,
    width: '18%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {`${row.naturezaDaReceita} - ${row.receita}`} {/* Exibe ambos os valores */}
      </div>
    )
  },
  { name: "Origem dos Recursos", selector: (row) => row.origemDoRecurso, sortable: true, width: '18%'  },
  { name: "Valor Orçado", selector: (row) => row.valorOrcado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%' },
  { name: "Valor Arrecadado (Mês)", selector: (row) => row.arrecadacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '16%' },
  { name: "Valor Arrecadado (Anual)", selector: (row) => row.valorAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '17%' },

  // Adicionando a coluna de "Ver Detalhes"
  {
    name: 'Detalhes',
    selector: row => row.chave.codigoDaReceita,
    cell: row => {
      const id = row.chave.codigoDaReceita;
      const ano = row.chave.ano || new Date().getFullYear();
      const mes = row.chave.mes || (new Date().getMonth() + 1).toString().padStart(2, '0');
      
      return (
        <ButtonTable
          path="/receitas"
          id={id}
          queryParams={`?ano=${ano}&mes=${mes}`}
          label="Ver Detalhes"
        />
      );
    },
    width: '11%',
    excludeFromExport: true
  }
  
];

const Receitas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Get initial filters - if no year/month in URL, use current year/month
  const getInitialFilters = () => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value;
    }
    
    // If no year filter exists, add current year
    if (!filters.ano) {
      filters.ano = new Date().getFullYear().toString();
    }
    
    // If no month filter exists, add current month
    if (!filters.mes) {
      filters.mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
    }
    
    return filters;
  };

  useEffect(() => {
    document.title = `Receita Prevista e Arrecadada - Portal Transparência - ${config.geral.nomeOrgao}`;
    const initialFilters = getInitialFilters();
    
    // Always update URL with initial filters
    const params = new URLSearchParams(searchParams);
    if (!params.has('ano')) {
      params.set('ano', initialFilters.ano);
      params.set('mes', initialFilters.mes);
      setSearchParams(params);
    }
    
    // Always fetch data with initial filters
    fetchData(initialFilters);
  }, []);

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('Buscando receitas com filtros:', filters);
      
      const result = await getReceitas(filters);
      setData(result.registros);
      
      if (Object.keys(filters).length > 0) {
        setToast({
          type: 'success',
          message: 'Filtros aplicados com sucesso!'
        });
      }
    } catch (err) {
      console.error('Erro ao buscar receitas:', err);
      setError(err.message);
      setToast({
        type: 'error',
        message: 'Erro ao aplicar filtros: ' + err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    console.log('Filtros recebidos:', filters);
    
    // Atualiza a URL com os novos filtros
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);

    // Busca os dados com os novos filtros
    fetchData(filters);
  };

  return (
    <div className="container">
      <PageHeader
        title="Receita Prevista e Arrecadada"
        breadcrumb={[
          { label: 'Receita Prevista e Arrecadada' },
        ]}
      />      
      
      <MultiComboSelect
        title="Filtros de Pesquisa"
        availableFilters={RECEITAS_COMBO_FILTERS}
        textFields={RECEITAS_TEXT_FIELDS}
        selectFields={RECEITAS_SELECT_FIELDS}
        customWidths={RECEITAS_CUSTOM_WIDTHS}
        customLabels={RECEITAS_CUSTOM_LABELS}
        onFilterChange={handleFilterChange}
        initialValues={getInitialFilters()}
        requiredFilters={RECEITAS_REQUIRED_FILTERS}
        fieldOrder={RECEITAS_FIELD_ORDER}
      />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
      
      {toast && (
        <Toast 
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Receitas: {error}</div>
      ) : (
        <DataTableComponent
          title="Receitas"
          columns={columns}
          data={data}
        />
      )}
    </div>
  );
};

export default Receitas;