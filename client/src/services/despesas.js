import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api/despesas/empenho/paginado'

export const getDespesas = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString(); // Converte os filtros em query string
    const response = await axios.get(`${API_BASE_URL}?${params}`);
    return response.data
  } catch (error) {
    console.error('Erro ao buscar despesas:', error)
    throw error
  }
}
