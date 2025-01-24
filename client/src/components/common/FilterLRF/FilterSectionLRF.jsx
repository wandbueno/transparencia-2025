import React, { useState, useEffect } from 'react';
import './FilterSectionLRF.css';

const FilterSectionLRF = ({ onFilterChange, initialValues, hideMonth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false);
  
  const [filters, setFilters] = useState(initialValues || {
    ano: new Date().getFullYear(),
    mes: 12,
    extensao: 'pdf',
  });

  const extensoesOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'xlsx', label: 'Excel' },
    { value: 'docx', label: 'Word' },
  ];

  const mesesOptions = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  const anosOptions = [2024, 2023, 2022, 2021, 2020];

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = () => {
    setHasFiltersApplied(true);
    onFilterChange(hideMonth ? { ...filters, mes: 12 } : filters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      ano: new Date().getFullYear(),
      mes: 12,
      extensao: 'pdf',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    setHasFiltersApplied(false);
  };

  return (
    <div className="filter-section-lrf">
      <div className="filter-header-lrf" onClick={toggleFilters}>
        <div className="filter-header-title-lrf">Filtros de Pesquisa</div>
        <div className="filter-toggle-lrf">
          {isOpen ? "Esconder Filtros" : "Mostrar Filtros"}
          <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
        </div>
      </div>

      {isOpen ? (
        <div className="filter-content-lrf">
          <div className="filter-row-lrf">
            <div className="filter-group-lrf">
              <label>Ano</label>
              <select 
                name="ano" 
                value={filters.ano} 
                onChange={handleInputChange}
              >
                {anosOptions.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>

            {!hideMonth && (
              <div className="filter-group-lrf">
                <label>Mês</label>
                <select 
                  name="mes" 
                  value={filters.mes} 
                  onChange={handleInputChange}
                >
                  {mesesOptions.map((mes) => (
                    <option key={mes.value} value={mes.value}>
                      {mes.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="filter-group-lrf">
              <label>Formato</label>
              <select 
                name="extensao" 
                value={filters.extensao} 
                onChange={handleInputChange}
              >
                {extensoesOptions.map((formato) => (
                  <option key={formato.value} value={formato.value}>
                    {formato.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-buttons-lrf">
            <button
              className={`clear-button ${hasFiltersApplied ? 'visible' : ''}`}
              onClick={handleClearFilters}
            >
              Limpar
            </button>
            <button className="search-button" onClick={handleFilterSubmit}>
              Pesquisar
            </button>
          </div>
        </div>
      ) : (
        <div className="filter-placeholder-lrf">
          Utilize os campos do formulário para filtrar a sua pesquisa. Para isso,
          clique em <strong>MOSTRAR FILTRO</strong> e preencha os campos com os dados
          do seu interesse.
        </div>
      )}
    </div>
  );
};

export default FilterSectionLRF; 