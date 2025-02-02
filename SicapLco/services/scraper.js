const axios = require('axios')
const cheerio = require('cheerio')
const FormData = require('form-data')
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie')
const municipalities = require('../config/municipalities')

const BASE_URL = 'https://app.tce.to.gov.br/lo_publico'

const cookieJar = new tough.CookieJar()
const client = wrapper(
  axios.create({
    jar: cookieJar,
    withCredentials: true
  })
)

// Função auxiliar para classificação de modalidade
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

// Função para verificar se a unidade gestora pertence ao tenant atual
const isValidManagementUnit = (ugText, tenant) => {
  if (!tenant || !municipalities[tenant]) {
    console.log(`⚠️ Tenant inválido: ${tenant}`)
    return false
  }

  const managementUnits = municipalities[tenant].managementUnits
  const normalizedUgText = ugText
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  console.log(`🔍 Verificando UG: ${normalizedUgText}`)

  for (const unit of managementUnits) {
    const normalizedUnitName = unit.name
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    console.log(`📋 Comparando com: ${normalizedUnitName}`)

    if (normalizedUgText.includes(normalizedUnitName)) {
      console.log(`✅ Match encontrado!`)
      return true
    }
  }

  console.log(`❌ Nenhum match encontrado`)
  return false
}

const extractProcedimentosData = (html, tenant) => {
  const $ = cheerio.load(html)
  const procedimentos = []
  let totalProcessados = 0
  let totalValidos = 0

  $('table tbody tr').each((i, element) => {
    try {
      totalProcessados++
      const $row = $(element)
      const $blockquote = $row.find('blockquote')

      // Extrai o texto da unidade gestora
      const ugText = $blockquote
        .find('b:contains("UG:")')
        .parent()
        .text()
        .trim()

      // Verifica se a unidade gestora pertence ao tenant atual
      if (!isValidManagementUnit(ugText, tenant)) {
        return // Pula este item se não pertencer ao tenant
      }

      totalValidos++

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
        return text.replace(/\n/g, ' ').trim() || defaultValue
      }

      const idProcedimento = $row.find('a').attr('href')?.split('=')[1]?.trim()
      const processoAdministrativo = $blockquote
        .find('span.label-info')
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
        unidadeGestora: ugText.split('N° Proc. Administrativo')[0].trim(),
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
        console.log(`⚠️ Dados incompletos na linha ${i}`)
        return
      }

      procedimentos.push(procedimento)
    } catch (error) {
      console.error(`❌ Erro ao processar linha ${i}:`, error.message)
    }
  })

  console.log(
    `✅ Página processada - ${totalValidos} itens válidos de ${totalProcessados} totais`
  )
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
    const tenant = process.env.TENANT_ID
    let failedPages = []
    let totalRegistros = 0

    if (!tenant || !municipalities[tenant]) {
      throw new Error('Tenant não configurado ou inválido')
    }

    const municipalityCode = municipalities[tenant].code

    // Primeiro request para obter o total de registros
    console.log('🔄 Buscando primeira página para obter total de registros...')
    const initialData = await fetchPage(1, limit, municipalityCode)
    totalRegistros = initialData.totalRegistros
    const totalPages = Math.ceil(totalRegistros / limit)

    console.log(`📊 Total de registros: ${totalRegistros}`)
    console.log(`📊 Total de páginas: ${totalPages}`)

    allProcedimentos = initialData.procedimentos

    // Loop para percorrer todas as páginas a partir da segunda
    for (let page = 2; page <= totalPages; page++) {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000)) // Delay entre requisições

        console.log(`🔄 Coletando página ${page}/${totalPages}...`)
        const pageData = await fetchPage(
          page,
          limit,
          municipalityCode,
          totalRegistros
        )

        if (pageData.procedimentos.length > 0) {
          allProcedimentos = [...allProcedimentos, ...pageData.procedimentos]
          console.log(
            `✅ Página ${page} processada - ${pageData.procedimentos.length} itens`
          )
        } else {
          console.log(
            `⚠️ Página ${page} sem dados - Adicionando à lista de retry`
          )
          failedPages.push(page)
        }
      } catch (error) {
        console.error(`❌ Erro ao processar a página ${page}:`, error.message)
        failedPages.push(page)
        await new Promise(resolve => setTimeout(resolve, 5000)) // Delay maior após erro
      }
    }

    // Tenta recuperar páginas que falharam
    if (failedPages.length > 0) {
      console.log(
        `🔄 Tentando recuperar ${failedPages.length} páginas que falharam...`
      )
      for (const page of failedPages) {
        try {
          await new Promise(resolve => setTimeout(resolve, 5000))
          console.log(`🔄 Tentando recuperar página ${page}...`)
          const pageData = await fetchPage(
            page,
            limit,
            municipalityCode,
            totalRegistros
          )
          if (pageData.procedimentos.length > 0) {
            allProcedimentos = [...allProcedimentos, ...pageData.procedimentos]
            console.log(`✅ Página ${page} recuperada com sucesso`)
          }
        } catch (error) {
          console.error(`❌ Falha definitiva na página ${page}:`, error.message)
        }
      }
    }

    // Remove duplicatas
    const uniqueProcedimentos = [
      ...new Map(allProcedimentos.map(item => [item.id, item])).values()
    ]

    console.log(
      `⚠️ Atenção: Coletados ${uniqueProcedimentos.length} registros de ${totalRegistros} esperados`
    )

    return uniqueProcedimentos
  } catch (error) {
    console.error('❌ Erro crítico:', {
      message: error.message,
      stack: error.stack
    })
    throw new Error('Falha ao coletar todas as páginas')
  }
}

