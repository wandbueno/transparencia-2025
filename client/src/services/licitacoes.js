import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})

// Função para obter a lista de licitações
export const getLicitacoes = async () => {
  try {
    const response = await api.get(
      '/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/detalhes-paginado',
      {
        params: {
          pagina: 1,
          tamanhoDaPagina: 25
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          'cliente-integrado': import.meta.env.VITE_CLIENTE_INTEGRADO // Certifique-se de que VITE_CLIENTE_INTEGRADO está configurado corretamente
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Erro ao obter licitações:', error)
    throw error
  }
}

// Função para obter detalhes de uma licitação específica
export const getLicitacaoDetalhe = async id => {
  try {
    const response = await api.get(
      `/api/contratos-convenios-e-licitacoes/procedimento-licitatorio/detalhe?chavePrimaria=${id}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`, // Certifique-se de que VITE_API_TOKEN está configurado corretamente
          'cliente-integrado': import.meta.env.VITE_CLIENTE_INTEGRADO // Certifique-se de que VITE_CLIENTE_INTEGRADO está configurado corretamente
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Erro ao obter detalhes da licitação:', error)
    throw error
  }
}
