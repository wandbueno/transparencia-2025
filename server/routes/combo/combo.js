const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/', async (req, res) => {
  try {
    const filtros = req.query.filtro

    // Se não houver filtro, retorna erro
    if (!filtros) {
      return res.status(400).json({
        error: 'O parâmetro filtro é obrigatório'
      })
    }

    // Converte para array se for string única
    const filtrosArray = Array.isArray(filtros) ? filtros : [filtros]

    // Constrói a query string manualmente
    const queryString = filtrosArray
      .map(f => `filtro=${encodeURIComponent(f)}`)
      .join('&')
    const url = `${process.env.SERVER}/api/combo/?${queryString}`

    // console.log('Fazendo requisição para:', url)

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO,
        Accept: 'application/json, text/plain, */*'
      }
    })

    res.json(response.data)
  } catch (error) {
    console.error('Erro na requisição do combo:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    })

    res.status(error.response?.status || 500).json({
      error: 'Erro ao buscar dados do combo',
      details: error.response?.data || error.message
    })
  }
})

module.exports = router
