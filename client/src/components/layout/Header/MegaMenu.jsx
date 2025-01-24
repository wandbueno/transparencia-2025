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
                  <Link to="/balanco" className={location.pathname === '/balanco' ? 'active' : ''} onClick={closeMenu}> Balanço Orçamentário </Link>
                </p>
                <p>
                  <Link to="/extra-orcamentaria" className={location.pathname === '/extra-orcamentaria' ? 'active' : ''} onClick={closeMenu}> Extra Orçamentária</Link>
                </p>
                <p>
                  <Link to="/balanco-anual" className={location.pathname === '/balanco-anual' ? 'active' : ''} onClick={closeMenu}>Relatório de Balanço Anual</Link>
                </p>
                <p>
                  <Link to="/pcasp" className={location.pathname === '/pcasp' ? 'active' : ''} onClick={closeMenu}>Relatório PCASP</Link>
                </p>
                <p>
                  <Link to="/informacoes-consolidadas" className={location.pathname === '/informacoes-consolidadas' ? 'active' : ''} onClick={closeMenu}> Informações Consolidadas</Link>
                </p>
                <p>
                  <Link to="/restos-a-pagar" className={location.pathname === '/restos-a-pagar' ? 'active' : ''} onClick={closeMenu}>Informação Consolidada - Restos a Pagar</Link>
                </p>
                <p>
                  <Link to="/ordem-cronologica-de-pagamentos" className={location.pathname === '/ordem-cronologica-de-pagamentos' ? 'active' : ''} onClick={closeMenu}>Ordem Cronológica de Pagamentos</Link>
                </p>
              </div>
              <div className="column">
                <p>
                  <Link to="/despesas-empenho" className={location.pathname === '/despesas-empenho' ? 'active' : ''} onClick={closeMenu}> Despesa/ Empenho </Link>
                </p>
                <p>
                  <Link to="/pagamentos" className={location.pathname === '/pagamentos' ? 'active' : ''} onClick={closeMenu}> Pagamentos </Link>
                </p>
                <p>
                  <Link to="/liquidacoes" className={location.pathname === '/liquidacoes' ? 'active' : ''} onClick={closeMenu}> Liquidação </Link>
                </p>
                <p>
                  <Link to="/despesas-fixadas" className={location.pathname === '/despesas-fixadas' ? 'active' : ''} onClick={closeMenu}> Despesas Fixadas </Link>
                </p>
                <p>
                  <Link to="/despesa-sintetica" className={location.pathname === '/despesa-sintetica' ? 'active' : ''} onClick={closeMenu}> Despesa Sintética </Link>
                </p>
                <p>
                  <Link to="/renuncias-fiscais" className={location.pathname === '/renuncias-fiscais' ? 'active' : ''} onClick={closeMenu}> Renúncias Fiscais</Link>
                </p>
                <p>
                  <Link to="/desoneracao" className={location.pathname === '/desoneracao' ? 'active' : ''} onClick={closeMenu}> Desoneração </Link>
                </p>
              </div>
              <div className="column">
              <p>
                  <Link to="/repasse-ou-transferencia" className={location.pathname === '/repasse-ou-transferencia' ? 'active' : ''} onClick={closeMenu}> Repasse ou transferência de Recursos</Link>
                </p>
                <p>
                  <Link to="/transferencias-voluntarias-realizadas" className={location.pathname === '/transferencias-voluntarias-realizadas' ? 'active' : ''} onClick={closeMenu}> Transferências Voluntárias Realizadas</Link>
                </p>
                <p>
                  <Link to="/transferencias-voluntarias-recebidas" className={location.pathname === '/transferencias-voluntarias-recebidas' ? 'active' : ''} onClick={closeMenu}> Transferências Voluntárias Recebidas</Link>
                </p>
                <p>
                  <Link to="/divida-ativa" className={location.pathname === '/divida-ativa' ? 'active' : ''} onClick={closeMenu}> Dívida Ativa e Cobranças</Link>
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
                  <p>
                    <Link to="/concurso-processo-seletivo" className={location.pathname === '/concurso-processo-seletivo' ? 'active' : ''} onClick={closeMenu}>Concursos e Processos Seletivos</Link>
                  </p>
                </div>
                <div className="column">
                  <p>
                    <Link to="/estrutura-de-remuneracao" className={location.pathname === '/estrutura-de-remuneracao' ? 'active' : ''} onClick={closeMenu}>Estrutura de Remuneração</Link>
                  </p>
                  <p>
                    <Link to="/saude" className={location.pathname === '/saude' ? 'active' : ''} onClick={closeMenu}>Estabelecimentos e Profissionais da Saúde</Link>
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
                    <Link to="/tabela-explicativa-de-valores-de-diarias" className={location.pathname === '/tabela-explicativa-de-valores-de-diarias' ? 'active' : ''} onClick={closeMenu} >Tabela com Valores de Diárias</Link>
                  </p>
                </div>
              </div>
              
            )}

            {activeMenu === 'politicas' && (
              <div className="submenu-grid">
                <div className="column">
                  <p>
                    <Link to="/obras" className={location.pathname === '/obras' ? 'active' : ''} onClick={closeMenu}>Acompanhamento de Obras</Link>                    
                  </p> 
                  <p>
                    <Link to="/obras-paralisadas" className={location.pathname === '/obras-paralisadas' ? 'active' : ''} onClick={closeMenu}>Relação de Obras paralisadas</Link>                    
                  </p>
                                    
                </div>
                <div className="column">
                  <p>
                    <Link to="/julgamento-de-contas" className={location.pathname === '/julgamento-de-contas' ? 'active' : ''} onClick={closeMenu}>Julgamento de Contas pelo Legislativo</Link>                    
                  </p> 
                  <p>
                    <Link to="/prestacao-de-contas" className={location.pathname === '/prestacao-de-contas' ? 'active' : ''} onClick={closeMenu}>Prestação de Contas e Parecer Prévio do TCE</Link>                    
                  </p>  
                  <p>
                    <Link to="/incentivos-a-projetos-culturais" className={location.pathname === '/incentivos-a-projetos-culturais' ? 'active' : ''} onClick={closeMenu}>Incentivos a Projetos Culturais / Esportivos</Link>                    
                  </p>                 
                </div>
                <div className="column">
                  <p>
                    <Link to="/planos" className={location.pathname === '/planos' ? 'active' : ''} onClick={closeMenu}>Planos Municipal</Link>                    
                  </p>                                   
                </div>

              </div>
            )}

            {activeMenu === 'fiscal' && (
              <div className="submenu-grid">
                <div className="column">
                  <p>
                    <Link to="/relatorio-anual-de-gestao" className={location.pathname === '/relatorio-anual-de-gestao' ? 'active' : ''} onClick={closeMenu}>Relatório Anual de Gestão ou Atividades</Link>                    
                  </p> 
                  <p>
                    <Link to="/relatorio-do-controle-interno" className={location.pathname === '/relatorio-do-controle-interno' ? 'active' : ''} onClick={closeMenu}>Relatório do Controle Interno</Link>                    
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
                  <p>
                     <Link to="/sancoes-administrativas" className={location.pathname === '/sancoes-administrativas' ? 'active' : ''} onClick={closeMenu} >Sanções Administrativas
                     </Link>
                  </p>
                </div>
                <div className="column">
                  <p>
                     <Link to="/patrimonio-e-almoxarifado" className={location.pathname === '/patrimonio-e-almoxarifado' ? 'active' : ''} onClick={closeMenu} >Patrimônio e Almoxarifado</Link>
                  </p>                  
                </div>
                
              </div>
            )}

            {activeMenu === 'legislacao' && (
              <div className="submenu-grid">
                <div className="column">
                  <p>
                     <Link to="/leis" className={location.pathname === '/leis' ? 'active' : ''} onClick={closeMenu} >Leis Municípais</Link>
                  </p>
                  <p>
                     <Link to="/acordos" className={location.pathname === '/acordos' ? 'active' : ''} onClick={closeMenu} >Parceiras e Acordos Firmados</Link>
                  </p>                 
                </div>
                <div className="column">
                  <p>
                     <Link to="/convenio-pre-convenio-celebrados" className={location.pathname === '/convenio-pre-convenio-celebrados' ? 'active' : ''} onClick={closeMenu} >Convênio/Pré-Convênio Celebrados</Link>
                  </p> 
                  <p>
                     <Link to="/emendas-parlamentares" className={location.pathname === '/emendas-parlamentares' ? 'active' : ''} onClick={closeMenu} >Emendas Parlamentares</Link>
                  </p>                  
                </div>
              </div>
            )}

            {activeMenu === 'ouvidoria' && (
              <div className="submenu-grid">
                <div className="column">
                  <p>
                     <Link to="/rol-de-informacoes" className={location.pathname === '/rol-de-informacoes' ? 'active' : ''} onClick={closeMenu} >Rol de Informações</Link>
                  </p>                  
                </div>
              </div>
            )}
            
          </div>
    </div>
  );
};

export default MegaMenu;
