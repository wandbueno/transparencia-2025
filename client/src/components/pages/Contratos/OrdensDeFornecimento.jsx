import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postOrdensDeFornecimentoPaginadas } from "../../../services/contratosLicitacoes/ordensDeFornecimento";
import DataTableComponent from "../../common/DataTable";
import LoadingSpinner from '../../common/LoadingSpinner';
import '../../../assets/global.css';
import PageContent from "../../layout/pageContent";
import { config } from '../../../assets/config';
import ButtonTable from '../../common/ButtonTable';
import InfoText from "../../common/InfoText";

const OrdensDeFornecimento = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Ordens de Fornecimentos - Portal Transparência - ${config.geral.nomeOrgao}`;
    
    // Filtro simplificado
    const filtro = {
      pagina: 1,
      tamanhoDaPagina: 2500
    };

    const fetchData = async () => {
      try {
        const result = await postOrdensDeFornecimentoPaginadas(filtro);
        setData(result.registros);
      } catch (err) {
        console.error('Erro ao buscar ordens de fornecimentos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      name: "Compra",
      selector: (row) => row.codigoDaCompra,
      sortable: true, width: '7%'
    },
    {
      name: "Data",
      selector: (row) => row.data,
      sortable: true, width: '10%'
    },
    {
      name: "Modalidade",
      selector: (row) => row.modalidade,
      sortable: true, width: '13%'
    },
    {
      name: "Licitação",
      selector: (row) => row.licitacao,
      sortable: true, width: '10%'
    },
    
    {
      name: "Fornecedor",
      selector: (row) => row.fornecedor,
      sortable: true, width: '30%'
    },
    { name: "Valor Final", selector: (row) => row.valorTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '10%' },    
    {
      name: "Situação",
      selector: (row) => row.situacao,
      sortable: true, width: '10%'
    },
    
    {
      name: "Detalhes",
      selector: row => row.codigoDaCompra,
      cell: row => {
        const id = row.codigoDaCompra;
        return <ButtonTable path={`/ordem-de-fornecimento/${id}`} label="Ver Detalhes" />;
      },
      excludeFromExport: true, width: '10%'
    },
    // Adicione outras colunas conforme necessário
  ];

  return (
    <div className="container">
      <PageContent 
        title="Ordens de Fornecimentos"
        breadcrumb={[
          { label: 'Ordens de Fornecimentos' },
        ]}
        infoTextHref="https://conceicaodotocantins.to.gov.br/transparencia/declaracoes/teste" 
      />
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar ordens de fornecimento: {error}</div>
      ) : (
        <DataTableComponent
          columns={columns}
          data={data}
        />
      )}
    </div>
  );
};

export default OrdensDeFornecimento;