import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/transferencias-recebidas`

export const getTransferenciasRecebidas = async () => {
  const currentYear = new Date().getFullYear() // Obtém o ano atual do sistema
  try {
    const response = await axios.get(
      `${API_BASE_URL}/paginado?ano=${currentYear}`
    )
    return response.data
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    throw error
  }
}

export const getTransferenciasRecebidasId = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Pagamento com id ${id}:`, error)
    throw error
  }
}
