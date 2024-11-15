// services/paramService.js

// Defina os parâmetros que serão usados na requisição de forma dinâmica
const getAPIParams = req => ({
  pagina: req.query.pagina || 1,
  tamanhoDaPagina: req.query.tamanhoDaPagina || 2500,
  tipoDeConsultaDeModalidade: req.query.tipoDeConsultaDeModalidade || '',
  filtro: req.query.filtro || ''
})

module.exports = { getAPIParams }
