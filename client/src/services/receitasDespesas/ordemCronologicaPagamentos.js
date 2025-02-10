import axios from 'axios'

// client/src/services/receitasDespesas/ordemCronologicaPagamentos.js

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/ordem-cronologica-de-pagamentos`

// Função para buscar a lista paginada de ordens cronológicas de pagamento
export const getOrdensCronologicasPagas = async (filters = {}) => {
  try {
    const params = {
      pagina: 1,
      tamanhoDaPagina: -1,
      ano: filters.ano || new Date().getFullYear(),
      mes: filters.mes || new Date().getMonth() + 1,
      nomeDoFornecedor: filters.nomeDoFornecedor,
      cpfCnpjDoFornecedor: filters.cpfCnpjDoFornecedor, // Make sure this matches
      codigoDoOrgao: filters.orgao ? parseInt(filters.orgao) : undefined,
      categoriaDeEmpenho: filters.categoriaDeEmpenho
        ? parseInt(filters.categoriaDeEmpenho)
        : undefined
    }

    // Remove undefined params
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })

    const response = await axios.get(`${API_BASE_URL}/paginado`, { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar ordens cronológicas de pagamento:', error)
    throw error
  }
}

export const getOrdemCronologicaById = async (liquidacao, ano, mes) => {
  try {
    const params = {
      ano,
      mes,
      liquidacao
    }

    const response = await axios.get(`${API_BASE_URL}/detalhe`, { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar detalhes da ordem cronológica:', error)
    throw error
  }
}
