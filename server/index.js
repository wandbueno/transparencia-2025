const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Configurar CORS
app.use(
  cors({
    origin: 'http://localhost:5173'
  })
)

app.use(express.json())

// Rotas modularizadas
const licitacoesRoutes = require('./routes/contratosLicitacoes/licitacoes')
const contratosRoutes = require('./routes/contratosLicitacoes/contratos')
const fiscaisContratosRoutes = require('./routes/contratosLicitacoes/fiscaisContratos')

const projetosRoutes = require('./routes/PlanPolPublicas/projetos')
const programasRoutes = require('./routes/PlanPolPublicas/programas')
const despesasRoutes = require('./routes/receitasDespesas/despesas')
const receitasRoutes = require('./routes/receitasDespesas/receitas')
const dividaRoutes = require('./routes/receitasDespesas/divida')
const ExtraRoutes = require('./routes/receitasDespesas/Extraorçamentaria')
const PagamentoRoutes = require('./routes/receitasDespesas/Pagamento')
const LiquidacaoRoutes = require('./routes/receitasDespesas/Liquidacoes')
const PatrimonioAlmoxarifadoRoutes = require('./routes/receitasDespesas/PatrimonioAlmoxarifado')
const TransferenciasRealizadasRoutes = require('./routes/receitasDespesas/TransferenciasRealizadas')
const TransferenciasRecebidasRoutes = require('./routes/receitasDespesas/TransferenciasRecebidas')
const RepassesTransferenciasRoutes = require('./routes/receitasDespesas/RepassesTransferencias')
const DespesasFixadasRoutes = require('./routes/receitasDespesas/DespesasFixadas')
const DespesaSinteticaRoutes = require('./routes/receitasDespesas/DespesaSintetica')
const RestosPagarRoutes = require('./routes/receitasDespesas/RestosPagar')
const informacoesConsolidadasRouter = require('./routes/receitasDespesas/informacoesConsolidadas')

const diariasRoutes = require('./routes/orgaosServidores/diarias')
const servidoresRoutes = require('./routes/orgaosServidores/servidores')
const estruturaremuneracaoRoutes = require('./routes/orgaosServidores/EstruturaRemuneracao')

const legislacaoRoutes = require('./routes/legislacaoPublicacoes/legislacao')

const lrfRoutes = require('./routes/LRF/lrf')
const comboRoutes = require('./routes/combo/combo')

// Usar as rotas
app.use('/api/licitacoes', licitacoesRoutes)
app.use('/api/contratos', contratosRoutes)
app.use('/api/fiscais-de-contratos', fiscaisContratosRoutes)

app.use('/api/projetos', projetosRoutes)
app.use('/api/programas', programasRoutes)

app.use('/api/receitas', receitasRoutes)
app.use('/api/despesas', despesasRoutes)
app.use('/api/divida', dividaRoutes)
app.use('/api/extra', ExtraRoutes)
app.use('/api/pagamento', PagamentoRoutes)
app.use('/api/liquidacoes', LiquidacaoRoutes)
app.use('/api/patrimonio-e-almoxarifado', PatrimonioAlmoxarifadoRoutes)
app.use('/api/transferencia-realizada', TransferenciasRealizadasRoutes)
app.use('/api/transferencias-recebidas', TransferenciasRecebidasRoutes)
app.use('/api/repasse-ou-transferencia', RepassesTransferenciasRoutes)
app.use('/api/despesas-fixadas', DespesasFixadasRoutes)
app.use('/api/despesas-sintetica', DespesaSinteticaRoutes)
app.use('/api/restos-a-pagar', RestosPagarRoutes)
app.use('/api/informacoes-consolidadas', informacoesConsolidadasRouter)

app.use('/api/diarias', diariasRoutes)
app.use('/api/servidor', servidoresRoutes)
app.use('/api/estrutura-de-remuneracao', estruturaremuneracaoRoutes)

app.use('/api/legislacao', legislacaoRoutes)

app.use('/api/lrf', lrfRoutes)
app.use('/api/combo', comboRoutes)

// Rota básica para a raiz do servidor
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!')
})

// Middleware para rotas não definidas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Algo deu errado!' })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
