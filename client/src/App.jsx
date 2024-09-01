import React from 'react';
import LicitacoesTable from './components/pages/licitacoes/LicitacoesTable';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './components/pages/Home/Home';
import Licitacoes from './components/pages/licitacoes/LicitacoesTable';

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/licitacoes" element={<Licitacoes />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
