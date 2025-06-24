"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AutenticaciNService } from '@/api/generated/services/AutenticaciNService'
import type { LoginDto } from '@/api/generated/models/LoginDto'
import type { UserProfileDto } from '@/api/generated/models/UserProfileDto'
import { useApiToken } from '@/hooks/useApiToken'

interface AuthContextType {
  user: UserProfileDto | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  fetchUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfileDto | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { setToken: setApiToken } = useApiToken()

  // Verificar si hay token guardado al cargar la app
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    
    if (savedToken) {
      setToken(savedToken)
      setApiToken(savedToken)
      // Intentar obtener el perfil del usuario
      fetchUserProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const userProfile = await AutenticaciNService.authControllerGetProfile()
      setUser(userProfile.data)
      localStorage.setItem('user', JSON.stringify(userProfile.data))
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Si falla al obtener el perfil, limpiar todo
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const loginData: LoginDto = {
        nombre_usuario: username,
        contrasena: password
      }
      
      const response = await AutenticaciNService.authControllerLogin(loginData)
      
      if (response.status && response.data.token) {
        const authToken = response.data.token
        
        // Guardar token en localStorage
        localStorage.setItem('authToken', authToken)
        
        // Actualizar estado y configurar API
        setToken(authToken)
        setApiToken(authToken)
        
        // Obtener perfil del usuario
        await fetchUserProfile()
        
        return true
      } else {
        return false
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    // Limpiar estado y API
    setToken(null)
    setUser(null)
    setApiToken(null)
    
    // Redirigir al login
    router.push('/login')
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      logout,
      isAuthenticated,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 