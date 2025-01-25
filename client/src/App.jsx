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
import Extraorcamentaria from './components/pages/despesas/Extraorcamentaria/Extraorcamentaria';
import AccessibilityButton from './components/layout/Accessibility/AccessibilityButton';
import AccessibilityPopup from './components/layout/Accessibility/AccessibilityPopup';
import './App.css';
import Footer from './components/layout/Footer';
import Obras from './components/pages/obras/Obras';
import Diarias from './components/pages/servidores/diarias/Diarias';
import DiariasDetail from './components/pages/servidores/diarias/DiariasDetail';
import ReceitasDetail from './components/pages/receitas/ReceitasDetail';
import Leis from './components/pages/legislacaoPublicacao/Leis';
import LegislacaoDetail from './components/pages/legislacaoPublicacao/LegislacaoDetail';
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
import Convenio from './components/pages/legislacaoPublicacao/Convenio/Convenio';
import EmendasParlamentares from './components/pages/legislacaoPublicacao/EmendasParlamentares/EmendasParlamentares';
import ValoresDiarias from './components/pages/servidores/ValoresDiarias/ValoresDiarias';
import SancoesAdministrativas from './components/pages/licitacoes/SancoesAdministrativas/SancoesAdministrativas';
import PlanosMunicipal from './components/pages/PoliticasPublicas/PlanosMunicipal/PlanosMunicipal';
import PublicacaoWPDetail from './components/pages/DetalhesPubWP/PublicacaoWPDetail';
import RelControleInterno from './components/pages/RespFiscal/RelControleInterno/RelControleInterno';
import RelAnualGestao from './components/pages/RespFiscal/RelAnualGestao/RelAnualGestao';
import RolInformacoes from './components/pages/ouvidoria/RolInformacoes/RolInformacoes';
import ParceirasAcordos from './components/pages/legislacaoPublicacao/ParceirasAcordos/ParceirasAcordos';
import Liquidacao from './components/pages/despesas/Liquidacao/Liquidacao';
import LiquidacaoDetail from './components/pages/despesas/Liquidacao/LiquidacaoDetail';
import EstruturaRemuneracao from './components/pages/servidores/estrutura/EstruturaRemuneracao';
import EstruturaRemuneracaoDetail from './components/pages/servidores/estrutura/EstruturaRemuneracaoDetail';
import ExtraorcamentariaDetail from './components/pages/despesas/Extraorcamentaria/ExtraorcamentariaDetail';
import RepassesTransferencias from './components/pages/despesas/RepassesTransferencias/RepassesTransferencias';
import RepassesTransferenciasDetail from './components/pages/despesas/RepassesTransferencias/RepassesTransferenciasDetail';
import DespesasFixadas from './components/pages/despesas/DespesasFixadas/DespesasFixadas';
import DespesasFixadasDetail from './components/pages/despesas/DespesasFixadas/DespesasFixadasDetail';
import DespesasSintetica from './components/pages/despesas/DespesasSintetica/DespesasSintetica';
import DespesasSinteticaDetail from './components/pages/despesas/DespesasSintetica/DespesasSinteticaDetail';
import RestosPagar from './components/pages/despesas/RestosPagar/RestosPagar';
import RestosPagaroDetail from './components/pages/despesas/RestosPagar/RestosPagaroDetail';
import NewHeader from './components/layout/Header/NewHeader/NewHeader';
import Metas from './components/pages/lrf/Metas/Metas';
import BalancoAnual from './components/pages/lrf/Balanco/Balanco';
import Pcasp from './components/pages/lrf/Pcasp/Pcasp';
import RREO from './components/pages/lrf/RREO/RREO';
import RGF from './components/pages/lrf/RGF/RGF';
import FiscaisContratos from './components/pages/Contratos/FiscaisContratos';
import AcompanhamentoProjetos from './components/pages/PoliticasPublicas/AcompanhamentoProjetos/AcompanhamentoProjetos';
import AcompanhamentoProjetosDetail from './components/pages/PoliticasPublicas/AcompanhamentoProjetos/AcompanhamentoProjetosDetail';
import InformacoesConsolidadas from './components/pages/despesas/InformacoesConsolidadas/InformacoesConsolidadas';
import InformacoesConsolidadasDetail from './components/pages/despesas/InformacoesConsolidadas/InformacoesConsolidadasDetail';
import AcompanhamentoProgramas from './components/pages/PoliticasPublicas/AcompanhamentoProgramas/AcompanhamentoProgramas';
import AcompanhamentoProgramasDetail from './components/pages/PoliticasPublicas/AcompanhamentoProgramas/AcompanhamentoProgramasDetail';
import FiscaisContratosDetail from './components/pages/Contratos/FiscaisContratosDetail';
import OrdensDeFornecimento from './components/pages/Contratos/OrdensDeFornecimento';
import OrdemDeFornecimentoDetalhe from './components/pages/Contratos/OrdemDeFornecimentoDetalhe';
import OrdemCronologicaPagamentos from './components/pages/despesas/OrdemCronologicaPagamentos/OrdemCronologicaPagamentos';
import Sicap from './components/pages/sicap/Sicap';
import SicapDetail from './components/pages/sicap/SicapDetail';

