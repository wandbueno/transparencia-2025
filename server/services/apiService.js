// services/apiService.js
const axios = require('axios')
const { getAPIParams } = require('./paramService') // Importa a função que gera os parâmetros

const fetchFromAPI = async (method, path, req, res, options = {}) => {
  try {
    const response = await axios({
      method: method || 'get',
      url: `${process.env.SERVER}${path}`,
      params: method === 'get' ? options.params : undefined,
      data: method === 'post' ? options.data : undefined,
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO
      }
    })
    res.json(response.data)
  } catch (error) {
    console.error('Erro na API:', error.response?.data || error.message)
    res.status(error.response?.status || 500).json({
      message: 'Erro ao conectar com a API externa',
      error: error.response?.data || error.message
    })
  }
}

module.exports = { fetchFromAPI }
