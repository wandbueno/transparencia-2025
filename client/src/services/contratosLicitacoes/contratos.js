import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/contratos`

export const getContratos = async (filters = {}) => {
  try {
    // Mapeia os filtros para os parâmetros esperados pela API
    const params = {
      pagina: 1,
      tamanhoDaPagina: 2500,
      ordenarPor: 'dataInicial',
      ordem: 'asc'
    }

    // Adiciona filtros em formato de array quando necessário
    if (filters.modalidade) {
      params.codigosDasModalidades = [filters.modalidade]
    }

    if (filters.situacaoDoContrato) {
      params.codigosDasSituacoes = [filters.situacaoDoContrato]
    }
    if (filters.aditivoDoContrato) {
      params.codigosDosTiposDeAditivos = [Number(filters.aditivoDoContrato)]
    }

    // Mapeia os filtros simples
    if (filters.ano) params.ano = Number(filters.ano)
    if (filters.orgao) params.codigoDoOrgao = Number(filters.orgao)
    if (filters.contratoCovid19)
      params.atendimentoAoCovid19 = filters.contratoCovid19 === 'true'
    if (filters.assuntoDeContrato)
      params.codigosDeAssuntos = [filters.assuntoDeContrato]

    // Filtros de texto
    if (filters.cpfCnpj) params.cpfCnpj = filters.cpfCnpj
    if (filters.fornecedor) params.fornecedor = filters.fornecedor
    if (filters.objeto) params.objeto = filters.objeto
    if (filters.numeroContrato) params.numeroDoContrato = filters.numeroContrato

    console.log('Parâmetros enviados para API:', params)

    const response = await axios.post(`${API_BASE_URL}/paginado`, params)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar Contratos:', error)
    throw error
  }
}
export const getContratosById = async id => {
  try {
    const response = await axios.get(`${API_BASE_URL}/detalhe`, {
      params: {
        id: id
      }
    })
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar Contrato com ID ${id}:`, error)
    throw error
  }
}
