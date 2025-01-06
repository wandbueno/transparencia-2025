import React, { useState, useEffect } from 'react';
import { getMultiplosCombo } from '../../../services/combo/comboService';
import { FILTER_TYPES, INPUT_TYPES, FILTER_LABELS } from './filterTypes';
import LoadingSpinner from '../LoadingSpinner';
import './MultiComboSelect.css';

const MultiComboSelect = ({
  title = "Filtros de Pesquisa",
  availableFilters = [],
  textFields = [],
  onFilterChange,
  initialValues = {},
  customLabels = {},
  customWidths = {},
  disabledFilters = [],
  requiredFilters = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState(initialValues);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (availableFilters?.length > 0) {
      loadFilterData();
    }
  }, [availableFilters]);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      const data = await getMultiplosCombo(availableFilters);
      setFilterData(data);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar filtros:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    const errors = {};
    requiredFilters.forEach(filter => {
      if (!selectedFilters[filter]) {
        errors[filter] = 'Campo obrigatório';
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFilterSubmit = () => {
    if (validateFields()) {
      setHasFiltersApplied(true);
      onFilterChange(selectedFilters);
    }
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setHasFiltersApplied(false);
    setValidationErrors({});
    onFilterChange({});
  };

  const getWidthClass = (fieldId) => {
    const width = customWidths[fieldId] || '25%';
    return width.replace('%', ''); // Remove o % para usar como data-attribute
  };

  const renderComboField = (filterKey) => {
    const options = filterData[filterKey] || [];
    const label = customLabels[filterKey] || FILTER_LABELS[filterKey] || filterKey;
    const isDisabled = disabledFilters.includes(filterKey);
    const isRequired = requiredFilters.includes(filterKey);

    return (
      <div 
        className="filter-group" 
        key={filterKey} 
        data-width={getWidthClass(filterKey)}
      >
        <label>
          {label}
          {isRequired && <span className="required-mark">*</span>}
        </label>
        <select
          name={filterKey}
          value={selectedFilters[filterKey] || ''}
          onChange={handleInputChange}
          disabled={isDisabled}
          className={validationErrors[filterKey] ? 'error' : ''}
        >
          <option value="">Selecione...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {validationErrors[filterKey] && (
          <span className="error-message">{validationErrors[filterKey]}</span>
        )}
      </div>
    );
  };

  const renderTextField = (field) => {
    const isRequired = requiredFilters.includes(field.id);
    
    return (
      <div 
        className="filter-group" 
        key={field.id} 
        data-width={getWidthClass(field.id)}
      >
        <label>
          {field.label}
          {isRequired && <span className="required-mark">*</span>}
        </label>
        <input
          type={field.type}
          name={field.id}
          value={selectedFilters[field.id] || ''}
          onChange={handleInputChange}
          placeholder={field.placeholder}
          className={validationErrors[field.id] ? 'error' : ''}
        />
        {validationErrors[field.id] && (
          <span className="error-message">{validationErrors[field.id]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="multi-combo-section">
      <div className="multi-combo-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="multi-combo-header-title">{title}</div>
        <div className="multi-combo-toggle">
          {isOpen ? "Esconder Filtros" : "Mostrar Filtros"}
          <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
        </div>
      </div>

      {isOpen ? (
        <div className="multi-combo-content">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="multi-combo-row">
                {availableFilters.map(filterKey => renderComboField(filterKey))}
                {textFields.map(field => renderTextField(field))}
              </div>

              <div className="multi-combo-buttons">
                {hasFiltersApplied && (
                  <button 
                    className="clear-button" 
                    onClick={handleClearFilters}
                    type="button"
                  >
                    Limpar
                  </button>
                )}
                <button 
                  className="search-button" 
                  onClick={handleFilterSubmit}
                  type="button"
                >
                  Pesquisar
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="multi-combo-placeholder">
          Utilize os campos do formulário para filtrar a sua pesquisa. Para isso,
          clique em <strong>MOSTRAR FILTROS</strong> e preencha os campos com os dados
          do seu interesse.
        </div>
      )}
    </div>
  );
};

export default MultiComboSelect;