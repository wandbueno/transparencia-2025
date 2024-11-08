import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/lrf`

// Mapeamento de semestre para mês
const SEMESTRE_PARA_MES = {
  1: 6, // 1º semestre -> junho
  2: 12 // 2º semestre -> dezembro
}

export const getMetaDadosRGF = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/meta-dados-rgf`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar metadados do RGF:', error)
    throw error
  }
}

export const getRelatorioRGF = async (tipo, params = {}) => {
  try {
    // Converte semestre para mês se necessário
    if (params.semestre) {
      params.mes = SEMESTRE_PARA_MES[params.semestre]
      delete params.semestre
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

export const getUltimoSemestrePublicado = async (ano, tipo = 2) => {
  try {
    let ultimoSemestreEncontrado = null

    // Tenta buscar do último semestre até o primeiro
    const semestreAtual = Math.ceil((new Date().getMonth() + 1) / 6)
    const semestreInicial = ano === new Date().getFullYear() ? semestreAtual : 2

    for (let semestre = semestreInicial; semestre >= 1; semestre--) {
      try {
        const response = await axios.get(`${API_BASE_URL}/rgf-anexo-1`, {
          params: {
            ano,
            mes: SEMESTRE_PARA_MES[semestre], // Converte semestre para mês
            extensao: 'pdf',
            orgao: 1,
            tipoDoRelatorio: tipo
          },
          responseType: 'blob'
        })

        if (response.status === 200) {
          ultimoSemestreEncontrado = semestre
          break
        }
      } catch (error) {
        continue
      }
    }

    if (ultimoSemestreEncontrado === null) {
      throw new Error('Nenhum relatório publicado para este ano')
    }

    return ultimoSemestreEncontrado
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
      await getUltimoSemestrePublicado(anoAtual)
      return anoAtual
    } catch (error) {
      // Se não encontrar no ano atual, pega o maior ano disponível
      return Math.max(...anos)
    }
  } catch (error) {
    throw error
  }
}

// Função auxiliar para obter lista de semestres
export const getSemestresDisponiveis = () => {
  return [
    { value: 1, label: '1º Semestre' },
    { value: 2, label: '2º Semestre' }
  ]
}
