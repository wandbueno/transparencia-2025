import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/despesas`

export const getDespesas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/empenho/paginado`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar despesas:', error)
    throw error
  }
}

export const getDespesasId = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Empenho com id ${id}:`, error)
    throw error
  }
}
