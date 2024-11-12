import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/informacoes-consolidadas`

export const getDataAtualizacao = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data-de-atualizacao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar data de atualização:', error)
    throw error
  }
}

export const getDetalhesConsolidado = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar detalhes da informação consolidada:', error)
    throw error
  }
}

export const getLiquidacoesPaginadas = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/liquidacoes/paginado`, {
      params: filters
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar liquidações:', error)
    throw error
  }
}

export const getOrdensPagamentoPaginadas = async (filters = {}) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/ordens-de-pagamento/paginado`,
      {
        params: filters
      }
    )
    return response.data
  } catch (error) {
    console.error('Erro ao buscar ordens de pagamento:', error)
    throw error
  }
}

export const getConsolidadosPaginados = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: filters
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar lista de informações consolidadas:', error)
    throw error
  }
}

// Função auxiliar para buscar tanto liquidações quanto ordens de pagamento
export const getDetalhamentoCompleto = async (id, filters = {}) => {
  try {
    const [detalhes, liquidacoes, ordensPagamento] = await Promise.all([
      getDetalhesConsolidado(id),
      getLiquidacoesPaginadas({ ...filters, codigoDoEmpenho: id }),
      getOrdensPagamentoPaginadas({ ...filters, codigoDoEmpenho: id })
    ])

    return {
      detalhes,
      liquidacoes,
      ordensPagamento
    }
  } catch (error) {
    console.error('Erro ao buscar detalhamento completo:', error)
    throw error
  }
}
