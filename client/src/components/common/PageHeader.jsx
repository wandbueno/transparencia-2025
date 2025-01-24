import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../assets/global.css'
import './PageHeader.css'
import ExportDetailToPDF from '../common/ExportDetailToPDF';

const PageHeader = ({ title, breadcrumb, showExportButton, contentRef, tableRef, pageTitle }) => {
  return (
    <div className="page-header">
      <div>
        <h2 className="title">{title}</h2>
        <nav className="breadcrumb">
          {/* Breadcrumb comum a todas as páginas */}
          <span className="breadcrumb-ite">
            <Link to="/">Página Inicial</Link>
            <span className="breadcrumb-separator">/</span>
          </span>
          <span className="breadcrumb-ite">
            <Link to="/transparencia">Transparência</Link>
            <span className="breadcrumb-separator">/</span>
          </span>

          {/* Breadcrumb específico da página, recebido via props */}

          {breadcrumb.map((item, index) => (
            <span key={index} className="breadcrumb-ite">
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
      <div>
        {/* Renderiza o botão de exportação apenas se estiver na página de detalhes */}
        {showExportButton && (
          <div className="export-pdf-button">
            <ExportDetailToPDF
              contentRef={contentRef}
              tableRef={tableRef}
              pageTitle={pageTitle}
            />
          </div>
        )}
      </div>

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
  showExportButton: PropTypes.bool,  // Nova prop para condicionar o botão de exportação
  contentRef: PropTypes.object,  // Referência para o conteúdo
  tableRef: PropTypes.object,  // Referência para a tabela
  pageTitle: PropTypes.string,  // Título da página
};

export default PageHeader;
