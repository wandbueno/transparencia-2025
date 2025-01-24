const axios = require('axios')

/**
 * Função genérica para fazer requisições à API externa
 * @param {string} path - Caminho da API
 * @param {object} req - Request object do Express
 * @param {object} res - Response object do Express
 * @param {object} customParams - Parâmetros customizados para a requisição (opcional)
 */
const fetchFromAPI = async (path, req, res, customParams = {}) => {
  try {
    const tenant = req.tenant
    if (!tenant) {
      throw new Error('Tenant não configurado')
    }

    // Remove o parâmetro tenant da query
    const { tenant: _, ...queryParams } = req.query

    // Mescla os parâmetros da query com os parâmetros customizados
    const params = {
      ...queryParams,
      ...customParams
    }

    console.log('Requisição para API:', {
      url: `${tenant.api_url}${path}`,
      method: 'GET',
      params: params,
      tenant: tenant.name
    })

    const response = await axios.get(`${tenant.api_url}${path}`, {
      params: params,
      headers: {
        Authorization: `Bearer ${tenant.token}`,
        'cliente-integrado': tenant.cliente_integrado,
        Accept: 'application/json'
      }
    })

    res.json(response.data)
  } catch (error) {
    console.error('Erro na requisição:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      path: path,
      tenant: req.tenant?.name
    })

    res.status(error.response?.status || 500).json({
      error: 'Erro ao conectar com a API externa',
      details: error.response?.data || error.message
    })
  }
}

module.exports = { fetchFromAPI }
