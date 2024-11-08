import React, { useState } from 'react';
import '../common/FilterSection/FilterSection.css';

const FilterSection = ({ data, onFilterChange, resetFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false); // Controla se os filtros foram aplicados
  
  const [filters, setFilters] = useState({
    ano: '',
    codigoDoOrgao: '',
    codigoDaModalidade: '',
    codigoDaSituacao: '',
    cpfCnpj: '',
    fornecedor: '',
    objeto: '',
  });

  const anosOptions = data && data.length > 0 
    ? [...new Set(data.map(item => new Date(item.dataDePublicacao).getFullYear()))] 
    : [];

  const orgaosOptions = data && data.length > 0 
    ? [...new Map(data.map(item => [item.codigoDoOrgao, { codigo: item.codigoDoOrgao, nome: item.orgao }])).values()]
    : [];

  const modalidadesOptions = data && data.length > 0 
    ? [...new Map(data.map(item => [item.codigoDaModalidade, { codigo: item.codigoDaModalidade, nome: item.modalidade }])).values()]
    : [];

  const situacoesOptions = data && data.length > 0 
    ? [...new Map(data.map(item => [item.codigoDaSituacao, { codigo: item.codigoDaSituacao, nome: item.situacao }])).values()]
    : [];

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleFilterSubmit = () => {
    setHasFiltersApplied(true); // Marcar que os filtros foram aplicados
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      ano: '',
      codigoDoOrgao: '',
      codigoDaModalidade: '',
      codigoDaSituacao: '',
      cpfCnpj: '',
      fornecedor: '',
      objeto: '',
    });
    resetFilters();
    setHasFiltersApplied(false); // Resetar quando os filtros forem limpos
  };

  return (
    <div className="filter-section">
      <div className="filter-header" onClick={toggleFilters}>
        <div className="filter-header-title">Filtros de Pesquisa</div>
        <div className="filter-toggle">
          {isOpen ? "Esconder Filtros" : "Mostrar Filtros"}
          <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
        </div>
      </div>

      {isOpen ? (
        <div className="filter-content">
          <div className="filter-row">
            <div className="filter-group">
              <label>Ano</label>
              <select name="ano" value={filters.ano} onChange={handleInputChange}>
                <option value="">Todos os anos...</option>
                {anosOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Órgão</label>
              <select name="codigoDoOrgao" value={filters.codigoDoOrgao} onChange={handleInputChange}>
                <option value="">Todos os Órgãos...</option>
                {orgaosOptions.map((option) => (
                  <option key={option.codigo} value={option.codigo}>
                    {option.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Modalidade</label>
              <select name="codigoDaModalidade" value={filters.codigoDaModalidade} onChange={handleInputChange}>
                <option value="">Todas as modalidades...</option>
                {modalidadesOptions.map((option) => (
                  <option key={option.codigo} value={option.codigo}>
                    {option.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Situação</label>
              <select name="codigoDaSituacao" value={filters.codigoDaSituacao} onChange={handleInputChange}>
                <option value="">Todas as situações...</option>
                {situacoesOptions.map((option) => (
                  <option key={option.codigo} value={option.codigo}>
                    {option.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group full-width">
              <label>CPF/CNPJ</label>
              <input type="text" name="cpfCnpj" value={filters.cpfCnpj} onChange={handleInputChange} />
            </div>

            <div className="filter-group full-width">
              <label>Fornecedor</label>
              <input type="text" name="fornecedor" value={filters.fornecedor} onChange={handleInputChange} />
            </div>

            <div className="filter-group full-width">
              <label>Objeto</label>
              <input type="text" name="objeto" value={filters.objeto} onChange={handleInputChange} />
            </div>
          </div>

          <div className="filter-buttons">
            <button
              className={`clear-button ${hasFiltersApplied ? 'visible' : ''}`} // Mostrar apenas quando filtros forem aplicados
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
        <div className="filter-placeholder">
          Utilize os campos do formulário para filtrar a sua pesquisa. Para isso,
          clique em <strong>MOSTRAR FILTRO</strong> e preencha os campos com os dados
          do seu interesse.
        </div>
      )}
    </div>
  );
};

export default FilterSection;
