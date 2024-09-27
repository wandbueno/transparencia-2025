// components/common/ButtonTable.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ButtonTable.css';

const ButtonTable = ({ path, id, label, queryParams }) => {
  const navigate = useNavigate(); // Hook dentro do componente

  const handleClick = () => {
    // Navega para a rota com ou sem queryParams
    navigate(`${path}/${id}${queryParams ? queryParams : ''}`);
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

export default ButtonTable;
