const axios = require('axios')
const cheerio = require('cheerio')
const FormData = require('form-data')
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie')

const BASE_URL = 'https://app.tce.to.gov.br/lo_publico'

const cookieJar = new tough.CookieJar()
const client = wrapper(
  axios.create({
    jar: cookieJar,
    withCredentials: true
  })
)

// Função auxiliar para classificação de modalidade (deve estar no mesmo arquivo)
const classificarModalidade = tipoExecucao => {
  const lowerCaseTipo = tipoExecucao.toLowerCase()
  if (
    lowerCaseTipo.includes('dispensa') ||
    lowerCaseTipo.includes('inexigibilidade') ||
    lowerCaseTipo.includes('chamamento') ||
    lowerCaseTipo.includes('credenciamento')
  ) {
    return 'Modalidade 1'
  }
  return 'Modalidade 2'
}
// Otimização de seletores Cheerio
const optimizeSelectors = {
  UG: 'b:contains("UG:")',
  PROC_LICITATORIO: 'b:contains("Proc. Licitatório:")',
  LABEL_INFO: 'span.label-info',
  LABEL_WARNING: 'span.label-warning'
}

const extractProcedimentosData = html => {
  const $ = cheerio.load(html)
  const procedimentos = []

  $('table tbody tr').each((i, element) => {
    try {
      const $row = $(element)
      const $blockquote = $row.find('blockquote')

      // Função auxiliar para extração de texto com fallback
      const extractText = (selector, defaultValue = 'Não informado') => {
        const element = $blockquote.find(selector).first()
        let text = ''
        let nextNode = element[0]?.nextSibling
        while (nextNode && nextNode.nodeType !== 1) {
          if (nextNode.nodeType === 3) {
            text += nextNode.nodeValue
          }
          nextNode = nextNode.nextSibling
        }
        return (
          text
            .replace(/\n/g, ' ')
            .replace(/N° Proc\. Administrativo:/g, '')
            .trim()
            .replace(/\s+/g, ' ') || defaultValue
        )
      }

      const idProcedimento = $row.find('a').attr('href')?.split('=')[1]?.trim()
      const processoAdministrativo = $blockquote
        .find(optimizeSelectors.LABEL_INFO)
        .first()
        .text()
        .trim()

      // Função para determinar o tipo/modalidade
      const extractTipoModalidade = $row => {
        const $cell = $row.find('td:nth-child(2)')
        let tipoText = ''
        const ataSrpText = $cell.find('span.label-warning').text().trim()
        const labelText = $cell
          .find('span.label:not(.label-warning)')
          .text()
          .trim()

        if (labelText) {
          return labelText
        }

        const cellText = $cell.text().trim()
        if (cellText.includes('➤')) {
          const parts = cellText.split('➤').map(part => part.trim())
          const modalidade = parts[1].replace('ATA-SRP', '').trim()
          tipoText = `${modalidade}${ataSrpText ? ` ${ataSrpText}` : ''}`
        } else if (cellText.includes('Licitação')) {
          tipoText = cellText
            .replace('Licitação', '')
            .replace('➤', '')
            .replace('ATA-SRP', '')
            .trim()
          if (ataSrpText) tipoText += ` ${ataSrpText}`
        } else {
          tipoText = cellText || 'Não informado'
        }
        return tipoText
      }

      const procedimento = {
        id: idProcedimento || `N/I-${i}`,
        unidadeGestora: extractText('b:contains("UG:")')
          .split('N° Proc. Administrativo')[0]
          .trim(),
        processoAdministrativo,
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
        fases: $row
          .find('td:nth-child(5) span')
          .map((_, el) => $(el).text().trim())
          .get(),
        detalhesUrl: $row.find('a').attr('href') || '#',
        modalidade: classificarModalidade(extractTipoModalidade($row))
      }

      if (!procedimento.id || !procedimento.unidadeGestora) {
        throw new Error(`Dados incompletos na linha ${i}`)
      }
      procedimentos.push(procedimento)
    } catch (error) {
      console.error(`Erro ao processar linha ${i}:`, error.message)
    }
  })

  console.log(`Extraídos ${procedimentos.length} procedimentos desta página`)
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
  const extractLabelText = (label, parentSelector = '.panel-body') => {
    const element = $(`${parentSelector} b:contains("${label}:")`)
    if (!element.length) return ''
    const text = element
      .parent()
      .html()
      ?.split(`<b>${label}:</b>`)[1]
      ?.split(/<b>|<br>/)[0]
      ?.trim()
    return text || ''
  }

  const unidadeGestora = $('dl dd h4.text-success').text().trim()
  const cnpj = $('dl span.badge').text().trim()
  const numeroSicap = $('span.label-info:first').text().trim()
  const processo = $('span.label-info').eq(1).text().trim()

  const isDispensa = $('span.label-info:contains("Dispensa")').length > 0
  const isInexigibilidade =
    $('span.label-danger:contains("Inexigibilidade")').length > 0
  const isLicitacao = $('span:contains("Licitação")').length > 0

  let tipoModalidade = ''
  if (isDispensa) {
    tipoModalidade = 'Dispensa'
  } else if (isInexigibilidade) {
    tipoModalidade = 'Inexigibilidade'
  } else if (isLicitacao) {
    tipoModalidade = 'Licitação'
  }

  const valorEstimado = $('b:contains("Valor estimado:")')
    .next('span.label-info')
    .text()
    .trim()

  const result = {
    unidadeGestora,
    cnpj,
    numeroSicap,
    processo,
    tipoModalidade,
    valorEstimado
  }

  if (isDispensa || isInexigibilidade) {
    const itemOuLote = extractLabelText('Item ou Lote')
    const dataCadastro = extractLabelText('Data de cadastro')
    const dataBaseOrcamento = extractLabelText('Data Base de orçamento')
    const dataPrimeiraPublicacao = extractLabelText('Data Primeira publicação')

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
    let allProcedimentos = []
    const limit = 25 // Quantidade de itens por página
    let totalPages = 1

    // Primeiro request para obter o total de registros
    const initialData = await fetchPage(1, limit)
    totalPages = Math.ceil(initialData.totalRegistros / limit)
    allProcedimentos = initialData.procedimentos

    console.log(
      `📌 Primeira página processada - ${initialData.procedimentos.length} itens`
    )
    console.log(`📊 Total de páginas estimado: ${totalPages}`)

    // Loop para percorrer todas as páginas a partir da segunda
    for (let page = 2; page <= totalPages; page++) {
      await new Promise(resolve => setTimeout(resolve, 3000)) // Pequeno delay para evitar bloqueios

      try {
        console.log(`🔄 Coletando página ${page}/${totalPages}...`)
        const pageData = await fetchPage(
          page,
          limit,
          initialData.totalRegistros
        )
        allProcedimentos = [...allProcedimentos, ...pageData.procedimentos]

        console.log(
          `✅ Página ${page} processada - ${pageData.procedimentos.length} itens`
        )
      } catch (error) {
        console.error(`❌ Erro ao processar a página ${page}:`, error.message)
        throw error
      }
    }

    console.log(
      `🎉 Scraping completo! Total de registros coletados: ${allProcedimentos.length}`
    )
    return allProcedimentos
  } catch (error) {
    console.error('❌ Erro crítico:', {
      message: error.message,
      stack: error.stack
    })
    throw new Error('Falha ao coletar todas as páginas')
  }
}

