import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/transferencia-realizada`

export const getTransferenciasRealizadas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginado`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    throw error
  }
}

export const getTransferenciasRealizadasId = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Pagamento com id ${id}:`, error)
    throw error
  }
}
