// src/components/common/PageHeader.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PageHeader.css';

const PageHeader = ({ title, breadcrumb }) => {
  return (
    <div className="page-header">
      <h2 className="page-title">{title}</h2>
      <nav className="breadcrumb">
        {breadcrumb.map((item, index) => (
          <span key={index} className="breadcrumb-item">
            {item.path ? (
              <Link to={item.path}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
            {index < breadcrumb.length - 1 && <span className="breadcrumb-separator">/</span>}
          </span>
        ))}
      </nav>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumb: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ).isRequired,
};

export default PageHeader;
