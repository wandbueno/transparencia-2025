import React, { useEffect, useState } from "react";
import { getReceitas } from "../../../services/receitasDespesas/receitas";
import DataTableComponent from "../../common/DataTable";
import PageHeader from '../../common/PageHeader';
import FilterSection from '../../common/FilterSection';
import InfoText from '../../common/InfoText';
import LoadingSpinner from '../../common/LoadingSpinner';
import './Receitas.css';
import ButtonTable from "../../common/ButtonTable";
// import { config } from '../../../../assets/config';

const columns = [
  // { name: "Ano", selector: (row) => row.chave.ano, sortable: true, width: '6%' },
  {
    name: "Mês/Ano",
    selector: (row) => `${row.chave.mes}/${row.chave.ano}`, // Certifica-se de acessar corretamente os dados
    sortable: true,
    width: '8%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {`${row.chave.mes}/${row.chave.ano}`} {/* Mostra o mês/ano corretamente */}
      </div>
    )
  },
  // {
  //   name: "Órgão",
  //   selector: (row) => row.orgaoUnidadeGestora,
  //   sortable: true,
  //   width: '17%',
  //   cell: (row) => (
  //     <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
  //       {row.orgaoUnidadeGestora}
  //     </div>
  //   )
  // },
  {
    name: "Natureza da Receita",
    selector: (row) => `${row.naturezaDaReceita} - ${row.receita}`, // Combina os dois valores
    sortable: true,
    width: '18%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {`${row.naturezaDaReceita} - ${row.receita}`} {/* Exibe ambos os valores */}
      </div>
    )
  },
  { name: "Origem dos Recursos", selector: (row) => row.origemDoRecurso, sortable: true, width: '18%'  },
  { name: "Valor Orçado", selector: (row) => row.valorOrcado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%' },
  { name: "Valor Arrecadado (Mês)", selector: (row) => row.arrecadacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '16%' },
  { name: "Valor Arrecadado (Anual)", selector: (row) => row.valorAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '17%' },

  // Adicionando a coluna de "Ver Detalhes"
  {
    name: 'Detalhes',
    selector: row => row.chave.codigoDaReceita, // Pega o código da receita
    cell: row => {
      const id = row.chave.codigoDaReceita; // Acessa o código da receita
      const ano = row.chave.ano || new Date().getFullYear(); // Usa o ano da receita ou o ano atual
      const mes = row.chave.mes || (new Date().getMonth() + 1).toString().padStart(2, '0'); // Usa o mês da receita ou o mês atual formatado
      const codigoDoOrgao = row.chave.codigoDoOrgao; // Acessa o código do órgão
      
      // Construa a URL corretamente, com queryParams atualizados
      return <ButtonTable 
               path="/receitas" 
               id={id} 
               queryParams={`?ano=${ano}&mes=${mes}&codigoDoOrgao=${codigoDoOrgao}`} 
               label="Ver Detalhes" 
             />;
    },
    width: '11%', 
    excludeFromExport: true
  }
  
];

const Receitas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, url } = await getReceitas();
        console.log(data.registros); // Adicione isso para verificar os dados recebidos
        setData(data.registros);  
        setUrl(url);  
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
        title="Receitas"
        breadcrumb={[
          { label: 'Receitas' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Receitas: {error}</div>
      ) : (
        <DataTableComponent
          title="Receitas"
          columns={columns}
          data={data}
        />
        
      )}
<p>Fonte de dados: </p>
   
    </div>
  );
};

export default Receitas;
