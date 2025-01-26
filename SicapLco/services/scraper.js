const axios = require('axios')
const cheerio = require('cheerio')
const FormData = require('form-data')

const BASE_URL = 'https://app.tce.to.gov.br/lo_publico'

const extractProcedimentosData = html => {
  const $ = cheerio.load(html)
  const procedimentos = []

  $('table tbody tr').each((i, element) => {
    const $row = $(element)
    const $blockquote = $row.find('blockquote')

    // Extrai o ID do procedimento do link "Ver"
    const idProcedimento = $row.find('a').attr('href')?.split('=')[1]

    // Função auxiliar para extrair texto com fallback
    const extractText = (selector, defaultValue = 'Não informado') => {
      const text = $blockquote
        .find(selector)
        .parent()
        .text()
        .split(':')[1]
        ?.trim()
      return text || defaultValue
    }

    // Extrai o número do processo administrativo do span com classe label-info
    const processoAdministrativo =
      $blockquote.find('span.label-info').first().text().trim() ||
      'Não informado'

    // Função para extrair e formatar o tipo/modalidade
    const extractTipoModalidade = $row => {
      const $cell = $row.find('td:nth-child(2)')
      let tipoText = ''

      // Primeiro tenta encontrar o span com a classe label-warning (para ATA-SRP)
      const ataSrpText = $cell.find('span.label-warning').text().trim()

      // Primeiro tenta encontrar o span com a classe label (para Dispensa/Inexigibilidade)
      const labelText = $cell
        .find('span.label:not(.label-warning)')
        .text()
        .trim()
      if (labelText) {
        return labelText
      }

      // Se não encontrou o span.label, procura pelo formato "Licitação ➤ Modalidade"
      const cellText = $cell.text().trim()
      if (cellText.includes('➤')) {
        // Divide o texto pelo símbolo ➤ e pega apenas a segunda parte (modalidade)
        const parts = cellText.split('➤').map(part => part.trim())
        // Remove o texto ATA-SRP da parte da modalidade
        const modalidade = parts[1].replace('ATA-SRP', '').trim()
        // Reconstrói o texto apenas com a modalidade e o ATA-SRP se existir
        tipoText = `${modalidade}${ataSrpText ? ` ${ataSrpText}` : ''}`
      } else if (cellText.includes('Licitação')) {
        // Caso especial para outros formatos de licitação
        tipoText = cellText
          .replace('Licitação', '')
          .replace('➤', '')
          .replace('ATA-SRP', '')
          .trim()
        if (ataSrpText) {
          tipoText += ` ${ataSrpText}`
        }
      } else {
        // Se nenhum formato conhecido for encontrado
        tipoText = cellText || 'Não informado'
      }

      return tipoText
    }

    const procedimento = {
      id: idProcedimento,
      unidadeGestora: extractText('b:contains("UG:")'),
      processoAdministrativo: processoAdministrativo, // Usa o valor extraído do span
      processoLicitatorio: extractText('b:contains("Proc. Licitatório:")'),
      descricaoObjeto: $blockquote.find('p').text().trim() || 'Não informado',
      tipoExecucao: extractTipoModalidade($row),
      dataCadastro:
        $row
          .find('td:nth-child(3)')
          .text()
          .split('Data de Cadastro:')[1]
          ?.split('Data de Abertura:')[0]
          ?.trim() || 'Não informado',
      dataAbertura:
        $row
          .find('td:nth-child(3)')
          .text()
          .split('Data de Abertura:')[1]
          ?.trim() || 'Não informado',
      valor:
        $row.find('td:nth-child(4)').text().trim() || 'Valor não informado',
      fases:
        $row
          .find('td:nth-child(5) span')
          .map((_, el) => $(el).text().trim())
          .get()
          .join(' ') || 'Não informado',
      detalhesUrl: $row.find('a').attr('href') || '#'
    }

    procedimentos.push(procedimento)
  })

  return procedimentos
}

const extractAnexos = $ => {
  const anexos = []
  $('#anexos table tbody tr').each((i, element) => {
    const $row = $(element)
    const anexo = {
      id: $row.find('td:nth-child(1)').text().trim(),
      fase: $row.find('td:nth-child(2)').text().trim(),
      tipo: $row.find('td:nth-child(3)').text().trim(),
      referencia: $row.find('td:nth-child(4)').text().trim(),
      dataAnexo: $row.find('td:nth-child(5)').text().trim(),
      arquivo: {
        nome: $row.find('td:nth-child(6) a').text().trim(),
        url: $row.find('td:nth-child(6) a').attr('href')
      }
    }
    anexos.push(anexo)
  })
  return anexos
}

