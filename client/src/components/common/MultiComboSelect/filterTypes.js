// Tipos de filtros disponíveis
export const FILTER_TYPES = {
  // Filtros Gerais
  ANO: 'ano',
  MES: 'mes',
  ORGAO: 'orgao',
  DEPARTAMENTO: 'departamento',
  UNIDADE: 'unidade',

  // Documentos e Legislação
  TIPO_DOCUMENTO_LEGISLACAO: 'tipoDeDocumentoLegislacaoMunicipal',
  TIPO_DOCUMENTO_CONSELHO: 'tipoDeDocumentoConselho',
  TIPO_DOCUMENTO_OUTRAS_PUBLICACOES: 'tipoDeDocumentoOutrasPublicacoes',
  TIPO_DOCUMENTO_VERSAO_SIMPLIFICADA: 'tipoDeDocumentoVersaoSimplificada',
  TIPO_DOCUMENTO_COVID19: 'tipoDeDocumentoCovid19',
  TIPO_DOCUMENTO_PLANOS: 'tipoDeDocumentoPlanos',

  // Financeiro
  ELEMENTO: 'elemento',
  FUNCAO: 'funcao',
  SUBFUNCAO: 'subfuncao',
  PROGRAMA: 'programa',
  FONTE_EMPENHO: 'fonteDoEmpenho',
  FONTE_RECEITA: 'fonteDaReceita',
  CATEGORIA_RECEITA: 'categoriaDaReceita',
  ORIGEM_RECEITA: 'origemDaReceita',
  ORIGEM_RECURSOS: 'origemDeRecursos',
  TIPO_EXTRA: 'tipoDeExtra',
  TITULO_RECEITA: 'tituloDeReceita',

  // Licitações e Contratos
  MODALIDADE: 'modalidade',
  MODALIDADE_LICITACAO: 'modalidadeProcedimentoLicitatorios',
  MODALIDADE_DISPENSA: 'modalidadeDispensasInexigibilidades',
  NATUREZA_PROCEDIMENTO: 'naturezaDoProcedimento',
  SITUACAO_CONTRATO: 'situacaoDoContrato',
  ADITIVO_CONTRATO: 'aditivoDoContrato',
  ASSUNTO_CONTRATO: 'assuntoDeContrato',
  SITUACAO_ATA_REGISTRO: 'situacaoDaAtaDeRegistroDePreco',

  // Servidores
  CARGO: 'cargo',
  TIPO_CARGO: 'tipoDeCargo',
  SITUACAO_FUNCIONARIO: 'situacaoFuncionario',
  CATEGORIA_TRABALHADOR: 'categoriaDoTrabalhadorNoESocial',
  TIPO_VINCULO: 'tipoDeVinculo',
  TIPO_LICENCA: 'tipoDeLicenca',

  // Outros
  CONSELHO: 'conselho',
  TIPO_BEM: 'tipoDeBem',
  CONTRATO_COVID19: 'contratoCovid19',
  PARECER_PREVIO_MODALIDADE: 'parecerPrevioModalidade',
  PARECER_PREVIO_STATUS: 'parecerPrevioStatus',
  CATEGORIA_VIDEO: 'categoriaDeVideo',
  TIPO_CONVENIO: 'tipoDeConvenio',
  FASE_LIQUIDACAO: 'faseDaLiquidacao',
  FASE_ORDEM_PAGAMENTO: 'faseDaOrdemDePagamento',
  SITUACAO_DOCUMENTO: 'situacaoDoDocumentoDoPortalDaTransparencia',
  SITUACAO_HOMOLOGACAO: 'situacaoDaHomologacao',
  SITUACAO_CONCURSO: 'situacaoDoConcurso',
  VEICULO_PUBLICACAO: 'veiculoDePublicacao',
  TIPO_PROCESSO_SELETIVO: 'tipoDeProcessoSeletivoDoConcurso',
  CATEGORIA_EMPENHO: 'categoriaDeEmpenho',
  TIPO_ENTE_FEDERADO: 'tipoDeEnteFederadoVidaFuncionalDisposicao'
}

// Tipos de campos de entrada
export const INPUT_TYPES = {
  COMBO: 'combo',
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date'
}

// Mapeamento de labels para os filtros
export const FILTER_LABELS = {
  [FILTER_TYPES.ANO]: 'Ano',
  [FILTER_TYPES.MES]: 'Mês',
  [FILTER_TYPES.ORGAO]: 'Órgão',
  [FILTER_TYPES.DEPARTAMENTO]: 'Departamento',
  [FILTER_TYPES.UNIDADE]: 'Unidade',
  [FILTER_TYPES.MODALIDADE]: 'Modalidade',
  [FILTER_TYPES.MODALIDADE_LICITACAO]: 'Modalidade de Licitação',
  [FILTER_TYPES.SITUACAO_CONTRATO]: 'Situação do Contrato',
  [FILTER_TYPES.ADITIVO_CONTRATO]: 'Aditivo do Contrato',
  [FILTER_TYPES.ASSUNTO_CONTRATO]: 'Assunto do Contrato',
  [FILTER_TYPES.CONTRATO_COVID19]: 'Covid-19'
  // Adicione mais labels conforme necessário
}

// Configurações padrão dos campos de texto
export const TEXT_FIELDS = {
  CPF_CNPJ: {
    id: 'cpfCnpj',
    label: 'CPF/CNPJ',
    type: INPUT_TYPES.TEXT,
    placeholder: 'Digite o CPF ou CNPJ'
  },
  FORNECEDOR: {
    id: 'fornecedor',
    label: 'Fornecedor',
    type: INPUT_TYPES.TEXT,
    placeholder: 'Digite o nome do fornecedor'
  },
  OBJETO: {
    id: 'objeto',
    label: 'Objeto',
    type: INPUT_TYPES.TEXT,
    placeholder: 'Digite o objeto'
  },
  NUMERO_CONTRATO: {
    id: 'numeroContrato',
    label: 'Número do Contrato',
    type: INPUT_TYPES.TEXT,
    placeholder: 'Digite o número do contrato'
  },
  // Novos campos para Ordens de Fornecimento
  CODIGO_COMPRA: {
    id: 'codigoDaCompra',
    label: 'Código da Compra',
    type: INPUT_TYPES.TEXT,
    placeholder: 'Digite o código da compra'
  },
  DATA_INICIAL: {
    id: 'dataInicial',
    label: 'Data Inicial',
    type: INPUT_TYPES.DATE
  },
  DATA_FINAL: {
    id: 'dataFinal',
    label: 'Data Final',
    type: INPUT_TYPES.DATE
  }
}
