import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/repasse-ou-transferencia`

// Função para buscar repasses ou transferências paginados
export const getRepassesTransferencias = async (
  ano = new Date().getFullYear(),
  mes = new Date().getMonth() + 1 // Corrige o mês para o formato correto (1 a 12)
) => {
  try {
    // Formatação do mês para dois dígitos
    const mesFormatado = mes.toString().padStart(2, '0')

    // Faz a requisição para a API com os parâmetros ano e mes formatados
    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: {
        ano: ano,
        mes: mesFormatado
      }
    })

    // Retorna os dados recebidos da API
    return response.data
  } catch (error) {
    console.error('Erro ao buscar repasses ou transferências paginados:', error)
    throw error
  }
}

// Função para buscar detalhes de um repasse ou transferência pelo ID
export const getRepassesTransferenciasId = async (id, ano, mes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      params: { ano, mes }
    })
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar detalhes do repasse ou transferência com ID ${id}:`,
      error
    )
    throw error
  }
}

// Função para buscar movimentos de um repasse ou transferência específico
export const getRepassesMovimentos = async (id, ano, mes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movimentos/${id}`, {
      params: {
        ano: ano,
        mes: mes
      }
    })
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar movimentos do repasse ou transferência com ID ${id}:`,
      error
    )
    throw error
  }
}
