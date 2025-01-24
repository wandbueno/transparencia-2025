import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTaxonomyTerms, getMetaFieldOptions, TAXONOMY_LABELS, isMetaField } from '../../../services/publicacoesWP/taxonomies';
import LoadingSpinner from '../../common/LoadingSpinner';
import './FilterWP.css';

const FilterWP = ({ 
  onFilterChange,
  enabledFilters = [],
  customWidths = {},
  title = "Filtros de Pesquisa",
  showSearch = true
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState('');

  // Initialize filters from URL params
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const initialFilters = {};
    for (const [key, value] of searchParams.entries()) {
      initialFilters[key] = value;
    }
    return initialFilters;
  });

  useEffect(() => {
    const initializeFilters = async () => {
      if (enabledFilters?.length > 0) {
        await loadFilterData();
      }
      // Apply initial filters from URL if they exist
      if (Object.keys(selectedFilters).length > 0) {
        onFilterChange(selectedFilters);
        setHasFiltersApplied(true);
      }
    };

    initializeFilters();
  }, [enabledFilters]);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      const optionsPromises = enabledFilters.map(async filter => {
        if (isMetaField(filter)) {
          const options = await getMetaFieldOptions(filter);
          return [filter, options];
        } else {
          const terms = await getTaxonomyTerms(filter);
          return [filter, terms];
        }
      });

      const options = await Promise.all(optionsPromises);
      setFilterOptions(Object.fromEntries(options));
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

    onFilterChange(selectedFilters);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setHasFiltersApplied(false);
    setSearchParams({}); // Clear URL parameters
    onFilterChange({});
  };

  const renderFilterFields = () => {
    let currentRowWidth = 0;
    const rows = [];
    let currentRow = [];

    const addCurrentRowToRows = () => {
      if (currentRow.length > 0) {
        rows.push([...currentRow]);
        currentRow = [];
        currentRowWidth = 0;
      }
    };

    const allFilters = [...enabledFilters];
    if (showSearch) {
      allFilters.push('searchTerm');
    }

    allFilters.forEach(filter => {
      const width = parseFloat(customWidths[filter] || '100');
      
      if (currentRowWidth + width > 100) {
        addCurrentRowToRows();
      }

      currentRow.push(renderFilterField(filter));
      currentRowWidth += width;
    });

    addCurrentRowToRows();

    return rows.map((row, index) => (
      <div key={index} className="filter-row">
        {row}
      </div>
    ));
  };

  const renderFilterField = (filter) => {
    const width = customWidths[filter] || '100%';
    
    if (filter === 'searchTerm') {
      return (
        <div key={filter} className="filter-group" style={{ width }}>
          <label>Palavras-chave</label>
          <input
            type="text"
            name="searchTerm"
            value={selectedFilters.searchTerm || ''}
            onChange={handleInputChange}
            placeholder="Digite sua busca..."
          />
        </div>
      );
    }

    return (
      <div key={filter} className="filter-group" style={{ width }}>
        <label>{TAXONOMY_LABELS[filter] || filter}</label>
        <select
          name={filter}
          value={selectedFilters[filter] || ''}
          onChange={handleInputChange}
        >
          <option value="">Todos...</option>
          {filterOptions[filter]?.map(option => (
            <option 
              key={option.id} 
              value={isMetaField(filter) ? option.name : option.id}
            >
              {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Only show loading spinner when loading filter options
  if (loading && !Object.keys(filterOptions).length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="filter-wp">
      <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="filter-header-title">{title}</div>
        <div className="filter-toggle">
          {isOpen ? "Esconder Filtros" : "Mostrar Filtros"}
          <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
        </div>
      </div>

      {isOpen ? (
        <div className="filter-content">
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              {renderFilterFields()}
              <div className="filter-buttons">
                {hasFiltersApplied && (
                  <button className="clear-button" onClick={handleClearFilters}>
                    Limpar filtros
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

export default FilterWP;