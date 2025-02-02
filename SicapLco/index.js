const express = require('express')
const cors = require('cors')
const procedimentosRoutes = require('./routes/procedimentos')
const fileProxyRouter = require('./services/fileProxy')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware para verificar tenant
const tenantMiddleware = (req, res, next) => {
  const tenant =
    req.headers['x-tenant-id'] || req.query.tenant || 'conceicaodotocantins'
  process.env.TENANT_ID = tenant
  next()
}

// Configurar CORS
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://conceicaodotocantins.to.gov.br'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-tenant-id']
  })
)

app.use(express.json())

// Aplicar middleware de tenant em todas as rotas
app.use(tenantMiddleware)

// Rotas
app.use('/api/tipo', procedimentosRoutes)
app.use('/api/files', fileProxyRouter) // Mudamos a rota do proxy

// Rota básica para teste
app.get('/', (req, res) => {
  res.send('SICAP-LCO Scraper está funcionando!')
})

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
