import axios from 'axios'

const SICAP_API_URL =
  import.meta.env.VITE_SICAP_API_URL || 'http://localhost:2025/api/tipo'

// Função para buscar procedimentos por modalidade
export const getProcedimentos = async (modalidade = 'modalidade2') => {
  try {
    const response = await axios.get(`${SICAP_API_URL}/${modalidade}`, {
      headers: {
        'x-tenant-id': import.meta.env.VITE_TENANT_ID || 'conceicaodotocantins'
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar procedimentos:', error)
    throw error
  }
}

// Função para buscar detalhes de um procedimento específico
export const getProcedimentoById = async id => {
  try {
    const response = await axios.get(`${SICAP_API_URL}/detalhes/${id}`, {
      headers: {
        'x-tenant-id': import.meta.env.VITE_TENANT_ID || 'conceicaodotocantins'
      }
    })
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar procedimento com ID ${id}:`, error)
    throw error
  }
}
