import React, { useEffect, useState } from "react";
import { getDiarias } from "../../../../services/orgãosServidores/diarias";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
// import './Empenho.css';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

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
      return <ButtonTable path="/diarias" id={id} label="Ver Detalhes" />; // Usa o botão de detalhes
    },
    width: '11%', 
    excludeFromExport: true
  },
];


const Diarias = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Diárias Pagas a Servidores - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getDiarias();
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
        title="Diárias Pagas a Servidores"
        breadcrumb={[
          { label: 'Diárias Pagas a Servidores' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
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
