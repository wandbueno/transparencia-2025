const express = require('express')
const router = express.Router()
const ComboService = require('../../services/comboService')

router.get('/', async (req, res) => {
  try {
    const filtros = req.query.filtro

    // Verifica se o filtro está presente
    if (!filtros) {
      return res.status(400).json({
        error: 'O parâmetro filtro é obrigatório'
      })
    }

    // Busca dados do combo
    const data = await ComboService.fetchComboData(filtros)
    res.json(data)
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
