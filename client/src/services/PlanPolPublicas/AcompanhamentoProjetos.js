import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/projetos`

export const getDataAtualizacao = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data-de-atualizacao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar data de atualização:', error)
    throw error
  }
}

export const getDetalhesProjeto = async chavePrimaria => {
  try {
    const response = await axios.get(`${API_BASE_URL}/detalhe`, {
      params: { chavePrimaria }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar detalhes do projeto:', error)
    throw error
  }
}

export const getDetalhesProjetoPorParametros = async (acaoCodigo, ano, mes) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${acaoCodigo}/${ano}/${mes}`
    )
    return response.data
  } catch (error) {
    console.error('Erro ao buscar detalhes do projeto:', error)
    throw error
  }
}

export const getMetasPaginadas = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/metas/paginado`, {
      params: filters
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar metas do projeto:', error)
    throw error
  }
}

export const getProjetosPaginados = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: filters
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar lista de projetos:', error)
    throw error
  }
}
