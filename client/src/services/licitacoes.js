import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api/licitacoes'

export const getLicitacoes = async () => {
  try {
    const response = await axios.get(API_BASE_URL)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar licitações:', error)
    throw error
  }
}

// export const getLicitacaoById = async id => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/${id}`)
//     return response.data
//   } catch (error) {
//     console.error(`Erro ao buscar licitação com id ${id}:`, error)
//     throw error
//   }
// }
