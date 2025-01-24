import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/estrutura-de-remuneracao`

export const getEstruturaRemuneracao = async (filters = {}) => {
  try {
    // Mapeia os filtros para os parâmetros esperados pela API
    const params = {
      pagina: 1,
      tamanhoDaPagina: 2500,
      ano: filters.ano || new Date().getFullYear(),
      mes: filters.mes || String(new Date().getMonth() + 1).padStart(2, '0'),
      tipoDeCargo: filters.tipoDeCargo,
      nomeDoCargo: filters.nomeDoCargo
    }

    // Remove parâmetros undefined
    Object.keys(params).forEach(
      key => params[key] === undefined && delete params[key]
    )

    console.log('Parâmetros enviados para API:', params)

    const response = await axios.get(`${API_BASE_URL}/paginado`, { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar estrutura de remuneração:', error)
    throw error
  }
}

export const getEstruturaRemuneracaoId = async (codigoDoNivel, ano, mes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${codigoDoNivel}`, {
      params: { ano, mes }
    })
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar detalhes da Estrutura de Remuneração com código ${codigoDoNivel}:`,
      error
    )
    throw error
  }
}
