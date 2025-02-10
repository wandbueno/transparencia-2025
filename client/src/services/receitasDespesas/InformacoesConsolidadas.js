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
    // Mapeia os filtros para os parâmetros esperados pela API
    const params = {
      pagina: 1,
      tamanhoDaPagina: -1,

      // Parâmetros de estrutura
      codigoDoOrgao: filters.orgao ? parseInt(filters.orgao) : undefined,
      ano: filters.ano,
      cpfOuCnpj: filters.cpfOuCnpj ? addCnpjMask(filters.cpfOuCnpj) : undefined,
      fonteDoEmpenho: filters.fonteDoEmpenho,
      fornecedor: filters.fornecedor,
      rubricaDaDespesa: filters.rubricaDaDespesa
    }

    // Remove parâmetros undefined ou vazios
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })

    console.log('Parâmetros enviados para API:', params)

    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params,
      headers: {
        Accept: 'application/json'
      }
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

// Função para adicionar a máscara ao CNPJ
function addCnpjMask(cnpj) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}
