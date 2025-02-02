const NodeCache = require('node-cache')
const { getProcedimentoById } = require('./scraper')

// Create cache with 30 minute TTL
const sessionCache = new NodeCache({ stdTTL: 1800 })

/**
 * Get a valid session for a procedure
 * @param {string} procedimentoId The procedure ID
 * @returns {Promise<Object>} Session data including cookies and referer
 */
const getSession = async procedimentoId => {
  try {
    // Try to get session from cache
    let session = sessionCache.get(procedimentoId)

    if (!session) {
      console.log(`🔄 Creating new session for procedure ${procedimentoId}`)
      // Get fresh session data
      const { sessionData } = await getProcedimentoById(procedimentoId)
      session = sessionData

      // Cache the session
      sessionCache.set(procedimentoId, session)
      console.log(`✅ Session cached for procedure ${procedimentoId}`)
    }

    return session
  } catch (error) {
    console.error('❌ Error getting session:', error)
    throw error
  }
}

/**
 * Invalidate a cached session
 * @param {string} procedimentoId The procedure ID
 */
const invalidateSession = procedimentoId => {
  sessionCache.del(procedimentoId)
  console.log(`🗑️ Session invalidated for procedure ${procedimentoId}`)
}

module.exports = {
  getSession,
  invalidateSession
}
