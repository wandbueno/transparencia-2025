import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/gestao-eletronica-de-documentos`

// Função para listar documentos
export const getDocumentos = async (tabela, codigoDoRegistro) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        tabela,
        codigoDoRegistro,
        pagina: 1,
        tamanhoDaPagina: 100
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar documentos:', error)
    throw error
  }
}

// Função para obter nome do documento
export const getDocumentName = async codigo => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/nome-pelo-codigo/${codigo}`
    )
    return response.data
  } catch (error) {
    console.error('Erro ao buscar nome do documento:', error)
    throw error
  }
}

// Função para baixar documento
export const downloadDocumento = async codigo => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/baixar-documento/${codigo}`,
      {
        responseType: 'blob'
      }
    )

    // Obtém o nome do arquivo do header Content-Disposition
    const contentDisposition = response.headers['content-disposition']
    let filename = 'documento'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      )
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
      }
    }

    // Cria URL do blob
    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: response.headers['content-type']
      })
    )

    // Cria elemento <a> temporário para download
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()

    // Limpa
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error('Erro ao baixar documento:', error)
    throw error
  }
}

// Função para visualizar documento (retorna URL do blob)
export const visualizarDocumento = async codigo => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/baixar-documento/${codigo}`,
      {
        responseType: 'blob'
      }
    )

    // Cria e retorna URL do blob
    return window.URL.createObjectURL(
      new Blob([response.data], {
        type: response.headers['content-type']
      })
    )
  } catch (error) {
    console.error('Erro ao visualizar documento:', error)
    throw error
  }
}
