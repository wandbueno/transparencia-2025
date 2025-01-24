import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMultiplosCombo } from '../../../services/combo/comboService';
import LoadingSpinner from '../LoadingSpinner';
import './FilterSection.css';

const FilterSection = ({ 
  onFilterChange,
  enabledFilters = [],
  customWidths = {},
  title = "Filtros de Pesquisa",
  initialFilters = {}
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const [error, setError] = useState('');

  useEffect(() => {
    if (enabledFilters?.length > 0) {
      loadFilterData();
    }
  }, [enabledFilters]);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      const data = await getMultiplosCombo(enabledFilters);
      
      // Transform the data into the correct format
      const formattedData = {};
      Object.entries(data).forEach(([key, value]) => {
        // Ensure value is an array and has the correct structure
        formattedData[key] = Array.isArray(value) ? value.map(item => ({
          value: item.value || item.id || '',
          label: item.label || item.name || ''
        })) : [];
      });
      
      setFilterData(formattedData);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar filtros:', err);
      setError('Erro ao carregar filtros');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = () => {
    setHasFiltersApplied(true);
    
    // Update URL parameters
    const params = new URLSearchParams();
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);

    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setHasFiltersApplied(false);
    setSearchParams({}); // Clear URL parameters
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const renderFilter = (filterType) => {
    const options = filterData[filterType] || [];
    const width = customWidths[filterType] || '100%';
    
    return (
      <div className="filter-group" key={filterType} style={{ width }}>
        <label>{filterType}</label>
        <select 
          name={filterType}
          value={selectedFilters[filterType] || ''}
          onChange={handleInputChange}
        >
          <option value="">Selecione...</option>
          {Array.isArray(options) && options.map((option) => (
            <option 
              key={`${filterType}-${option.value}-${Math.random().toString(36).substr(2, 9)}`} 
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="filter-header-title">{title}</div>
        <div className="filter-toggle">
          {isOpen ? "Esconder Filtros" : "Mostrar Filtros"}
          <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
        </div>
      </div>

      {isOpen ? (
        <div className="filter-content">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="filter-row">
                {enabledFilters.map(filter => renderFilter(filter))}
              </div>
              <div className="filter-buttons">
                {hasFiltersApplied && (
                  <button className="clear-button" onClick={handleClearFilters}>
                    Limpar
                  </button>
                )}
                <button className="search-button" onClick={handleFilterSubmit}>
                  Pesquisar
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="filter-placeholder">
          Utilize os campos do formulário para filtrar a sua pesquisa. Para isso,
          clique em <strong>MOSTRAR FILTROS</strong> e preencha os campos com os dados
          do seu interesse.
        </div>
      )}
    </div>
  );
};

export default FilterSection;