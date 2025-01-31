const express = require('express')
const axios = require('axios')
const { getProcedimentoById } = require('../services/scraper')
const router = express.Router()

// Caso BASE_URL não esteja definido aqui, importe-o ou defina-o conforme o scraper
const BASE_URL = 'https://app.tce.to.gov.br/lo_publico'

router.get('/file/:procedimentoId/:token', async (req, res) => {
  try {
    const { token, procedimentoId } = req.params

    // 1. Obter metadados da sessão
    const { sessionData } = await getProcedimentoById(procedimentoId)

    // 2. Configurar headers específicos
    const headers = {
      Referer: sessionData.referer,
      Cookie: sessionData.cookies,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }

    // 3. Fazer requisição para o TCE
    const response = await axios.get(`${BASE_URL}/castor/arquivo?t=${token}`, {
      responseType: 'stream',
      headers,
      maxRedirects: 0 // Importante para não perder headers
    })

    // 4. Encaminhar headers importantes
    res.set({
      'Content-Type': response.headers['content-type'],
      'Content-Disposition': response.headers['content-disposition']
    })

    // 5. Encaminhar o stream da resposta
    response.data.pipe(res)
  } catch (error) {
    console.error('Erro no proxy de arquivo:', error)
    res.status(500).json({
      error: 'Falha ao recuperar arquivo',
      details: error.response?.data || error.message
    })
  }
})

module.exports = router
