import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './ButtonDownloadAnexos.css';

const ButtonDownloadAnexos = ({ onClick, label = "Visualizar" }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onClick();
    } catch (error) {
      console.error('Erro ao visualizar documento:', error);
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
        icon={isLoading ? faSpinner : faEye}
        className={isLoading ? 'fa-spin' : ''} 
        style={{ marginRight: '5px' }}
      />
      {isLoading ? 'Carregando...' : label}
    </button>
  );
};

export default ButtonDownloadAnexos;