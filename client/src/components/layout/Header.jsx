import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Transparência</h1>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <NavLink exact="true" to="/" activeclassname="active">Início</NavLink>
          </li>
          <li>
            <NavLink to="/about" activeclassname="active">Sobre</NavLink>
          </li>
          <li>
            <NavLink to="/services" activeclassname="active">Serviços</NavLink>
          </li>
          <li>
            <NavLink to="/contact" activeclassname="active">Contato</NavLink>
          </li>
          <li>
            <NavLink to="/licitacoes" activeclassname="active">Licitações</NavLink> {/* Adicione esta linha */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
