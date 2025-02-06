import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/gestao-eletronica-de-documentos`

// Lista de tipos MIME que podem ser visualizados no navegador
const VIEWABLE_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'text/html'
]

// Lista de extensões que devem forçar download
const FORCE_DOWNLOAD_EXTENSIONS = [
  'zip',
  'rar',
  'xlsx',
  'xls',
  'doc',
  'docx',
  'csv',
  'odt',
  'ods'
].map(ext => ext.toLowerCase())

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

// Função para limpar nome de arquivo
const sanitizeFilename = filename => {
  return filename
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

// Função para visualizar ou baixar documento
export const visualizarDocumento = async (
  codigo,
  extensao,
  tabela = 'LICITACAO'
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/baixar-documento/${codigo}`,
      {
        params: { tabela },
        responseType: 'blob'
      }
    )

    // Determina o tipo de conteúdo e extensão
    const contentType = response.headers['content-type']
    const extensaoLower = extensao?.toLowerCase()

    // Verifica se o documento pode ser visualizado no navegador
    const isViewable = VIEWABLE_MIME_TYPES.some(type =>
      contentType?.includes(type)
    )
    const shouldForceDownload =
      FORCE_DOWNLOAD_EXTENSIONS.includes(extensaoLower) || !isViewable

    // Cria URL do blob
    const blob = new Blob([response.data], { type: contentType })
    const blobUrl = window.URL.createObjectURL(blob)

    // Obtém o nome do arquivo do header Content-Disposition
    const contentDisposition = response.headers['content-disposition']
    let filename = ''
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      )
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, '')
      }
    }

    // Se não tiver nome do arquivo, gera um nome com a extensão
    if (!filename) {
      filename = `documento_${codigo}${
        extensaoLower ? `.${extensaoLower}` : ''
      }`
    }

    // Limpa o nome do arquivo
    filename = sanitizeFilename(filename)

    // Se deve forçar download ou é documento do portal da transparência
    if (shouldForceDownload || tabela === 'DOCUMENTO_PORTAL_DA_TRANSPARENCIA') {
      const link = document.createElement('a')
      link.href = blobUrl
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
      return null
    }

    // Para PDFs, retorna a URL para abrir em nova aba
    return blobUrl
  } catch (error) {
    console.error('Erro ao visualizar documento:', error)
    throw error
  }
}
