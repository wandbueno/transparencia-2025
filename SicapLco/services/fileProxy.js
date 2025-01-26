// SicapLco/services/fileProxy.js
const express = require('express')
const axios = require('axios')
const router = express.Router()

router.get('/file/:token', async (req, res) => {
  try {
    const { token } = req.params
    const response = await axios.get(
      `https://app.tce.to.gov.br/lo_publico/castor/arquivo?t=${token}`,
      {
        responseType: 'stream',
        headers: {
          Referer: 'https://app.tce.to.gov.br/lo_publico/pesquisar/detalhes',
          Cookie: 'JSESSIONID=your_session_id' // Você precisará gerenciar a sessão
        }
      }
    )

    // Encaminha o stream do arquivo
    response.data.pipe(res)
  } catch (error) {
    console.error('Erro ao buscar arquivo:', error)
    res.status(500).send('Erro ao buscar arquivo')
  }
})

module.exports = router
