import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/extra`

export const getExtra = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginado`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar despesas Extra:', error)
    throw error
  }
}

// Função para buscar detalhes de uma despesa extra-orçamentária por ID, ano e mês
export const getExtraById = async (
  id,
  ano = new Date().getFullYear(),
  mes = (new Date().getMonth() + 1).toString().padStart(2, '0')
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${id}`, // Rota para os detalhes: /api/extra/:id
      {
        params: {
          ano, // Ano fornecido ou o ano atual
          mes // Mês fornecido ou o mês atual (formatado com dois dígitos)
        }
      }
    )
    return response.data // Retorna os dados recebidos da API
  } catch (error) {
    console.error(`Erro ao buscar despesas Extra com id ${id}:`, error)
    throw error
  }
}

// Função para buscar os movimentos da extra orçamentária
export const getExtraMovimentos = async (id, ano, mes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movimentos/paginado`, {
      params: { codigoDaExtra: id, ano, mes }
    })
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar movimentos da Extra com id ${id}:`, error)
    throw error
  }
}
