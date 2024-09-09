import React from 'react';
import './Footer.css';
import '../../assets/global.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faClock, faPhone, } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';


import { config } from '../../assets/config'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-contact">
        <p>Não encontrou o que está procurando? Acesse nosso canal de atendimento e fale conosco.</p>
        <div></div>
      </div>
      <div className="footer-sections">
        <div className="footer-column">
          <h4>Fale Conosco</h4>
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> {config.geral.endereco}
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} /> <a href={`mailto:${config.geral.email}`}>{config.geral.email}</a>
          </p>
          <p>
            <FontAwesomeIcon icon={faClock} /> {config.geral.horario}
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} /> {config.geral.telefonePrincipal}
          </p>
        </div>
        <div className="footer-column">
          <h4>Ouvidoria e Atendimento</h4>
          <ul>
            <li><a href="/ouvidoria">Ouvidoria Municipal</a></li>
            <li><a href="/sic">Serviço de Informação ao Cidadão (E-SIC)</a></li>
            <li><a href="/sic-fisico">Informação do SIC Físico</a></li>
            <li><a href="/carta-servicos">Carta de Serviços aos Usuários</a></li>
            <li><a href="/pesquisa-satisfacao">Pesquisa de Satisfação</a></li>
            <li><a href="/faq">Perguntas Frequentes</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Links Úteis</h4>
          <ul>
            <li><a href="/mapa-do-site">Mapa do Site</a></li>
            <li><a href="/responsaveis">Responsáveis pelo site</a></li>
            <li><a href="/radar-transparencia">Radar da Transparência Pública</a></li>
            <li><a href="/politica-privacidade">Política de Privacidade</a></li>
            <li><a href="/governo-digital">Governo Digital</a></li>
            <li><a href="/lgpd">LGPD</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-social">
        <span>Siga-nos nas redes sociais: </span>
        <div>
          <a href={config.redesSociais.facebook} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href={config.redesSociais.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href={config.redesSociais.youtube} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
          <p>2024 © Todos os direitos reservados.</p>
        <div className="footer-bottom-right">
          <span>Este portal foi desenvolvido por: </span>
          <a href="https://publixel.com.br/" target="_blank" rel="noopener noreferrer">
          <img src={config.geral.logotipo} alt="Logo"/>
        </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
