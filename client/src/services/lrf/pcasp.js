import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/lrf`

export const getMetaDadosPcasp = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/meta-dados-pcasp`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar metadados do PCASP:', error)
    throw error
  }
}

export const getRelatorioPcasp = async (tipo, params = {}) => {
  try {
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

export const getUltimoMesPublicado = async (ano, tipo = 6) => {
  try {
    let ultimoMesEncontrado = null

    // Tenta buscar do mês atual até janeiro
    const mesAtual = new Date().getMonth() + 1 // getMonth() retorna 0-11
    const mesInicial = ano === new Date().getFullYear() ? mesAtual : 12

    for (let mes = mesInicial; mes >= 1; mes--) {
      try {
        const response = await axios.get(`${API_BASE_URL}/pcasp-anexo-12`, {
          params: {
            ano,
            mes,
            extensao: 'pdf',
            orgao: 1,
            tipoDoRelatorio: tipo
          },
          responseType: 'blob'
        })

        if (response.status === 200) {
          ultimoMesEncontrado = mes
          break
        }
      } catch (error) {
        continue
      }
    }

    if (ultimoMesEncontrado === null) {
      throw new Error('Nenhum relatório publicado para este ano')
    }

    return ultimoMesEncontrado
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
      await getUltimoMesPublicado(anoAtual)
      return anoAtual
    } catch (error) {
      // Se não encontrar no ano atual, pega o maior ano disponível
      return Math.max(...anos)
    }
  } catch (error) {
    throw error
  }
}
