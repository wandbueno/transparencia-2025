import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/lrf`

// Mapeamento de bimestre para mês
const BIMESTRE_PARA_MES = {
  1: 2, // 1º bimestre -> fevereiro
  2: 4, // 2º bimestre -> abril
  3: 6, // 3º bimestre -> junho
  4: 8, // 4º bimestre -> agosto
  5: 10, // 5º bimestre -> outubro
  6: 12 // 6º bimestre -> dezembro
}

export const getMetaDadosRREO = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/meta-dados-rreo`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar metadados do RREO:', error)
    throw error
  }
}

export const getRelatorioRREO = async (tipo, params = {}) => {
  try {
    // Converte bimestre para mês se necessário
    if (params.bimestre) {
      params.mes = BIMESTRE_PARA_MES[params.bimestre]
      delete params.bimestre
    }

    const response = await axios.get(`${API_BASE_URL}/${tipo}`, {
      params,
      responseType: 'blob',
      validateStatus: status => status < 500
    })
    return response
  } catch (error) {
    if (error.response?.data) {
      const reader = new FileReader()
      const textPromise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
      })
      reader.readAsText(error.response.data)
      const text = await textPromise
      const errorData = JSON.parse(text)
      throw new Error(errorData.error || 'Erro ao buscar relatório')
    }
    throw error
  }
}

export const getAnosDisponiveis = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/anos-disponiveis`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar anos disponíveis:', error)
    throw error
  }
}

export const getUltimoBimestrePublicado = async (ano, tipo = 1) => {
  try {
    let ultimoBimestreEncontrado = null

    // Tenta buscar do último bimestre até o primeiro
    const bimestreAtual = Math.ceil((new Date().getMonth() + 1) / 2)
    const bimestreInicial = ano === new Date().getFullYear() ? bimestreAtual : 6

    for (let bimestre = bimestreInicial; bimestre >= 1; bimestre--) {
      try {
        const response = await axios.get(`${API_BASE_URL}/rreo-anexo-1`, {
          params: {
            ano,
            mes: BIMESTRE_PARA_MES[bimestre], // Converte bimestre para mês
            extensao: 'pdf',
            orgao: 1,
            tipoDoRelatorio: tipo
          },
          responseType: 'blob'
        })

        if (response.status === 200) {
          ultimoBimestreEncontrado = bimestre
          break
        }
      } catch (error) {
        continue
      }
    }

    if (ultimoBimestreEncontrado === null) {
      throw new Error('Nenhum relatório publicado para este ano')
    }

    return ultimoBimestreEncontrado
  } catch (error) {
    throw error
  }
}

export const getUltimoAnoPublicado = async () => {
  try {
    const anos = await getAnosDisponiveis()
    const anoAtual = new Date().getFullYear()

    // Tenta o ano atual primeiro
    try {
      await getUltimoBimestrePublicado(anoAtual)
      return anoAtual
    } catch (error) {
      // Se não encontrar no ano atual, pega o maior ano disponível
      return Math.max(...anos)
    }
  } catch (error) {
    throw error
  }
}

// Função auxiliar para obter lista de bimestres
export const getBimestresDisponiveis = () => {
  return [
    { value: 1, label: '1º Bimestre' },
    { value: 2, label: '2º Bimestre' },
    { value: 3, label: '3º Bimestre' },
    { value: 4, label: '4º Bimestre' },
    { value: 5, label: '5º Bimestre' },
    { value: 6, label: '6º Bimestre' }
  ]
}
