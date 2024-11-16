import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDollarSign,
  faArrowDown,
  faUsers,
  faGavel,
  faFileInvoice,
  faShoppingCart,
  faBook,
  faChartLine,
  faHeadset,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { config } from '../../../assets/config'

// Estrutura completa dos menus extraída do NewMegaMenu.jsx
export const menuStructure = {
  receitas: {
    titulo: 'Receitas e Despesas',
    icon: faDollarSign,
    cor: '#28a745',
    links: [
      {
        nome: 'Receita Prevista e Arrecadada',
        path: '/receitas',
        icon: faChartLine,
        keywords: [
          'arrecadação',
          'previsão',
          'receitas municipais',
          'entrada',
          'dinheiro público',
          'tributos',
          'impostos',
          'taxas',
          'IPTU',
          'ISS',
          'arrecadação municipal',
          'receita corrente',
          'receita capital',
          'arrecadação impostos',
          'receita própria',
          'recursos municipais',
          'quanto foi arrecadado',
          'receita realizada',
          'arrecadação tributos',
          'receita total',
          'previsão orçamentária'
        ]
      },
      {
        nome: 'Balanço Orçamentário',
        path: '/balanco',
        icon: faFileInvoice,
        keywords: [
          'orçamento',
          'balanço',
          'contas públicas',
          'prestação de contas',
          'execução orçamentária',
          'demonstrativo orçamentário',
          'resultado orçamentário',
          'demonstrações contábeis',
          'relatório orçamentário',
          'gestão orçamentária',
          'contas anuais',
          'exercício financeiro',
          'balanço receitas despesas',
          'resultado execução',
          'déficit',
          'superávit'
        ]
      },
      {
        nome: 'Extra Orçamentária',
        path: '/extra-orcamentaria',
        icon: faDollarSign,
        keywords: [
          'recursos',
          'extra orçamento',
          'despesas extras',
          'receitas extras',
          'movimentação extra',
          'recursos extraorçamentários',
          'depósitos',
          'cauções',
          'consignações',
          'valores extraorçamentários',
          'movimentação financeira',
          'recursos fora orçamento',
          'valores retidos',
          'retenções',
          'depósitos terceiros'
        ]
      },
      {
        nome: 'Relatório de Balanço Anual',
        path: '/balanco-anual',
        icon: faFileInvoice,
        keywords: [
          'Qual foi o resultado do fechamento das contas anuais do município',
          'Comparativo da Receita Prevista com a Realizada',
          'Comparativo da Despesa Orçada com a Realizada',
          'Balanço Orçamentário',
          'Balanço Financeiro',
          'Balanço Patrimonial',
          'Demonstrativos das Variações Patrimoniais',
          'prestação contas anual',
          'resultado anual',
          'demonstrações anuais',
          'relatório anual',
          'contas do exercício'
        ]
      },
      {
        nome: 'Relatório PCASP',
        path: '/pcasp',
        icon: faFileInvoice,
        keywords: [
          'Quais foram as receitas e despesas previstas em confronto com as realizadas para avaliação da gestão orçamentária?',
          'Balanço Orçamentário - PCASP',
          'Balanço Financeiro - PCASP',
          'Balanço Patrimonial - PCASP',
          'Demonstrativos das variações patrimoniais - PCASP',
          'plano de contas',
          'contabilidade aplicada',
          'demonstrações PCASP',
          'normas contábeis',
          'contabilidade pública'
        ]
      },
      {
        nome: 'Informações Consolidadas',
        path: '/informacoes-consolidadas',
        icon: faChartLine,
        keywords: [
          'dados consolidados',
          'resumo geral',
          'visão geral',
          'informações gerais',
          'consolidação dados',
          'relatório consolidado',
          'balanço consolidado',
          'demonstrativos consolidados'
        ]
      },
      {
        nome: 'Restos a Pagar',
        path: '/restos-a-pagar',
        icon: faDollarSign,
        keywords: [
          'RAP',
          'despesas não pagas',
          'dívidas anteriores',
          'restos processados',
          'restos não processados',
          'pagamentos pendentes',
          'dívidas exercício anterior',
          'despesas inscritas RAP'
        ]
      },
      {
        nome: 'Ordem Cronológica de Pagamentos',
        path: '/ordem-cronologica-de-pagamentos',
        icon: faArrowDown,
        keywords: [
          'fila pagamentos',
          'sequência pagamentos',
          'ordem pagamento',
          'cronologia',
          'lista pagamentos',
          'prioridade pagamentos',
          'ordem credores',
          'sequência credores'
        ]
      },
      {
        nome: 'Despesa/Empenho',
        path: '/despesas-empenho',
        icon: faArrowDown,
        keywords: [
          'empenho',
          'nota empenho',
          'despesas empenhadas',
          'gastos empenhados',
          'reserva orçamentária',
          'comprometimento orçamento',
          'empenho despesa',
          'autorização despesa'
        ]
      },
      {
        nome: 'Pagamentos',
        path: '/pagamentos',
        icon: faDollarSign,
        keywords: [
          'pagamentos realizados',
          'despesas pagas',
          'quitação',
          'desembolso',
          'pagamento fornecedores',
          'ordem bancária',
          'comprovante pagamento',
          'valores pagos'
        ]
      },
      {
        nome: 'Liquidação',
        path: '/liquidacoes',
        icon: faFileInvoice,
        keywords: [
          'liquidação despesa',
          'verificação direito',
          'despesas liquidadas',
          'fase liquidação',
          'comprovação serviço',
          'ateste',
          'conferência',
          'verificação entrega'
        ]
      },
      {
        nome: 'Despesas Fixadas',
        path: '/despesas-fixadas',
        icon: faFileInvoice,
        keywords: [
          'orçamento previsto',
          'previsão despesas',
          'dotação orçamentária',
          'despesas autorizadas',
          'planejamento despesas',
          'limite despesas',
          'orçamento aprovado',
          'créditos orçamentários'
        ]
      },
      {
        nome: 'Despesa Sintética',
        path: '/despesa-sintetica',
        icon: faFileInvoice,
        keywords: [
          'resumo despesas',
          'visão geral despesas',
          'despesas resumidas',
          'síntese gastos',
          'consolidado despesas',
          'quadro despesas',
          'demonstrativo sintético',
          'resumo gastos'
        ]
      },
      {
        nome: 'Renúncias Fiscais',
        path: '/renuncias-fiscais',
        icon: faDollarSign,
        keywords: [
          'isenção fiscal',
          'benefícios fiscais',
          'incentivos fiscais',
          'desconto tributos',
          'redução impostos',
          'renúncia receita',
          'isenção tributos',
          'benefícios tributários'
        ]
      },
      {
        nome: 'Desoneração',
        path: '/desoneracao',
        icon: faDollarSign,
        keywords: [
          'redução tributos',
          'isenção impostos',
          'benefício fiscal',
          'alívio fiscal',
          'desoneração tributária',
          'redução carga',
          'diminuição impostos',
          'incentivo fiscal'
        ]
      },
      {
        nome: 'Repasse ou transferência de Recursos',
        path: '/repasse-ou-transferencia',
        icon: faDollarSign,
        keywords: [
          'transferência recursos',
          'repasse verbas',
          'envio recursos',
          'transferência dinheiro',
          'repasse financeiro',
          'destinação recursos',
          'transferência valores',
          'movimentação recursos'
        ]
      },
      {
        nome: 'Transferências Voluntárias Realizadas',
        path: '/transferencias-voluntarias-realizadas',
        icon: faDollarSign,
        keywords: [
          'repasses voluntários',
          'transferências feitas',
          'recursos enviados',
          'convênios realizados',
          'repasses efetuados',
          'transferências concedidas',
          'recursos transferidos',
          'repasses executados'
        ]
      },
      {
        nome: 'Transferências Voluntárias Recebidas',
        path: '/transferencias-voluntarias-recebidas',
        icon: faDollarSign,
        keywords: [
          'recursos recebidos',
          'transferências recebidas',
          'repasses recebidos',
          'convênios recebidos',
          'verbas recebidas',
          'recursos obtidos',
          'transferências obtidas',
          'repasses conquistados'
        ]
      },
      {
        nome: 'Dívida Ativa e Cobranças',
        path: '/divida-ativa',
        icon: faDollarSign,
        keywords: [
          'dívida ativa',
          'cobrança tributos',
          'débitos município',
          'execução fiscal',
          'créditos município',
          'dívida tributária',
          'inadimplência',
          'recuperação créditos'
        ]
      }
    ]
  },
  orgaos: {
    titulo: 'Órgãos e Servidores',
    icon: faUsers,
    cor: '#6610f2',
    links: [
      {
        nome: 'Servidores',
        path: '/servidores',
        icon: faUsers,
        keywords: [
          'funcionários',
          'servidores públicos',
          'folha de pagamento',
          'salários',
          'remuneração',
          'concursados',
          'efetivos',
          'comissionados',
          'contratados',
          'quadro de pessoal'
        ]
      },
      {
        nome: 'Terceirizados',
        path: '/terceirizados',
        icon: faUsers,
        keywords: [
          'prestadores de serviço',
          'funcionários terceirizados',
          'empresas terceirizadas',
          'contratos de terceirização',
          'serviços terceirizados',
          'pessoal terceirizado'
        ]
      },
      {
        nome: 'Estagiários',
        path: '/estagiarios',
        icon: faUsers,
        keywords: [
          'programa de estágio',
          'bolsa estágio',
          'estudantes',
          'estagiários municipais',
          'contratação de estagiários',
          'vagas de estágio'
        ]
      },
      {
        nome: 'Concursos e Processos Seletivos',
        path: '/concurso-processo-seletivo',
        icon: faUsers,
        keywords: [
          'edital',
          'seleção pública',
          'concurso público',
          'processo seletivo',
          'seleção de pessoal',
          'vagas',
          'oportunidades',
          'contratação',
          'seleção simplificada',
          'teste seletivo'
        ]
      },
      {
        nome: 'Estrutura de Remuneração',
        path: '/estrutura-de-remuneracao',
        icon: faUsers,
        keywords: [
          'tabela salarial',
          'plano de cargos e salários',
          'vencimentos',
          'remuneração dos servidores',
          'salários',
          'gratificações',
          'benefícios',
          'plano de carreira'
        ]
      },
      {
        nome: 'Estabelecimentos e Profissionais da Saúde',
        path: '/saude',
        icon: faUsers,
        keywords: [
          'unidades de saúde',
          'postos de saúde',
          'hospitais',
          'médicos',
          'enfermeiros',
          'profissionais da saúde',
          'rede municipal de saúde',
          'atendimento médico',
          'equipe de saúde'
        ]
      },
      {
        nome: 'Diárias Pagas a Servidores',
        path: '/diarias',
        icon: faUsers,
        keywords: [
          'pagamento de diárias',
          'viagens',
          'despesas com diárias',
          'valores de diárias',
          'deslocamentos',
          'viagens a serviço',
          'prestação de contas de diárias'
        ]
      },
      {
        nome: 'Liquidações de Diárias',
        path: '/liquidacoes',
        icon: faUsers,
        keywords: [
          'pagamentos de diárias',
          'liquidação de despesas com diárias',
          'comprovação de diárias',
          'prestação de contas',
          'relatório de viagem'
        ]
      },
      {
        nome: 'Tabela com Valores de Diárias',
        path: '/tabela-explicativa-de-valores-de-diarias',
        icon: faUsers,
        keywords: [
          'valores das diárias',
          'tabela de diárias',
          'quanto custa cada diária',
          'regulamentação de diárias',
          'valores por cargo',
          'diárias por função',
          'legislação de diárias'
        ]
      }
    ]
  },
  politicas: {
    titulo: 'Planejamento e Políticas Públicas',
    icon: faGavel,
    cor: '#fd7e14',
    links: [
      {
        nome: 'Acompanhamento de Obras',
        path: '/obras',
        icon: faGavel,
        keywords: [
          'obras públicas',
          'construção',
          'reforma',
          'infraestrutura',
          'andamento obras',
          'execução obras'
        ]
      },
      {
        nome: 'Relação de Obras paralisadas',
        path: '/obras-paralisadas',
        icon: faGavel,
        keywords: [
          'obras paradas',
          'construções interrompidas',
          'obras suspensas',
          'paralisação'
        ]
      },
      {
        nome: 'Metas e Riscos Fiscais',
        path: '/metas-e-riscos-fiscais',
        icon: faGavel,
        keywords: [
          'planejamento fiscal',
          'LDO',
          'metas orçamentárias',
          'riscos orçamentários',
          'gestão fiscal'
        ]
      },
      {
        nome: 'Julgamento de Contas pelo Legislativo',
        path: '/julgamento-de-contas',
        icon: faGavel,
        keywords: [
          'prestação contas câmara',
          'aprovação contas',
          'julgamento vereadores',
          'parecer contas'
        ]
      },
      {
        nome: 'Prestação de Contas e Parecer Prévio do TCE',
        path: '/prestacao-de-contas',
        icon: faGavel,
        keywords: [
          'tribunal contas',
          'TCE',
          'parecer TCE',
          'prestação contas anual',
          'contas anuais'
        ]
      },
      {
        nome: 'Incentivos a Projetos Culturais / Esportivos',
        path: '/incentivos-a-projetos-culturais',
        icon: faGavel,
        keywords: [
          'cultura',
          'esporte',
          'projetos culturais',
          'incentivo esporte',
          'fomento cultura',
          'apoio projetos'
        ]
      },
      {
        nome: 'Planos Municipal',
        path: '/planos',
        icon: faGavel,
        keywords: [
          'plano diretor',
          'planejamento municipal',
          'planos estratégicos',
          'desenvolvimento municipal',
          'plano plurianual'
        ]
      }
    ]
  },
  fiscal: {
    titulo: 'Responsabilidade Fiscal',
    icon: faFileInvoice,
    cor: '#20c997',
    links: [
      {
        nome: 'Relatório Anual de Gestão ou Atividades',
        path: '/relatorio-anual-de-gestao',
        icon: faFileInvoice,
        keywords: [
          'relatório gestão',
          'prestação contas anual',
          'atividades anuais',
          'resultados gestão',
          'balanço anual',
          'gestão municipal'
        ]
      },
      {
        nome: 'Relatório do Controle Interno',
        path: '/relatorio-do-controle-interno',
        icon: faFileInvoice,
        keywords: [
          'controle interno',
          'auditoria interna',
          'fiscalização',
          'conformidade',
          'relatório controlador',
          'controladoria'
        ]
      }
    ]
  },
  licitacoes: {
    titulo: 'Licitações e Contratos',
    icon: faShoppingCart,
    cor: '#dc3545',
    links: [
      {
        nome: 'Procedimentos Licitatórios',
        path: '/licitacoes',
        icon: faShoppingCart,
        keywords: [
          'licitação',
          'licitações',
          'pregão',
          'tomada preço',
          'concorrência',
          'edital',
          'processo licitatório',
          'compras públicas'
        ]
      },
      {
        nome: 'Dispensas e Inexigibilidades',
        path: '/dispensas-e-inexigibilidades',
        icon: faShoppingCart,
        keywords: [
          'dispensa licitação',
          'inexigibilidade',
          'contratação direta',
          'compra direta',
          'emergencial'
        ]
      },
      {
        nome: 'Contratos e Aditivos',
        path: '/contratos',
        icon: faShoppingCart,
        keywords: [
          'contrato',
          'termo aditivo',
          'prorrogação contrato',
          'alteração contratual',
          'vigência contrato'
        ]
      },
      {
        nome: 'Sanções Administrativas',
        path: '/sancoes-administrativas',
        icon: faShoppingCart,
        keywords: [
          'penalidade',
          'multa',
          'suspensão',
          'impedimento licitar',
          'punição empresa',
          'sanção fornecedor'
        ]
      },
      {
        nome: 'Patrimônio e Almoxarifado',
        path: '/patrimonio-e-almoxarifado',
        icon: faShoppingCart,
        keywords: [
          'bens públicos',
          'estoque',
          'material',
          'inventário',
          'patrimônio municipal',
          'almoxarifado'
        ]
      },
      {
        nome: 'Fiscais de Contratos',
        path: '/lista-de-fiscal-de-contrato',
        icon: faShoppingCart,
        keywords: [
          'Fiscal de contratos',
          'Fiscal do contrato',
          'Fiscais dos contratos Vigentes',
          'Fiscais dos contratos Encerrados'
        ]
      },
      {
        nome: 'Ordens de Fornecimentos',
        path: '/ordem-de-fornecimento',
        icon: faShoppingCart,
        keywords: [
          'Ordem de Fornecimento',
          'Compras',
          'Relação de Compras',
          'Relacao de Compras',
          'Fornecedor da Compra ou Serviço'
        ]
      }
    ]
  },
  legislacao: {
    titulo: 'Legislação e Publicação',
    icon: faBook,
    cor: '#6f42c1',
    links: [
      {
        nome: 'Leis Municipais',
        path: '/leis',
        icon: faBook,
        keywords: [
          'legislação municipal',
          'leis',
          'decretos',
          'portarias',
          'normas municipais',
          'atos normativos'
        ]
      },
      {
        nome: 'Parceiras e Acordos Firmados',
        path: '/acordos',
        icon: faBook,
        keywords: [
          'parcerias',
          'acordos',
          'termos cooperação',
          'convênios',
          'parcerias público privadas',
          'cooperação técnica'
        ]
      },
      {
        nome: 'Convênio/Pré-Convênio Celebrados',
        path: '/convenio-pre-convenio-celebrados',
        icon: faBook,
        keywords: [
          'convênios',
          'termos convênio',
          'acordos celebrados',
          'parcerias firmadas',
          'contratos convênio'
        ]
      },
      {
        nome: 'Emendas Parlamentares',
        path: '/emendas-parlamentares',
        icon: faBook,
        keywords: [
          'emendas',
          'recursos parlamentares',
          'verbas parlamentares',
          'deputados',
          'senadores'
        ]
      }
    ]
  },
  ouvidoria: {
    titulo: 'Ouvidoria/SIC',
    icon: faHeadset,
    cor: '#0dcaf0',
    links: [
      {
        nome: 'Rol de Informações',
        path: '/rol-de-informacoes',
        icon: faHeadset,
        keywords: [
          'informações classificadas',
          'acesso informação',
          'LAI',
          'transparência passiva',
          'pedido informação',
          'solicitação informação',
          'e-SIC'
        ]
      }
    ]
  }
}

