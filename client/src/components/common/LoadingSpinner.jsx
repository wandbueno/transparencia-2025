import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Carregando...' }) => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <FontAwesomeIcon icon={faSpinner} className="spinner spin" />
        <span className="spinner-text">{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
