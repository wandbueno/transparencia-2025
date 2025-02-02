const express = require('express')
const router = express.Router()
const { getProcedimentos, getProcedimentoById } = require('../services/scraper')
const municipalities = require('../config/municipalities')

// Configuração de cache
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 })

// Função auxiliar para padronizar o valor da modalidade
const padronizarModalidade = modalidade =>
  modalidade.toLowerCase().replace(/\s/g, '')

// Rota para modalidade1
router.get('/modalidade1', async (req, res) => {
  try {
    const tenant =
      req.query.tenant || req.headers['x-tenant-id'] || 'conceicaodotocantins'
    const cacheKey = `${tenant}-modalidade1`

    // Verifica se existe no cache
    const cached = cache.get(cacheKey)
    if (cached) return res.json(cached)

    // Verifica se o tenant existe na configuração
    if (!municipalities[tenant]) {
      return res.status(404).json({
        error: 'Município não encontrado',
        message: `Tenant ${tenant} não está configurado`
      })
    }

    // Define o tenant no ambiente
    process.env.TENANT_ID = tenant

    // Busca todos os procedimentos
    const allData = await getProcedimentos()

    // Filtra por modalidade1
    const filtered = allData.filter(
      p => padronizarModalidade(p.modalidade) === 'modalidade1'
    )

    // Salva no cache
    cache.set(cacheKey, filtered)

    res.json(filtered)
  } catch (error) {
    console.error('Erro em /modalidade1:', error)
    res.status(500).json({
      error: 'Erro ao buscar dados',
      message: error.message
    })
  }
})

// Rota para modalidade2
router.get('/modalidade2', async (req, res) => {
  try {
    const tenant =
      req.query.tenant || req.headers['x-tenant-id'] || 'conceicaodotocantins'
    const cacheKey = `${tenant}-modalidade2`

    // Verifica se existe no cache
    const cached = cache.get(cacheKey)
    if (cached) return res.json(cached)

    // Verifica se o tenant existe na configuração
    if (!municipalities[tenant]) {
      return res.status(404).json({
        error: 'Município não encontrado',
        message: `Tenant ${tenant} não está configurado`
      })
    }

    // Define o tenant no ambiente
    process.env.TENANT_ID = tenant

    // Busca todos os procedimentos
    const allData = await getProcedimentos()

    // Filtra por modalidade2
    const filtered = allData.filter(
      p => padronizarModalidade(p.modalidade) === 'modalidade2'
    )

    // Salva no cache
    cache.set(cacheKey, filtered)

    res.json(filtered)
  } catch (error) {
    console.error('Erro em /modalidade2:', error)
    res.status(500).json({
      error: 'Erro ao buscar dados',
      message: error.message
    })
  }
})

// Rota para buscar detalhes de um procedimento específico
router.get('/detalhes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const tenant =
      req.query.tenant || req.headers['x-tenant-id'] || 'conceicaodotocantins'
    const cacheKey = `${tenant}-details-${id}`

    // Verifica cache
    const cached = cache.get(cacheKey)
    if (cached) return res.json(cached)

    // Verifica tenant
    if (!municipalities[tenant]) {
      return res.status(404).json({
        error: 'Município não encontrado',
        message: `Tenant ${tenant} não está configurado`
      })
    }

    // Define o tenant
    process.env.TENANT_ID = tenant

    // Busca detalhes
    const detalhes = await getProcedimentoById(id)

    // Salva no cache
    cache.set(cacheKey, detalhes)

    res.json(detalhes)
  } catch (error) {
    console.error('Erro ao buscar detalhes do procedimento:', error)
    res.status(500).json({
      error: 'Erro ao buscar detalhes',
      message: error.message
    })
  }
})

module.exports = router
