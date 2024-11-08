import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/pagamento`

export const getPagamentos = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: filters
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error)
    throw error
  }
}

export const getPagamentosId = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Pagamento com id ${id}:`, error)
    throw error
  }
}
