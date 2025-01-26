import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/extra`

export const getExtra = async (filters = {}) => {
  try {
    // Mapeia os filtros para os parâmetros esperados pela API
    const params = {
      pagina: 1,
      tamanhoDaPagina: 2500,

      // Parâmetros de estrutura
      codigoDoOrgao: filters.orgao ? parseInt(filters.orgao) : undefined,
      tipoDeExtra: filters.tipoDeExtra
        ? parseInt(filters.tipoDeExtra)
        : undefined,
      titulo: filters.titulo,
      ano: filters.ano ? parseInt(filters.ano) : undefined,
      mes: filters.mes ? parseInt(filters.mes) : undefined
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
    console.error('Erro ao buscar Extra Orçamentária:', error)
    throw error
  }
}

// Função para buscar detalhes de uma despesa extra-orçamentária por ID, ano e mês
export const getExtraById = async (id, ano, mes) => {
  try {
    // Verifica se todos os parâmetros necessários estão presentes
    if (!id || !ano || !mes) {
      throw new Error(
        'Parâmetros obrigatórios ausentes: id, ano e mes são necessários'
      )
    }

    // Formata o mês para garantir que tenha dois dígitos
    const mesFormatado = mes.toString().padStart(2, '0')

    const params = {
      codigoDaExtra: id,
      ano: parseInt(ano),
      mes: parseInt(mesFormatado)
    }

    console.log(
      'Buscando detalhes da Extra Orçamentária com parâmetros:',
      params
    )

    const response = await axios.get(`${API_BASE_URL}/detalhe`, {
      params,
      headers: {
        Accept: 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Extra Orçamentária com id ${id}:`, error)
    throw error
  }
}

// Função para buscar os movimentos da extra orçamentária
export const getExtraMovimentos = async (id, ano, mes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movimentos/paginado`, {
      params: {
        codigoDaExtra: id,
        ano: parseInt(ano),
        mes: parseInt(mes)
      },
      headers: {
        Accept: 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar movimentos da Extra com id ${id}:`, error)
    throw error
  }
}
