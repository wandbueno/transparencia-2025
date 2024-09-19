import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/licitacoes`

const TIPO_DE_CONSULTA = 1

export const getLicitacoes = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}?tipoDeConsultaDeModalidade=${TIPO_DE_CONSULTA}`
    )
    return response.data
  } catch (error) {
    console.error('Erro ao buscar licitações:', error)
    throw error
  }
}

export const getLicitacaoById = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${id}?tipoDeConsultaDeModalidade=${TIPO_DE_CONSULTA}`
    )
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar licitação com id ${id}:`, error)
    throw error
  }
}
