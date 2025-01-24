import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getContratos } from "../../../services/contratosLicitacoes/contratos";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import MultiComboSelect from '../../common/MultiComboSelect/MultiComboSelect';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import Toast from '../../common/Toast';
import './Contratos.css';
import columnsContratos from "./columnsContratos";
import { config } from '../../../assets/config';


const Contratos = () => {
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
    document.title = `Contratos e Aditivos - Portal Transparência - ${config.geral.nomeOrgao}`;
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
      console.log('Buscando contratos com filtros:', filters);
      
      const result = await getContratos(filters);
      setData(result.registros);
      
      if (Object.keys(filters).length > 0) {
        setToast({
          type: 'success',
          message: 'Filtros aplicados com sucesso!'
        });
      }
    } catch (err) {
      console.error('Erro ao buscar contratos:', err);
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
        title="Contratos e Aditivos"
        breadcrumb={[
          { label: 'Contratos e Aditivos' },
        ]}
      />
      
      <MultiComboSelect
        availableFilters={['ano', 'orgao', 'modalidade', 'assuntoDeContrato', 'situacaoDoContrato', 'aditivoDoContrato', 'contratoCovid19', ]}
        textFields={[
          { id: 'cpfCnpj', label: 'CPF/CNPJ', type: 'text' },
          { id: 'fornecedor', label: 'Fornecedor', type: 'text' },
          { id: 'numeroContrato', label: 'Número do Contrato', type: 'number' },          
          { id: 'objeto', label: 'Objeto', type: 'text' },
        ]}
        customWidths={{
          ano: '25%',
          orgao: '25%',
          modalidade: '25%',
          contratoCovid19: '25%',
          assuntoDeContrato: '25%',
          situacaoDoContrato: '25%',
          aditivoDoContrato: '25%',
          cpfCnpj: '25%',
          fornecedor: '25%',
          numeroContrato: '25%',
          objeto: '50%'
        }}
        onFilterChange={handleFilterChange}
      />
      
      <InfoText href="/transparencia/contratos/declaracoes">
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
        <div>Erro ao carregar contratos: {error}</div>
      ) : (
        <DataTableComponent
          columns={columnsContratos}
          data={data}
        />
      )}
    </div>
  );
};

export default Contratos;