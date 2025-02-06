const express = require('express')
const router = express.Router()
const { getProcedimentos, getProcedimentoById } = require('../services/scraper')

// Configuração de cache
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 })

// Função auxiliar para padronizar o valor da modalidade
const padronizarModalidade = modalidade =>
  modalidade.toLowerCase().replace(/\s/g, '')

// Rota otimizada para contratos
router.get('/contratos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const start = (page - 1) * limit

    // Busca do cache primeiro
    const cachedContratos = cache.get(`contratos_page_${page}`)
    if (cachedContratos) {
      return res.json(cachedContratos)
    }

    // Busca apenas os procedimentos da página atual
    const allData = await getProcedimentos()
    const paginatedData = allData.slice(start, start + limit)

    // Busca detalhes apenas dos procedimentos da página atual
    const detalhes = await Promise.all(
      paginatedData.map(proc => getProcedimentoById(proc.id))
    )

    // Processa os contratos
    const contratos = detalhes
      .filter(detalhe => detalhe.contratos && detalhe.contratos.length > 0)
      .flatMap(detalhe =>
        detalhe.contratos.map(contrato => ({
          numero: contrato.numero,
          valorContrato: contrato.valorContrato,
          dataAssinatura: contrato.dataAssinatura,
          contratado: contrato.contratado,
          procedimento: {
            id: detalhe.id,
            tipoModalidade: detalhe.dadosPrimeiraFase.tipoModalidade,
            processo: detalhe.dadosPrimeiraFase.processo,
            unidadeGestora: detalhe.dadosPrimeiraFase.unidadeGestora,
            sicapUrl: `https://app.tce.to.gov.br/lo_publico/pesquisar/detalhes?idProcedimento=${detalhe.id}`
          }
        }))
      )

    const response = {
      contratos,
      pagination: {
        page,
        limit,
        total: allData.length,
        totalPages: Math.ceil(allData.length / limit)
      }
    }

    // Cache por página
    cache.set(`contratos_page_${page}`, response)

    res.json(response)
  } catch (error) {
    console.error('Erro em /contratos:', error)
    res.status(500).json({ error: 'Erro ao buscar contratos' })
  }
})
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
