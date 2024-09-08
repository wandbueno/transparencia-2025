import React from 'react';
import './Footer.css';
import logo from '../../assets/LogoPublixelOfc.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-contact">
        <p>Não encontrou o que está procurando? Acesse nosso canal de atendimento e fale conosco.</p>
      </div>
      <div className="footer-sections">
        <div className="footer-column">
          <h4>Fale Conosco</h4>
          <p>Rua São Bento Q 26, Lt 04, Centro, CEP: 77560-000</p>
          <p><a href="mailto:ouvidoria@brejinhodenazare.to.gov.br">ouvidoria@brejinhodenazare.to.gov.br</a></p>
          <p>08:00 as 14:00</p>
          <p>(63) 3521-1239</p>
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
        <a href="https://facebook.com" className="social-icon"></a>
        <a href="https://twitter.com" className="social-icon"></a>
        <a href="https://instagram.com" className="social-icon"></a>
        <a href="https://linkedin.com" className="social-icon"></a>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <p>2024© Todos os direitos reservados.</p>
        </div>
        <div className="footer-bottom-right">
          <img src={logo} alt="Logo" className="footer-logo" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
