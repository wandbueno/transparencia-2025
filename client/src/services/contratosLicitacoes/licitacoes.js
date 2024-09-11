import axios from 'axios'

// Atualize a URL base para não incluir o parâmetro tipoDeConsultaDeModalidade
const API_BASE_URL = 'http://localhost:5000/api/licitacoes'

// Adicione o parâmetro `tipoDeConsultaDeModalidade` nas funções que necessitam dele
const TIPO_DE_CONSULTA = 1 // Ajuste o valor conforme necessário

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
