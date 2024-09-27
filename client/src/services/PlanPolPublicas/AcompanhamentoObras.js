import axios from 'axios'

// Obter a URL base do site oficial a partir das variáveis de ambiente
const VITE_SITE_OFICIAL = `${
  import.meta.env.VITE_SITE_OFICIAL
}/wp-json/wp/v2/obras?per_page=100`

// Função para obter os dados de obras
export const getAcompanhamentoObras = async () => {
  try {
    const response = await axios.get(VITE_SITE_OFICIAL)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar obras:', error)
    throw error
  }
}
