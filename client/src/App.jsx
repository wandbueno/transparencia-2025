import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './components/pages/Home/Home';
import Licitacoes from './components/pages/licitacoes/LicitacoesTable';
import Receitas from './components/pages/receitas/Receitas';
import Despesas from './components/pages/despesas/Despesas';

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/receita" element={<Receitas />} />
        <Route path="/licitacoes" element={<Licitacoes />} />
        <Route path="/despesas" element={<Despesas />} />
        
      </Routes>
      </div>
    </Router>
  );
}

export default App;
