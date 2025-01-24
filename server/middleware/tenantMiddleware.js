const tenants = require('../config/tenants')

const tenantMiddleware = (req, res, next) => {
  try {
    // Pega o tenant do header ou query parameter
    const tenantId =
      req.headers['x-tenant-id'] || req.query.tenant || 'conceicaodotocantins'

    const tenant = tenants[tenantId]
    if (!tenant) {
      return res.status(404).json({
        error: 'Tenant não encontrado',
        message: 'O tenant especificado não existe'
      })
    }

    // Validação de domínio
    const origin = req.get('origin')
    if (
      origin &&
      !tenant.allowed_domains.some(domain => origin.includes(domain))
    ) {
      return res.status(403).json({
        error: 'Domínio não autorizado',
        message: 'Este domínio não tem permissão para acessar este tenant'
      })
    }

    // Validação das credenciais do tenant
    if (!tenant.api_url || !tenant.token || !tenant.cliente_integrado) {
      console.error(`Configurações incompletas para o tenant ${tenantId}`)
      return res.status(500).json({
        error: 'Configuração inválida',
        message: 'Configurações do tenant estão incompletas'
      })
    }

    // Adiciona as configurações do tenant ao request
    req.tenant = tenant
    next()
  } catch (error) {
    console.error('Erro no middleware de tenant:', error)
    res.status(500).json({
      error: 'Erro interno',
      message: 'Ocorreu um erro ao processar a requisição'
    })
  }
}

module.exports = tenantMiddleware
