import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/extra`

export const getDespesas = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/extra-orcamentaria/paginado`
    )
    return response.data
  } catch (error) {
    console.error('Erro ao buscar despesas Extra:', error)
    throw error
  }
}

export const getDespesasById = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/extra-orcamentaria/paginado/${id}`
    )
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar despesas Extra com id ${id}:`, error)
    throw error
  }
}
