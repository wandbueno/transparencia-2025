import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom"; 
import { useNavigate } from 'react-router-dom';
import { getContratos  } from "../../../services/contratosLicitacoes/contratos";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import './contratos.css';
import '../../../assets/global.css';
import ButtonTable from "../../common/ButtonTable";

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

const columnsContratos = [
  { name: "Número", selector: (row) => row.numero, sortable: true, width: '9%' },
  { name: "Ano", selector: (row) => row.exercicioAno, sortable: true, width: '7%' },
  { name: "Fornecedor", selector: (row) => row.nomeDoFornecedor, sortable: true, width: '20%' },
  { name: "Valor", selector: (row) => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '10%' },
  { name: "Situação", selector: (row) => row.situacao, sortable: true, width: '10%' },
  { 
    name: "Objeto", 
    selector: (row) => row.historico, 
    sortable: true, width: '34%',
    cell: (row) => (
      <div className="break-word">
        {truncateText(row.objeto, 150)}
      </div>
    )
  },
  {
    name: "Detalhes",
    selector: (row) => row.codigo,
    cell: (row) => {
      const id = row.codigo;
      const navigate = useNavigate(); // Certifique-se de usar o hook
  
      const handleClick = () => {
        navigate(`/contratos/${id}`); // Navega para o caminho específico
      };
  
      return <ButtonTable onClick={handleClick} label="Ver Detalhes" />;
    },
    width: '11%',
  }
];

const Contratos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getContratos();
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
        title="Contratos"
        breadcrumb={[
          { label: 'Página Inicial', path: '/' },
          { label: 'Transparência', path: '/contratos' },
          { label: 'Contratos' },
        ]}
      />
      
      <FilterSection  />

      <InfoText href="/transparencia/declaracoes/">
        <p>Veja Declarações Negativas e Demais Documentos Clicando Aqui</p>
      </InfoText>
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar contratos: {error}</div>
      ) : (
        <DataTableComponent
          title="Contratos"
          columns={columnsContratos}
          data={data}
        />
      )}
    </div>
  );
};

export default Contratos;
