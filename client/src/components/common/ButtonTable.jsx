import React from 'react';
import './ButtonTable.css'

const ButtonTable = ({ onClick, label }) => {
  return (
    <button
      className="btn btn-primary"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {label}
    </button>
  );
};

export default ButtonTable;
