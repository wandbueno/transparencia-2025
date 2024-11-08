import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderPrincipal.css';
import logoFundo from '../../../assets/Logo-Concei_fundo.png.webp';
import logo from '../../../assets/LogoPublixelOfc.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faBook, faHeadset } from '@fortawesome/free-solid-svg-icons';
import { menuStructure } from '../../../components/pages/Home/homeConfig';

const HeaderPrincipal = ({ onHamburgerClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Função para buscar em todas as páginas
  const searchPages = (term) => {
    if (!term) return [];

    const results = [];
    const searchTerms = term.toLowerCase().split(' ');

    Object.values(menuStructure).forEach(section => {
      section.links.forEach(link => {
        const titleMatch = searchTerms.every(term => 
          link.nome.toLowerCase().includes(term)
        );
        
        const keywordMatch = link.keywords?.some(keyword =>
          searchTerms.every(term => keyword.toLowerCase().includes(term))
        );

        if (titleMatch || keywordMatch) {
          results.push({
            ...link,
            section: section.titulo,
            cor: section.cor
          });
        }
      });
    });

    return results.slice(0, 6); // Limita a 6 resultados
  };

  // Atualiza resultados quando usuário digita
  useEffect(() => {
    if (searchTerm) {
      const results = searchPages(searchTerm);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm]);

  // Fecha resultados quando clica fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (path) => {
    navigate(path);
    setSearchTerm('');
    setShowResults(false);
  };

  const handleMenuClick = () => {
    if (onHamburgerClick) {
      onHamburgerClick(true);
    }
  };

  return (
    <>
      

      <header className="header-info">
        <div className="logo-container">
          <img src={logo} alt="Logo" />        
        </div>

        <div className="search-container" ref={searchRef}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Buscar no portal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>

          {showResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handleResultClick(result.path)}
                  style={{ borderLeft: `4px solid ${result.cor}` }}
                >
                  <div className="result-content">
                    <span className="result-title">{result.nome}</span>
                    <span className="result-section">{result.section}</span>
                  </div>
                  <FontAwesomeIcon icon={result.icon} style={{ color: result.cor }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="action-buttons">
          <a href="/diario" className="quick-link">
            <FontAwesomeIcon icon={faBook} />
            <span>Diário Oficial</span>
          </a>
          <a href="/ouvidoria" className="quick-link">
            <FontAwesomeIcon icon={faHeadset} />
            <span>Ouvidoria</span>
          </a>
        </div>
      </header>
      {/* Barra do menu mobile */}
      <div className="mobile-menu-bar">
        <button className="hamburger-icon" onClick={handleMenuClick} aria-label="Abrir Menu">
          <FontAwesomeIcon icon={faBars} />
          <span className="menu-label">Menu</span>
        </button>
      </div>
    </>
  );
};

export default HeaderPrincipal;