export const legislacaoTransparencia = [
  {
    nome: 'Lei Complementar nº 101/2000',
    descricao: 'Lei de Responsabilidade Fiscal (LRF)',
    link: 'http://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm'
  },
  {
    nome: 'Lei Complementar nº 131/2009',
    descricao: 'Lei da Transparência',
    link: 'http://www.planalto.gov.br/ccivil_03/leis/lcp/lcp131.htm'
  },
  {
    nome: 'Lei nº 12.527/2011',
    descricao: 'LAI - Lei de Acesso à Informação',
    link: 'http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm'
  },
  {
    nome: 'Lei nº 431/2016',
    descricao: 'Regulamentação Municipal da LAI',
    link: 'https://drive.google.com/file/d/1mymZBc1RvP84tvmY6xGyJtOqYBywPaMB/view?usp=sharing'
  }
]

export const linksUteis = [
  {
    nome: 'Tribunal de Contas dos Municípios',
    descricao: 'Portal da Transparência do Governo Federal',
    link: 'https://www.tceto.tc.br/'
  },
  {
    nome: 'Radar da Transparência Pública',
    descricao: 'Levantamento nacional de transparência pública',
    link: 'https://radardatransparencia.atricon.org.br/radar-da-transparencia-publica.html'
  },
  {
    nome: `Câmara de ${config.geral.cidade}`,
    descricao: 'Câmara de Vereadores',
    link: 'https://conceicaodotocantins.to.leg.br/'
  }
]