function App() {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  return (
    <Router>
        <NewHeader />
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
          <Route path="/liquidacoes" element={<Liquidacao />} /> 
          <Route path="/liquidacoes/:id" element={<LiquidacaoDetail />} />
          <Route path="/extra-orcamentaria" element={<Extraorcamentaria />} />
          <Route path="/extra-orcamentaria/:id" element={<ExtraorcamentariaDetail />} /> 
          <Route path="/dispensas-e-inexigibilidades" element={<Dispensas />} />
          <Route path="/dispensas-e-inexigibilidades/:id" element={<DispensasDetail />} /> 
          <Route path="/obras" element={<Obras />} />
          <Route path="/obras-paralisadas" element={<ObrasParalisadas />} />
          <Route path="/diarias" element={<Diarias />} />
          <Route path="/diarias/:id" element={<DiariasDetail />} />
          <Route path="/servidores" element={<Servidores />} />
          <Route path="/servidores/:id" element={<ServidoresDetail />} />
          <Route path="/estrutura-de-remuneracao" element={<EstruturaRemuneracao />} />
          <Route path="/estrutura-de-remuneracao/:id" element={<EstruturaRemuneracaoDetail />} />
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
          <Route path="/concurso-processo-seletivo/:slug" element={<PublicacaoWPDetail />} />
          <Route path="/julgamento-de-contas" element={<JulgamentoContas />} />   
          <Route path="/prestacao-de-contas" element={<PrestacaoContas />} />
          <Route path="/prestacao-de-contas/:slug" element={<PublicacaoWPDetail />} />
          <Route path="/incentivos-a-projetos-culturais" element={<IncentivosProjetos />} />
          <Route path="/convenio-pre-convenio-celebrados" element={<Convenio />} />
          <Route path="/convenio-pre-convenio-celebrados/:slug" element={<PublicacaoWPDetail />} />
          <Route path="/emendas-parlamentares" element={<EmendasParlamentares />} />
          <Route path="/emendas-parlamentares/:slug" element={<PublicacaoWPDetail />} />
          <Route path="/tabela-explicativa-de-valores-de-diarias" element={<ValoresDiarias />} />
          <Route path="/sancoes-administrativas" element={<SancoesAdministrativas />} />
          <Route path="/planos" element={<PlanosMunicipal />} />
          <Route path="/planos/:slug" element={<PublicacaoWPDetail />} />
          <Route path="/relatorio-do-controle-interno" element={<RelControleInterno />} />
          <Route path="/relatorio-anual-de-gestao" element={<RelAnualGestao />} />
          <Route path="/relatorio-anual-de-gestao/:slug" element={<PublicacaoWPDetail />} />
          <Route path="/rol-de-informacoes" element={<RolInformacoes />} />
          <Route path="/acordos" element={<ParceirasAcordos />} />
          
          <Route path="/leis" element={<Leis />} />
          <Route path="/leis/:id" element={<LegislacaoDetail />} />
          <Route path="/patrimonio-e-almoxarifado" element={<PatrimonioAlmoxarifado />} />
          <Route path="/patrimonio-e-almoxarifado/:id" element={<PatrimonioAlmoxarifadoDetail />} />
          <Route path="/repasse-ou-transferencia" element={<RepassesTransferencias />} />
          <Route path="/repasse-ou-transferencia/:id" element={<RepassesTransferenciasDetail />} />
          <Route path="/despesas-fixadas" element={<DespesasFixadas />} />
          <Route path="/despesas-fixadas/:id" element={<DespesasFixadasDetail />} />
          <Route path="/despesa-sintetica" element={<DespesasSintetica />} />
          <Route path="/despesa-sintetica/:id" element={<DespesasSinteticaDetail />} />
          <Route path="/restos-a-pagar" element={<RestosPagar />} />
          <Route path="/restos-a-pagar/:id" element={<RestosPagaroDetail />} />
          <Route path="/informacoes-consolidadas" element={<InformacoesConsolidadas />} />
          <Route path="/informacoes-consolidadas/:id" element={<InformacoesConsolidadasDetail />} />

          <Route path="/metas-e-riscos-fiscais" element={<Metas />} />
          <Route path="/balanco-anual" element={<BalancoAnual />} />
          <Route path="/pcasp" element={<Pcasp />} />
          <Route path="/relatorio-resumido-da-execucao-orcamentaria" element={<RREO />} />
          <Route path="/relatorio-de-gestao-fiscal" element={<RGF />} />
          <Route path="/lista-de-fiscal-de-contrato" element={<FiscaisContratos />} />
          <Route path="/lista-de-fiscal-de-contrato/:id" element={<FiscaisContratosDetail />} />
          <Route path="/acoes-e-projetos" element={<AcompanhamentoProjetos />} />
          <Route path="/acoes-e-projetos/:id" element={<AcompanhamentoProjetosDetail />} />
          <Route path="/programas" element={<AcompanhamentoProgramas />} />
          <Route path="/programas/:id" element={<AcompanhamentoProgramasDetail />} />
          <Route path="/ordem-de-fornecimento" element={<OrdensDeFornecimento />} />
          <Route path="/ordem-de-fornecimento/:id" element={<OrdemDeFornecimentoDetalhe />} />
          <Route path="/ordem-cronologica-de-pagamentos" element={<OrdemCronologicaPagamentos />} />
          <Route path="/sicap" element={ <Sicap />} />
          <Route path="/sicap/:id" element={<SicapDetail />} />
        </Routes>
        <Footer />
          <AccessibilityButton onOpen={handleOpenPopup} />
          <AccessibilityPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
        </div>
    </Router>
  );
}

export default App;