const fetchPage = async (
  page,
  limit,
  municipalityCode,
  totalRegistrosFromFirstPage = null
) => {
  try {
    const formData = new FormData()
    const tenant = process.env.TENANT_ID

    // Parâmetros fixos da requisição
    const formFields = {
      isestadual: '',
      municipios: municipalityCode,
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
      municipios: municipalityCode,
      page: page,
      limit: limit,
      start: (page - 1) * limit,
      municipio_nome: page === 1 ? {} : []
    }

    formData.append('data-filter', JSON.stringify(paginationParams))

    // Se for a partir da segunda página, adicionamos os parâmetros necessários
    if (page > 1) {
      if (!totalRegistrosFromFirstPage) {
        throw new Error('Total de registros não fornecido para paginação')
      }
      formData.append('total-registros', String(totalRegistrosFromFirstPage))
      formData.append('type-new-page', 'next')
    }

    // Define o endpoint correto
    const endpoint =
      page === 1 ? '/pesquisar/ListaProcedimento' : '/pesquisar/NewPage'

    // Adiciona headers específicos para simular um navegador real
    const headers = {
      ...formData.getHeaders(),
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'text/html, */*; q=0.01',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Referer: `${BASE_URL}/pesquisar/ListaProcedimento`
    }

    // Log detalhado da requisição
    console.log(`🔎 Buscando página ${page} em: ${BASE_URL}${endpoint}`)
    console.log(
      `📊 Parâmetros enviados:`,
      JSON.stringify(paginationParams, null, 2)
    )

    // Faz a requisição com retry em caso de erro
    let retries = 3
    let response
    while (retries > 0) {
      try {
        response = await axios.post(`${BASE_URL}${endpoint}`, formData, {
          headers,
          timeout: 30000
        })
        break
      } catch (error) {
        retries--
        if (retries === 0) throw error
        console.log(
          `⚠️ Tentativa falhou, tentando novamente... (${retries} tentativas restantes)`
        )
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }

    const $ = cheerio.load(response.data)
    const totalRegistros = extractTotalRegistros($)

    // Verifica se a página retornou dados
    const rows = $('table tbody tr').length
    if (rows === 0 && page === 1) {
      console.log('⚠️ Atenção: Primeira página sem dados')
      return { procedimentos: [], totalRegistros: 0 }
    }

    console.log(`✅ Página ${page} carregada com sucesso! (${rows} linhas)`)

    // Aguarda um intervalo antes de retornar para evitar sobrecarga
    await new Promise(resolve => setTimeout(resolve, 2000))

    return {
      procedimentos: extractProcedimentosData(response.data, tenant),
      totalRegistros: totalRegistros
    }
  } catch (error) {
    console.error(`❌ Erro na página ${page}:`, {
      message: error.message,
      status: error.response?.status
    })
    throw new Error(`Falha na recuperação da página ${page}: ${error.message}`)
  }
}

const extractTotalRegistros = $ => {
  try {
    // Tenta extrair do texto de paginação
    const paginationText = $('.pagination-info').text().trim()
    const totalMatch = paginationText.match(/de\s+(\d+(?:\.\d+)?)\s+registros/)
    if (totalMatch) {
      const total = parseInt(totalMatch[1].replace(/\./g, ''))
      console.log(`📊 Total de registros (via texto): ${total}`)
      return total
    }

    // Tenta extrair do input hidden
    const hiddenTotal = $('input#total-registros').val()
    if (hiddenTotal) {
      const total = parseInt(hiddenTotal)
      console.log(`📊 Total de registros (via input): ${total}`)
      return total
    }

    // Tenta extrair da última página
    const lastPage = $('.pagination li:not(.next):last').text().trim()
    if (lastPage && !isNaN(lastPage)) {
      const total = parseInt(lastPage) * 25 // 25 registros por página
      console.log(`📊 Total de registros (via paginação): ${total}`)
      return total
    }

    // Se nenhum método funcionar, conta as linhas da tabela
    const rowCount = $('table tbody tr').length
    console.log(`📊 Total de registros (via contagem): ${rowCount}`)
    return rowCount
  } catch (error) {
    console.error('❌ Erro ao extrair total de registros:', error)
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
