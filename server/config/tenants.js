// Configuração dos tenants
const tenants = {
  conceicaodotocantins: {
    name: 'Conceição do Tocantins',
    api_url: process.env.SERVER_CONCEICAO,
    token: process.env.TOKEN_CONCEICAO,
    cliente_integrado: process.env.CLIENTE_INTEGRADO,
    allowed_domains: ['conceicaodotocantins.to.gov.br', 'localhost']
  },
  camaraconceicaodotocantins: {
    name: 'Câmara de Conceição do Tocantins',
    api_url: process.env.SERVER_CM_CONCEICAO,
    token: process.env.TOKEN_CM_CONCEICAO,
    cliente_integrado: process.env.CLIENTE_INTEGRADO,
    allowed_domains: ['conceicaodotocantins.to.leg.br', 'localhost']
  }
  // arraias: {
  //   name: 'Arraias',
  //   api_url: process.env.SERVER_ARRAIAS,
  //   token: process.env.TOKEN_ARRAIAS,
  //   cliente_integrado: process.env.CLIENTE_INTEGRADO,
  //   allowed_domains: ['arraias.to.gov.br', 'localhost']
  // },
  // brejinhodenazare: {
  //   name: 'nazare',
  //   api_url: process.env.SERVER_NAZARE,
  //   token: process.env.TOKEN_NAZARE,
  //   cliente_integrado: process.env.CLIENTE_INTEGRADO,
  //   allowed_domains: ['brejinhodenazare.to.gov.br', 'localhost']
  // }
}

// Validação das configurações dos tenants
Object.entries(tenants).forEach(([key, tenant]) => {
  const requiredFields = ['api_url', 'token', 'cliente_integrado']
  requiredFields.forEach(field => {
    if (!tenant[field]) {
      console.error(`Erro: ${field} não configurado para o tenant ${key}`)
      process.exit(1)
    }
  })
})

module.exports = tenants
