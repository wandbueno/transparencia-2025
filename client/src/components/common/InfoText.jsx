import React from 'react';
import PropTypes from 'prop-types';
import './InfoText.css';

const InfoText = ({ href, children }) => {
  return (
    <div className="info-text">
      <a href={href} className="info-text-link" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </div>
  );
};

InfoText.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default InfoText;
