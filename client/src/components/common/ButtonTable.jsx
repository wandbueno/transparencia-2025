// components/common/ButtonTable.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ButtonTable.css';

const ButtonTable = ({ path, id, label }) => {
  const navigate = useNavigate(); // Hook dentro do componente

  const handleClick = () => {
    navigate(`${path}/${id}`); // Navega para a rota correta
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
