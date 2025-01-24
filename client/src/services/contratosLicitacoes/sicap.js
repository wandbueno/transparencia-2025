import axios from 'axios'

// URL base para buscar procedimentos
const API_BASE_URL = 'http://localhost:5000/api/procedimentos'

// Função para buscar a lista de procedimentos
export const getProcedimentos = async () => {
  try {
    // Faz a requisição para a API de procedimentos sem parâmetros de paginação
    const response = await axios.get(API_BASE_URL)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar Procedimentos:', error)
    throw error
  }
}

// Função para buscar procedimento por ID (caso precise no futuro)
export const getProcedimentoById = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Procedimento com ID ${id}:`, error)
    throw error
  }
}
