import React from 'react';
import '../ButtonTable.css'; // Reuse the same CSS as ButtonTable

const ButtonSicapLink = ({ url, label }) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
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

export default ButtonSicapLink;