const extractPrimeiraFase = $ => {
  // Função auxiliar para extrair texto após um label específico
  const extractLabelText = (label, parentSelector = '.panel-body') => {
    const element = $(`${parentSelector} b:contains("${label}:")`)
    if (!element.length) return ''

    // Pega o texto após o label até o próximo <b> ou <br>
    const text = element
      .parent()
      .html()
      ?.split(`<b>${label}:</b>`)[1]
      ?.split(/<b>|<br>/)[0]
      ?.trim()
    return text || ''
  }

  // Extrai informações do cabeçalho comum
  const unidadeGestora = $('dl dd h4.text-success').text().trim()
  const cnpj = $('dl span.badge').text().trim()

  // Extrai dados específicos do procedimento
  const numeroSicap = $('span.label-info:first').text().trim()
  const processo = $('span.label-info').eq(1).text().trim()

  // Determina o tipo de procedimento
  const isDispensa = $('span.label-info:contains("Dispensa")').length > 0
  const isInexigibilidade =
    $('span.label-danger:contains("Inexigibilidade")').length > 0
  const isLicitacao = $('span:contains("Licitação")').length > 0

  // Extrai tipo/modalidade baseado no tipo de procedimento
  let tipoModalidade = ''
  if (isDispensa) {
    tipoModalidade = 'Dispensa'
  } else if (isInexigibilidade) {
    tipoModalidade = 'Inexigibilidade'
  } else if (isLicitacao) {
    tipoModalidade = 'Licitação'
  }

  // Extrai valor estimado
  const valorEstimado = $('b:contains("Valor estimado:")')
    .next('span.label-info')
    .text()
    .trim()

  // Cria o objeto base com campos comuns
  const result = {
    unidadeGestora,
    cnpj,
    numeroSicap,
    processo,
    tipoModalidade,
    valorEstimado
  }

  // Adiciona campos específicos baseado no tipo de procedimento
  if (isDispensa || isInexigibilidade) {
    // Campos comuns para Dispensa e Inexigibilidade
    const itemOuLote = extractLabelText('Item ou Lote')
    const dataCadastro = extractLabelText('Data de cadastro')
    const dataBaseOrcamento = extractLabelText('Data Base de orçamento')
    const dataPrimeiraPublicacao = extractLabelText('Data Primeira publicação')

    // Extrai justificativa, legislação e objeto separadamente
    const justificativaText = $('b:contains("Justificativa:")')
      .parent()
      .html()
      ?.split('<b>Justificativa:</b>')[1]
      ?.split('<b>')[0]
      ?.trim()
    const legislacaoText = $('b:contains("Legislação:")')
      .parent()
      .html()
      ?.split('<b>Legislação:</b>')[1]
      ?.split('<b>')[0]
      ?.trim()
    const objetoText = $('b:contains("Objeto:")')
      .parent()
      .html()
      ?.split('<b>Objeto:</b>')[1]
      ?.split('<br>')[0]
      ?.trim()

    Object.assign(result, {
      itemOuLote,
      dataCadastro,
      dataBaseOrcamento,
      dataPrimeiraPublicacao,
      justificativa: justificativaText?.replace(/<br>/g, ''),
      legislacao: legislacaoText?.replace(/<br>/g, ''),
      objeto: objetoText?.replace(/<br>/g, '')
    })
  } else if (isLicitacao) {
    // Campos específicos para Licitação
    const tipo = extractLabelText('Tipo')
    const regime = extractLabelText('Regime')
    const numeroIRP = extractLabelText('Número IRP')
    const numeroConvidados = extractLabelText('Número de Convidados')
    const quantidadeLicitantes = extractLabelText('Quantidade de Licitantes')
    const quantidadeHabilitados = extractLabelText('Quantidade de Habilitados')
    const dataPropostas = extractLabelText('Data das Propostas ou dos eventos')
    const dataJulgamento = extractLabelText('Data de Julgamento Proposta')
    const dataCadastro = extractLabelText('Cadastro em')
    const dataBaseOrcamentos = extractLabelText('Data Base de Orçamentos')
    const dataPublicacao = extractLabelText('Data da Publicação')
    const objeto = $('b:contains("Objeto:")')
      .parent()
      .html()
      ?.split('<b>Objeto:</b>')[1]
      ?.split('<br>')[0]
      ?.trim()

    Object.assign(result, {
      tipo,
      regime,
      numeroIRP,
      numeroConvidados,
      quantidadeLicitantes,
      quantidadeHabilitados,
      dataPropostas,
      dataJulgamento,
      dataCadastro,
      dataBaseOrcamentos,
      dataPublicacao,
      objeto: objeto?.replace(/<br>/g, '')
    })
  }

  return result
}

