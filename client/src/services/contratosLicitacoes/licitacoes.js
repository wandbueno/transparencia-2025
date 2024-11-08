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
  console.log(filters)
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

// Função para buscar os itens vencedores de uma licitação específica
export const getItensVencedores = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/itens-vencedores/${id}?tipoDeConsultaDeModalidade=${TIPO_DE_CONSULTA}`
    )
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar itens vencedores para o id ${id}:`, error)
    throw error
  }
}

// Função para buscar itens fracassados ou desertos de uma licitação específica
export const getItensFracassadosOuDesertos = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/itens-fracassados-ou-desertos/${id}?tipoDeConsultaDeModalidade=${TIPO_DE_CONSULTA}`
    )
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar itens fracassados ou desertos para o id ${id}:`,
      error
    )
    throw error
  }
}

// Função para buscar itens em aberto de uma licitação específica
export const getItensEmAberto = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/itens-em-aberto/${id}?tipoDeConsultaDeModalidade=${TIPO_DE_CONSULTA}`
    )
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar itens em aberto para o id ${id}:`, error)
    throw error
  }
}

// Função para buscar itens cancelados ou substituídos de uma licitação específica
export const getItensCanceladosESubstituidos = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/itens-cancelados-e-substituidos/${id}?tipoDeConsultaDeModalidade=${TIPO_DE_CONSULTA}`
    )
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar itens cancelados ou substituídos para o id ${id}:`,
      error
    )
    throw error
  }
}

// Função para buscar empresas credenciadas de uma licitação específica
export const getEmpresasCredenciadas = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/empresas-credenciadas/${id}?tipoDeConsultaDeModalidade=${TIPO_DE_CONSULTA}`
    )
    return response.data
  } catch (error) {
    console.error(
      `Erro ao buscar empresas credenciadas para o id ${id}:`,
      error
    )
    throw error
  }
}

// Função para buscar empenhos de uma licitação específica
export const getEmpenhos = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/empenhos/${id}?tipoDeConsultaDeModalidade=${TIPO_DE_CONSULTA}`
    )
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar empenhos para o id ${id}:`, error)
    throw error
  }
}

// Função para buscar contratos de uma licitação específica
export const getContratos = async id => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/contratos/${id}?tipoDeConsultaDeModalidade=${TIPO_DE_CONSULTA}`
    )
    return response.data
  } catch (error) {
    console.error(`Erro ao buscar contratos para o id ${id}:`, error)
    throw error
  }
}
