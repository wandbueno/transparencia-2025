import React from 'react';
import './ButtonTable.css';

// Importa a URL do site oficial do arquivo .env
const VITE_SITE_OFICIAL = import.meta.env.VITE_SITE_OFICIAL;

const ButtonLink = ({ link, label }) => {
  const handleClick = () => {
    // Decodifica '&amp;' para '&' se estiver presente
    let decodedLink = link.replace(/&amp;/g, '&');
  
    // Verifica se o link começa com 'http', caso contrário, adiciona a URL do site oficial
    const fullLink = decodedLink.startsWith('http') ? decodedLink : `${VITE_SITE_OFICIAL}${decodedLink}`;
  
    console.log('Full link:', fullLink); // Verifica o link no console
  
    // Abre o link em uma nova aba
    window.open(fullLink, '_blank', 'noopener,noreferrer');
  };
  

  return (
    <button
      className="btn btn-primary"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {label}
    </button>
  );
};

export default ButtonLink;
