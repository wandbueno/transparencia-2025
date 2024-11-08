const express = require('express')
const router = express.Router()
const { fetchFromAPI } = require('../../services/apiService')

// Rota para buscar dados do combo
router.get('/', (req, res) => {
  fetchFromAPI('/api/combo', req, res)
})

module.exports = router
