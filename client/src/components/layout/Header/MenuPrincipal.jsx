// MenuPrincipal.jsx

import React, { useState } from 'react';
import './MenuPrincipal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faDollarSign, faUsers, faGavel, faFileInvoice, faShoppingCart, faBook, faHeadset, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const MenuPrincipal = ({ isMenuActive, toggleMenu, closeMenu, isMobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();

  // Função para fechar o menu mobile
  const closeMobileMenu = () => {
    setMobileMenuOpen(false); // Atualiza o estado para fechar o menu
    closeMenu(); // Fecha o menu ativo, se necessário
  };


  const renderMenuItems = () => (
    <>
          <li className={location.pathname === '/' ? 'active' : ''} onClick={closeMobileMenu}>
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
    </>
  );
  return (
    <nav className={`navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      {/* Botão de fechar no topo do menu - só aparece no mobile */}
      {isMobileMenuOpen && (
        <div className="close-icon" onClick={closeMobileMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      )}
      <ul className="menu-list">
        {renderMenuItems()}
      </ul>
    </nav>
);
};

export default MenuPrincipal;