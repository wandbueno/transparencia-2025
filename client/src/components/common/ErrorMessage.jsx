import React, { useEffect, useState } from 'react';
import './ErrorMessage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const ErrorMessage = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 5000); // Fecha automaticamente após 5 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="error-overlay">
      <div className="error-container">
        <div className="error-icon">
          <FontAwesomeIcon icon={faExclamationCircle} />
        </div>
        <div className="error-content">
          <h3>Erro</h3>
          <p>{message}</p>
        </div>
        <button className="error-close" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage; 