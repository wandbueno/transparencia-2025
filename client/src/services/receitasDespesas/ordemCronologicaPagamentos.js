import axios from 'axios'

// client/src/services/receitasDespesas/ordemCronologicaPagamentos.js

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/ordem-cronologica-de-pagamentos`

// Função para buscar a lista paginada de ordens cronológicas de pagamento
export const getOrdensCronologicasPagas = async (filters = {}) => {
  try {
    // Obter a data atual
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    // Prepara os parâmetros da requisição
    const params = {
      pagina: 1,
      tamanhoDaPagina: -1, // Remove limit to get all records
      ano: filters.ano || currentYear,
      mes: filters.mes || currentMonth,
      nomeDoFornecedor: filters.nomeDoFornecedor,
      cpfCnpj: filters.cpfCnpj,
      codigoDoOrgao: filters.orgao ? parseInt(filters.orgao) : undefined, // Convert to number
      categoriaDeEmpenho: filters.categoriaDeEmpenho
        ? parseInt(filters.categoriaDeEmpenho)
        : undefined // Convert to number
    }

    // Remove undefined params
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })

    console.log('Parâmetros enviados para API:', params)

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
