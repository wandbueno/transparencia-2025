import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/receitas`

// Função para buscar receitas
export const getReceitas = async (filters = {}) => {
  try {
    // Obter o ano e mês atual se não fornecidos
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')

    // Mapeia os filtros para os parâmetros esperados pela API
    const params = {
      pagina: 1,
      tamanhoDaPagina: 2500,

      // Parâmetros de data - sempre presentes
      ano: filters.ano || currentYear,
      mes: filters.mes || currentMonth,

      // Parâmetros de estrutura
      codigoDoOrgao: filters.orgao ? parseInt(filters.orgao) : undefined,

      // Parâmetros de classificação
      naturezaDaReceita: filters.naturezaDaReceita,
      detalhamentoDaNaturezaDaReceita: filters.detalhamentoDaNaturezaDaReceita,
      origemDoRecurso: filters.origemDoRecurso
        ? parseInt(filters.origemDoRecurso)
        : undefined,
      fonteDaReceita: filters.fonteDaReceita,

      // Parâmetros de configuração
      totalizarReceitas: filters.totalizarReceitas === 'true',
      covid19: filters.covid19 === 'true'
    }

    // Remove parâmetros undefined ou vazios
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })

    console.log('Parâmetros enviados para API:', params)

    const response = await axios.get(`${API_BASE_URL}/paginado`, { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar receitas:', error)
    throw error
  }
}

// Função para buscar detalhes de uma receita
export const getReceitasId = async (id, ano, mes, codigoDoOrgao) => {
  try {
    // Verifica se todos os parâmetros necessários estão presentes
    if (!id || !ano || !mes || !codigoDoOrgao) {
      throw new Error(
        'Parâmetros obrigatórios ausentes: id, ano, mes e codigoDoOrgao são necessários'
      )
    }

    // Formata o mês para garantir que tenha dois dígitos
    const mesFormatado = mes.toString().padStart(2, '0')

    const params = {
      codigoDaReceita: id,
      ano,
      mes: mesFormatado,
      codigoDoOrgao
    }

    console.log('Buscando detalhes da receita com parâmetros:', params)

    const response = await axios.get(`${API_BASE_URL}/detalhe`, { params })
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar detalhes da Receita com id ${id}:`, error)
    throw error
  }
}

// Função para buscar movimentos de uma receita
export const getMovimentosReceita = async (id, ano, mes, codigoDoOrgao) => {
  try {
    // Verifica se todos os parâmetros necessários estão presentes
    if (!id || !ano || !mes || !codigoDoOrgao) {
      throw new Error(
        'Parâmetros obrigatórios ausentes: id, ano, mes e codigoDoOrgao são necessários'
      )
    }

    // Formata o mês para garantir que tenha dois dígitos
    const mesFormatado = mes.toString().padStart(2, '0')

    const params = {
      codigoDaReceita: id,
      ano,
      mes: mesFormatado,
      codigoDoOrgao
    }

    console.log('Buscando movimentos da receita com parâmetros:', params)

    const response = await axios.get(`${API_BASE_URL}/movimentos/paginado`, {
      params
    })
    return response
  } catch (error) {
    console.error(`Erro ao buscar movimentos da Receita com id ${id}:`, error)
    throw error
  }
}

// Add new function to get update date
export const getReceitasDataAtualizacao = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data-de-atualizacao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar data de atualização:', error)
    throw error
  }
}