const extractSegundaFase = $ => {
  const situacoes = []
  $('#fase2 table:first tbody tr').each((i, element) => {
    const $row = $(element)
    const situacao = {
      situacao: $row.find('td:nth-child(1)').text().trim(),
      justificativa: $row.find('td:nth-child(2)').text().trim(),
      data: $row.find('td:nth-child(3)').text().trim(),
      numeroEContas: $row.find('td:nth-child(4)').text().trim(),
      adicionadoPor: $row.find('td:nth-child(5)').text().trim(),
      ativo: $row.find('td:nth-child(6)').text().trim()
    }
    situacoes.push(situacao)
  })

  const habilitados = []
  $('#fase2 table:last tbody tr').each((i, element) => {
    const $row = $(element)
    const habilitado = {
      resultado: $row.find('td:nth-child(1)').text().trim(),
      licitante: $row.find('td:nth-child(2)').text().trim(),
      adicionadoPor: $row.find('td:nth-child(3)').text().trim(),
      aposRepublicacao: $row.find('td:nth-child(4)').text().trim(),
      renunciaPrazoRecursal: $row.find('td:nth-child(5)').text().trim(),
      registrouPresenca: $row.find('td:nth-child(6)').text().trim(),
      ativo: $row.find('td:nth-child(7)').text().trim()
    }
    habilitados.push(habilitado)
  })

  return {
    situacoes,
    habilitados
  }
}

const extractTerceiraFase = $ => {
  const contratos = []

  $('#contrato h3').each((i, element) => {
    const $contratoSection = $(element).next('.row')

    const contrato = {
      numero: $contratoSection
        .find('b:contains("Contrato:")')
        .next('span.label')
        .text()
        .trim(),
      contratado: $contratoSection
        .find('b:contains("Contratado:")')
        .parent()
        .text()
        .split(':')[1]
        ?.trim(),
      procedimento: $contratoSection
        .find('b:contains("Procedimento:")')
        .parent()
        .text()
        .split(':')[1]
        ?.trim(),
      valorContrato: $contratoSection
        .find('b:contains("Valor do contrato:")')
        .next('span.label')
        .text()
        .trim(),
      dataAssinatura: $contratoSection
        .find('b:contains("Data Assinatura:")')
        .parent()
        .text()
        .split(':')[1]
        ?.trim(),
      dataVigencia: $contratoSection
        .find('b:contains("Data Vigência:")')
        .parent()
        .text()
        .split(':')[1]
        ?.trim(),
      formaPagamento: $contratoSection
        .find('b:contains("Forma de pagamento:")')
        .parent()
        .text()
        .split(':')[1]
        ?.trim(),
      unidadeOrg: $contratoSection
        .find('b:contains("Unidade Org:")')
        .parent()
        .text()
        .split(':')[1]
        ?.trim(),
      numeroContratoExecucao: $contratoSection
        .find('b:contains("Número contrato execução:")')
        .parent()
        .text()
        .split(':')[1]
        ?.trim(),
      contratoPrincipal: $contratoSection
        .find('b:contains("Contrato principal:")')
        .parent()
        .text()
        .split(':')[1]
        ?.trim(),
      adicionadoPor: $contratoSection
        .find('b:contains("Adicionado por:")')
        .parent()
        .text()
        .split(':')[1]
        ?.trim(),
      ativo: $contratoSection
        .find('b:contains("Ativo:")')
        .next('span')
        .text()
        .trim()
    }

    contratos.push(contrato)
  })

  return contratos
}

const getProcedimentos = async () => {
  try {
    const formData = new FormData()
    formData.append('isestadual', '')
    formData.append('municipios', '1703701')
    formData.append('unidadegestora', '')
    formData.append('numprsadm', '')
    formData.append('anoprocessode', 'T')
    formData.append('descricaoObjeto', '')
    formData.append('tipodata', '')
    formData.append('databrinicio', '')
    formData.append('databrfim', '')
    formData.append('id', '')
    formData.append('cnpjcpf', '')
    formData.append('numprslictatorio', '')
    formData.append('anolicitatorio', 'T')

    const response = await axios.post(
      `${BASE_URL}/pesquisar/ListaProcedimento`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          Pragma: 'no-cache',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      }
    )

    return extractProcedimentosData(response.data)
  } catch (error) {
    console.error('Erro ao buscar procedimentos:', error)
    throw error
  }
}

const getProcedimentoById = async id => {
  try {
    const response = await axios.get(`${BASE_URL}/pesquisar/detalhes`, {
      params: { idProcedimento: id },
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        Pragma: 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    })

    const $ = cheerio.load(response.data)

    const dadosPrimeiraFase = extractPrimeiraFase($)
    const anexos = extractAnexos($)
    const dadosSegundaFase = extractSegundaFase($)
    const contratos = extractTerceiraFase($)

    return {
      id,
      dadosPrimeiraFase,
      anexos,
      dadosSegundaFase,
      contratos
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do procedimento:', error)
    throw error
  }
}

module.exports = {
  getProcedimentos,
  getProcedimentoById
}
