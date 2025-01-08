// Global error handler service
export const handleApiError = error => {
  if (error.message === 'Network Error') {
    return {
      type: 'network',
      message:
        'Não foi possível conectar ao servidor. Por favor, verifique sua conexão.',
      details: error.message
    }
  }

  return {
    type: 'api',
    message:
      'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.',
    details: error.message
  }
}
