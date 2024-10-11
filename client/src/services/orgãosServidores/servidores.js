import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/servidor`

// Função para buscar servidores
export const getServidores = async (
  ano = new Date().getFullYear(),
  mes = new Date().getMonth()
  // mes = new Date().getMonth() + 1
) => {
  try {
    // Formatação do mês para dois dígitos
    const mesFormatado = mes.toString().padStart(2, '0')
    console.log(`Chamando a API com ano=${ano} e mes=${mesFormatado}`)

    // Faz a requisição para a API com os parâmetros ano e mes
    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: {
        ano,
        mes: mesFormatado
      }
    })

    // Retorna os dados recebidos da API
    return response.data // Simples retorno dos dados sem a URL
  } catch (error) {
    console.error('Erro ao buscar servidores:', error)
    throw error // Propaga o erro para o chamador lidar
  }
}

// export const getServidoresId = async id => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/${matricula}`)
//     return response.data
//   } catch (error) {
//     console.error(`Erro ao buscar Diarias com id ${id}:`, error)
//     throw error
//   }
// }

export const getServidoresId = async (matricula, ano, mes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${matricula}`, {
      params: { ano, mes, matricula }
    })
    return response.data // Certifique-se de que isso está retornando os dados corretamente
  } catch (error) {
    console.error(
      `Erro ao buscar detalhes do Servidor com matrícula ${matricula}:`,
      error
    )
    throw error
  }
}

export const getServidoresFeriasId = async (matricula, ano, mes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ferias/${matricula}`, {
      params: { ano, mes, matricula }
    })
    return response.data // Certifique-se de que isso está retornando os dados corretamente
  } catch (error) {
    console.error(
      `Erro ao buscar detalhes do Servidor com matrícula ${matricula}:`,
      error
    )
    throw error
  }
}

export const getServidoresMovimentosVencimentosId = async (
  matricula,
  ano,
  mes
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/movimento-vencimentos/${matricula}`,
      {
        params: { ano, mes, matricula }
      }
    )
    return response.data // Certifique-se de que isso está retornando os dados corretamente
  } catch (error) {
    console.error(
      `Erro ao buscar detalhes do Servidor com matrícula ${matricula}:`,
      error
    )
    throw error
  }
}
