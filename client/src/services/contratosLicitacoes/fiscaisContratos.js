import axios from 'axios'

// URL base para buscar fiscais de contratos
const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/fiscais-de-contratos`

// Função para buscar lista de fiscais
export const getFiscaisContratos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lista`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar Fiscais de Contratos:', error)
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
      `${API_BASE_URL}/contratos-do-fiscal/paginado`,
      {
        params: {
          codigo: codigo,
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
