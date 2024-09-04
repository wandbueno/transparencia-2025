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
const licitacoesRoutes = require('./routes/licitacoes')
const dividaRoutes = require('./routes/divida')
const diariasRoutes = require('./routes/diarias')
const contratosRoutes = require('./routes/contratos')
const receitasRoutes = require('./routes/receitas')
const despesasRoutes = require('./routes/receitas-despesas/despesas')

// Usar as rotas
app.use('/api/licitacoes', licitacoesRoutes)
app.use('/api/divida', dividaRoutes)
app.use('/api/diarias', diariasRoutes)
app.use('/api/contratos', contratosRoutes)
app.use('/api/receitas', receitasRoutes)
app.use('/api/despesas', despesasRoutes)

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
