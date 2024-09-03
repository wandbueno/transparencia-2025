// src/components/common/InfoText.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './InfoText.css';

const InfoText = ({ children }) => {
  return <div className="info-text">{children}</div>;
};

InfoText.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InfoText;
