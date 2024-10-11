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
import Leis from './components/pages/legislacao/Leis';
import LegislacaoDetail from './components/pages/legislacao/LegislacaoDetail';
import PatrimonioAlmoxarifado from './components/pages/despesas/patrimonio/PatrimonioAlmoxarifado';
import PatrimonioAlmoxarifadoDetail from './components/pages/despesas/patrimonio/PatrimonioAlmoxarifadoDetail';
import DispensasDetail from './components/pages/licitacoes/DispensasDetail';
import Servidores from './components/pages/servidores/servidor/Servidores';
import ServidoresDetail from './components/pages/servidores/servidor/ServidoresDetail';
import TransferenciasRealizadas from './components/pages/despesas/TransferenciasRealizadas/TransferenciasRealizadas';
import TransferenciasRealizadasDetail from './components/pages/despesas/TransferenciasRealizadas/TransferenciasRealizadasDetail';
import TransferenciasRecebidas from './components/pages/despesas/TransferenciasRecebidas/TransferenciasRecebidas';
import TransferenciasRecebidasDetail from './components/pages/despesas/TransferenciasRecebidas/TransferenciasRecebidasDetail';
import Terceirizados from './components/pages/servidores/terceirizados/Terceirizados';
import Estagiarios from './components/pages/servidores/Estagiarios/Estagiarios';
import Desoneracao from './components/pages/despesas/Desoneracao';
import Renuncias from './components/pages/despesas/Renuncias';
import DividaAtiva from './components/pages/despesas/DividaAtiva';
import ConcursosSeletivos from './components/pages/servidores/concuros/ConcursosSeletivos';
import JulgamentoContas from './components/pages/PoliticasPublicas/JulgamenrtoContas/JulgamentoContas';
import PrestacaoContas from './components/pages/PoliticasPublicas/PrestacaoContas/PrestacaoContas';
import ObrasParalisadas from './components/pages/obras/ObrasParalisadas';
import IncentivosProjetos from './components/pages/PoliticasPublicas/IncentivosProjetos/IncentivosProjetos';

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
        <Route path="/dispensas-e-inexigibilidades/:id" element={<DispensasDetail />} /> 
        <Route path="/obras" element={<Obras />} />
        <Route path="/obras-paralisadas" element={<ObrasParalisadas />} />
        <Route path="/diarias" element={<Diarias />} />
        <Route path="/diarias/:id" element={<DiariasDetail />} />
        <Route path="/servidores" element={<Servidores />} />
        <Route path="/servidores/:id" element={<ServidoresDetail />} />
        <Route path="/terceirizados" element={<Terceirizados />} />
        <Route path="/estagiarios" element={<Estagiarios />} />
        <Route path="/transferencias-voluntarias-realizadas" element={<TransferenciasRealizadas />} />
        <Route path="/transferencias-voluntarias-realizadas/:id" element={<TransferenciasRealizadasDetail />} />
        <Route path="/transferencias-voluntarias-recebidas" element={<TransferenciasRecebidas />} />
        <Route path="/transferencias-voluntarias-recebidas/:id" element={<TransferenciasRecebidasDetail />} />
        <Route path="/renuncias-fiscais" element={<Renuncias />} />
        <Route path="/desoneracao" element={<Desoneracao />} />
        <Route path="/divida-ativa" element={<DividaAtiva />} />
        <Route path="/concurso-processo-seletivo" element={<ConcursosSeletivos />} />
        <Route path="/julgamento-de-contas" element={<JulgamentoContas />} />   
        <Route path="/prestacao-de-contas" element={<PrestacaoContas />} />
        <Route path="/incentivos-a-projetos-culturais" element={<IncentivosProjetos />} />

        <Route path="/leis" element={<Leis />} />
        <Route path="/leis/:id" element={<LegislacaoDetail />} />
        <Route path="/patrimonio-e-almoxarifado" element={<PatrimonioAlmoxarifado />} />
        <Route path="/patrimonio-e-almoxarifado/:id" element={<PatrimonioAlmoxarifadoDetail />} />


      </Routes>
      <Footer />
        <AccessibilityButton onOpen={handleOpenPopup} />
        <AccessibilityPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      </div>
    </Router>
  );
}

export default App;