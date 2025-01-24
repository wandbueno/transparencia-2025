const axios = require('axios')

const fetchFromLRFAPI = async (path, req, res) => {
  try {
    console.log(
      'Fazendo requisição LRF para:',
      `${process.env.SERVER_LRF}${path}`
    )
    console.log('Parâmetros:', req.query)

    const response = await axios.get(`${process.env.SERVER_LRF}${path}`, {
      params: req.query,
      headers: {
        Authorization: `Bearer ${process.env.TOKEN_LRF}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO
      },
      responseType: 'arraybuffer'
    })

    const contentType = response.headers['content-type']
    if (contentType && contentType.includes('application/')) {
      res.setHeader('Content-Type', contentType)
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=relatorio.${req.query.extensao}`
      )
      return res.send(response.data)
    }

    res.json(response.data)
  } catch (error) {
    if (error.response) {
      const errorData = JSON.parse(error.response.data.toString())
      return res.status(error.response.status).json({
        error: errorData.message || 'Erro ao conectar com a API LRF',
        status: error.response.status,
        path: path
      })
    }

    res.status(500).json({
      error: 'Erro ao conectar com a API LRF',
      details: error.message
    })
  }
}

module.exports = { fetchFromLRFAPI }
