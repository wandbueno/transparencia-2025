const express = require('express')
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Configurar CORS para permitir o frontend
app.use(
  cors({
    origin: 'http://localhost:5173' // Altere para o endereço do seu frontend em produção
  })
)

app.use(express.json())

// Rota básica para a raiz do servidor
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!')
})

// Rota para obter os dados de licitação
app.get('/api/licitacoes', async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.SERVER}/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/detalhes-paginado`,
      {
        params: {
          pagina: 1,
          tamanhoDaPagina: 250
        },
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          'cliente-integrado': process.env.CLIENTE_INTEGRADO
        }
      }
    )
    res.json(response.data)
  } catch (error) {
    console.error('Erro ao conectar com a API externa:', error.message)
    res.status(500).json({ error: 'Erro ao conectar com a API externa' })
  }
})

app.get('/api/licitacao/detalhe/:id', async (req, res) => {
  const id = req.params.id

  try {
    const response = await axios.get(
      `${process.env.SERVER}/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/detalhe?chavePrimaria=${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          'cliente-integrado': process.env.CLIENTE_INTEGRADO
        }
      }
    )
    res.json(response.data)
  } catch (error) {
    console.error('Erro ao conectar com a API externa:', error.message)
    res.status(500).json({ error: 'Erro ao conectar com a API externa' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
