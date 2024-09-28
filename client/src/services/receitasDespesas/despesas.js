import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/despesas`

// Função para buscar a lista paginada de despesas (empenhos)
export const getDespesas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/empenho/paginado`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar despesas:', error)
    throw error
  }
}

// Função para buscar os detalhes de um empenho específico pelo id
export const getDespesasId = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Empenho com id ${id}:`, error)
    throw error
  }
}

// Função para buscar os itens de um empenho específico pelo id
export const getItensEmpenho = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/itens-empenho/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar itens do Empenho com id ${id}:`, error)
    throw error
  }
}
