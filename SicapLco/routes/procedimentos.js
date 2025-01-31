const express = require('express')
const router = express.Router()
const { getProcedimentos, getProcedimentoById } = require('../services/scraper')

// Configuração de cache
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 })

// Função auxiliar para padronizar o valor da modalidade
const padronizarModalidade = modalidade =>
  modalidade.toLowerCase().replace(/\s/g, '')

// Rota otimizada para modalidade1
router.get('/modalidade1', async (req, res) => {
  try {
    const cached = cache.get('modalidade1')
    if (cached) return res.json(cached)

    const allData = await getProcedimentos()
    const filtered = allData.filter(
      p => padronizarModalidade(p.modalidade) === 'modalidade1'
    )

    cache.set('modalidade1', filtered)
    res.json(filtered)
  } catch (error) {
    console.error('Erro em /modalidade1:', error)
    res.status(500).json({ error: 'Erro ao buscar dados' })
  }
})

// Rota otimizada para modalidade2
router.get('/modalidade2', async (req, res) => {
  try {
    const cached = cache.get('modalidade2')
    if (cached) return res.json(cached)

    const allData = await getProcedimentos()
    const filtered = allData.filter(
      p => padronizarModalidade(p.modalidade) === 'modalidade2'
    )

    cache.set('modalidade2', filtered)
    res.json(filtered)
  } catch (error) {
    console.error('Erro em /modalidade2:', error)
    res.status(500).json({ error: 'Erro ao buscar dados' })
  }
})

// Rota completa (apenas para administração)
router.get('/full', async (req, res) => {
  try {
    const cached = cache.get('full')
    if (cached) return res.json(cached)

    const data = await getProcedimentos()

    cache.set('full', data)
    res.json(data)
  } catch (error) {
    console.error('Erro em /full:', error)
    res.status(500).json({ error: 'Erro ao buscar dados completos' })
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
