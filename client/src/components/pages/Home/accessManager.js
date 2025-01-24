import axios from 'axios'

// Chave para armazenamento no localStorage
const STORAGE_KEY = 'page_access_counts'

// Função para carregar contadores do localStorage
const loadAccessCounts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Erro ao carregar contadores:', error)
    return {}
  }
}

// Função para salvar contadores no localStorage
const saveAccessCounts = counts => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts))
  } catch (error) {
    console.error('Erro ao salvar contadores:', error)
  }
}

// Função para registrar um acesso quando um card é clicado
export const registerAccess = path => {
  const counts = loadAccessCounts()
  counts[path] = (counts[path] || 0) + 1
  saveAccessCounts(counts)

  // Log para debug
  console.log('Acesso registrado:', {
    pagina: path,
    contagem: counts[path],
    todosAcessos: counts
  })
}

// Função para obter as páginas mais acessadas
export const getMostAccessedPages = menuStructure => {
  const counts = loadAccessCounts()
  const allPages = []

  Object.entries(menuStructure).forEach(([key, section]) => {
    section.links.forEach(link => {
      allPages.push({
        ...link,
        acessos: counts[link.path] || 0,
        cor: section.cor
      })
    })
  })

  // Alterado de 5 para 8
  return allPages.sort((a, b) => b.acessos - a.acessos).slice(0, 4)
}
