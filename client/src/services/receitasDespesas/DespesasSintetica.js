import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/despesas-sintetica`

// Função para buscar a lista paginada de liquidações
export const getDespesasSintetica = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginado?ano=2024`, {
      params
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar Despesas Sintetica:', error)
    throw error
  }
}

// Função para buscar os detalhes de uma liquidação específica pelo id
export const getDespesasSinteticaById = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Despesas Sintetica com id ${id}:`, error)
    throw error
  }
}

// Função para buscar a data de atualização das liquidações
export const getDespesasSinteticaDataAtualizacao = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data-de-atualizacao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar data de atualização:', error)
    throw error
  }
}
