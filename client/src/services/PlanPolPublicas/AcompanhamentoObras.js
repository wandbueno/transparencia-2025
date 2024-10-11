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

// Função para obter apenas obras paralisadas (Inacabada ou Paralisada)
export const getObrasParalisadas = async () => {
  try {
    const obras = await getAcompanhamentoObras() // Reaproveita a função original

    // Filtrar as obras onde a situação é 'Inacabada' (32) ou 'Paralisada' (34)
    const obrasParalisadas = obras.filter(obra => {
      const situacaoObra = obra['situacao-obra'] // Acessa o campo 'situacao-obra'
      return (
        situacaoObra && (situacaoObra.includes(32) || situacaoObra.includes(34))
      )
    })

    return obrasParalisadas
  } catch (error) {
    console.error('Erro ao buscar obras paralisadas:', error)
    throw error
  }
}
