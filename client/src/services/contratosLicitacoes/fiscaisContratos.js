import axios from 'axios'

// URL base para buscar fiscais de contratos
const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/fiscais-de-contratos`

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

// Função para buscar fiscal por ID
export const getFiscalContratosById = async chavePrimaria => {
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

// Função para buscar contratos do fiscal
export const getContratosByFiscal = async codigo => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/contratos-do-fiscal/${codigo}`,
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

// Função para buscar fiscais paginados
export const getFiscaisPaginados = async filtro => {
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
