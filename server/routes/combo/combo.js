const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/', async (req, res) => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    const filtros = req.query.filtro
    if (!filtros) {
      return res.status(400).json({
        error: 'O parâmetro filtro é obrigatório'
      })
    }

    const filtrosArray = Array.isArray(filtros) ? filtros : [filtros]
    const promises = filtrosArray.map(async filtro => {
      try {
        console.log(`Requesting combo data for filter: ${filtro}`)

        const url = `${tenant.api_url}/api/combo/?filtro=${encodeURIComponent(
          filtro
        )}`
        console.log('Requesting URL:', url)

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${tenant.token}`,
            'cliente-integrado': tenant.cliente_integrado,
            Accept: 'application/json'
          }
        })

        console.log(`Response for ${filtro}:`, response.data)

        // Handle different response formats
        if (
          response.data &&
          response.data[filtro] &&
          Array.isArray(response.data[filtro])
        ) {
          return {
            [filtro]: response.data[filtro].map(item => ({
              value: item.value?.toString() || item.id?.toString() || '',
              label: item.label || ''
            }))
          }
        } else if (
          response.data &&
          response.data.lista &&
          Array.isArray(response.data.lista)
        ) {
          return {
            [filtro]: response.data.lista.map(item => ({
              value: item.codigo?.toString() || '',
              label: item.descricao || ''
            }))
          }
        } else {
          console.warn(
            `Unexpected response format for filter ${filtro}:`,
            response.data
          )
          return { [filtro]: [] }
        }
      } catch (error) {
        console.error(
          `Error fetching combo data for filter ${filtro}:`,
          error.message
        )
        return { [filtro]: [] }
      }
    })

    const results = await Promise.all(promises)
    const combinedResults = results.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    )

    console.log('Sending combined results:', combinedResults)
    res.json(combinedResults)
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
