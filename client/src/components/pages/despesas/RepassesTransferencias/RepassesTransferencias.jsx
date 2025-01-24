import React, { useEffect, useState } from "react";
import { getRepassesTransferencias } from "../../../../services/receitasDespesas/RepassesTransferencias";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
// import './Empenho.css';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsRepassesTransferencias = [
  { 
    name: "Mês/Ano", 
    selector: (row) => `${row.chave.mes}/${row.chave.ano}`, 
    sortable: true, 
    width: '8%' 
  },
  { name: "Órgão", selector: (row) => row.orgao, sortable: true, width: '20%' },
  { name: "Título", selector: (row) => row.titulo, sortable: true, width: '19%' },
  { name: "Tipo de Repasse", selector: (row) => row.tipoDeLancamento, sortable: true, width: '15%' },
  
  { 
    name: "Valor Movimento (Mês)", 
    selector: (row) => row.valorMovimento ? row.valorMovimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Valor Acumulado", 
    selector: (row) => row.valorAcumulado ? row.valorAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
    sortable: true, 
    width: '13%' 
  },

  {
    name: 'Detalhes',
    selector: row => row.chave.codigoDaExtra,
    cell: row => {
      const id = row.chave.codigoDaExtra;
  
      // Verifique se "ano" e "mes" realmente existem antes de criar a URL
      const ano = row.chave.ano || new Date().getFullYear(); // Se "row.chave.ano" for undefined, use o ano atual
      const mes = row.chave.mes || (new Date().getMonth() + 1).toString().padStart(2, '0'); // Se "row.chave.mes" for undefined, use o mês atual formatado
      
      // Verifique se ano e mes foram atribuídos corretamente
      console.log(`ID: ${id}, Ano: ${ano}, Mês: ${mes}`);
  
      return (
        <ButtonTable
          path="/repasse-ou-transferencia"
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


const RepassesTransferencias = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Repasse ou transferência de Recursos - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getRepassesTransferencias();
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
        title="Repasse ou transferência de Recursos"
        breadcrumb={[
          { label: 'Repasse ou transferência de Recursos' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/?jsf=jet-data-table:filter_declaracao&tax=tipo-declaracao:133">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Repasse ou transferência de Recursos: {error}</div>
      ) : (
        <DataTableComponent
          title="Repasse ou transferência de Recursos"
          columns={columnsRepassesTransferencias}
          data={data}
        />
      )}

   
    </div>
  );
};

export default RepassesTransferencias;
