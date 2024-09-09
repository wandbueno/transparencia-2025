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
  faHeadset,
  faExternalLinkAlt,
  faSearch  
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

  // Fecha o menu ativo atual
  const closeMenu = () => {
    setActiveMenu(null);
  };

  return (
    <div>
      {/* Seção superior com logo, busca e botões */}
      <header className="header-info">
        <img src={logo} alt="Logo" className="logo" />
        <div className="search-container">
          <input type="text" placeholder="Buscar no portal..." />
          <button aria-label="Buscar">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className="action-buttons">
          <a href="/diario-oficial" className="btn" title="Diário Oficial">
            <FontAwesomeIcon icon={faBook} />
          </a>
          <a href="/ouvidoria" className="btn" title="Ouvidoria/e-Sic">
            <FontAwesomeIcon icon={faHeadset} />
          </a>
          <a href="https://prefeitura.to.gov.br" target="_blank" className="btn" title="Site Institucional">
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </div>
      </header>

      {/* Seção de navegação */}
      <nav className="navbar">
        <ul className="menu-list">
          {/* Menu Home */}
          <li className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>
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
                  <Link to="/receita" className={location.pathname === '/receita' ? 'active' : ''} onClick={closeMenu}> Receita Prevista e Arrecadada </Link>
                </p>
                <p>
                  <Link to="/arrecadacao" className={location.pathname === '/arrecadacao' ? 'active' : ''} onClick={closeMenu}> Arrecadação </Link>
                </p>
                <p>
                  <Link to="/balanco" className={location.pathname === '/balanco' ? 'active' : ''} onClick={closeMenu}> Balanço Orçamentário </Link>
                </p>
              </div>
              <div className="column">
                <p>
                  <Link to="/despesas" className={location.pathname === '/despesas' ? 'active' : ''} onClick={closeMenu}> Despesa/ Empenho </Link>
                </p>
                <p>
                  <Link to="/pagamento" className={location.pathname === '/pagamento' ? 'active' : ''} onClick={closeMenu}> Pagamentos </Link>
                </p>
              </div>
              <div className="column">
                <p>
                  <Link to="/resumo-rubrica" className={location.pathname === '/resumo-rubrica' ? 'active' : ''} onClick={closeMenu}> Resumo Mensal por Rubrica </Link>
                </p>
                <p>
                  <Link to="/resumo-alinea" className={location.pathname === '/resumo-alinea' ? 'active' : ''} onClick={closeMenu}> Resumo Mensal por Alínea </Link>
                </p>
                <p>
                  <Link to="/transferencias" className={location.pathname === '/transferencias' ? 'active' : ''} onClick={closeMenu}> Transferências Financeiras Recebidas </Link>
                </p>
              </div>
            </div>            
            )}

            {activeMenu === 'orgaos' && (              
              <div className="submenu-grid">
                <div className="column">
                  <p>
                    <Link to="/servidores" className={location.pathname === '/servidores' ? 'active' : ''} onClick={closeMenu}>Servidores</Link>
                  </p>
                  <p>
                    <Link to="/terceirizados" className={location.pathname === '/terceirizados' ? 'active' : ''} onClick={closeMenu}>Terceirizados</Link>
                  </p>
                  <p>
                    <Link to="/estagiarios" className={location.pathname === '/estagiarios' ? 'active' : ''} onClick={closeMenu}>Estagiários</Link>
                  </p>
                </div>
                <div className="column">
                  <p>
                    <Link to="/saude" className={location.pathname === '/saude' ? 'active' : ''} onClick={closeMenu}>Estabelecimentos e Profissionais da Saúde</Link>
                  </p>
                  <p>
                    <Link to="/concursos" className={location.pathname === '/concursos' ? 'active' : ''} onClick={closeMenu} >Concursos e Processos Seletivos</Link>
                  </p>
                </div>
                <div className="column">
                  <p>
                    <Link to="/diarias" className={location.pathname === '/diarias' ? 'active' : ''} onClick={closeMenu}>Diárias Pagas a Servidores</Link>
                  </p>
                  <p>
                    <Link to="/liquidacoes" className={location.pathname === '/liquidacoes' ? 'active' : ''} onClick={closeMenu}>Liquidações de Diárias</Link>
                  </p>
                  <p>
                    <Link to="/tabela-diarias" className={location.pathname === '/tabela-diarias' ? 'active' : ''} onClick={closeMenu} >Tabela com Valores de Diárias</Link>
                  </p>
                </div>
              </div>
              
            )}

            {activeMenu === 'fiscal' && (
              <div className="submenu-grid">
                <div className="column">
                  <p>
                    <Link to="/relatorio-gestao" className={location.pathname === '/relatorio-gestao' ? 'active' : ''} onClick={closeMenu}>Relatório de Gestão Fiscal</Link>                    
                  </p>
                  <p>
                    <Link to="/execucao-orcamentariao" className={location.pathname === '/execucao-orcamentaria' ? 'active' : ''}onClick={closeMenu} >Execução Orçamentária</Link>
                  </p>
                </div>
              </div>
            )}

            {activeMenu === 'licitacoes' && (
              <div className="submenu-grid">
                <div className="column">
                  <p>
                     <Link to="/licitacoes" className={location.pathname === '/execucao-orcamentaria' ? 'active' : ''} onClick={closeMenu} >Procedimentos Licitatórios</Link>
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
