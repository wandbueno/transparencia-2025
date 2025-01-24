import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/diarias`

export const getDiarias = async (filters = {}) => {
  try {
    // Mapeia os filtros para os parâmetros esperados pela API
    const params = {
      pagina: 1,
      tamanhoDaPagina: 2500,
      // Filtros de órgão e departamento
      codigoDoOrgao: filters.orgao || undefined,
      codigoDoDepartamento: filters.departamento || undefined,

      // Filtros de funcionário
      matriculaDoFuncionario: filters.matriculaDoFuncionario || undefined,
      nomeDoFuncionario: filters.nomeDoFuncionario || undefined,

      // Filtros de data
      dataInicial: filters.dataInicial || undefined,
      dataFinal: filters.dataFinal || undefined,

      // Filtros de destino e portaria
      destino: filters.destino || undefined,
      numeroDaPortaria: filters.numeroDaPortaria || undefined,
      anoDaPortaria: filters.anoDaPortaria || undefined,

      // Filtros de documentos relacionados
      numeroDoProcesso: filters.numeroDoProcesso || undefined,
      numeroDoEmpenho: filters.numeroDoEmpenho || undefined,
      numeroDaLiquidacao: filters.numeroDaLiquidacao || undefined,
      numeroDoPagamento: filters.numeroDoPagamento || undefined,

      // Filtro de valor
      valor: filters.valor || undefined
    }

    // Remove parâmetros undefined
    Object.keys(params).forEach(
      key => params[key] === undefined && delete params[key]
    )

    console.log('Parâmetros enviados para API:', params)

    const headers = {
      'x-tenant-id': import.meta.env.VITE_TENANT_ID || 'conceicaodotocantins',
      Accept: 'application/json'
    }

    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params,
      headers
    })

    return response.data
  } catch (error) {
    console.error('Erro ao buscar diárias:', error)
    throw error
  }
}

export const getDiariasId = async id => {
  try {
    const headers = {
      'x-tenant-id': import.meta.env.VITE_TENANT_ID || 'conceicaodotocantins',
      Accept: 'application/json'
    }

    const response = await axios.get(`${API_BASE_URL}/${id}`, { headers })
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar diária com ID ${id}:`, error)
    throw error
  }
}
