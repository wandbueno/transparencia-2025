const express = require('express')
const router = express.Router()
const { getProcedimentos, getProcedimentoById } = require('../services/scraper')

// Rota para listar procedimentos
router.get('/', async (req, res) => {
  try {
    const procedimentos = await getProcedimentos()
    res.json(procedimentos)
  } catch (error) {
    console.error('Erro ao buscar procedimentos:', error)
    res.status(500).json({ error: 'Erro ao buscar procedimentos' })
  }
})

// Rota para buscar detalhes de um procedimento específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const detalhes = await getProcedimentoById(id)
    res.json(detalhes)
  } catch (error) {
    console.error('Erro ao buscar detalhes do procedimento:', error)
    res.status(500).json({ error: 'Erro ao buscar detalhes do procedimento' })
  }
})

module.exports = router
