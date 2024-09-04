import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/global.css'

const InfoText = ({ href, children }) => {
  return (
    <div className="link">
      <a href={href} target="_blank" rel="noopener noreferrer">
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
