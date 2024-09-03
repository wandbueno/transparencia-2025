import React from 'react';
import { NavLink } from 'react-router-dom';
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
import './Header.css';
import logo from '../../assets/LogoPublixelOfc.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-info">
        <img src={logo} alt="Logo" className="logo" />
        <div className="search-container">
          <input type="text" placeholder="Buscar no portal..." />
        </div>
        <p>Voltar ao site da prefeitura</p>
      </div>
      <nav className="nav">
      <ul>
          <li>
            <NavLink exact="true" to="/" activeclassname="active">
              <FontAwesomeIcon icon={faHome} size="lg" />
              <span>Início</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/receita" activeclassname="active">
              <FontAwesomeIcon icon={faDollarSign} size="lg" />
              <span>Receitas e Despesas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" activeclassname="active">
              <FontAwesomeIcon icon={faUsers} size="lg" />
              <span>Órgãos e Servidores</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" activeclassname="active">
              <FontAwesomeIcon icon={faGavel} size="lg" />
              <span>Políticas Públicas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" activeclassname="active">
              <FontAwesomeIcon icon={faFileInvoice} size="lg" />
              <span>Resp. Fiscal</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" activeclassname="active">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              <span>Compras e Licitações</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" activeclassname="active">
              <FontAwesomeIcon icon={faBook} size="lg" />
              <span>Legislação e Publicação</span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/contact" activeclassname="active">
              <FontAwesomeIcon icon={faHeadset} size="lg" />
              <span>Ouvidoria/SIC</span>
            </NavLink>
          </li> */}
          <li>
            <NavLink to="/licitacoes" activeclassname="active">
              <FontAwesomeIcon icon={faFileInvoice} size="lg" />
              <span>Licitações</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
