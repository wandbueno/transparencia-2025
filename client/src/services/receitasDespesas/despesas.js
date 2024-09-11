import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api/despesas/empenho/paginado'

export const getDespesas = async () => {
  try {
    const response = await axios.get(API_BASE_URL)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar despesas:', error)
    throw error
  }
}
