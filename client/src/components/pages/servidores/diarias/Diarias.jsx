import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDiarias } from "../../../../services/orgãosServidores/diarias";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import MultiComboSelect from '../../../common/MultiComboSelect/MultiComboSelect';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import Toast from '../../../common/Toast';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';
import { 
  DIARIAS_COMBO_FILTERS,
  DIARIAS_TEXT_FIELDS,
  DIARIAS_CUSTOM_WIDTHS 
} from '../../../../services/filters/orgaosServidores/diarias';

const columnsDiarias = [
  { name: "Matrícula", selector: (row) => row.matriculaDoFuncionario, sortable: true, width: '10%' },
  { name: "Nome do Funcionário", selector: (row) => row.nomeDoFuncionario, sortable: true, width: '20%' },
  { name: "Saída", selector: (row) => row.dataDaSaida, sortable: true, width: '12%' },
  { name: "Chegada", selector: (row) => row.dataDaChegada, sortable: true, width: '12%' },
  { name: "Destino", selector: (row) => row.destino, sortable: true, width: '20%' },
  { 
    name: "Valor da Diária", 
    selector: (row) => row.valorDaDiaria !== undefined && row.valorDaDiaria !== null 
      ? row.valorDaDiaria.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
      : 'R$ 0,00', 
    sortable: true, 
    width: '15%'
  },
  {
    name: 'Detalhes',
    selector: row => row.codigoDaViagem, 
    cell: row => {
      const id = row.codigoDaViagem;
      return <ButtonTable path="/diarias" id={id} label="Ver Detalhes" />;
    },
    width: '11%', 
    excludeFromExport: true
  },
];

const Diarias = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Recupera os filtros iniciais da URL
  const getInitialFilters = () => {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value;
    }
    return filters;
  };

  useEffect(() => {
    document.title = `Diárias Pagas a Servidores - Portal Transparência - ${config.geral.nomeOrgao}`;
    const initialFilters = getInitialFilters();
    if (Object.keys(initialFilters).length > 0) {
      fetchData(initialFilters);
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('Buscando diárias com filtros:', filters);
      
      const result = await getDiarias(filters);
      setData(result.registros);
      
      if (Object.keys(filters).length > 0) {
        setToast({
          type: 'success',
          message: 'Filtros aplicados com sucesso!'
        });
      }
    } catch (err) {
      console.error('Erro ao buscar diárias:', err);
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
        title="Diárias Pagas a Servidores"
        breadcrumb={[
          { label: 'Diárias Pagas a Servidores' },
        ]}
      />      
      
      <MultiComboSelect
        title="Filtros de Pesquisa"
        availableFilters={DIARIAS_COMBO_FILTERS}
        textFields={DIARIAS_TEXT_FIELDS}
        customWidths={DIARIAS_CUSTOM_WIDTHS}
        onFilterChange={handleFilterChange}
        initialValues={getInitialFilters()}
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
        <div>Erro ao carregar Diarias: {error}</div>
      ) : (
        <DataTableComponent
          title="Diarias"
          columns={columnsDiarias}
          data={data}
        />
      )}
    </div>
  );
};

export default Diarias;