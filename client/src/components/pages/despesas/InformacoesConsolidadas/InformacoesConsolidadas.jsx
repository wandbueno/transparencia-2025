import React, { useEffect, useState } from "react";
import { getConsolidadosPaginados } from "../../../../services/receitasDespesas/InformacoesConsolidadas";
import DataTableComponent from "../../../common/DataTable";
import PageHeader from '../../../common/PageHeader';
import FilterSection from '../../../common/FilterSection/FilterSection';
import InfoText from '../../../common/InfoText';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ButtonTable from "../../../common/ButtonTable";
import { config } from '../../../../assets/config';

// Função auxiliar para truncar texto
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const columnsConsolidados = [
  // { 
  //   name: "Código do Empenho", 
  //   selector: (row) => row.numeroDoEmpenhoFormatado, 
  //   sortable: true, 
  //   width: '10%' 
  // },
  { 
    name: "Órgão", 
    selector: (row) => truncateText(row.nomeDoOrgao, 25), // Limita a 25 caracteres
    sortable: true, 
    width: '16%',
    cell: row => (
      <div title={row.nomeDoOrgao}> {/* Mostra o texto completo no tooltip */}
        {truncateText(row.nomeDoOrgao, 25)}
      </div>
    )
  },
  { 
    name: "Ano", 
    selector: (row) => row.anoDoEmpenho, 
    sortable: true, 
    width: '5%' 
  },
  { 
    name: "Fornecedor", 
    selector: (row) => row.fornecedor, 
    sortable: true, 
    width: '28%' 
  },
  { 
    name: "Rubrica", 
    selector: (row) => row.rubricaFormatada, 
    sortable: true, 
    width: '15%' 
  },
  { 
    name: "Empenhado", 
    selector: (row) => row.valorEmpenhado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
    sortable: true, 
    width: '9%' 
  },
  { 
    name: "Liquidado", 
    selector: (row) => row.valorLiquidado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
    sortable: true, 
    width: '9%' 
  },
  { 
    name: "Pago", 
    selector: (row) => row.valorPago?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00', 
    sortable: true, 
    width: '9%' 
  },
  {
    name: 'Detalhes',
    selector: row => row.codigoDoEmpenho,
    cell: row => (
      <ButtonTable
        path="/informacoes-consolidadas"
        id={row.codigoDoEmpenho}
        label="Ver Detalhes"
      />
    ),
    width: '10%',
    excludeFromExport: true
  }
];

const InformacoesConsolidadas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Atualiza o título da aba do navegador
    document.title = `Informações Consolidadas - Portal Transparência - ${config.geral.nomeOrgao}`;

    const fetchData = async () => {
      try {
        const result = await getConsolidadosPaginados();
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
        title="Informações Consolidadas"
        breadcrumb={[
          { label: 'Informações Consolidadas' },
        ]}
      />
      
      <FilterSection />
      
      <InfoText href="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/">
        Veja Declarações Negativas e Demais Documentos Clicando Aqui
      </InfoText>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar Informações Consolidadas: {error}</div>
      ) : (
        <DataTableComponent
          title="Informações Consolidadas"
          columns={columnsConsolidados}
          data={data}
        />
      )}
    </div>
  );
};

export default InformacoesConsolidadas; 