import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './components/pages/Home/Home';
import Licitacoes from './components/pages/licitacoes/LicitacoesTable';
import Dispensas from './components/pages/licitacoes/DispensasTable';
import LicitacaoDetail from './components/pages/licitacoes/LicitacaoDetail';
import Receitas from './components/pages/receitas/Receitas';
import Despesas from './components/pages/despesas/Despesas';
import AccessibilityButton from './components/layout/Accessibility/AccessibilityButton';
import AccessibilityPopup from './components/layout/Accessibility/AccessibilityPopup';
import './App.css';
import Footer from './components/layout/Footer';

function App() {

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <Router>
      <Header />
      <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/receita" element={<Receitas />} />
        <Route path="/licitacoes" element={<Licitacoes />} />
        <Route path="/licitacoes/:id" element={<LicitacaoDetail />} /> {/* Adiciona a rota de detalhes */}
        <Route path="/despesas" element={<Despesas />} />
        <Route path="/dispensas-e-inexigibilidades" element={<Dispensas />} />
        <Route path="/dispensas-e-inexigibilidades/:id" element={<LicitacaoDetail />} /> 

      </Routes>
      <Footer />
        <AccessibilityButton onOpen={handleOpenPopup} />
        <AccessibilityPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      </div>
    </Router>
  );
}

export default App;