const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Configurar CORS para permitir o frontend
app.use(
  cors({
    origin: 'http://localhost:5173'
  })
)

app.use(express.json())

// Rotas modularizadas
const licitacoesRoutes = require('./routes/contratosLicitacoes/licitacoes')
const contratosRoutes = require('./routes/contratosLicitacoes/contratos')

const despesasRoutes = require('./routes/receitasDespesas/despesas')
const receitasRoutes = require('./routes/receitasDespesas/receitas')
const dividaRoutes = require('./routes/receitasDespesas/divida')
const ExtraRoutes = require('./routes/receitasDespesas/Extraorçamentaria')
const PagamentoRoutes = require('./routes/receitasDespesas/Pagamento')
const PatrimonioAlmoxarifadoRoutes = require('./routes/receitasDespesas/PatrimonioAlmoxarifado')
const TransferenciasRealizadasRoutes = require('./routes/receitasDespesas/TransferenciasRealizadas')
const TransferenciasRecebidasRoutes = require('./routes/receitasDespesas/TransferenciasRecebidas')

const diariasRoutes = require('./routes/orgaosServidores/diarias')
const servidoresRoutes = require('./routes/orgaosServidores/servidores')

const legislacaoRoutes = require('./routes/legislacaoPublicacoes/legislacao')

// Usar as rotas
app.use('/api/licitacoes', licitacoesRoutes)
app.use('/api/contratos', contratosRoutes)

app.use('/api/receitas', receitasRoutes)
app.use('/api/despesas', despesasRoutes)
app.use('/api/divida', dividaRoutes)
app.use('/api/extra', ExtraRoutes)
app.use('/api/pagamento', PagamentoRoutes)
app.use('/api/patrimonio-e-almoxarifado', PatrimonioAlmoxarifadoRoutes)
app.use('/api/transferencia-realizada', TransferenciasRealizadasRoutes)
app.use('/api/transferencias-recebidas', TransferenciasRecebidasRoutes)

app.use('/api/diarias', diariasRoutes)
app.use('/api/servidor', servidoresRoutes)

app.use('/api/legislacao', legislacaoRoutes)

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
