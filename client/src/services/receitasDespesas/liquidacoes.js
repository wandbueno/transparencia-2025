import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/liquidacoes`

// Função para buscar a lista paginada de liquidações
export const getLiquidacoes = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginado`, { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar liquidações:', error)
    throw error
  }
}

// Função para buscar os detalhes de uma liquidação específica pelo id
export const getLiquidacaoById = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar liquidação com id ${id}:`, error)
    throw error
  }
}

// Função para buscar as anulações de uma liquidação
export const getAnulacoesLiquidacao = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/anulacoes/paginado`, {
      params
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar anulações de liquidação:', error)
    throw error
  }
}

// Função para buscar a data de atualização das liquidações
export const getDataAtualizacao = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data-de-atualizacao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar data de atualização:', error)
    throw error
  }
}
