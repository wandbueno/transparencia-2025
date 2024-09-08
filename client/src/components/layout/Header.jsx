import React, { useState } from 'react';
import './Header.css';
import '../../assets/global.css';
import logo from '../../assets/LogoPublixelOfc.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faDollarSign, 
  faUsers, 
  faGavel, 
  faFileInvoice, 
  faShoppingCart, 
  faBook, 
  faHeadset 
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation(); // Usando o useLocation para pegar a rota atual

  // Configuração dos menus principais e seus submenus
  const menuConfig = {
    receitas: ['/despesas', '/receita'],
    orgaos: ['/servidores', '/terceirizados'],
    politicas: ['/politicas'],
    fiscal: ['/fiscal'],
    licitacoes: ['/licitacoes'],
    legislacao: ['/legislacao'],
    ouvidoria: ['/ouvidoria']
  };

  // Verifica se o menu principal deve estar ativo
  const isMenuActive = (menuKey) => {
    const menuRoutes = menuConfig[menuKey] || [];
    return menuRoutes.some(route => location.pathname.includes(route));
  };

  const [activeMenu, setActiveMenu] = useState(null);

  // Alterna o menu
  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div>
      {/* Seção superior com logo, busca e botões */}
      <header className="header-info">
        <img src={logo} alt="Logo" className="logo" />
        <div className="search-container">
          <input type="text" placeholder="Buscar no portal..." />
          <button className="search-button">🔍</button>
        </div>
        <div className="action-buttons">
          <button className="btn">Transparência</button>
          <button className="btn">Prefeitura</button>
        </div>
      </header>

      {/* Seção de navegação */}
      <nav className="navbar">
        <ul className="menu-list">
          {/* Menu Home */}
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">
              <div className="menu-icon"><FontAwesomeIcon icon={faHome} /></div>
              <span>Home</span>
            </Link>
          </li>

          {/* Menu Receitas e Despesas */}
          <li 
            onClick={() => toggleMenu('receitas')}
            className={isMenuActive('receitas') ? 'active' : ''}
          >
            <div className="menu-icon"><FontAwesomeIcon icon={faDollarSign} /></div><span>Receitas e Despesas</span>
          </li>

          {/* Outros menus */}
          <li 
            onClick={() => toggleMenu('orgaos')} 
            className={isMenuActive('orgaos') ? 'active' : ''}
          >
            <div className="menu-icon"><FontAwesomeIcon icon={faUsers} /></div><span>Órgãos e Servidores</span>
          </li>
          <li 
            onClick={() => toggleMenu('politicas')} 
            className={isMenuActive('politicas') ? 'active' : ''}
          >
            <div className="menu-icon"><FontAwesomeIcon icon={faGavel} /></div><span>Políticas Públicas</span>
          </li>
          <li 
            onClick={() => toggleMenu('fiscal')} 
            className={isMenuActive('fiscal') ? 'active' : ''}
          >
            <div className="menu-icon"><FontAwesomeIcon icon={faFileInvoice} /></div><span>Resp. Fiscal</span>
          </li>
          <li 
            onClick={() => toggleMenu('licitacoes')} 
            className={isMenuActive('licitacoes') ? 'active' : ''}
          >
            <div className="menu-icon"><FontAwesomeIcon icon={faShoppingCart} /></div><span>Compras e Licitações</span>
          </li>
          <li 
            onClick={() => toggleMenu('legislacao')} 
            className={isMenuActive('legislacao') ? 'active' : ''}
          >
            <div className="menu-icon"><FontAwesomeIcon icon={faBook} /></div><span>Legislação e Publicação</span>
          </li>
          <li 
            onClick={() => toggleMenu('ouvidoria')} 
            className={isMenuActive('ouvidoria') ? 'active' : ''}
          >
            <div className="menu-icon"><FontAwesomeIcon icon={faHeadset} /></div><span>Ouvidoria/SIC</span>
          </li>
        </ul>
      </nav>

      {/* Megamenu */}
      {activeMenu && (
        <div className={`megamenu ${activeMenu ? 'expanded' : ''}`}>
          <h2>
            {activeMenu === 'receitas' && ' Receitas e Despesas '}
            {activeMenu === 'orgaos' && 'Órgãos e Servidores '}
            {activeMenu === 'politicas' && 'Planejamento e Políticas Públicas '}
            {activeMenu === 'fiscal' && 'Responsabilidade Fiscal '}
            {activeMenu === 'licitacoes' && 'CONTRATOS, CONVÊNIOS E LICITAÇÕES '}
            {activeMenu === 'legislacao' && 'Legislação e Publicação '}
            {activeMenu === 'ouvidoria' && 'Ouvidoria/SIC '}
          </h2>
          <div className="menu-content">
            {activeMenu === 'receitas' && (
              <div className="submenu-grid">
                <div className="column">
                  <p>
                    <a href="/receita" className={location.pathname === '/receita' ? 'active' : ''}> Receita Prevista e Arrecadada </a>
                  </p>
                  <p>
                    <a href="/arrecadacao" className={location.pathname === '/arrecadacao' ? 'active' : ''}> Arrecadação </a>
                  </p>
                  <p>
                    <a href="/balanco" className={location.pathname === '/balanco' ? 'active' : ''}> Balanço Orçamentário </a>
                  </p>
                </div>
                <div className="column">
                  <p>
                    <a href="/despesas" className={location.pathname === '/despesas' ? 'active' : ''}> Despesa/ Empenho </a>
                  </p>
                  <p>
                    <a href="/pagamento" className={location.pathname === '/pagamento' ? 'active' : ''}> Pagamentos </a>
                  </p>
                </div>
                <div className="column">
                  <p>
                    <a href="/resumo-rubrica" className={location.pathname === '/resumo-rubrica' ? 'active' : ''}> Resumo Mensal por Rubrica </a>
                  </p>
                  <p>
                    <a href="/resumo-alinea" className={location.pathname === '/resumo-alinea' ? 'active' : ''}> Resumo Mensal por Alínea </a>
                  </p>
                  <p>
                    <a href="/transferencias" className={location.pathname === '/transferencias' ? 'active' : ''}> Transferências Financeiras Recebidas </a>
                  </p>
                </div>
              </div>
            )}

            {activeMenu === 'orgaos' && (
              <div className="submenu-grid">
                <div className="column">
                  <p>
                    <a href="/servidores" className={location.pathname === '/servidores' ? 'active' : ''}> Servidores </a>
                  </p>
                  <p>
                    <a href="/terceirizados" className={location.pathname === '/terceirizados' ? 'active' : ''}> Terceirizados </a>
                  </p>
                  <p>
                    <a href="/estagiarios" className={location.pathname === '/estagiarios' ? 'active' : ''}> Estagiários </a>
                  </p>
                </div>
                <div className="column">
                  <p>
                    <a href="/saude" className={location.pathname === '/saude' ? 'active' : ''}> Estabelecimentos e Profissionais da Saúde </a>
                  </p>
                  <p>
                    <a href="/concursos" className={location.pathname === '/concursos' ? 'active' : ''}> Concursos e Processos Seletivos </a>
                  </p>
                </div>
                <div className="column">
                  <p>
                    <a href="/diarias" className={location.pathname === '/diarias' ? 'active' : ''}> Diárias Pagas a Servidores </a>
                  </p>
                  <p>
                    <a href="/liquidacoes" className={location.pathname === '/liquidacoes' ? 'active' : ''}> Liquidações de Diárias </a>
                  </p>
                  <p>
                    <a href="/tabela-diarias" className={location.pathname === '/tabela-diarias' ? 'active' : ''}> Tabela com Valores de Diárias </a>
                  </p>
                </div>
              </div>
            )}

            {activeMenu === 'fiscal' && (
              <div className="submenu-grid">
                <div className="column">
                  <p>
                    <a href="/relatorio-gestao" className={location.pathname === '/relatorio-gestao' ? 'active' : ''}> Relatório de Gestão Fiscal </a>
                  </p>
                  <p>
                    <a href="/execucao-orcamentaria" className={location.pathname === '/execucao-orcamentaria' ? 'active' : ''}> Execução Orçamentária </a>
                  </p>
                </div>
              </div>
            )}

            {activeMenu === 'licitacoes' && (
              <div className="submenu-grid">
                <div className="column">
                  <p>
                    <a href="/licitacoes" className={location.pathname === '/licitacoes' ? 'active' : ''}> Procedimentos Licitatórios </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
