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

// Usar as rotas
app.use('/api/licitacoes', licitacoesRoutes)
app.use('/api/divida', dividaRoutes)
app.use('/api/diarias', diariasRoutes)
app.use('/api/contratos', contratosRoutes)

// Rota básica para a raiz do servidor
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!')
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
