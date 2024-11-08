import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getExtra } from "../../../../services/receitasDespesas/extraorcamentaria";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
// import './Despesas.css';
import ButtonTable from "../../../common/ButtonTable";
import { config } from "../../../../assets/config";

const columnsExtra = [
  { name: "Órgão", selector: (row) => row.orgao, sortable: true, width: '15%' },
  { name: "Título", selector: (row) => row.titulo, sortable: true, width: '15%' },
  { name: "Tipo Extra", selector: (row) => row.tipoDoLancamento, sortable: true, width: '15%' },
  { name: "Valor Movimento (Mês)", selector: (row) => row.valorMovimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '17%' },
  { name: "Valor Anulação (Mês)", selector: (row) => row.valorAnulacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '16%' },
  { name: "Valor Acumulado", selector: (row) => row.valorAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '11%' },
  {
    name: "Detalhes",
    selector: (row) => row.chave.codigoDaExtra, // Código da despesa extra-orçamentária
    cell: (row) => {
      const id = row.chave.codigoDaExtra;
      const ano = row.ano || new Date().getFullYear(); // Pega o ano da row ou o ano atual
      const mes = row.mes || (new Date().getMonth() + 1).toString().padStart(2, '0'); // Pega o mês da row ou o mês atual formatado
    
      // Verifica se o ID, ano e mês estão corretos
      console.log(`ID: ${id}, Ano: ${ano}, Mês: ${mes}`);
    
      return (
        <ButtonTable
          path="/extra-orcamentaria" // O caminho para a página de detalhes
          id={id}
          queryParams={`?ano=${ano}&mes=${mes}`}  // Passa o ano e o mês como parâmetros da query string
          label="Ver Detalhes"
        />
      );
    },
    width: '11%', 
  }
  
];


const Extraorcamentaria = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Extra Orçamentária - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getExtra();
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
