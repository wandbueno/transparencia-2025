import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation  } from "react-router-dom";
import { getServidoresId } from "../../../../services/orgãosServidores/servidores";
import PageHeader from '../../../common/PageHeader';
import LoadingSpinner from '../../../common/LoadingSpinner'
import DataTableDetail from '../../../common/DataTableDetail';
import '../../PagesDetail.css';
import './ServidoresDetail.css'
import '../../../../assets/global.css';
import { config } from "../../../../assets/config";

const ServidoresDetail = () => {
  const { id } = useParams();  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ano = searchParams.get("ano");
  const mes = searchParams.get("mes");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef();  // Referência para capturar o conteúdo principal
  const tableRef = useRef(); // Referência para capturar as tabelas separadamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getServidoresId(id, ano, mes);  
        setData(result);
        
        // Atualizando o título da página com base nos dados recebidos
        if (result) {
          document.title = `${result.nome} - Portal Transparência - ${config.geral.nomeOrgao}`;
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, ano, mes]);  // Adiciona `id` como dependência do useEffect

  // Definindo o título dinamicamente com base nos dados
  const pageTitle = data ? `Detalhes: ${data.nome} - ${data.matricula}` : 'Detalhes';

  // Definição das colunas para exibir "Movimento de Vencimentos"
  const columnsMovimentos = [
    { name: 'Evento', selector: row => row.nome, sortable: true, width: '40%' },
    { name: 'Proventos', selector: row => row.proventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '30%' },
    { name: 'Descontos', selector: row => row.descontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '30%' },
  ];

  const columnsLicenca = [
    { name: 'Tipo de Licença', selector: row => row.tipoDeLicenca, sortable: true, width: '32%' },
    { name: 'Data de Afastamento', selector: row => row.dataDeAfastamento, sortable: true, width: '17%' },
    { name: 'Data de Retorno', selector: row => row.dataDeRetorno, sortable: true, width: '17%' },
    { name: 'Número/Ano do Ato', selector: row => row.numeroEAnoDoAto, sortable: true, width: '17%' },
    { name: 'Data de Publicação', selector: row => row.dataDePublicacao, sortable: true, width: '17%' },
  ];

  const columnsFerias = [
    { name: 'Data de Início', selector: row => row.dataInicio, sortable: true, width: '30%' },
    { name: 'Data de Fim', selector: row => row.dataFim, sortable: true, width: '30%' },
    { name: 'Observação', selector: row => row.observacao, sortable: true, width: '40%' },
  ];

  const columnsMovimentoFerias = [
    { name: 'Evento', selector: row => row.nome, sortable: true, width: '40%' },
    { 
      name: "Proventos", 
      selector: (row) => row.proventos ? row.proventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
      sortable: true, 
      width: '30%' 
    },
    { 
      name: "Descontos", 
      selector: (row) => row.descontos ? row.descontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
      sortable: true, 
      width: '30%' 
    },
   
  ];
  const columnsMovimentoComplementar = [
    { name: 'Evento', selector: row => row.nome, sortable: true, width: '40%' },
    { 
      name: "Proventos", 
      selector: (row) => row.proventos ? row.proventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
      sortable: true, 
      width: '30%' 
    },
    { 
      name: "Descontos", 
      selector: (row) => row.descontos ? row.descontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
      sortable: true, 
      width: '30%' 
    },
  ];

  const columnsMovimentoRescisao = [
    { name: 'Evento', selector: row => row.nome, sortable: true, width: '40%' },
    { 
      name: "Proventos", 
      selector: (row) => row.proventos ? row.proventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
      sortable: true, 
      width: '30%' 
    },
    { 
      name: "Descontos", 
      selector: (row) => row.descontos ? row.descontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00', 
      sortable: true, 
      width: '30%' 
    },
  ];
  

  return (
    <div className="container">
      <PageHeader
        title={pageTitle} 
        breadcrumb={[
          { label: 'Servidores', path: '/servidores' },
          { label: data ? `${data.nome} - ${data.matricula}` : 'Detalhes' },
        ]}
        showExportButton={true}  // Exibe o botão de exportação apenas aqui
        contentRef={contentRef}
        tableRef={tableRef}
        pageTitle={pageTitle}  
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div>Erro ao carregar detalhes: {error}</div>
      ) : (
      <div className="detalhes-geral">  
        <div className="detalhes" ref={contentRef}>
          {/* <div className="full-width">
            <span><p>Nome:</p> {data.nome}</span>
          </div>  */}
            <span><p>Mês/Ano:</p> {data.mesAno}</span>
            <span><p>Nome:</p> {data.nome}</span>
            <span><p>cpf:</p> {data.cpf}</span>
            <span><p>Matrícula:</p> {data.matricula}</span>
            <span><p>Tipo de Admissão:</p> {data.tipoDeVinculo}</span>
            <span><p>Data de Admissão:</p> {data.dataAdmissao}</span>
            <span><p>Nível:</p> {data.nivel}</span>
            <span><p>Carga Horária:</p> {data.cargaHoraria} horas</span>
            <span><p>Situação:</p> {data.situacao}</span>
            <span><p>Classificação:</p> {data.classificacao}</span>            
            <span><p>Decreto:</p> {data.decreto}</span>
            <span><p>Data Decreto:</p> {data.dataDecreto}</span>
            <span><p>Cargo:</p> {data.cargo}</span>
            <span><p>Cargo Recebimento:</p> {data.cargoRec}</span>
            <span><p>Departamento:</p> {data.departamento}</span>
            <span><p>Órgão:</p> {data.orgao}</span>
            <span><p>Jornada Semanal:</p> {data.orgao}</span>            
          <div className="full-width">
            <span><p>Categorias de Trabalhadores:</p> {data.categoriaDoTrabalhadorNoESocial}</span>
          </div>          
        </div>

        <div ref={tableRef}>

        <div className="tabela-detalhes">
            {data.licenca && data.licenca.total > 0 && (
              <>
                <h2 className="titulo-tabela">Licença</h2>
                <DataTableDetail
                  columns={columnsLicenca}
                  data={data.licenca.registros}
                />
              </>
            )}
          </div>
          
        <div className="tabela-detalhes">
          {data.movimentoVencimentos && data.movimentoVencimentos.total > 0 && (
            <>
              <h2 className="titulo-tabela">Vencimentos</h2>
              <DataTableDetail
                columns={columnsMovimentos}
                data={data.movimentoVencimentos.registros}
              />

              {/* Renderizando o somatório dos movimentos de vencimentos */}
              {data.somatorioMovimentoVencimentos && (
                <>
                  <h3 className="titulo-tabela">Somatório dos vencimentos</h3>
                  <div className="somatorio-detalhes">
                    <span><strong>Proventos:</strong> {data.somatorioMovimentoVencimentos.somatorioProventos !== undefined ? 
                      data.somatorioMovimentoVencimentos.somatorioProventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                    </span>
                    <span><strong>Descontos:</strong> {data.somatorioMovimentoVencimentos.somatorioDescontos !== undefined ? 
                      data.somatorioMovimentoVencimentos.somatorioDescontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                    </span>
                    <span><strong>Total Líquido:</strong> {data.somatorioMovimentoVencimentos.totalLiquido !== undefined ? 
                      data.somatorioMovimentoVencimentos.totalLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
          
        <div className="tabela-detalhes">
          {data.movimentoComplementar && data.movimentoComplementar.total > 0 && (
            <>
              <h2 className="titulo-tabela">Complementar</h2>
              <DataTableDetail
                columns={columnsMovimentoComplementar}
                data={data.movimentoComplementar.registros}
              />

              {/* Renderizando o somatório dos movimentos complementares */}
              {data.somatorioMovimentoComplementar && (
                <>
                  <h3 className="titulo-tabela">Somatório Movimentos Complementares</h3>
                  <div className="somatorio-detalhes">
                    <span><strong>Proventos:</strong> {data.somatorioMovimentoComplementar.somatorioProventos !== undefined ? 
                      data.somatorioMovimentoComplementar.somatorioProventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                    </span>
                    <span><strong>Descontos:</strong> {data.somatorioMovimentoComplementar.somatorioDescontos !== undefined ? 
                      data.somatorioMovimentoComplementar.somatorioDescontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                    </span>
                    <span><strong>Total Líquido:</strong> {data.somatorioMovimentoComplementar.totalLiquido !== undefined ? 
                      data.somatorioMovimentoComplementar.totalLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </div>


          <div className="tabela-detalhes">
            {data.ferias && data.ferias.total > 0 && (
              <>
                <h2 className="titulo-tabela">Férias</h2>
                <DataTableDetail
                  columns={columnsFerias}
                  data={data.ferias.registros}
                />
              </>
            )}
          </div>

          <div className="tabela-detalhes">
            {data.movimentoFerias && data.movimentoFerias.total > 0 && (
              <>
                <h2 className="titulo-tabela">Férias</h2>
                <DataTableDetail
                  columns={columnsMovimentoFerias}
                  data={data.movimentoFerias.registros}
                />

                {/* Renderizando o somatório dos movimentos de férias */}
                {data.somatorioMovimentoFerias && (
                  <>
                  <h3 className="titulo-tabela">Somatório de Férias</h3>
                    <div className="somatorio-detalhes">
                      <span><strong>Proventos:</strong> {data.somatorioMovimentoFerias.somatorioProventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      <span><strong>Descontos:</strong> {data.somatorioMovimentoFerias.somatorioDescontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      <span><strong>Total Líquido:</strong> {data.somatorioMovimentoFerias.totalLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="tabela-detalhes">
            {data.movimentoRescisao && data.movimentoRescisao.total > 0 && (
              <>
                <h2 className="titulo-tabela">Movimentos de Rescisão</h2>
                <DataTableDetail
                  columns={columnsMovimentoRescisao}
                  data={data.movimentoRescisao.registros}
                />

                {/* Renderizando o somatório dos movimentos de rescisão */}
                {data.somatorioMovimentoRescisao && (
                  <>
                    <h3 className="titulo-tabela">Somatório Movimentos de Rescisão</h3>
                    <div className="somatorio-detalhes">
                      <span><strong>Proventos:</strong> {data.somatorioMovimentoRescisao.somatorioProventos !== undefined ? 
                        data.somatorioMovimentoRescisao.somatorioProventos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                      </span>
                      <span><strong>Descontos:</strong> {data.somatorioMovimentoRescisao.somatorioDescontos !== undefined ? 
                        data.somatorioMovimentoRescisao.somatorioDescontos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                      </span>
                      <span><strong>Total Líquido:</strong> {data.somatorioMovimentoRescisao.totalLiquido !== undefined ? 
                        data.somatorioMovimentoRescisao.totalLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>


          
          </div>
       
        
      </div> 
       

      )} 
    </div>
  );
};

export default ServidoresDetail;