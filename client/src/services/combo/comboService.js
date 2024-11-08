import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/combo`

export const getComboData = async (filtros = []) => {
  try {
    console.log('Enviando requisição de filtros:', filtros)

    // Converte o array de filtros em uma string
    const filtrosString = filtros.join(',')

    const response = await axios.get(API_BASE_URL, {
      params: {
        filtro: filtrosString // Envia como string única
      }
    })

    console.log('Resposta do combo:', response.data)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar dados do combo:', error)
    throw error
  }
}

// Funções específicas para cada tipo de filtro
export const getAnosCombo = async () => {
  return getComboData(['ano'])
}

export const getOrgaosCombo = async () => {
  return getComboData(['orgao'])
}

export const getModalidadesCombo = async () => {
  return getComboData(['modalidade'])
}

// ... outras funções específicas conforme necessário
