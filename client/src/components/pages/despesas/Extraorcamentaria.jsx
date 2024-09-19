import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getDespesas } from "../../../services/receitasDespesas/extraorcamentaria";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import './Despesas.css';
import ButtonTable from "../../common/ButtonTable";

const columnsExtra = [
  { name: "Órgão", selector: (row) => row.orgao, sortable: true, width: '15%' },
  { name: "Título", selector: (row) => row.titulo, sortable: true, width: '15%' },
  { name: "Tipo Extra", selector: (row) => row.tipoDoLancamento, sortable: true, width: '15%' },
  { name: "Valor Movimento (Mês)", selector: (row) => row.valorMovimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '17%' },
  { name: "Valor Anulação (Mês)", selector: (row) => row.valorAnulacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '16%' },
  { name: "Valor Acumulado", selector: (row) => row.valorAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '11%' },
  {
    name: "Mais",
    selector: (row) => row.codigo,
    cell: (row) => {
      const id = row.codigo;
      const navigate = useNavigate(); // Certifique-se de usar o hook
  
      const handleClick = () => {
        navigate(`/extra-orcamentaria/${id}`); // Navega para o caminho específico
      };
  
      return <ButtonTable onClick={handleClick} label="Ver Detalhes" />;
    },
    width: '11%',
  }
];


const Extraorcamentaria = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDespesas();
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
        title="Extra Orçamentária"
        breadcrumb={[
          { label: 'Página Inicial', path: '/' },
          { label: 'Transparência', path: '/Extra Orçamentária' },
          { label: 'Extra Orçamentária' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Despesas Extra Orçamentária: {error}</div>
      ) : (
        <DataTableComponent
          title="Extra Orçamentária"
          columns={columnsExtra}
          data={data}
        />
      )}

   
    </div>
  );
};

export default Extraorcamentaria;
