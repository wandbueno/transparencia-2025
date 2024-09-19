import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom"; 
import { useNavigate } from 'react-router-dom';
import { getLicitacoes  } from "../../../services/contratosLicitacoes/licitacoes";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import './LicitacoesTable.css';
import '../../../assets/global.css';
import ButtonTable from "../../common/ButtonTable";
import { config } from '../../../assets/config';

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

const columns = [
  { name: "Modalidade", selector: (row) => row.modalidade, sortable: true, width: '14%' },
  { name: "Nº/Ano", selector: (row) => row.numeroAno, sortable: true, width: '8%' },
  { name: "Órgão", selector: (row) => row.orgao, sortable: true, width: '18%' },
  { name: "Data de Julgamento", selector: (row) => row.dataDeJulgamento, sortable: true, width: '15%' },
  { name: "Situação", selector: (row) => row.situacao, sortable: true, width: '9%' },
  { 
    name: "Objeto", 
    selector: (row) => row.historico, 
    sortable: true, width: '25%',
    cell: (row) => (
      <div className="break-word">
        {truncateText(row.historico, 150)}
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
        navigate(`/licitacoes/${id}`); // Navega para o caminho específico
      };
  
      return <ButtonTable onClick={handleClick} label="Ver Detalhes" />;
    },
    width: '11%',
  }
];

const LicitacoesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Atualiza o título da aba do navegador
    document.title = `Procedimentos Licitatórios - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getLicitacoes();
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
        title="Procedimentos Licitatórios"
        breadcrumb={[
          { label: 'Página Inicial', path: '/' },
          { label: 'Transparência', path: '/transparencia' },
          { label: 'Procedimentos Licitatórios' },
        ]}
      />
      
      <FilterSection  />

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
          columns={columns}
          data={data}
        />
      )}
    </div>
  );
};

export default LicitacoesTable;
