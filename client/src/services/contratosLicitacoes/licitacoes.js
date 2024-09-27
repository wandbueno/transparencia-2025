import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/licitacoes`

// Defina o valor de TIPO_DE_CONSULTA
const TIPO_DE_CONSULTA = 1

export const getLicitacoes = async filters => {
  const {
    ano,
    codigoDoOrgao,
    codigoDaModalidade,
    codigoDaSituacao,
    cpfCnpj,
    fornecedor,
    objeto
  } = filters

  const params = new URLSearchParams()
  if (ano) params.append('ano', ano)
  if (codigoDoOrgao) params.append('codigoDoOrgao', codigoDoOrgao)
  if (codigoDaModalidade)
    params.append('codigoDaModalidade', codigoDaModalidade) // Ajuste correto
  if (codigoDaSituacao) params.append('codigoDaSituacao', codigoDaSituacao) // Ajuste correto
  if (cpfCnpj) params.append('cpfCnpj', cpfCnpj)
  if (fornecedor) params.append('fornecedor', fornecedor)
  if (objeto) params.append('objeto', objeto)

  params.append('pagina', 1)
  params.append('tamanhoDaPagina', 2500)
  params.append('tipoDeConsultaDeModalidade', 1)

  try {
    const response = await axios.get(`${API_BASE_URL}?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar licitações:', error)
    throw error
  }
}
export const getLicitacaoById = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${id}?tipoDeConsultaDeModalidade=${TIPO_DE_CONSULTA}`
    )
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar licitação com id ${id}:`, error)
    throw error
  }
}
