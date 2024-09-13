import axios from 'axios'

// URL base para buscar contratos
const API_BASE_URL = 'http://localhost:5000/api/contratos/detalhes-paginado'
const API_DETAIL = 'http://localhost:5000/api/contratos/'

export const getContratos = async () => {
  try {
    // Faz a requisição com o parâmetro para ordenar pela data de início
    const response = await axios.get(API_BASE_URL, {
      params: {
        ordenarPor: 'dataInicial', // Supondo que o campo de data de início seja 'dataInicial'
        ordem: 'asc' // 'asc' para ordem crescente, 'desc' para ordem decrescente
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
    const response = await axios.get(`${API_DETAIL}/detalhe`, {
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
