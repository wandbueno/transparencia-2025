// MegaMenu.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './MegaMenu.css';

const MegaMenu = ({ activeMenu, closeMenu, location }) => {
  if (!activeMenu) return null;

   // Função para fechar o submenu e o menu mobile
   const handleSubmenuClick = () => {
    closeMenu(); // Fecha o submenu
    closeMobileMenu(); // Fecha o menu mobile
  };


  return (
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
                  <Link to="/receitas" className={location.pathname === '/receitas' ? 'active' : ''} onClick={handleSubmenuClick}> Receita Prevista e Arrecadada </Link>
                </p>
                <p>
                  <Link to="/arrecadacao" className={location.pathname === '/arrecadacao' ? 'active' : ''} onClick={closeMenu}> Arrecadação </Link>
                </p>
                <p>
                  <Link to="/balanco" className={location.pathname === '/balanco' ? 'active' : ''} onClick={closeMenu}> Balanço Orçamentário </Link>
                </p>
                <p>
                  <Link to="/extra-orcamentaria" className={location.pathname === '/extra-orcamentaria' ? 'active' : ''} onClick={closeMenu}> Extra Orçamentária</Link>
                </p>
              </div>
              <div className="column">
                <p>
                  <Link to="/despesas-empenho" className={location.pathname === '/despesas-empenho' ? 'active' : ''} onClick={closeMenu}> Despesa/ Empenho </Link>
                </p>
                <p>
                  <Link to="/pagamentos" className={location.pathname === '/pagamentos' ? 'active' : ''} onClick={closeMenu}> Pagamentos </Link>
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
                     <Link to="/licitacoes" className={location.pathname === '/licitacoes' ? 'active' : ''} onClick={closeMenu} >Procedimentos Licitatórios</Link>
                  </p>
                  <p>
                     <Link to="/dispensas-e-inexigibilidades" className={location.pathname === '/dispensas-e-inexigibilidades' ? 'active' : ''} onClick={closeMenu} >Dispensas e Inexigibilidades
                     </Link>
                  </p>
                  <p>
                     <Link to="/contratos" className={location.pathname === '/contratos' ? 'active' : ''} onClick={closeMenu} >Contratos e Aditivos
                     </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
    </div>
  );
};

export default MegaMenu;
