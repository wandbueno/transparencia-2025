// services/apiService.js
const axios = require('axios')
const { getAPIParams } = require('./paramService') // Importa a função que gera os parâmetros

const fetchFromAPI = async (path, req, res) => {
  try {
    const params = getAPIParams(req) // Reutiliza a função para definir os parâmetros dinamicamente
    const response = await axios.get(`${process.env.SERVER}${path}`, {
      params,
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO
      }
    })
    res.json(response.data)
  } catch (error) {
    console.error('Erro ao conectar com a API externa:', error.message)
    res.status(500).json({ error: 'Erro ao conectar com a API externa' })
  }
}

module.exports = { fetchFromAPI }
