import React, { useEffect, useState } from "react";
import { getEstruturaRemuneracao } from "../../../../services/orgãosServidores/estruturaRemuneracao";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
// import './Empenho.css';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsEstruturaRemuneracao = [
  { name: "Cargo", selector: (row) => row.cargo, sortable: true, width: '22%' },
  { name: "Nível", selector: (row) => row.nivel, sortable: true, width: '8%' },
  { name: "CBO", selector: (row) => row.cbo, sortable: true, width: '5%' },
  { name: "Código", selector: (row) => row.codigo, sortable: true, width: '6%' },
  { name: "Lei", selector: (row) => row.lei, sortable: true, width: '4%' },
  { name: "Data da Lei", selector: (row) => row.dataDaLei, sortable: true, width: '8%' },
  { name: "Qtd. Vagas", selector: (row) => row.vagas, sortable: true, width: '8%' },
  { name: "Vagas providas", selector: (row) => row.vagasProvidas, sortable: true, width: '10%' },
  { name: "Não providas", selector: (row) => row.vagasNaoProvidas, sortable: true, width: '10%' },
  { 
    name: "Salário", 
    selector: (row) => row.salario !== undefined && row.salario !== null 
      ? row.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
      : 'R$ 0,00', 
    sortable: true, 
    width: '10%'
  },
  {
    name: 'Detalhes',
    selector: row => row.chave.codigoDoNivel,
    cell: row => {
      const id = row.chave.codigoDoNivel;
  
      // Verifique se "ano" e "mes" realmente existem antes de criar a URL
      const ano = row.chave.ano || new Date().getFullYear(); // Se "row.chave.ano" for undefined, use o ano atual
      const mes = row.chave.mes || (new Date().getMonth() + 1).toString().padStart(2, '0'); // Se "row.chave.mes" for undefined, use o mês atual formatado
      
      // Verifique se ano e mes foram atribuídos corretamente
      console.log(`ID: ${id}, Ano: ${ano}, Mês: ${mes}`);
  
      return (
        <ButtonTable
          path="/estrutura-de-remuneracao"
          id={id}
          queryParams={`?ano=${ano}&mes=${mes}`}  // Passe o ano e o mês como parâmetros da query string
          label="Ver Detalhes"
        />
      );
    },
    width: '10%',
    excludeFromExport: true
  }
  
];



const EstruturaRemuneracao = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Estrutura de Remuneração - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getEstruturaRemuneracao();
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
        title="Estrutura de Remuneração"
        breadcrumb={[
          { label: 'Estrutura de Remuneração' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Estrutura de Remuneração: {error}</div>
      ) : (
        <DataTableComponent
          title="Estrutura de Remuneração"
          columns={columnsEstruturaRemuneracao}
          data={data}
        />
      )}

   
    </div>
  );
};

export default EstruturaRemuneracao;
