import React, { useState } from 'react';
import './HeaderPrincipal.css';
import logo from '../../../assets/LogoPublixelOfc.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSearch, faBook, faHeadset, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const HeaderPrincipal = ({ onHamburgerClick }) => {
  
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    if (onHamburgerClick) onHamburgerClick(!isMobileMenuOpen); // Passa o estado atualizado para o componente pai
  };

  return (
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
      {/* Hamburger menu for mobile */}
      <div className="hamburger-container">
          <button className="hamburger-icon" onClick={toggleMobileMenu} aria-label="Abrir Menu">
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
            <span className="menu-label">Menu</span> {/* Adicionando o rótulo "Menu" */}
          </button>
        </div>
      
    </header>
  );
};

export default HeaderPrincipal;
