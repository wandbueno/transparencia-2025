import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/programas`
const anoAtual = new Date().getFullYear()

export const getDataAtualizacao = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data-de-atualizacao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar data de atualização:', error)
    throw error
  }
}

export const getDetalhesPrograma = async chavePrimaria => {
  try {
    const response = await axios.get(`${API_BASE_URL}/detalhe`, {
      params: {
        chavePrimaria,
        ano: anoAtual
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar detalhes do programa:', error)
    throw error
  }
}

export const getDetalhesProgramaPorParametros = async codigoDoPrograma => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${codigoDoPrograma}`, {
      params: { ano: anoAtual }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar detalhes do programa:', error)
    throw error
  }
}

export const getProgramasPaginados = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: {
        ...filters,
        ano: anoAtual
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar lista de programas:', error)
    throw error
  }
}
