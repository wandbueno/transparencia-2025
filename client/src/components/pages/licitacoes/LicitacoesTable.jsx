import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getLicitacoes } from "../../../services/contratosLicitacoes/licitacoes";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import './LicitacoesTable.css';
import '../../../assets/global.css';
import columnsLicitacao from "./columnsLicitacao";
import { config } from '../../../assets/config';

const LicitacoesTable = () => {
  const [data, setData] = useState([]); // Dados completos da API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    ano: '',
    codigoDoOrgao: '',
    codigoDaModalidade: '',
    codigoDaSituacao: '',
    cpfCnpj: '',
    fornecedor: '',
    objeto: ''
  });

  // Função chamada quando há mudança nos filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    // Construir a URL sem incluir filtros vazios
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });

    // Atualizar a URL com os parâmetros de filtro
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  // Requisição de dados ao backend passando os filtros
  useEffect(() => {

    // Atualiza o título da aba do navegador
    document.title = `Procedimentos Licitatórios - Portal Transparência - ${config.geral.nomeOrgao}`
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getLicitacoes(filters); // Passa os filtros para a API
        if (result && result.registros) {
          setData(result.registros); // Garante que "result" seja válido
        } else {
          setData([]); // Caso não haja registros
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]); // Filtros como dependências

  return (
    <div className="container">
      <PageHeader
        title="Procedimentos Licitatórios"
        breadcrumb={[
          { label: 'Procedimentos Licitatórios' },
        ]}
      />

      <FilterSection 
        data={data} 
        onFilterChange={handleFilterChange} 
      />

      <InfoText href="/transparencia/declaracoes/">
        <p>Veja Declarações Negativas e Demais Documentos Clicando Aqui</p>
      </InfoText>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar licitações: {error}</div>
      ) : (
        <DataTableComponent
          title="Licitações"
          columns={columnsLicitacao}
          data={data.length > 0 ? data : []}
        />
      )}
    </div>
  );
};

export default LicitacoesTable;
