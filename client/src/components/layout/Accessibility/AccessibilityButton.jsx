import React from 'react';
import './AccessibilityButton.css'; // Verifique o caminho

const AccessibilityButton = ({ onOpen }) => {
  return (
    <button className="accessibility-button" onClick={onOpen}>
      <i className="fas fa-universal-access"></i>
    </button>
  );
};

export default AccessibilityButton;
