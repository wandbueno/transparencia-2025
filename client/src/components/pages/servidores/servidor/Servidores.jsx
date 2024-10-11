import React, { useEffect, useState } from "react";
import { getServidores } from "../../../../services/orgãosServidores/servidores";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsServidores = [
  { name: "Mês/Ano", selector: (row) => row.mesAno, sortable: true, width: '8%' },
  { name: "Matrícula", selector: (row) => row.matricula, sortable: true, width: '6%' },
  { name: "CPF", selector: (row) => row.cpf, sortable: true, width: '8%' },
  {
    name: "Nome",
    selector: (row) => row.nome,
    sortable: true,
    width: '12%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.nome}
      </div>
    )
  },
  { name: "Cargo", selector: (row) => row.cargo, sortable: true, width: '10%' },
  { name: "Situação", selector: (row) => row.situacao, sortable: true, width: '8%' },
  // { name: "Admissão", selector: (row) => row.dataAdmissao, sortable: true, width: '8%' },
  
  { 
    name: "Total Proventos", 
    selector: (row) => row.proventos ? row.proventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Total Descontos", 
    selector: (row) => row.descontos ? row.descontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
    sortable: true, 
    width: '10%' 
  },
  { 
    name: "Total Líquido", 
    selector: (row) => row.totalLiquido ? row.totalLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
    sortable: true, 
    width: '10%' 
  },

  { name: "Situação", selector: (row) => row.situacaoPagamento, sortable: true, width: '8%' },
  {
    name: 'Detalhes',
    selector: row => row.matricula,
    cell: row => {
      const id = row.matricula;
      
      // Verifique se "ano" e "mes" realmente existem antes de criar a URL
      const ano = row.ano || new Date().getFullYear(); // Se "row.ano" for undefined, use o ano atual
      const mes = row.mes || (new Date().getMonth() + 1).toString().padStart(2, '0'); // Se "row.mes" for undefined, use o mês atual formatado
      
      // Verifique se ano e mes foram atribuídos corretamente
      console.log(`ID: ${id}, Ano: ${ano}, Mês: ${mes}`);
  
      return (
        <ButtonTable
          path="/servidores" 
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


const Servidores = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Servidores - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getServidores();
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
        title="Servidores"
        breadcrumb={[
          { label: 'Servidores' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Servidores: {error}</div>
      ) : (
        <DataTableComponent
          title="Servidores"
          columns={columnsServidores}
          data={data}
        />
      )}

   
    </div>
  );
};

export default Servidores;
