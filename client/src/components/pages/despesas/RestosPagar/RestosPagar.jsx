import React, { useEffect, useState } from "react";
import { getRestoPagar } from "../../../../services/receitasDespesas/RestoPagar";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsRestosPagar = [
  { name: "Ano", selector: (row) => row.ano, sortable: true, width: '5%' },
  { name: "Órgão", selector: (row) => row.orgao, sortable: true, width: '20%' },
  { name: "Fornecedor", selector: (row) => row.fornecedor, sortable: true, width: '20%' },
  { name: "CPF/CNPJ", selector: (row) => row.cpfCnpj, sortable: true, width: '11%' },
  { name: "Valor Empenhado", 
    selector: (row) => row.valorEmpenhado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '12%' 
  },
  { name: "Valor Liquidado", 
    selector: (row) => row.valorLiquidado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '12%' 
  },
  { name: "Valor Pago", 
    selector: (row) => row.valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    sortable: true, 
    width: '10%' 
  },
  {
    name: 'Detalhes',
    selector: row => row.codigo, 
    cell: row => {
      const id = row.codigo;
      
      // Verifique se "ano" realmente existe, senão use o ano atual
      const ano = row.ano || new Date().getFullYear(); // Se "row.ano" for undefined, usa o ano atual
            
      return (
        <ButtonTable
          path="/restos-a-pagar" 
          id={id} 
          queryParams={`?ano=${ano}`}  // Passe o ano como parâmetro da query string
          label="Ver Detalhes"
        />
      );
    },
    width: '10%', 
    excludeFromExport: true
  }
  
];


const RestosPagar = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Informação Consolidada - Restos a Pagar - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getRestoPagar();
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
        title="Informação Consolidada - Restos a Pagar"
        breadcrumb={[
          { label: 'Informação Consolidada - Restos a Pagar' },
        ]}
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Informação Consolidada - Restos a Pagar: {error}</div>
      ) : (
        <DataTableComponent
          title="Informação Consolidada - Restos a Pagar"
          columns={columnsRestosPagar}
          data={data}
        />
      )}

   
    </div>
  );
};

export default RestosPagar;
