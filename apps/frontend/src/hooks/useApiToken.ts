import { useEffect } from 'react'
import { OpenAPI } from '@/api/generated/core/OpenAPI'

export function useApiToken() {
  useEffect(() => {
    // Configurar el token dinámicamente
    const token = localStorage.getItem('authToken')
    
    if (token) {
      OpenAPI.TOKEN = token
    } else {
      OpenAPI.TOKEN = undefined
    }
  }, [])

  const setToken = (token: string | null) => {
    if (token) {
      OpenAPI.TOKEN = token
    } else {
      OpenAPI.TOKEN = undefined
    }
  }

  return { setToken }
} 