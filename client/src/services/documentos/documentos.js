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

// Function to download document
export const downloadDocumento = async codigo => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/baixar-documento/${codigo}`,
      {
        responseType: 'blob'
      }
    )

    // Get content type from response
    const contentType = response.headers['content-type']

    // Get filename from content disposition or use default with extension
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

    // Create blob URL
    const blob = new Blob([response.data], { type: contentType })
    const url = window.URL.createObjectURL(blob)

    // Create temporary link and trigger download
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()

    // Cleanup
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error('Erro ao baixar documento:', error)
    throw error
  }
}

// Função para visualizar documento
export const visualizarDocumento = async codigo => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/baixar-documento/${codigo}`,
      {
        responseType: 'blob'
      }
    )

    // Criar URL do blob
    const blobUrl = window.URL.createObjectURL(
      new Blob([response.data], {
        type: response.headers['content-type']
      })
    )

    return blobUrl
  } catch (error) {
    console.error('Erro ao visualizar documento:', error)
    throw error
  }
}
