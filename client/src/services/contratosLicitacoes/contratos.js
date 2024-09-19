import axios from 'axios'

// URL base para buscar contratos
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/contratos`

export const getContratos = async () => {
  try {
    // Faz a requisição com o parâmetro para ordenar pela data de início
    const response = await axios.get(`${API_BASE_URL}/detalhes-paginado`, {
      params: {
        ordenarPor: 'dataInicial',
        ordem: 'asc'
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar Contratos:', error)
    throw error
  }
}

// Função para buscar contrato por ID
export const getContratosById = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/detalhe`, {
      params: {
        id: id // ID como parâmetro de consulta
      }
    })
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Contrato com ID ${id}:`, error)
    throw error
  }
}
