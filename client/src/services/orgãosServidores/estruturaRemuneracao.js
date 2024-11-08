import axios from 'axios'

const API_BASE_URL = `${
  import.meta.env.VITE_BACKEND_URL
}/api/estrutura-de-remuneracao`

export const getEstruturaRemuneracao = async (
  ano = new Date().getFullYear(),
  mes = new Date().getMonth() + 1, // Corrige o mês para o formato correto (1 a 12)
  pagina = 1,
  tamanhoDaPagina = 2500
) => {
  try {
    // Formatação do mês para dois dígitos
    const mesFormatado = mes.toString().padStart(2, '0')
    console.log(`Chamando a API com ano=${ano} e mes=${mesFormatado}`)

    // Faz a requisição para a API com os parâmetros ano e mes formatados
    const response = await axios.get(`${API_BASE_URL}/paginado`, {
      params: {
        ano: ano,
        mes: mesFormatado,
        pagina: pagina,
        tamanhoDaPagina: tamanhoDaPagina
      }
    })

    // Retorna os dados recebidos da API
    return response.data
  } catch (error) {
    console.error('Erro ao buscar estrutura de remuneração:', error)
    throw error
  }
}

export const getEstruturaRemuneracaoId = async (codigoDoNivel, ano, mes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${codigoDoNivel}`, {
      params: { ano, mes }
    })
    return response.data // Certifique-se de que isso está retornando os dados corretamente
  } catch (error) {
    console.error(
      `Erro ao buscar detalhes da Estrutura de Remuneração com código ${codigoDoNivel}:`,
      error
    )
    throw error
  }
}
