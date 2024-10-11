// HeaderNovo.jsx

import React, { useState } from 'react';
import HeaderPrincipal from './HeaderPrincipal';
import MenuPrincipal from './MenuPrincipal';
import MegaMenu from './MegaMenu';
import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation(); // Pega a rota atual
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // Estado para controlar o menu mobile

  // Configuração dos menus principais e seus submenus
  const menuConfig = {
    receitas: ['/despesas-empenho', '/receitas', '/extra-orcamentaria', '/pagamentos', '/transferencias-voluntarias-realizadas', '/transferencias-voluntarias-recebidas', '/renuncias-fiscais', '/desoneracao', '/divida-ativa'],
    orgaos: ['/servidores', '/terceirizados', '/diarias', '/terceirizados', '/estagiarios', '/concurso-processo-seletivo'],
    politicas: ['/politicas', '/obras', '/obras-paralisadas', '/julgamento-de-contas','/prestacao-de-contas', '/incentivos-a-projetos-culturais'],
    fiscal: ['/fiscal'],
    licitacoes: ['/licitacoes', '/dispensas-e-inexigibilidades', '/contratos','/patrimonio-e-almoxarifado'],
    legislacao: ['/legislacao', '/leis'],
    ouvidoria: ['/ouvidoria']
  };

  // Verifica se o menu principal deve estar ativo com base na rota
  const isMenuActive = (menuKey) => {
    const menuRoutes = menuConfig[menuKey] || [];
    return menuRoutes.some(route => location.pathname.includes(route));
  };

  // Alterna o menu ativo
  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Fecha o menu ativo
  const closeMenu = () => {
    setActiveMenu(null);
  };

  // Função que controla o estado do menu mobile
  const handleHamburgerClick = (isOpen) => {
    setMobileMenuOpen(isOpen);
  };

  return (
    <div>
      {/* Header principal com a logo, busca e ícones */}
      <HeaderPrincipal onHamburgerClick={handleHamburgerClick} />

      <MenuPrincipal
        location={location}
        toggleMenu={toggleMenu}
        isMenuActive={isMenuActive}
        closeMenu={closeMenu}
        isMobileMenuOpen={isMobileMenuOpen} // Passando estado mobile
        setMobileMenuOpen={setMobileMenuOpen} // Passando função para controlar o mobile
      />

      {/* MegaMenu exibido se houver um menu ativo */}
      <MegaMenu
        activeMenu={activeMenu}
        closeMenu={closeMenu}
        location={location}
      />
    </div>
  );
};

export default Header;
