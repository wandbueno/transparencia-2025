import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/servidor`

// Função para buscar servidores
export const getServidores = async (filters = {}) => {
  try {
    // Mapeia os filtros para os parâmetros esperados pela API
    const params = {
      pagina: 1,
      tamanhoDaPagina: 2500,

      // Parâmetros de data
      ano: filters.ano,
      mes: filters.mes,

      // Parâmetros de identificação
      matriculaDoFuncionario: filters.matriculaDoFuncionario,
      cpf: filters.cpf,
      nomeDoFuncionario: filters.nomeDoFuncionario,

      // Parâmetros de estrutura organizacional
      codigoDoOrgao: filters.orgao,
      nomeDoDepartamento: filters.nomeDoDepartamento,

      // Parâmetros de cargo e vínculo
      codigoDoCargo: filters.cargo,
      codigoDoTipoDeVinculo: filters.tipoDeVinculo,
      codigoDaSituacao: filters.situacaoFuncionario,
      categoriaDoTrabalhadorNoESocial: filters.categoriaDoTrabalhadorNoESocial
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
    console.error('Erro ao buscar servidores:', error)
    throw error
  }
}

// Função para buscar detalhes de um servidor
export const getServidoresId = async (matricula, ano, mes) => {
  try {
    // Verifica se todos os parâmetros necessários estão presentes
    if (!matricula || !ano || !mes) {
      throw new Error(
        'Parâmetros obrigatórios ausentes: matricula, ano e mes são necessários'
      )
    }

    // Formata o mês para garantir que tenha dois dígitos
    const mesFormatado = mes.toString().padStart(2, '0')

    const params = {
      matricula,
      ano,
      mes: mesFormatado
    }

    console.log('Buscando detalhes do servidor com parâmetros:', params)

    const response = await axios.get(`${API_BASE_URL}/detalhe`, { params })
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar detalhes do Servidor com matrícula ${matricula}:`,
      error
    )
    throw error
  }
}

// Função para buscar férias de um servidor
export const getServidoresFeriasId = async (matricula, ano, mes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ferias/${matricula}`, {
      params: {
        ano,
        mes,
        matricula
      }
    })
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar férias do Servidor com matrícula ${matricula}:`,
      error
    )
    throw error
  }
}

// Função para buscar movimentos de vencimentos de um servidor
export const getServidoresMovimentosVencimentosId = async (
  matricula,
  ano,
  mes
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/movimento-vencimentos/${matricula}`,
      {
        params: {
          ano,
          mes,
          matricula
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar movimentos de vencimentos do Servidor com matrícula ${matricula}:`,
      error
    )
    throw error
  }
}
