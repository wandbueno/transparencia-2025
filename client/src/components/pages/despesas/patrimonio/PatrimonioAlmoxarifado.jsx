import React, { useEffect, useState } from "react";
import { getPatrimonioAlmoxarifado } from "../../../../services/receitasDespesas/PatrimonioAlmoxarifado";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
// import './Empenho.css';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

const columnsPatrimonioAlmoxarifado = [
  { name: "Tombamento", selector: (row) => row.numeroDeTombamento, sortable: true, width: '10%' },
  { name: "Data de Aquisição", selector: (row) => row.dataDeAquisicao, sortable: true, width: '13%' },
  {
    name: "Mês/Ano",
    selector: (row) => `${row.mes.toString().padStart(2, '0')}/${row.ano}`,
    sortable: true,
    width: '8%',
  },
  {
    name: "Natureza Do Item",
    selector: (row) => row.subCategoria,
    sortable: true,
    width: '15%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.subCategoria}
      </div>
    )
  },
  { name: "Qtd", selector: (row) => row.quantidade, sortable: true, width: '5%' },
  {
    name: "Descrição",
    selector: (row) => row.descricao,
    sortable: true,
    width: '18%',
    cell: (row) => (
      <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
        {row.descricao}
      </div>
    )
  },
  { name: "Valor Original", selector: (row) => row.valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '11%' },
  { name: "Valor Atual", selector: (row) => row.valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '10%' },
  {
    name: 'Detalhes',
    selector: row => row.codigoDoPatrimonio, 
    cell: row => {
      const id = row.codigoDoPatrimonio;
      return <ButtonTable path="/patrimonio-e-almoxarifado" id={id} label="Ver Detalhes" />; // Usa o botão de detalhes
    },
    width: '11%', 
    excludeFromExport: true
  },
];


const PatrimonioAlmoxarifado = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    // Atualiza o título da aba do navegador
    document.title = `Patrimônio e Almoxarifado - Portal Transparência - ${config.geral.nomeOrgao}`

    const fetchData = async () => {
      try {
        const result = await getPatrimonioAlmoxarifado();
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
        title="Patrimônio e Almoxarifado"
        breadcrumb={[
          { label: 'Patrimônio e Almoxarifado' },
        ]}        
      />      
      <FilterSection  />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>        
         
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Despesas: {error}</div>
      ) : (
        <DataTableComponent
          title="Patrimônio e Almoxarifado"
          columns={columnsPatrimonioAlmoxarifado}
          data={data}
        />
      )}

   
    </div>
  );
};

export default PatrimonioAlmoxarifado;
