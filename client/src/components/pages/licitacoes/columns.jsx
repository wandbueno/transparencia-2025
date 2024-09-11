// Definição das colunas para o DataTable dos Itens Vencedores
const columnsItensVencedores = [
  { name: 'Lote/Item', selector: row => row.loteEItem, sortable: true, width: '10%' },
  { name: 'Produto', selector: row => row.produto, sortable: true, width: '20%'  },
  { name: 'Qtd', selector: row => row.quantidade, sortable: true, width: '6%'  },
  { name: 'Und', selector: row => row.unidade, sortable: true, width: '7%'  },
  { name: 'Fornecedor Vencedor', selector: row => row.fornecedor, sortable: true, width: '20%'  },
  { name: 'Valor Unitário', selector: row => row.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '13%'  },
  { name: 'Valor Total', selector: row => row.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%'  },
  { name: 'Adjudicada', selector: row => row.adjudicada, sortable: true, width: '12%'  }
];

// Definição das colunas para o DataTable dos Contratos
const columnsContratos = [
  { name: 'Número', selector: row => row.numero, sortable: true, width: '10%' },
  { name: 'Fornecedor', selector: row => row.nomeDoFornecedor, sortable: true, width: '30%'  },
  // { name: 'Objeto', selector: row => row.objeto, sortable: true, width: '40%' },
  { name: 'Data', selector: row => row.data, sortable: true, width: '20%'  },
  { name: 'Vigência', selector: row => row.vigencia, sortable: true, width: '20%'  },
  { name: 'Valor', selector: row => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '20%'  },
];

// Definição das colunas para o DataTable dos Empenhos
const columnsEmpenhos = [
  { name: 'Dotação Orçamentária', selector: row => row.classificacaoOrcamentaria, sortable: true, width: '13%' },
  { name: 'Número', selector: row => row.numero, sortable: true, width: '9%' },
  { name: 'Data', selector: row => row.data, sortable: true, width: '9%'  },
  { name: 'Fornecedor', selector: row => row.nomeDoFornecedor, sortable: true, width: '17%'  },
  { name: 'Empenho', selector: row => row.valorDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%'  },
  { name: 'Anulação', selector: row => row.valorDaAnulacaoDoEmpenho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%' },
  { name: 'Liquidação', selector: row => row.valorDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '12%'  },
  { name: 'Anulação Liquidação', selector: row => row.valorDaAnulacaoDaLiquidacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), sortable: true, width: '16%' },
];

// Definição das colunas para o DataTable dos Itens em Aberto
const columnsItensEmAberto = [
  { name: 'Lote e Item', selector: row => row.loteEItem, sortable: true },
  { name: 'Produto', selector: row => row.produto, sortable: true },
  { name: 'Unidade', selector: row => row.unidade, sortable: true },
  { name: 'Quantidade', selector: row => row.quantidade, sortable: true },

];

