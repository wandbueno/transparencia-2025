import React, { useState } from "react";
import "./FilterSection.css";

const FilterSection = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleFilters = () => {
    setIsOpen(!isOpen);
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
              <label>Modalidade</label>
              <select disabled>
                <option>Todas as modalidades...</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Ano</label>
              <select disabled>
                <option>Todos os anos...</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Unidade Gestora</label>
              <select disabled>
                <option>Todas as Unidades...</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Situação</label>
              <select disabled>
                <option>Todas as situações...</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Atendimento ao covid-19</label>
              <select disabled>
                <option>...</option>
              </select>
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group full-width">
              <label>Busca por Texto</label>
              <input type="text" disabled />
            </div>
          </div>
          <div className="filter-buttons">
            <button className="clear-button">Limpar</button>
            <button className="search-button">Pesquisar</button>
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
