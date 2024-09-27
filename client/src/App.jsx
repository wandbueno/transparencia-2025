import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderNovo from './components/layout/Header/HeaderNovo';
import Home from './components/pages/Home/Home';
import Licitacoes from './components/pages/licitacoes/LicitacoesTable';
import Dispensas from './components/pages/licitacoes/DispensasTable';
import LicitacaoDetail from './components/pages/licitacoes/LicitacaoDetail';
import Contratos from './components/pages/Contratos/Contratos';
import ContratosDetail from './components/pages/Contratos/ContratosDetail';
import Receitas from './components/pages/receitas/Receitas';
import Empenho from './components/pages/despesas/empenho/Empenho';
import Pagamento from './components/pages/despesas/pagamento/Pagamento';
import PagamentoDetail from './components/pages/despesas/pagamento/PagamentoDetail';
import EmpenhoDetail from './components/pages/despesas/empenho/EmpenhoDetail';
import Extraorcamentaria from './components/pages/despesas/Extraorcamentaria';
import AccessibilityButton from './components/layout/Accessibility/AccessibilityButton';
import AccessibilityPopup from './components/layout/Accessibility/AccessibilityPopup';
import './App.css';
import Footer from './components/layout/Footer';
import Obras from './components/pages/obras/Obras';
import Diarias from './components/pages/servidores/diarias/Diarias';
import DiariasDetail from './components/pages/servidores/diarias/DiariasDetail';
import ReceitasDetail from './components/pages/receitas/ReceitasDetail';


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
      <HeaderNovo />
      <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/receitas/:id" element={<ReceitasDetail />} />
        <Route path="/licitacoes" element={<Licitacoes />} />
        <Route path="/licitacoes/:id" element={<LicitacaoDetail />} />
        <Route path="/contratos" element={<Contratos />} />
        <Route path="/contratos/:id" element={<ContratosDetail />} />
        <Route path="/despesas-empenho" element={<Empenho />} />
        <Route path="/despesas-empenho/:id" element={<EmpenhoDetail />} />
        <Route path="/pagamentos" element={<Pagamento />} />        
        <Route path="/pagamentos/:id" element={<PagamentoDetail />} />
        <Route path="/extra-orcamentaria" element={<Extraorcamentaria />} />
        <Route path="/dispensas-e-inexigibilidades" element={<Dispensas />} />
        <Route path="/dispensas-e-inexigibilidades/:id" element={<LicitacaoDetail />} /> 
        <Route path="/obras" element={<Obras />} />
        <Route path="/diarias" element={<Diarias />} />
        <Route path="/diarias/:id" element={<DiariasDetail />} />
      </Routes>
      <Footer />
        <AccessibilityButton onOpen={handleOpenPopup} />
        <AccessibilityPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      </div>
    </Router>
  );
}

export default App;