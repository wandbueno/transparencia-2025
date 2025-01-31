import axios from 'axios'

const API_BASE_URL = 'http://localhost:2025/api/tipo/modalidade1'

// Função para buscar todos os procedimentos
export const getProcedimentos = async () => {
  try {
    const response = await axios.get(API_BASE_URL)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar procedimentos:', error)
    throw error
  }
}

// Função para buscar detalhes de um procedimento específico
export const getProcedimentoById = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar procedimento com ID ${id}:`, error)
    throw error
  }
}
