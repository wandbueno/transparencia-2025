import React from 'react';
import './NewMenuPrincipal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faDollarSign, faUsers, faGavel, faFileInvoice, faShoppingCart, faBook, faHeadset, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const NewMenuPrincipal = ({ isMenuActive, toggleMenu, closeMenu, isMobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();

  // Função para verificar se um menu deve estar ativo baseado na rota atual
  const isActive = (menu) => {
    // Caso especial para o Home - deve ser exatamente "/"
    if (menu === 'home') {
      return location.pathname === '/';
    }

    const menuRoutes = {
      receitas: ['/receitas', '/balanco', '/extra-orcamentaria', '/balanco-anual', '/pcasp', '/informacoes-consolidadas', '/restos-a-pagar', '/ordem-cronologica-de-pagamentos', '/despesas-empenho', '/pagamentos', '/liquidacoes', '/despesas-fixadas', '/despesa-sintetica', '/renuncias-fiscais', '/desoneracao', '/repasse-ou-transferencia', '/transferencias-voluntarias-realizadas', '/transferencias-voluntarias-recebidas', '/divida-ativa'],
      orgaos: ['/servidores', '/terceirizados', '/estagiarios', '/concurso-processo-seletivo', '/estrutura-de-remuneracao', '/saude', '/diarias', '/liquidacoes', '/tabela-explicativa-de-valores-de-diarias'],
      politicas: ['/obras', '/obras-paralisadas', '/metas-e-riscos-fiscais', '/julgamento-de-contas', '/prestacao-de-contas', '/incentivos-a-projetos-culturais', '/planos'],
      fiscal: ['/relatorio-anual-de-gestao', '/relatorio-do-controle-interno', '/relatorio-resumido-da-execucao-orcamentaria', '/relatorio-de-gestao-fiscal'],
      licitacoes: ['/licitacoes', '/dispensas-e-inexigibilidades', '/contratos', '/sancoes-administrativas', '/patrimonio-e-almoxarifado'],
      legislacao: ['/leis', '/acordos', '/convenio-pre-convenio-celebrados', '/emendas-parlamentares'],
      ouvidoria: ['/rol-de-informacoes']
    };

    return menuRoutes[menu]?.some(route => location.pathname === route || location.pathname.startsWith(route));
  };

  // Função para fechar o menu mobile
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    closeMenu();
  };

  return (
    <nav className={`navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      {isMobileMenuOpen && (
        <div className="menu-header">
          <button className="close-menu" onClick={closeMobileMenu}>
            Fechar <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      <ul className="menu-list">
        <li className={isActive('home') ? 'active' : ''} onClick={closeMobileMenu}>
          <Link to="/">
            <div className="menu-icon"><FontAwesomeIcon icon={faHome} /></div>
            <span>Home</span>
          </Link>
        </li>

        <li 
          onClick={() => toggleMenu('receitas')}
          className={isActive('receitas') ? 'active' : ''}
        >
          <div className="menu-icon"><FontAwesomeIcon icon={faDollarSign} /></div>
          <span>Receitas e Despesas</span>
        </li>

        <li 
          onClick={() => toggleMenu('orgaos')} 
          className={isActive('orgaos') ? 'active' : ''}
        >
          <div className="menu-icon"><FontAwesomeIcon icon={faUsers} /></div><span>Órgãos e Servidores</span>
        </li>
        <li 
          onClick={() => toggleMenu('politicas')} 
          className={isActive('politicas') ? 'active' : ''}
        >
          <div className="menu-icon"><FontAwesomeIcon icon={faGavel} /></div><span>Políticas Públicas</span>
        </li>
        <li 
          onClick={() => toggleMenu('fiscal')} 
          className={isActive('fiscal') ? 'active' : ''}
        >
          <div className="menu-icon"><FontAwesomeIcon icon={faFileInvoice} /></div><span>Resp. Fiscal</span>
        </li>
        <li 
          onClick={() => toggleMenu('licitacoes')} 
          className={isActive('licitacoes') ? 'active' : ''}
        >
          <div className="menu-icon"><FontAwesomeIcon icon={faShoppingCart} /></div><span>Compras e Licitações</span>
        </li>
        <li 
          onClick={() => toggleMenu('legislacao')} 
          className={isActive('legislacao') ? 'active' : ''}
        >
          <div className="menu-icon"><FontAwesomeIcon icon={faBook} /></div><span>Legislação e Publicação</span>
        </li>
        <li 
          onClick={() => toggleMenu('ouvidoria')} 
          className={isActive('ouvidoria') ? 'active' : ''}
        >
          <div className="menu-icon"><FontAwesomeIcon icon={faHeadset} /></div><span>Ouvidoria/SIC</span>
        </li>
      </ul>
    </nav>
  );
};

export default NewMenuPrincipal; 