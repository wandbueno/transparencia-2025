import axios from 'axios'

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/combo`

// Lista de todos os filtros disponíveis
export const COMBO_FILTERS = {
  // Filtros Gerais
  ANO: 'ano',
  ORGAO: 'orgao',
  DEPARTAMENTO: 'departamento',
  UNIDADE: 'unidade',

  // Filtros de Despesas
  FUNCAO: 'funcao',
  SUBFUNCAO: 'subfuncao',
  PROGRAMA: 'programa',
  FONTE_EMPENHO: 'fonteDoEmpenho',
  ELEMENTO: 'elemento',
  CATEGORIA_EMPENHO: 'categoriaDeEmpenho',
  FASE_LIQUIDACAO: 'faseDaLiquidacao',
  FASE_ORDEM_PAGAMENTO: 'faseDaOrdemDePagamento',
  MODALIDADE: 'modalidade',

  // Filtros de Receitas
  CATEGORIA_RECEITA: 'categoriaDaReceita',
  ORIGEM_RECEITA: 'origemDaReceita',
  FONTE_RECEITA: 'fonteDaReceita',
  TITULO_RECEITA: 'tituloDeReceita',

  // Filtros de Licitações e Contratos
  MODALIDADE_LICITACAO: 'modalidadeProcedimentoLicitatorios',
  MODALIDADE_DISPENSA: 'modalidadeDispensasInexigibilidades',
  NATUREZA_PROCEDIMENTO: 'naturezaDoProcedimento',
  SITUACAO_CONTRATO: 'situacaoDoContrato',
  ADITIVO_CONTRATO: 'aditivoDoContrato',
  ASSUNTO_CONTRATO: 'assuntoDeContrato',
  SITUACAO_ATA_REGISTRO: 'situacaoDaAtaDeRegistroDePreco',

  // Filtros de Servidores
  CARGO: 'cargo',
  TIPO_CARGO: 'tipoDeCargo',
  SITUACAO_FUNCIONARIO: 'situacaoFuncionario',
  CATEGORIA_TRABALHADOR: 'categoriaDoTrabalhadorNoESocial',
  TIPO_VINCULO: 'tipoDeVinculo',
  TIPO_LICENCA: 'tipoDeLicenca',

  // Filtros de Documentos e Publicações
  TIPO_DOCUMENTO_LEGISLACAO: 'tipoDeDocumentoLegislacaoMunicipal',
  TIPO_DOCUMENTO_CONSELHO: 'tipoDeDocumentoConselho',
  TIPO_DOCUMENTO_OUTRAS_PUBLICACOES: 'tipoDeDocumentoOutrasPublicacoes',
  TIPO_DOCUMENTO_VERSAO_SIMPLIFICADA: 'tipoDeDocumentoVersaoSimplificada',
  TIPO_DOCUMENTO_COVID19: 'tipoDeDocumentoCovid19',
  TIPO_DOCUMENTO_PLANOS: 'tipoDeDocumentoPlanos',
  SITUACAO_DOCUMENTO: 'situacaoDoDocumentoDoPortalDaTransparencia',
  VEICULO_PUBLICACAO: 'veiculoDePublicacao',

  // Filtros de Recursos e Convênios
  ORIGEM_RECURSOS: 'origemDeRecursos',
  TIPO_EXTRA: 'tipoDeExtra',
  TIPO_CONVENIO: 'tipoDeConvenio',

  // Filtros de Patrimônio
  TIPO_BEM: 'tipoDeBem',

  // Filtros de Pareceres e Conselhos
  CONSELHO: 'conselho',
  PARECER_PREVIO_MODALIDADE: 'parecerPrevioModalidade',
  PARECER_PREVIO_STATUS: 'parecerPrevioStatus',

  // Filtros de Concursos
  SITUACAO_CONCURSO: 'situacaoDoConcurso',
  TIPO_PROCESSO_SELETIVO: 'tipoDeProcessoSeletivoDoConcurso',
  SITUACAO_HOMOLOGACAO: 'situacaoDaHomologacao',

  // Outros Filtros
  CATEGORIA_VIDEO: 'categoriaDeVideo',
  TIPO_ENTE_FEDERADO: 'tipoDeEnteFederadoVidaFuncionalDisposicao'
}

// Função para buscar dados de múltiplos combos
export const getMultiplosCombo = async (filtros = []) => {
  try {
    if (!Array.isArray(filtros) || filtros.length === 0) {
      console.warn('No filters provided to getMultiplosCombo')
      return {}
    }

    // Constrói a query string com múltiplos parâmetros filtro
    const queryString = filtros
      .map(filtro => `filtro=${encodeURIComponent(filtro)}`)
      .join('&')

    console.log('Requesting combos with query:', queryString)

    const response = await axios.get(`${API_BASE_URL}/?${queryString}`, {
      headers: {
        'x-tenant-id': 'conceicaodotocantins', // Adiciona o tenant ID no header
        Accept: 'application/json'
      }
    })

    // Verifica se a resposta tem a estrutura esperada
    if (!response.data || typeof response.data !== 'object') {
      console.error('Invalid response format:', response.data)
      return {}
    }

    console.log('Combo response:', response.data)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar dados do combo:', error)
    throw error
  }
}
