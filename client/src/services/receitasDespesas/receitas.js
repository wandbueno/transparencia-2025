import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/receitas`

// Função para buscar receitas
export const getReceitas = async (
  ano = new Date().getFullYear(),
  mes = new Date().getMonth() + 1
) => {
  try {
    const mesFormatado = mes.toString().padStart(2, '0')
    console.log(`Chamando a API com ano=${ano} e mes=${mesFormatado}`)

    // Faz a requisição para a API com os parâmetros
    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: {
        ano,
        mes: mesFormatado
      }
    })

    return {
      data: response.data,
      url: `${API_BASE_URL}/paginado?ano=${ano}&mes=${mesFormatado}` // Retorna a URL da API
    }
  } catch (error) {
    console.error('Erro ao buscar receitas:', error)
    throw error
  }
}

// Função para buscar detalhes de uma receita
export const getReceitasId = async (id, ano, mes, codigoDoOrgao) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      params: { ano, mes, codigoDoOrgao }
    })
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar detalhes da Receita com id ${id}:`, error)
    throw error
  }
}
