import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NewMegaMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const NewMegaMenu = ({ activeMenu, closeMenu }) => {
  const location = useLocation();

  if (!activeMenu) return null;

  const handleSubmenuClick = () => {
    closeMenu();
  };

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  const renderLink = (to, text) => (
    <Link 
      to={to} 
      onClick={handleSubmenuClick}
      className={isLinkActive(to) ? 'active' : ''}
    >
      {text}
    </Link>
  );

  return (
    <div className={`megamenu ${activeMenu ? 'expanded' : ''}`}>
      <button className="back-button" onClick={closeMenu}>
        <FontAwesomeIcon icon={faChevronLeft} />
        Voltar
      </button>

      <h2>
        {activeMenu === 'receitas' && 'Receitas e Despesas'}
        {activeMenu === 'orgaos' && 'Órgãos e Servidores'}
        {activeMenu === 'politicas' && 'Planejamento e Políticas Públicas'}
        {activeMenu === 'fiscal' && 'Responsabilidade Fiscal'}
        {activeMenu === 'licitacoes' && 'CONTRATOS, CONVÊNIOS E LICITAÇÕES'}
        {activeMenu === 'legislacao' && 'Legislação e Publicação'}
        {activeMenu === 'ouvidoria' && 'Ouvidoria/SIC'}
      </h2>

      <div className="menu-content">
        {activeMenu === 'receitas' && (
          <div className="submenu-grid">
            <div className="column">
              <p>{renderLink('/receitas', 'Receita Prevista e Arrecadada')}</p>
              <p>{renderLink('/balanco', 'Balanço Orçamentário')}</p>
              <p>{renderLink('/extra-orcamentaria', 'Extra Orçamentária')}</p>
              <p>{renderLink('/balanco-anual', 'Relatório de Balanço Anual')}</p>
              <p>{renderLink('/pcasp', 'Relatório PCASP')}</p>
              <p>{renderLink('/informacoes-consolidadas', 'Informações Consolidadas')}</p>
              <p>{renderLink('/restos-a-pagar', 'Informação Consolidada - Restos a Pagar')}</p>
              <p>{renderLink('/ordem-cronologica-de-pagamentos', 'Ordem Cronológica de Pagamentos')}</p>
            </div>
            <div className="column">
              <p>{renderLink('/despesas-empenho', 'Despesa/ Empenho')}</p>
              <p>{renderLink('/pagamentos', 'Pagamentos')}</p>
              <p>{renderLink('/liquidacoes', 'Liquidação')}</p>
              <p>{renderLink('/despesas-fixadas', 'Despesas Fixadas')}</p>
              <p>{renderLink('/despesa-sintetica', 'Despesa Sintética')}</p>
              <p>{renderLink('/renuncias-fiscais', 'Renúncias Fiscais')}</p>
              <p>{renderLink('/desoneracao', 'Desoneração')}</p>
            </div>
            <div className="column">
              <p>{renderLink('/repasse-ou-transferencia', 'Repasse ou transferência de Recursos')}</p>
              <p>{renderLink('/transferencias-voluntarias-realizadas', 'Transferências Voluntárias Realizadas')}</p>
              <p>{renderLink('/transferencias-voluntarias-recebidas', 'Transferências Voluntárias Recebidas')}</p>
              <p>{renderLink('/divida-ativa', 'Dívida Ativa e Cobranças')}</p>
            </div>
          </div>
        )}

        {activeMenu === 'orgaos' && (
          <div className="submenu-grid">
            <div className="column">
              <p>{renderLink('/servidores', 'Servidores')}</p>
              <p>{renderLink('/terceirizados', 'Terceirizados')}</p>
              <p>{renderLink('/estagiarios', 'Estagiários')}</p>
              <p>{renderLink('/concurso-processo-seletivo', 'Concursos e Processos Seletivos')}</p>
            </div>
            <div className="column">
              <p>{renderLink('/estrutura-de-remuneracao', 'Estrutura de Remuneração')}</p>
              <p>{renderLink('/saude', 'Estabelecimentos e Profissionais da Saúde')}</p>
            </div>
            <div className="column">
              <p>{renderLink('/diarias', 'Diárias Pagas a Servidores')}</p>
              <p>{renderLink('/liquidacoes', 'Liquidações de Diárias')}</p>
              <p>{renderLink('/tabela-explicativa-de-valores-de-diarias', 'Tabela com Valores de Diárias')}</p>
            </div>
          </div>
        )}

        {activeMenu === 'politicas' && (
          <div className="submenu-grid">
            <div className="column">
              <p>{renderLink('/obras', 'Acompanhamento de Obras')}</p>
              <p>{renderLink('/obras-paralisadas', 'Relação de Obras paralisadas')}</p>
              <p>{renderLink('/programas', 'Acompanhamento de Programas')}</p>
              <p>{renderLink('/acoes-e-projetos', 'Acompanhamento de Ações e Projetos')}</p>
              
              <p>{renderLink('/metas-e-riscos-fiscais', 'Metas e Riscos Fiscais')}</p>
            </div>
            <div className="column">
              <p>{renderLink('/julgamento-de-contas', 'Julgamento de Contas pelo Legislativo')}</p>
              <p>{renderLink('/prestacao-de-contas', 'Prestação de Contas e Parecer Prévio do TCE')}</p>
              <p>{renderLink('/incentivos-a-projetos-culturais', 'Incentivos a Projetos Culturais / Esportivos')}</p>
            </div>
            <div className="column">
              <p>{renderLink('/planos', 'Planos Municipal')}</p>
            </div>
          </div>
        )}

        {activeMenu === 'fiscal' && (
          <div className="submenu-grid">
            <div className="column">
              <p>{renderLink('/relatorio-anual-de-gestao', 'Relatório Anual de Gestão ou Atividades')}</p>
              <p>{renderLink('/relatorio-do-controle-interno', 'Relatório do Controle Interno')}</p>
            </div>
            <div className="column">
              <p>{renderLink('/relatorio-resumido-da-execucao-orcamentaria', 'Relatório Resumido da Execução Orçamentária')}</p>
              <p>{renderLink('/relatorio-de-gestao-fiscal', 'Relatório de Gestão Fiscal')}</p>
            </div>
          </div>
        )}

        {activeMenu === 'licitacoes' && (
          <div className="submenu-grid">
            <div className="column">
              <p>{renderLink('/licitacoes', 'Procedimentos Licitatórios')}</p>
              <p>{renderLink('/dispensas-e-inexigibilidades', 'Dispensas e Inexigibilidades')}</p>
              <p>{renderLink('#', 'Adesão à Ata de Registro de Preços')}</p>
              <p>{renderLink('/contratos', 'Contratos e Aditivos')}</p>
              <p>{renderLink('/lista-de-fiscal-de-contrato', 'Fiscais de Contratos')}</p>
              
            </div>
            <div className="column">
            <p>{renderLink('#', 'Ordem Cronológica de Pagamentos')}</p>
              <p>{renderLink('/ordem-de-fornecimento', 'Ordem de Fornecimento')}</p>
              <p>{renderLink('/patrimonio-e-almoxarifado', 'Patrimônio e Almoxarifado')}</p>
              <p>{renderLink('/convenios-e-transferencias', 'Convênios e Transferências')}</p>              
            </div>
            <div className="column">
              <p>{renderLink('#', 'Plano de Contratações Anual (PCA)')}</p>
              <p>{renderLink('/sancoes-administrativas', 'Sanções Administrativas')}</p>
              
            </div>
          </div>
        )}

        {activeMenu === 'legislacao' && (
          <div className="submenu-grid">
            <div className="column">
              <p>{renderLink('/leis', 'Leis Municipais')}</p>
              <p>{renderLink('/acordos', 'Parceiras e Acordos Firmados')}</p>
            </div>
            <div className="column">
              <p>{renderLink('/convenio-pre-convenio-celebrados', 'Convênio/Pré-Convênio Celebrados')}</p>
              <p>{renderLink('/emendas-parlamentares', 'Emendas Parlamentares')}</p>
            </div>
          </div>
        )}

        {activeMenu === 'ouvidoria' && (
          <div className="submenu-grid">
            <div className="column">
              <p>{renderLink('/rol-de-informacoes', 'Rol de Informações')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewMegaMenu;