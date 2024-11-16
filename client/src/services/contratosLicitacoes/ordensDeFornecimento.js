import axios from 'axios'

// URL base para buscar ordens de fornecimento
const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/ordem-de-fornecimento`

// Função para buscar data de atualização
export const getDataAtualizacao = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data-de-atualizacao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar data de atualização:', error)
    throw error
  }
}

// Função para buscar detalhes de uma ordem de fornecimento
export const getOrdemDeFornecimentoById = async chavePrimaria => {
  try {
    const response = await axios.get(`${API_BASE_URL}/detalhe`, {
      params: {
        chavePrimaria: chavePrimaria
      }
    })
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar Fiscal de Contrato com ID ${chavePrimaria}:`,
      error
    )
    throw error
  }
}

// Função para buscar produtos relacionados a uma ordem de fornecimento
export const getProdutosPaginados = async codigo => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/produtos/paginado/${codigo}`,
      {
        params: {
          pagina: 1,
          tamanhoDaPagina: 2500
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Contratos do Fiscal ${codigo}:`, error)
    throw error
  }
}

export const postOrdensDeFornecimentoPaginadas = async filtro => {
  try {
    const response = await axios.post(`${API_BASE_URL}/paginado`, filtro) // Envia o filtro diretamente
    return response.data
  } catch (error) {
    console.error(
      'Erro ao buscar dados paginados dos fiscais de contratos:',
      error
    )
    throw error
  }
}
