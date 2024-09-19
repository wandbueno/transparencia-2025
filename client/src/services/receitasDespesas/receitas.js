import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/receitas`

export const getReceitas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginado`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar receitas:', error)
    throw error
  }
}
