// Configuration for municipalities and their management units
const municipalities = {
  conceicaodotocantins: {
    code: '1705607', // Código correto do município conforme select
    name: 'Conceição do Tocantins',
    managementUnits: [
      {
        name: 'FUNDO MUNICIPAL DA EDUCAÇÃO DE CONCEIÇÃO DO TOCANTINS - 5 RELT',
        cnpj: '30767108000175'
      },
      {
        name: 'FUNDO MUNICIPAL DE ASSISTENCIA SOCIAL DE CONCEICAO DO TOCANTINS - 5 RELT',
        cnpj: '14888222000105'
      },
      {
        name: 'FUNDO MUNICIPAL DE SAÚDE DE CONCEIÇÃO DO TOCANTINS - 5 RELT',
        cnpj: '11419212000124'
      },
      {
        name: 'FUNDO MUNICIPAL DOS DIREITOS DA CRIANCA E DO ADOLESCENTE DE CONCEIÇÃO DO TOCANTINS - 5 RELT',
        cnpj: '52266633000140'
      },
      {
        name: 'PREFEITURA MUNICIPAL DE CONCEIÇÃO DO TOCANTINS - 5 RELT',
        cnpj: '01067149000150'
      }
    ]
  },
  cmconceicaodoto: {
    code: '1705607', // Mesmo código do município
    name: 'Conceição do Tocantins',
    managementUnits: [
      {
        name: 'CÂMARA MUNICIPAL DE CONCEIÇÃO DO TOCANTINS - 5 RELT',
        cnpj: '33261298000142'
      }
    ]
  }
}

module.exports = municipalities
