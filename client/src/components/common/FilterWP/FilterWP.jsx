import React, { useState, useEffect } from 'react';
import './FilterWP.css';
import { 
  getTaxonomyTerms, 
  getMetaFieldOptions,
  TAXONOMY_LABELS,
  isMetaField 
} from '../../../services/publicacoesWP/taxonomies';
import LoadingSpinner from '../LoadingSpinner';

const FilterWP = ({ 
  onFilterChange, 
  title = "Filtros de Pesquisa",
  enabledFilters = ['ano-publicacao'],
  showSearch = true,
  customWidths = {},
  initialValues = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({
    searchTerm: '',
    ...initialValues
  });

  useEffect(() => {
    loadFilterOptions();
  }, [enabledFilters]);

  const loadFilterOptions = async () => {
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
    } catch (error) {
      console.error('Erro ao carregar filtros:', error);
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
    onFilterChange(selectedFilters);
  };

  const handleClearFilters = () => {
    setSelectedFilters({ searchTerm: '' });
    setHasFiltersApplied(false);
    onFilterChange({});
  };

  const getFilterStyle = (filterId) => {
    const width = customWidths[filterId];
    if (!width) {
      const totalFilters = enabledFilters.length + (showSearch ? 1 : 0);
      return { flex: `0 0 ${100 / totalFilters}%` };
    }
    return { flex: `0 0 ${width}` };
  };

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
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="filter-row">
                {/* Render select filters first */}
                {enabledFilters.map(filter => (
                  <div key={filter} className="filter-group" style={getFilterStyle(filter)}>
                    <label>{TAXONOMY_LABELS[filter] || filter}</label>
                    <select
                      name={filter}
                      value={selectedFilters[filter] || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Todos...</option>
                      {filterOptions[filter]?.map(option => (
                        <option key={option.id} value={isMetaField(filter) ? option.name : option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* Render search field last */}
                {showSearch && (
                  <div className="filter-group" style={getFilterStyle('searchTerm')}>
                    <label>Palavras-chave</label>
                    <input
                      type="text"
                      name="searchTerm"
                      value={selectedFilters.searchTerm || ''}
                      onChange={handleInputChange}
                      placeholder="Digite sua busca..."
                    />
                  </div>
                )}
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

export default FilterWP;