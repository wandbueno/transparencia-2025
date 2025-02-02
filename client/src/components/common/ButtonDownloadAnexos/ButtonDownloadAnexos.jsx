// client/src/components/common/ButtonDownload/ButtonDownload.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSpinner } from '@fortawesome/free-solid-svg-icons'; // Changed from faDownload to faEye
import './ButtonDownloadAnexos.css';

const ButtonDownloadAnexos = ({ onClick, label = "Visualizar" }) => { // Changed default label
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onClick();
    } catch (error) {
      console.error('Erro ao visualizar documento:', error); // Updated error message
      // Você pode adicionar um toast ou outra notificação de erro aqui
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="btn btn-primary download-button"
      onClick={handleClick}
      disabled={isLoading}
    >
      <FontAwesomeIcon 
        icon={isLoading ? faSpinner : faEye} // Changed icon
        className={isLoading ? 'fa-spin' : ''} 
        style={{ marginRight: '5px' }}
      />
      {isLoading ? 'Carregando...' : label}
    </button>
  );
};

export default ButtonDownloadAnexos;
