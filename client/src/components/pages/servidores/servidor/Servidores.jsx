import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getServidores } from "../../../../services/orgãosServidores/servidores";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import MultiComboSelect from '../../../common/MultiComboSelect/MultiComboSelect';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import Toast from '../../../common/Toast';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';
import {
  SERVIDORES_COMBO_FILTERS,
  SERVIDORES_TEXT_FIELDS,
  SERVIDORES_SELECT_FIELDS,
  SERVIDORES_CUSTOM_WIDTHS,
  SERVIDORES_CUSTOM_LABELS,
  SERVIDORES_FIELD_ORDER
} from '../../../../services/filters/orgaosServidores/servidores';

const columnsServidores = [
  { name: "Mês/Ano", selector: (row) => row.mesAno, sortable: true, width: '8%' },
  { name: "Matrícula", selector: (row) => row.matricula, sortable: true, width: '6%' },
  { name: "CPF", selector: (row) => row.cpf, sortable: true, width: '8%' },
  {
    name: "Nome",
    selector: (row) => row.nome,
    sortable: true,
    width: '12%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.nome}
      </div>
    )
  },
  { name: "Cargo", selector: (row) => row.cargo, sortable: true, width: '10%' },
  { name: "Situação", selector: (row) => row.situacao, sortable: true, width: '8%' },
  // { name: "Admissão", selector: (row) => row.dataAdmissao, sortable: true, width: '8%' },
  
  { 
    name: "Total Proventos", 
    selector: (row) => row.proventos ? row.proventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Total Descontos", 
    selector: (row) => row.descontos ? row.descontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Total Líquido", 
    selector: (row) => row.totalLiquido ? row.totalLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
    sortable: true, 
    width: '10%' 
  },

  { name: "Situação", selector: (row) => row.situacaoPagamento, sortable: true, width: '8%' },
  {
    name: 'Detalhes',
    selector: row => row.matricula,
    cell: row => {
      const id = row.matricula;
      
      // Pega o ano e mês da linha atual
      const ano = row.ano || new Date().getFullYear();
      const mes = row.mes || (new Date().getMonth() + 1).toString().padStart(2, '0');
      
      return (
        <ButtonTable
          path="/servidores" 
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

const Servidores = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Função para obter o mês anterior
  const getLastMonth = () => {
    const today = new Date();
    const lastMonth = today.getMonth() === 0 ? 12 : today.getMonth();
    const lastMonthYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    return {
      mes: lastMonth.toString().padStart(2, '0'),
      ano: lastMonthYear.toString()
    };
  };

  // Get initial filters - if no year/month in URL, use last month
  const getInitialFilters = () => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value;
    }
    
    const { mes, ano } = getLastMonth();
    
    // Se não houver ano/mês nos filtros, usa o mês anterior
    if (!filters.ano) filters.ano = ano;
    if (!filters.mes) filters.mes = mes;
    
    return filters;
  };

  useEffect(() => {
    document.title = `Servidores - Portal Transparência - ${config.geral.nomeOrgao}`;
    const initialFilters = getInitialFilters();
    
    // Always update URL with initial filters
    const params = new URLSearchParams(searchParams);
    if (!params.has('ano') || !params.has('mes')) {
      const { mes, ano } = getLastMonth();
      if (!params.has('ano')) params.set('ano', ano);
      if (!params.has('mes')) params.set('mes', mes);
      setSearchParams(params);
    }
    
    // Always fetch data with initial filters
    fetchData(initialFilters);
  }, []);

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('Buscando servidores com filtros:', filters);
      
      const result = await getServidores(filters);
      setData(result.registros);
      
      if (Object.keys(filters).length > 0) {
        setToast({
          type: 'success',
          message: 'Filtros aplicados com sucesso!'
        });
      }
    } catch (err) {
      console.error('Erro ao buscar servidores:', err);
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
    
    // Se os filtros estiverem vazios (limpar filtros foi clicado)
    if (Object.keys(filters).length === 0) {
      // Mantém apenas ano e mês com valores do mês anterior
      const { mes, ano } = getLastMonth();
      filters = { ano, mes };
    }
    
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
        title="Servidores"
        breadcrumb={[
          { label: 'Servidores' },
        ]}
      />      
      
      <MultiComboSelect
        title="Filtros de Pesquisa"
        availableFilters={SERVIDORES_COMBO_FILTERS}
        textFields={SERVIDORES_TEXT_FIELDS}
        selectFields={SERVIDORES_SELECT_FIELDS}
        customWidths={SERVIDORES_CUSTOM_WIDTHS}
        customLabels={SERVIDORES_CUSTOM_LABELS}
        onFilterChange={handleFilterChange}
        initialValues={getInitialFilters()}
        requiredFilters={['ano', 'mes']}
        fieldOrder={SERVIDORES_FIELD_ORDER}
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
        <div>Erro ao carregar Servidores: {error}</div>
      ) : (
        <DataTableComponent
          title="Servidores"
          columns={columnsServidores}
          data={data}
        />
      )}
    </div>
  );
};

export default Servidores;