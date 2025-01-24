import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faServer, 
  faNetworkWired,
  faDatabase,
  faExclamationCircle 
} from '@fortawesome/free-solid-svg-icons';
import './ErrorPage.css';

const ErrorPage = ({ 
  type = 'generic',
  message,
  details,
  onRetry,
  showHome = true
}) => {
  const navigate = useNavigate();

  const errorTypes = {
    api: {
      icon: faServer,
      title: 'Erro ao carregar dados',
      defaultMessage: 'Não foi possível carregar os dados da API.'
    },
    network: {
      icon: faNetworkWired,
      title: 'Erro de conexão',
      defaultMessage: 'Não foi possível conectar ao servidor.'
    },
    database: {
      icon: faDatabase,
      title: 'Erro no banco de dados',
      defaultMessage: 'Ocorreu um erro ao acessar o banco de dados.'
    },
    generic: {
      icon: faExclamationCircle,
      title: 'Erro',
      defaultMessage: 'Ocorreu um erro inesperado.'
    }
  };

  const errorConfig = errorTypes[type] || errorTypes.generic;

  return (
    <div className="error-page">
      <FontAwesomeIcon 
        icon={errorConfig.icon} 
        className="error-icon"
      />
      
      <h1 className="error-title">{errorConfig.title}</h1>
      
      <p className="error-message">
        {message || errorConfig.defaultMessage}
      </p>

      {details && (
        <div className="error-details">
          {details}
        </div>
      )}

      <div className="error-actions">
        {onRetry && (
          <button 
            onClick={onRetry}
            className="error-button primary"
          >
            Tentar novamente
          </button>
        )}

        {showHome && (
          <button 
            onClick={() => navigate('/')}
            className="error-button secondary"
          >
            Voltar para página inicial
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;