import axios from 'axios'

const SITE_URL = import.meta.env.VITE_SITE_OFICIAL

// Taxonomies constants
export const TAXONOMIES = {
  ANO: 'ano-publicacao',
  PLANO: 'tipo-de-plano',
  FISCAL: 'tipo-fiscal',
  OUTROS_DOCS: 'outros-docs',
  ROL: 'tipo-de-rol',
  TRANSFERENCIA: 'tipo-de-transferencia'
}

// Meta fields constants
export const META_FIELDS = {
  TIPO_ACORDO: 'tipo-acordo',
  TIPO_INFORMACAO: 'tipo-de-informacao'
}

// Labels mapping
export const TAXONOMY_LABELS = {
  [TAXONOMIES.ANO]: 'Ano',
  [TAXONOMIES.PLANO]: 'Tipo de Plano',
  [TAXONOMIES.FISCAL]: 'Tipo Fiscal',
  [TAXONOMIES.OUTROS_DOCS]: 'Outros Documentos',
  [TAXONOMIES.ROL]: 'Tipo de Rol',
  [TAXONOMIES.TRANSFERENCIA]: 'Tipo de Transferência',
  [META_FIELDS.TIPO_ACORDO]: 'Tipo de Acordo',
  [META_FIELDS.TIPO_INFORMACAO]: 'Tipo de Informação'
}

// Helper function to check if a field is a meta field
export const isMetaField = field => {
  return Object.values(META_FIELDS).includes(field)
}

// Function to get taxonomy terms
export const getTaxonomyTerms = async taxonomy => {
  try {
    const response = await axios.get(`${SITE_URL}/wp-json/wp/v2/${taxonomy}`, {
      params: {
        per_page: 100
      }
    })

    const terms = response.data.map(term => ({
      id: term.id,
      name: term.name,
      slug: term.slug
    }))

    if (taxonomy === TAXONOMIES.ANO) {
      return terms.sort((a, b) => b.name - a.name)
    }

    return terms
  } catch (error) {
    console.error(`Erro ao buscar termos da taxonomia ${taxonomy}:`, error)
    throw error
  }
}

// Function to get meta field options
export const getMetaFieldOptions = async field => {
  try {
    const response = await axios.get(`${SITE_URL}/wp-json/wp/v2/publicacao`, {
      params: {
        per_page: 100
      }
    })

    const uniqueValues = [
      ...new Set(
        response.data
          .map(post => post.meta?.[field])
          .filter(value => value && value !== 'Selecione' && value !== '')
      )
    ].sort()

    return uniqueValues.map(value => ({
      id: value,
      name: value,
      slug: value.toLowerCase().replace(/\s+/g, '-')
    }))
  } catch (error) {
    console.error(`Erro ao buscar opções do campo ${field}:`, error)
    throw error
  }
}
