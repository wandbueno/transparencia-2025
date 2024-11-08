import axios from 'axios'

// Obter a URL base do site oficial a partir das variáveis de ambiente
const VITE_SITE_OFICIAL = `${
  import.meta.env.VITE_SITE_OFICIAL
}/wp-json/wp/v2/publicacao`

// Função genérica para obter os dados de publicações filtradas por tipo de documento, lidando com paginação
export const getPublicacoesPorTipo = async tipoDocumento => {
  try {
    let page = 1
    let totalResults = []
    let morePagesAvailable = true

    while (morePagesAvailable) {
      // Faz a requisição para a API, passando o parâmetro `page` e `per_page=100`
      const response = await axios.get(VITE_SITE_OFICIAL, {
        params: {
          per_page: 100, // Número de itens por página
          page: page // Página atual
        }
      })

      // Filtra as publicações que têm o campo "tipo-de-documento" desejado
      const publicacoesFiltradas = response.data.filter(
        item => item.meta?.['tipo-de-documento'] === tipoDocumento
      )

      // Adiciona as publicações filtradas aos resultados totais
      totalResults = [...totalResults, ...publicacoesFiltradas]

      // Se o número de itens retornados for menor que 100, significa que não há mais páginas
      if (response.data.length < 100) {
        morePagesAvailable = false
      } else {
        page++ // Avança para a próxima página
      }
    }

    return totalResults // Retorna todas as publicações filtradas
  } catch (error) {
    console.error(`Erro ao buscar publicações do tipo ${tipoDocumento}:`, error)
    throw error
  }
}

// Função genérica para obter os dados de publicações filtradas por "tipo", lidando com paginação
export const getPlanosMunicipal = async tipo => {
  try {
    let page = 1
    let totalResults = []
    let morePagesAvailable = true

    while (morePagesAvailable) {
      // Faz a requisição para a API, passando o parâmetro `page` e `per_page=100`
      const response = await axios.get(VITE_SITE_OFICIAL, {
        params: {
          per_page: 100, // Número de itens por página
          page: page // Página atual
        }
      })

      // Filtra as publicações que têm o campo "tipo" desejado
      const publicacoesFiltradas = response.data.filter(
        item => item.meta?.['tipo'] === tipo
      )

      // Adiciona as publicações filtradas aos resultados totais
      totalResults = [...totalResults, ...publicacoesFiltradas]

      // Se o número de itens retornados for menor que 100, significa que não há mais páginas
      if (response.data.length < 100) {
        morePagesAvailable = false
      } else {
        page++ // Avança para a próxima página
      }
    }

    return totalResults
  } catch (error) {
    console.error('Erro ao buscar publicações por tipo:', error)
    throw error
  }
}

// Função para obter os anos (termos da taxonomia "ano-publicacao")
export const getAnosPublicacao = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SITE_OFICIAL}/wp-json/wp/v2/ano-publicacao`
    )
    return response.data // Retorna os termos com os IDs e os nomes dos anos
  } catch (error) {
    console.error('Erro ao buscar os anos de publicação:', error)
    throw error
  }
}

// Função para buscar publicação por slug
export const getPublicacaoBySlug = async slug => {
  try {
    const response = await axios.get(`${VITE_SITE_OFICIAL}?slug=${slug}`)
    return response.data[0] // Retorna o primeiro item da lista
  } catch (error) {
    console.error('Erro ao buscar publicação:', error)
    throw error
  }
}

// Função para obter o URL do documento a partir do ID de mídia no WordPress
export const getMediaUrlById = async mediaId => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SITE_OFICIAL}/wp-json/wp/v2/media/${mediaId}`
    )
    return response.data.source_url // Retorna o URL do arquivo de mídia
  } catch (error) {
    console.error(`Erro ao obter URL do media ID ${mediaId}:`, error)
    return null // Retorna null se houver erro
  }
}

// Função para transformar os documentos e obter os URLs dos arquivos de mídia
export const getDocumentsWithUrls = async documents => {
  if (!documents) return []

  const documentData = await Promise.all(
    Object.keys(documents).map(async key => {
      const documento = documents[key]
      const url = await getMediaUrlById(documento.anexo) // Busca o URL do arquivo de mídia
      return {
        tipo: documento.tipo,
        url: url || 'Não disponível'
      }
    })
  )

  return documentData
}
//teste
