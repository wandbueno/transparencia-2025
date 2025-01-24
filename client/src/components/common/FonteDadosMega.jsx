import React from 'react';
import logo from '../../assets/logo_megasoft.png'; 
import './FonteDadosMega.css'

const FonteDadosMega = () => {
  return (
    <div className="font-dados">
      <span>Dados obtidos de: </span>
      <img src={logo} alt="Logo Megasoft" style={{ width: '100px', height: 'auto' }} />
    </div>
  );
};

export default FonteDadosMega;
