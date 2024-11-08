const axios = require('axios')

const fetchComboData = async (req, res) => {
  try {
    console.log('Requisição de combo recebida:', req.query)

    // Garante que filtro seja um array
    const filtros = Array.isArray(req.query.filtro)
      ? req.query.filtro
      : [req.query.filtro]

    const response = await axios.get(`${process.env.SERVER}/api/combo`, {
      params: {
        filtro: filtros
      },
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
        'cliente-integrado': process.env.CLIENTE_INTEGRADO
      },
      paramsSerializer: params => {
        // Serializa o array de filtros no formato correto
        return `filtro=${params.filtro.join('&filtro=')}`
      }
    })

    console.log('Resposta do combo:', response.data)
    res.json(response.data)
  } catch (error) {
    console.error(
      'Erro ao conectar com a API externa:',
      error.response ? error.response.data : error.message
    )
    res.status(500).json({
      error: 'Erro ao buscar dados do combo',
      details: error.response?.data || error.message
    })
  }
}

module.exports = { fetchComboData }
