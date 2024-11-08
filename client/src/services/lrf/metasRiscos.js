import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/lrf`

// Função para buscar anos disponíveis
export const getAnosDisponiveis = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/anos-disponiveis`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar anos disponíveis:', error)
    throw error
  }
}

// Função para buscar relatórios publicados
export const getRelatoriosPublicados = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/relatorios-publicados`, {
      params
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar relatórios publicados:', error)
    throw error
  }
}

// Função para buscar metadados dos relatórios
export const getMetaDadosRelatorios = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/meta-dados-relatorios`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar metadados dos relatórios:', error)
    throw error
  }
}

// Função genérica para buscar relatórios específicos
export const getRelatorio = async (tipo, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${tipo}`, {
      params,
      responseType: 'blob' // Importante para receber arquivos PDF/DOCX/etc
    })
    return response
  } catch (error) {
    console.error(`Erro ao buscar relatório ${tipo}:`, error)
    throw error
  }
}

// Funções específicas para cada tipo de relatório
export const getMetasAnuais = async params => {
  return getRelatorio('metas-anuais', params)
}

export const getAvaliacaoMetasAnteriores = async params => {
  return getRelatorio('avaliacao-metas-anteriores', params)
}

export const getMetasComparadas = async params => {
  return getRelatorio('metas-comparadas', params)
}

export const getEvolucaoPatrimonio = async params => {
  return getRelatorio('evolucao-patrimonio', params)
}

export const getAlienacaoAtivos = async params => {
  return getRelatorio('alienacao-ativos', params)
}

export const getAvaliacaoRPPS = async params => {
  return getRelatorio('avaliacao-rpps', params)
}

export const getRenunciaReceita = async params => {
  return getRelatorio('renuncia-receita', params)
}

export const getMargemExpansao = async params => {
  return getRelatorio('margem-expansao', params)
}

export const getResultadoPrimario = async params => {
  return getRelatorio('resultado-primario', params)
}

export const getRiscosFiscais = async params => {
  return getRelatorio('riscos-fiscais', params)
}
