import React, { useState } from "react";
import "./FilterSection.css";

const FilterSection = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalidade, setModalidade] = useState("");
  const [ano, setAno] = useState("");
  const [unidadeGestora, setUnidadeGestora] = useState("");
  const [situacao, setSituacao] = useState("");
  const [covid, setCovid] = useState("");
  const [buscaTexto, setBuscaTexto] = useState("");

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    const filters = {
      modalidade,
      ano,
      unidadeGestora,
      situacao,
      covid,
      buscaTexto
    };
    onFilterChange(filters); // Envia os filtros para o componente pai
  };

  // Função para limpar os filtros
  const clearFilters = () => {
    setModalidade("");
    setAno("");
    setUnidadeGestora("");
    setSituacao("");
    setCovid("");
    setBuscaTexto("");
    onFilterChange({}); // Reseta os filtros no componente pai
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
              <select value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
                <option value="">Todas as modalidades...</option>
                <option value="modalidade1">Modalidade 1</option>
                <option value="modalidade2">Modalidade 2</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Ano</label>
              <select value={ano} onChange={(e) => setAno(e.target.value)}>
                <option value="">Todos os anos...</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Unidade Gestora</label>
              <select value={unidadeGestora} onChange={(e) => setUnidadeGestora(e.target.value)}>
                <option value="">Todas as Unidades...</option>
                <option value="gestora1">Unidade 1</option>
                <option value="gestora2">Unidade 2</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Situação</label>
              <select value={situacao} onChange={(e) => setSituacao(e.target.value)}>
                <option value="">Todas as situações...</option>
                <option value="sit1">Situação 1</option>
                <option value="sit2">Situação 2</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Atendimento ao covid-19</label>
              <select value={covid} onChange={(e) => setCovid(e.target.value)}>
                <option value="">...</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group full-width">
              <label>Busca por Texto</label>
              <input 
                type="text" 
                value={buscaTexto} 
                onChange={(e) => setBuscaTexto(e.target.value)} 
              />
            </div>
          </div>
          <div className="filter-buttons">
            <button className="clear-button" onClick={clearFilters}>Limpar</button>
            <button className="search-button" onClick={applyFilters}>Pesquisar</button>
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
