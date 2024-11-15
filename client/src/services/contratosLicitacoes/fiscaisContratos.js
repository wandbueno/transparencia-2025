import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/fiscais-de-contratos`

export const getDataAtualizacao = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data-de-atualizacao`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar data de atualização:', error)
    throw error
  }
}

export const getFiscaisContratos = async (params = {}) => {
  try {
    const filtro = {
      pagina: params.pagina || 1,
      tamanhoDaPagina: params.tamanhoDaPagina || 1000,
      nomeDoFiscal: params.nomeDoFiscal || '',
      orgaoDoCliente: params.orgaoDoCliente || '',
      estadoDoCliente: params.estadoDoCliente || ''
    }

    console.log('Enviando filtro:', filtro)

    const response = await axios.post(
      '/api/contratos-convenios-e-licitacoes/fiscais-de-contratos/paginado',
      { filtro }
    )
    return response.data
  } catch (error) {
    console.error('Erro ao buscar Fiscais:', error)
    throw error
  }
}
