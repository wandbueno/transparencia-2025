// Configuração dos tenants
const tenants = {
  conceicaodotocantins: {
    name: 'Conceição do Tocantins',
    api_url: process.env.SERVER_CONCEICAO,
    token: process.env.TOKEN_CONCEICAO,
    cliente_integrado: process.env.CLIENTE_INTEGRADO,
    allowed_domains: ['conceicaodotocantins.to.gov.br', 'localhost']
  }
  // arraias: {
  //   name: 'Arraias',
  //   api_url: process.env.SERVER_ARRAIAS,
  //   token: process.env.TOKEN_ARRAIAS,
  //   cliente_integrado: process.env.CLIENTE_INTEGRADO_ARRAIAS,
  //   allowed_domains: ['arraias.to.gov.br', 'localhost']
  // },
  // santarosa: {
  //   name: 'Santa Rosa',
  //   api_url: process.env.SERVER_SANTAROSA,
  //   token: process.env.TOKEN_SANTAROSA,
  //   cliente_integrado: process.env.CLIENTE_INTEGRADO_SANTAROSA,
  //   allowed_domains: ['santarosa.to.gov.br', 'localhost']
  // },
  // brejinho: {
  //   name: 'Brejinho',
  //   api_url: process.env.SERVER_BREJINHO,
  //   token: process.env.TOKEN_BREJINHO,
  //   cliente_integrado: process.env.CLIENTE_INTEGRADO_BREJINHO,
  //   allowed_domains: ['brejinho.to.gov.br', 'localhost']
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
