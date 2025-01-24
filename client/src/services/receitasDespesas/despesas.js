import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/despesas`

// Função para buscar a lista paginada de despesas (empenhos)
export const getDespesas = async (filters = {}) => {
  try {
    // Mapeia os filtros para os parâmetros esperados pela API
    const params = {
      pagina: 1,
      tamanhoDaPagina: -1,
      ordenarPor: 'data',
      ordem: 'desc'
    }

    // Mapeia os filtros simples - convertendo para número quando necessário
    if (filters.ano) params.ano = parseInt(filters.ano, 10)
    if (filters.orgao) params.codigoDoOrgao = parseInt(filters.orgao, 10)
    if (filters.modalidade)
      params.codigoDaModalidade = parseInt(filters.modalidade, 10)
    if (filters.elemento)
      params.codigoDoElemento = parseInt(filters.elemento, 10)

    console.log('Parâmetros enviados para API:', params)

    const response = await axios.get(`${API_BASE_URL}/empenho/paginado`, {
      params
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar Empenhos:', error)
    throw error
  }
}

// Função para buscar os detalhes de um empenho específico pelo id
export const getDespesasId = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Empenho com id ${id}:`, error)
    throw error
  }
}

// Função para buscar os itens de um empenho específico pelo id
export const getItensEmpenho = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/itens-empenho/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar itens do Empenho com id ${id}:`, error)
    throw error
  }
}

// Função para buscar os estornos de um empenho específico pelo id
export const getEstornosEmpenho = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/estornos-empenho/${id}`)
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar estornos do Empenho com id ${id}:`, error)
    throw error
  }
}

// Função para buscar as liquidações de um empenho específico pelo id
export const getLiquidacoesEmpenho = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/liquidacoes-empenho/${id}`
    )
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar liquidações do Empenho com id ${id}:`, error)
    throw error
  }
}

// Função para buscar as ordens de pagamento de um empenho específico pelo id
export const getOrdensPagamentoEmpenho = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/ordens-pagamento-empenho/${id}`
    )
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar ordens de pagamento do Empenho com id ${id}:`,
      error
    )
    throw error
  }
}
