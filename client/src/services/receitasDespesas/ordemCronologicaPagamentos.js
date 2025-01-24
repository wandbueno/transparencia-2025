import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/ordem-cronologica-de-pagamentos`

// Função para buscar a lista paginada de ordens cronológicas de pagamento
export const getOrdensCronologicasPagas = async (params = {}) => {
  try {
    // Obtendo a data atual
    const currentDate = new Date()
    const ano = currentDate.getFullYear() // Obtém o ano atual
    const mes = currentDate.getMonth() + 1 // Obtém o mês atual (0-11, então adicionamos 1)

    // Adicionando ano e mês aos parâmetros
    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: {
        ...params,
        ano, // Adiciona o ano atual
        mes // Adiciona o mês atual
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar ordens cronológicas de pagamento:', error)
    throw error
  }
}

// Função para buscar os detalhes de uma liquidação específica
export const getOrdemCronologicaById = async (ano, mes, liquidacao) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/detalhe`, {
      params: { ano, mes, liquidacao }
    })
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar ordem cronológica com liquidação ${liquidacao}:`,
      error
    )
    throw error
  }
}

// Função para buscar a data de atualização das ordens cronológicas de pagamento
export const getDataAtualizacaoOrdensCronologicas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data-de-atualizacao`)
    return response.data
  } catch (error) {
    console.error(
      'Erro ao buscar data de atualização das ordens cronológicas:',
      error
    )
    throw error
  }
}
