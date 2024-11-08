import React, { useState, useEffect } from 'react';
import { getComboData } from '../../../services/combo/comboService';
import './FilterSection.css';

const FilterSection = ({ availableFilters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (availableFilters?.length > 0) {
      loadFilterData();
    }
  }, [availableFilters]);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      const data = await getComboData(availableFilters);
      console.log('Dados recebidos do combo:', data);

      if (data && typeof data === 'object') {
        setFilterData(data);
      } else {
        console.error('Formato de dados inesperado:', data);
        setError('Formato de dados inválido');
      }
    } catch (error) {
      console.error('Erro ao carregar filtros:', error);
      setError(error.message);
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
    setSelectedFilters({});
    setHasFiltersApplied(false);
    onFilterChange({});
  };

  const renderFilter = (filterType) => {
    console.log('Renderizando filtro:', filterType);
    console.log('Dados disponíveis:', filterData[filterType]);

    const options = filterData[filterType] || [];

    switch (filterType) {
      case 'ano':
        return (
          <div className="filter-group" key={filterType}>
            <label>Ano</label>
            <select 
              name={filterType}
              value={selectedFilters[filterType] || ''}
              onChange={handleInputChange}
            >
              <option value="">Selecione o ano...</option>
              {options.map(ano => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
          </div>
        );

      case 'orgao':
        return (
          <div className="filter-group" key={filterType}>
            <label>Órgão</label>
            <select 
              name={filterType}
              value={selectedFilters[filterType] || ''}
              onChange={handleInputChange}
            >
              <option value="">Selecione o órgão...</option>
              {options.map(orgao => (
                <option key={orgao.codigo} value={orgao.codigo}>
                  {orgao.nome}
                </option>
              ))}
            </select>
          </div>
        );

      case 'modalidade':
        return (
          <div className="filter-group" key={filterType}>
            <label>Modalidade</label>
            <select 
              name={filterType}
              value={selectedFilters[filterType] || ''}
              onChange={handleInputChange}
            >
              <option value="">Selecione a modalidade...</option>
              {options.map(modalidade => (
                <option key={modalidade.codigo} value={modalidade.codigo}>
                  {modalidade.nome}
                </option>
              ))}
            </select>
          </div>
        );

      // Adicione mais cases conforme necessário para outros tipos de filtros
      default:
        return null;
    }
  };

  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="filter-header-title">Filtros de Pesquisa</div>
        <div className="filter-toggle">
          {isOpen ? "Esconder Filtros" : "Mostrar Filtros"}
          <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
        </div>
      </div>

      {isOpen && (
        <div className="filter-content">
          {loading ? (
            <div>Carregando filtros...</div>
          ) : (
            <>
              <div className="filter-row">
                {availableFilters?.map(filter => renderFilter(filter))}
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
      )}
    </div>
  );
};

export default FilterSection; 