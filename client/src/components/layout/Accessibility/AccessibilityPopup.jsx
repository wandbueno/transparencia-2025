import React from 'react';
import './AccessibilityPopup.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AccessibilityPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const defaultFontSize = 16; // Tamanho de fonte padrão (16px)

  const getCurrentFontSize = () => {
    const computedStyle = window.getComputedStyle(document.documentElement);
    return parseFloat(computedStyle.fontSize); // Obtém o tamanho da fonte em 'px'
  };

  const handleIncreaseFont = () => {
    const currentFontSize = getCurrentFontSize();
    document.documentElement.style.fontSize = `${currentFontSize + 2}px`; // Aumenta em 2px
  };

  const handleDecreaseFont = () => {
    const currentFontSize = getCurrentFontSize();
    if (currentFontSize > 10) { // Evita diminuir muito
      document.documentElement.style.fontSize = `${currentFontSize - 2}px`; // Diminui em 2px
    }
  };

  const handleResetFont = () => {
    document.documentElement.style.fontSize = `${defaultFontSize}px`; // Reseta ao valor padrão
  };

  const handleAutoContrast = () => {
    document.body.classList.toggle('high-contrast');
  };

  const handleGrayScale = () => {
    document.body.classList.toggle('gray-scale');
  };

  const handleUnderlineText = () => {
    document.body.classList.toggle('underline-text');
  };

  return (
    <div className="accessibility-popup">
      <button className="close-button" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
      <h2 className="title">Acessibilidade</h2>
      <ul className="accessibility-options">
        <li onClick={handleIncreaseFont}>
          <i className="fas fa-plus-circle"></i> <span>Aumentar Texto</span>
        </li>
        <li onClick={handleDecreaseFont}>
          <i className="fas fa-minus-circle"></i>  <span>Diminuir Texto</span>
        </li>
        <li onClick={handleResetFont}>
          <i className="fas fa-sync-alt"></i>  <span>Resetar Tamanho</span>
        </li>
        <li onClick={handleAutoContrast}>
          <i className="fas fa-adjust"></i>  <span>Auto Contraste</span>
        </li>
        <li onClick={handleGrayScale}>
          <i className="fas fa-palette"></i>  <span>Tons de Cinza</span>
        </li>
        <li onClick={handleUnderlineText}>
          <i className="fas fa-underline"></i>  <span>Sublinhar Texto</span>
        </li>
      </ul>
    </div>
  );
};

export default AccessibilityPopup;
