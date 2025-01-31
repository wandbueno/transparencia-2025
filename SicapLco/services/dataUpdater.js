const { getProcedimentos } = require('./scraper')
const cache = require('./cache')

// Função auxiliar para padronizar o valor da modalidade
const padronizarModalidade = modalidade =>
  modalidade.toLowerCase().replace(/\s/g, '')

const updateData = async () => {
  try {
    console.log('Iniciando atualização de dados...')
    const start = Date.now()

    const data = await getProcedimentos()
    const modalidade1 = data.filter(
      p => padronizarModalidade(p.modalidade) === 'modalidade1'
    )
    const modalidade2 = data.filter(
      p => padronizarModalidade(p.modalidade) === 'modalidade2'
    )

    cache.set('modalidade1', modalidade1)
    cache.set('modalidade2', modalidade2)
    cache.set('full', data)

    console.log(`Dados atualizados em ${(Date.now() - start) / 1000}s`)
  } catch (error) {
    console.error('Falha na atualização:', error)
  }
}

// Executar a cada 6 horas
setInterval(updateData, 21600000)
updateData() // Executa imediatamente ao iniciar
