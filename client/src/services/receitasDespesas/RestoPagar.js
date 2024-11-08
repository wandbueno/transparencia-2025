import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/restos-a-pagar`

// Função para buscar a lista paginada de "Resto a Pagar"
export const getRestoPagar = async (params = {}) => {
  try {
    // Obtém o ano atual do sistema
    const anoAtual = new Date().getFullYear()
    console.log(`Chamando a API com ano=${anoAtual}`)

    // Faz a requisição para a API com o ano atual
    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: {
        ano: anoAtual, // Passa o ano atual automaticamente
        ...params // Inclui outros parâmetros, se houver
      }
    })

    // Retorna os dados recebidos da API
    return response.data
  } catch (error) {
    console.error(
      'Erro ao buscar Informação Consolidada - Restos a Pagar:',
      error
    )
    throw error
  }
}

// Função para buscar os detalhes de uma liquidação específica pelo id
export const getRestoPagarById = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar Informação Consolidada - Restos a Pagar com id ${id}:`,
      error
    )
    throw error
  }
}

// Função para buscar a data de atualização das liquidações
export const getRestoPagarDataAtualizacao = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data-de-atualizacao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar data de atualização:', error)
    throw error
  }
}
