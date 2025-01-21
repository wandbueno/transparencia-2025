// client/src/services/orgaosServidores/diarias.js

import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/diarias`

export const getDiarias = async (filters = {}) => {
  try {
    // Adiciona o tenant ID no header
    const headers = {
      'x-tenant-id': import.meta.env.VITE_TENANT_ID
    }

    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: filters,
      headers
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar diárias:', error)
    throw error
  }
}

export const getDiariasId = async id => {
  try {
    const headers = {
      'x-tenant-id': import.meta.env.VITE_TENANT_ID
    }

    const response = await axios.get(`${API_BASE_URL}/${id}`, { headers })
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar diária com id ${id}:`, error)
    throw error
  }
}