const fetchPage = async (page, limit, totalRegistrosFromFirstPage = null) => {
  try {
    const formData = new FormData()

    // Parâmetros fixos da requisição
    const formFields = {
      isestadual: '',
      municipios: '1703701',
      unidadegestora: '',
      numprsadm: '',
      anoprocessode: 'T',
      descricaoObjeto: '',
      tipodata: '',
      databrinicio: '',
      databrfim: '',
      id: '',
      cnpjcpf: '',
      numprslictatorio: '',
      anolicitatorio: 'T'
    }

    Object.entries(formFields).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // Parâmetros de paginação
    const paginationParams = {
      tipoordenacao: 'procedimento',
      ordem: 'DESC',
      municipios: '1703701',
      page: page,
      limit: limit,
      start: (page - 1) * limit,
      municipio_nome: page === 1 ? {} : []
    }

    formData.append('data-filter', JSON.stringify(paginationParams))

    // Se for a partir da segunda página, adicionamos `type-new-page`
    if (page > 1 && totalRegistrosFromFirstPage) {
      formData.append('total-registros', String(totalRegistrosFromFirstPage))
      formData.append('type-new-page', 'next')
    }

    // Define o endpoint correto
    const endpoint =
      page === 1 ? '/pesquisar/ListaProcedimento' : '/pesquisar/NewPage'

    console.log(`🔎 Buscando página ${page} em: ${BASE_URL}${endpoint}`)
    console.log(
      `📊 Parâmetros enviados:`,
      JSON.stringify(paginationParams, null, 2)
    )

    const response = await axios.post(`${BASE_URL}${endpoint}`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 30000
    })

    const $ = cheerio.load(response.data)
    const totalRegistros = extractTotalRegistros($)

    console.log(`✅ Página ${page} carregada com sucesso!`)

    return {
      procedimentos: extractProcedimentosData(response.data),
      totalRegistros: totalRegistros
    }
  } catch (error) {
    console.error(`❌ Erro na página ${page}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data?.substring(0, 500)
    })
    throw error
  }
}

// Função para extrair o total de registros de forma robusta
const extractTotalRegistros = $ => {
  try {
    // 1. Tenta extrair via input oculto
    const hiddenInput = $('input#total-registros').val()
    if (hiddenInput) {
      console.log('Total via input oculto:', hiddenInput)
      return parseInt(hiddenInput)
    }

    // 2. Tenta extrair via texto do elemento .pagination-info
    const panelText = $('.pagination-info').text()
    console.log('Panel text:', panelText)
    // Exemplo esperado: "Exibindo 26 de 526 registros"
    const match = panelText.match(/de\s+([\d.]+)/i)
    if (match) {
      const total = parseInt(match[1].replace(/\./g, ''))
      console.log('Total extraído da pagination-info:', total)
      return total
    }

    // 3. Tenta extrair via os itens da paginação (ex: UL com class "pagination")
    const lastPageItem = $('.pagination li:nth-last-child(2)').text()
    if (lastPageItem) {
      const lastPage = parseInt(lastPageItem) || 1
      // Tenta pegar o valor do "limit" a partir de um <select> (caso exista)
      const perPage = parseInt($('select[name="limit"]').val()) || 25
      const total = lastPage * perPage
      console.log('Total extraído via paginação:', total)
      return total
    }

    // 4. Fallback: se não houver paginação, usa a quantidade de linhas da tabela
    const rows = $('table tbody tr').length
    if (rows) {
      console.log('Fallback: total de linhas da tabela:', rows)
      return rows
    }

    console.error('Total de registros não encontrado!')
    return 0
  } catch (error) {
    console.error('Erro na extração do total:', error)
    return 0
  }
}

const getProcedimentoById = async id => {
  try {
    await client.get(`${BASE_URL}/pesquisar/detalhes`, {
      params: { idProcedimento: id }
    })
    const response = await client.get(`${BASE_URL}/pesquisar/detalhes`, {
      params: { idProcedimento: id }
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
      contratos,
      sessionData: {
        cookies: cookieJar.getCookiesSync(BASE_URL).toString(),
        referer: `${BASE_URL}/pesquisar/detalhes?idProcedimento=${id}`
      }
    }
  } catch (error) {
    console.error('Erro na requisição de detalhes:', error)
    throw error
  }
}

module.exports = {
  getProcedimentos,
  getProcedimentoById
}
