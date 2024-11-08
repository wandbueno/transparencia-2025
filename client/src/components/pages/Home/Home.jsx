import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDollarSign, 
  faArrowDown, 
  faUsers, 
  faGavel, 
  faFileInvoice,
  faShoppingCart,
  faBook,
  faChartLine,
  faHeadset,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faInstagram, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons';
import { config } from '../../../assets/config';

import { menuStructure, legislacaoTransparencia, linksUteis } from './homeConfig';
import { registerAccess, getMostAccessedPages } from './accessManager';


const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dados, setDados] = useState({
    receitas: null,
    despesas: null,
    paginasMaisAcessadas: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [mostAccessed, setMostAccessed] = useState([]);

  // Função para registrar o acesso quando um card é clicado
  const handleCardClick = (path) => {
    registerAccess(path);
    // Atualiza a lista de mais acessados
    setMostAccessed(getMostAccessedPages(menuStructure));
  };

  // Função para obter os cards mais acessados
  const getMostAccessedCards = () => {
    const allCards = Object.values(menuStructure).flatMap(section => 
      section.links.map(link => ({
        ...link,
        acessos: link.acessos || 0
      }))
    );

    // Ordena os cards por número de acessos (decrescente)
    return allCards
      .sort((a, b) => (b.acessos || 0) - (a.acessos || 0))
      .slice(0, 5); // Pega os 5 mais acessados
  };

  // Função para filtrar os cards baseado na busca
  const getFilteredMenuItems = () => {
    if (!searchTerm) return menuStructure;

    // Lista de palavras para ignorar na busca
    const stopWords = ['de', 'do', 'da', 'dos', 'das', 'e', 'ou', 'para', 'com', 'em'];

    // Limpa e separa os termos de busca, removendo stopwords
    const searchTerms = searchTerm
      .toLowerCase()
      .split(' ')
      .filter(term => !stopWords.includes(term) && term.length > 1);

    // Se não sobrou nenhum termo válido após a filtragem
    if (searchTerms.length === 0) return menuStructure;

    const filteredStructure = {};
    Object.entries(menuStructure).forEach(([key, section]) => {
      const filteredLinks = section.links.filter(link => {
        // Verifica se todos os termos de busca estão presentes
        return searchTerms.every(term => {
          const titleMatch = link.nome.toLowerCase().includes(term);
          const keywordMatch = link.keywords?.some(keyword => 
            keyword.toLowerCase().includes(term)
          );
          return titleMatch || keywordMatch;
        });
      });

      if (filteredLinks.length > 0) {
        filteredStructure[key] = {
          ...section,
          links: filteredLinks
        };
      }
    });

    return filteredStructure;
  };

  // Verificar se há resultados
  const hasResults = Object.keys(getFilteredMenuItems()).length > 0;

  useEffect(() => {
    document.title = `Portal da Transparência - ${config.geral.nomeOrgao}`;
    
    const fetchDados = async () => {
      try {
        const response = await axios.get(
          'https://conceicaodotocantins.megasofttransparencia.com.br/api/configuracao/carregamento-inicial'
        );
        setDados(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os dados.');
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  useEffect(() => {
    // Carrega as páginas mais acessadas ao iniciar
    setMostAccessed(getMostAccessedPages(menuStructure));
  }, []);

  return (
    <div className="home-container">
      {/* Cabeçalho com Boas-vindas e Redes Sociais */}
      <header className="welcome-section">
        <h1>Bem vindo ao Portal de Transparência da {config.geral.nomeOrgao}</h1>
        <div className="social-media">
          <a 
            href={config.redesSociais.facebook} 
            target="_blank" 
            rel="noopener noreferrer"
            className="facebook"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a 
            href={config.redesSociais.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a 
            href={config.redesSociais.youtube} 
            target="_blank" 
            rel="noopener noreferrer"
            className="youtube"
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </header>

      {/* Texto Introdutório */}
      <section className="intro-section">
        <p>
          O portal da transparência integra a política de acesso a informações públicas, 
          reconhecida pelo município de {config.geral.nomeOrgao} como forma de tornar 
          exequível o controle social.
        </p>
      </section>

      {/* Campo de Busca */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Digite aqui para buscar por serviços, documentos ou informações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
      </div>

      {/* Mensagem quando não há resultados */}
      {searchTerm && !hasResults && (
        <div className="no-results">
          <p>Nenhum resultado encontrado para "<strong>{searchTerm}</strong>"</p>
          <p>Tente buscar usando outras palavras ou verifique a ortografia.</p>
        </div>
      )}

      {/* Seção de Mais Acessados */}
      {!searchTerm && mostAccessed.length > 0 && (
        <section className="nav-section">
          <h2 style={{ color: '#4263eb' }}>
            <FontAwesomeIcon icon={faChartLine} className="section-icon" />
            Mais Acessados
          </h2>
          <div className="nav-grid">
            {mostAccessed.map((pagina, index) => (
              <Link 
                key={index}
                to={pagina.path}
                className="nav-card"
                style={{'--cor': '#4263eb'}}
                onClick={() => handleCardClick(pagina.path)}
              >
                <FontAwesomeIcon icon={pagina.icon} />
                <span>{pagina.nome}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Seções de Navegação usando menuStructure filtrado */}
      {Object.entries(getFilteredMenuItems()).map(([key, section]) => (
        <section key={key} className="nav-section">
          <h2 style={{ color: section.cor }}>
            <FontAwesomeIcon icon={section.icon} className="section-icon" />
            {section.titulo}
          </h2>
          <div className="nav-grid">
            {section.links.map((link, index) => (
              <Link 
                key={index}
                to={link.path}
                className="nav-card"
                style={{'--cor': section.cor}}
                onClick={() => {
                  console.log('Clique em card normal:', link.path);
                  handleCardClick(link.path);
                }}
              >
                <FontAwesomeIcon icon={link.icon} />
                <span>{link.nome}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Nova seção informativa - só aparece quando não há busca */}
      {!searchTerm && (
        <section className="info-section">
          <div className="info-grid">
            {/* SIC Físico */}
            <div className="info-card">
              <h3>SIC Físico</h3>
              <div className="info-content">
                <p><strong>{config.geral.nomeOrgao}</strong></p>
                <p>{config.geral.endereco}</p>
                <p><strong>Horários de Atendimento:</strong></p>
                <p>{config.esic.horarioAtendimento}</p>
                <p><strong>Telefone:</strong></p>
                <p>{config.esic.telefone}</p>
                <p><strong>Responsável:</strong></p>
                <p>{config.esic.nome}</p>
              </div>
            </div>

            {/* Ouvidoria */}
            <div className="info-card">
              <h3>Ouvidoria</h3>
              <div className="info-content">
                <p>Este serviço permite a você solicitar qualquer informação que esteja sob a guarda do poder público municipal.</p>
                <Link to="/ouvidoria" className="ouvidoria-button">
                  Acessar Ouvidoria
                </Link>
              </div>
            </div>

            {/* Legislação */}
            <div className="info-card">
              <h3>Legislação sobre Transparência</h3>
              <div className="info-content">
                {legislacaoTransparencia.map((lei, index) => (
                  <div key={index} className="lei-item">
                    <a href={lei.link} target="_blank" rel="noopener noreferrer">
                      {lei.nome}
                    </a>
                    <p>{lei.descricao}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Links Úteis */}
            <div className="info-card">
              <h3>Links Úteis</h3>
              <div className="info-content">
                {linksUteis.map((link, index) => (
                  <div key={index} className="link-item">
                    <a href={link.link} target="_blank" rel="noopener noreferrer">
                      {link.nome}
                    </a>
                    <p>{link.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
