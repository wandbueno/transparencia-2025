import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getProcedimentos } from "../../../services/contratosLicitacoes/sicap"; // Função que criamos
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';

import '../../../assets/global.css';
import ButtonTable from "../../common/ButtonTable";

// Função para truncar textos longos
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Função para retornar a cor de acordo com a fase
const getColorForFase = (fase) => {
  switch (fase) {
    case '1ªF':
      return '#428bca';
    case '2ªF':
      return '#ffd700';
    case 'CO':
      return '#2e8b57';
    case 'TE':
      return '#b22222';
    case 'OB':
      return '#daa520';
    default:
      return 'gray'; // Cor padrão se a fase não for reconhecida
  }
};

// Função para renderizar as fases coloridas
const renderFases = (fases) => {
  if (!fases) return null;

  const fasesArray = fases.split(' '); // Separar as fases por espaço

  return fasesArray.map((fase, index) => (
    <span
      key={index}
      className="fase"
      style={{
        backgroundColor: getColorForFase(fase),
        color: 'white',
        padding: '4px 8px',
        borderRadius: '5px',
        marginRight: '5px',
        display: 'inline-block',
        fontSize: '11px'
      }}
    >
      {fase}
    </span>
  ));
};

// Definindo as colunas da tabela
const columnsProcedimentos = [
  { name: "Tipo", selector: (row) => row.tipoExecucao, sortable: true, width: '10%' },
  { name: "Processo Adm", selector: (row) => row.processoAdministrativo, sortable: true, width: '12%' },
  { name: "Publicação", selector: (row) => row.dataCadastro, sortable: true, width: '10%' },
  // { name: "Abertura", selector: (row) => row.dataAbertura, sortable: true, width: '10%' },
  { name: "Valor", selector: (row) => row.valor, sortable: true, width: '10%' },
  // {
  //   name: "Situação",
  //   selector: (row) => row.fases,
  //   cell: (row) => renderFases(row.fases), // Renderizar as fases coloridas
  //   width: '15%'
  // },
  { 
    name: "Objeto", 
    selector: (row) => row.descricaoObjeto, 
    sortable: true, width: '47%',
    cell: (row) => (
      <div className="break-word">
        {truncateText(row.descricaoObjeto, 100)}
      </div>
    )
  },
  {
    name: "Detalhes",
    selector: (row) => row.detalhesUrl,
    cell: (row) => {
      const detalhesUrl = row.detalhesUrl;
      const navigate = useNavigate();
  
      const handleClick = () => {
        window.open(detalhesUrl, '_blank'); // Abre o link de detalhes em uma nova aba
      };
  
      return <ButtonTable onClick={handleClick} label="Ver Detalhes" />;
    },
    width: '11%',
  }
];

const Sicap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getProcedimentos(); // Chama a função para obter os procedimentos
        // Filtrar apenas procedimentos de "Dispensa" e "Inexigibilidade"
        const filteredData = result.filter(procedimento =>
          procedimento.tipoExecucao.includes('Dispensa') || procedimento.tipoExecucao.includes('Inexigibilidade')
        );

        // Filtrar apenas procedimentos que NÃO sejam "Dispensa" ou "Inexigibilidade"
      // const filteredData = result.filter(procedimento =>
      //   !procedimento.tipoExecucao.includes('Dispensa') && !procedimento.tipoExecucao.includes('Inexigibilidade')
      // );

        setData(filteredData);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <PageHeader
        title="SICAP Procedimentos"
        breadcrumb={[
          { label: 'Página Inicial', path: '/' },
          { label: 'Transparência', path: '/sicap' },
          { label: 'SICAP Procedimentos' },
        ]}
      />
      
      <FilterSection />

      <InfoText>
        <p>Veja Declarações Negativas e Demais Documentos Clicando Aqui</p>
      </InfoText>
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar procedimentos: {error}</div>
      ) : (
        <DataTableComponent
          title="Procedimentos"
          columns={columnsProcedimentos}
          data={data}
        />
      )}
    </div>
  );
};

export default Sicap;
