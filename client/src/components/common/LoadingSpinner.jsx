import React from 'react';
import './LoadingSpinner.css';
import logoWhite from '../../assets/LOGO_BRANCO_favicon.png';
import logoColor from '../../assets/LOGO_RGB_favicon.png';

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="logo-carregando">
          <img src={logoWhite} alt="Logo" className="logo-base" />
          <img src={logoColor} alt="Logo" className="logo-color" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;