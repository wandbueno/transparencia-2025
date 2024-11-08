import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/lrf`

// Função para buscar metadados dos relatórios de balanço
export const getMetaDadosBalanco = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/meta-dados-balanco`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar metadados do balanço:', error)
    throw error
  }
}

// Função para buscar relatório específico
export const getRelatorioBalanco = async (tipo, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${tipo}`, {
      params,
      responseType: 'blob',
      validateStatus: status => status < 500 // Aceita status codes < 500
    })
    return response
  } catch (error) {
    if (error.response?.data) {
      const reader = new FileReader()
      const textPromise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
      })
      reader.readAsText(error.response.data)
      const text = await textPromise
      const errorData = JSON.parse(text)
      throw new Error(errorData.error || 'Erro ao buscar relatório')
    }
    throw error
  }
}
