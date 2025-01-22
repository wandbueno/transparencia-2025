import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEstruturaRemuneracao } from "../../../../services/orgãosServidores/estruturaRemuneracao";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import MultiComboSelect from '../../../common/MultiComboSelect/MultiComboSelect';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import Toast from '../../../common/Toast';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';
import {
  ESTRUTURA_REMUNERACAO_COMBO_FILTERS,
  ESTRUTURA_REMUNERACAO_TEXT_FIELDS,
  ESTRUTURA_REMUNERACAO_SELECT_FIELDS,
  ESTRUTURA_REMUNERACAO_CUSTOM_WIDTHS,
  ESTRUTURA_REMUNERACAO_CUSTOM_LABELS,
  ESTRUTURA_REMUNERACAO_FIELD_ORDER
} from '../../../../services/filters/orgaosServidores/estruturaRemuneracao';

const columnsEstruturaRemuneracao = [
  { name: "Cargo", selector: (row) => row.cargo, sortable: true, width: '22%' },
  { name: "Nível", selector: (row) => row.nivel, sortable: true, width: '8%' },
  { name: "CBO", selector: (row) => row.cbo, sortable: true, width: '5%' },
  { name: "Código", selector: (row) => row.codigo, sortable: true, width: '6%' },
  { name: "Lei", selector: (row) => row.lei, sortable: true, width: '4%' },
  { name: "Data da Lei", selector: (row) => row.dataDaLei, sortable: true, width: '8%' },
  { name: "Qtd. Vagas", selector: (row) => row.vagas, sortable: true, width: '8%' },
  { name: "Vagas providas", selector: (row) => row.vagasProvidas, sortable: true, width: '10%' },
  { name: "Não providas", selector: (row) => row.vagasNaoProvidas, sortable: true, width: '10%' },
  { 
    name: "Salário", 
    selector: (row) => row.salario !== undefined && row.salario !== null 
      ? row.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
      : 'R$ 0,00', 
    sortable: true, 
    width: '10%'
  },
  {
    name: 'Detalhes',
    selector: row => row.chave.codigoDoNivel,
    cell: row => {
      const id = row.chave.codigoDoNivel;
      const ano = row.chave.ano || new Date().getFullYear();
      const mes = row.chave.mes || (new Date().getMonth() + 1).toString().padStart(2, '0');
      
      return (
        <ButtonTable
          path="/estrutura-de-remuneracao"
          id={id}
          queryParams={`?ano=${ano}&mes=${mes}`}
          label="Ver Detalhes"
        />
      );
    },
    width: '10%',
    excludeFromExport: true
  }
];

const EstruturaRemuneracao = () => {
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
    document.title = `Estrutura de Remuneração - Portal Transparência - ${config.geral.nomeOrgao}`;
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
      console.log('Buscando estrutura de remuneração com filtros:', filters);
      
      const result = await getEstruturaRemuneracao(filters);
      setData(result.registros);
      
      if (Object.keys(filters).length > 0) {
        setToast({
          type: 'success',
          message: 'Filtros aplicados com sucesso!'
        });
      }
    } catch (err) {
      console.error('Erro ao buscar estrutura de remuneração:', err);
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
        title="Estrutura de Remuneração"
        breadcrumb={[
          { label: 'Estrutura de Remuneração' },
        ]}
      />      
      
      <MultiComboSelect
        title="Filtros de Pesquisa"
        availableFilters={ESTRUTURA_REMUNERACAO_COMBO_FILTERS}
        textFields={ESTRUTURA_REMUNERACAO_TEXT_FIELDS}
        selectFields={ESTRUTURA_REMUNERACAO_SELECT_FIELDS}
        customWidths={ESTRUTURA_REMUNERACAO_CUSTOM_WIDTHS}
        customLabels={ESTRUTURA_REMUNERACAO_CUSTOM_LABELS}
        onFilterChange={handleFilterChange}
        initialValues={getInitialFilters()}
        requiredFilters={['ano', 'mes']}
        fieldOrder={ESTRUTURA_REMUNERACAO_FIELD_ORDER}
      />
      
      <InfoText href="/transparencia/declaracoes/">
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
        <div>Erro ao carregar Estrutura de Remuneração: {error}</div>
      ) : (
        <DataTableComponent
          title="Estrutura de Remuneração"
          columns={columnsEstruturaRemuneracao}
          data={data}
        />
      )}
    </div>
  );
};

export default EstruturaRemuneracao;