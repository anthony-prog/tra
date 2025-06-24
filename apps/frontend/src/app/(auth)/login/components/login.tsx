"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Truck, Mail, Lock, ArrowRight, Zap, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [userFocus, setUserFocus] = useState(false)
  const [password, setPassword] = useState("")
  const [passFocus, setPassFocus] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [error, setError] = useState("")

  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  const words = ["Confianza", "Seguridad", "Eficiencia", "Innovación"]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/monitoreo-ruta')
    }
  }, [isAuthenticated, router])

  // Efecto de escritura automática
  useEffect(() => {
    if (!mounted) return

    const currentWord = words[currentWordIndex]
    let currentIndex = 0

    const typingInterval = setInterval(() => {
      if (currentIndex <= currentWord.length) {
        setTypingText(currentWord.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [currentWordIndex, mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        router.push('/monitoreo-ruta')
      } else {
        setError("Credenciales inválidas. Verifica tu usuario y contraseña.")
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Manejar errores específicos de la API
      if (error.response?.status === 401) {
        setError("Credenciales inválidas. Verifica tu usuario y contraseña.")
      } else if (error.response?.status === 500) {
        setError("Error del servidor. Intenta de nuevo más tarde.")
      } else if (error.code === 'NETWORK_ERROR') {
        setError("Error de conexión. Verifica tu conexión a internet.")
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos animados mejorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos flotantes grandes */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-400/10 rounded-full blur-3xl animate-float-delayed"></div>

        {/* Partículas flotantes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-blue-400/30 rounded-full animate-particle-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Líneas conectoras animadas */}
        <div className="absolute top-1/4 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse-line"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent animate-pulse-line delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Panel izquierdo mejorado */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg animate-glow">
                <Truck className="h-8 w-8 text-white animate-bounce-subtle" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 animate-text-shimmer">San Fernando</h1>
                <p className="text-slate-600 animate-fade-in delay-300">Alimentando a la buena familia peruana</p>
              </div>
            </div>

            <div className="space-y-4 animate-slide-in-left delay-200">
              <h2 className="text-2xl font-semibold text-slate-800">
                Creciendo con <span className="text-blue-600 animate-text-glow">{typingText}<span className="animate-blink">|</span></span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed animate-fade-in delay-500">
                Accede a tu dashboard de San Fernando para gestionar operaciones, monitorear procesos y más.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 animate-slide-in-left delay-400">
              {[
                { icon: Truck, number: "150+", label: "Vehículos", color: "blue" },
                { icon: Zap, number: "50+", label: "Rutas", color: "green" },
                { icon: Clock, number: "24/7", label: "Monitoreo", color: "purple" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm hover:bg-white/70 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-scale-in group cursor-pointer"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 text-${stat.color}-600 group-hover:animate-bounce`} />
                  <div className={`text-2xl font-bold text-${stat.color}-600 animate-counter`}>{stat.number}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo San Fernando grande, sin fondo */}
          <div className="flex justify-center animate-slide-in-left delay-700">
            <img
              src="/images/san-fernando-logo.png"
              alt="Logo San Fernando"
              className="object-contain w-[420px] h-[180px]"
            />
          </div>
        </div>

        {/* Panel derecho - Formulario mejorado */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-slide-in-right hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
            <CardHeader className="space-y-2 text-center pb-8">
              <div className="mx-auto p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full w-fit shadow-lg animate-spin-slow hover:animate-pulse">
                <Lock className="h-6 w-6 text-white animate-lock-unlock" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 animate-text-focus-in">Iniciar Sesión</CardTitle>
              <CardDescription className="text-slate-600 animate-fade-in delay-200">
                Accede a tu dashboard de San Fernando
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 animate-slide-in-bottom delay-100">
                  <Label htmlFor="username" className="text-slate-700 font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors duration-300 ${userFocus ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Tu usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setUserFocus(true)}
                      onBlur={() => setUserFocus(false)}
                      className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-slate-300 focus:shadow-lg animate-input-glow"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 animate-slide-in-bottom delay-200">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors duration-300 ${passFocus ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPassFocus(true)}
                      onBlur={() => setPassFocus(false)}
                      className="pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 hover:border-slate-300 focus:shadow-lg animate-input-glow"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all duration-300 hover:scale-110 animate-eye-blink"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm animate-slide-in-bottom delay-300">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all duration-300 hover:scale-110"
                    />
                    <span className="text-slate-600 group-hover:text-slate-800 transition-colors">Recordarme</span>
                  </label>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 hover:scale-105 animate-link-wave"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {error && (
                  <div className="animate-slide-in-bottom delay-250">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl animate-slide-in-bottom delay-400 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-fast"></div>
                      <span className="animate-pulse">Iniciando sesión...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 relative z-10">
                      <span>Iniciar Sesión</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 animate-arrow-bounce" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-slate-600 animate-slide-in-bottom delay-500">
                <p>
                  ¿Necesitas ayuda?{" "}
                  <button className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 hover:scale-105 animate-link-wave">
                    Contacta soporte
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Versión móvil del logo mejorada */}
      <div className="lg:hidden absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 animate-slide-in-top">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg animate-glow">
            <Truck className="h-5 w-5 text-white animate-bounce-subtle" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 animate-text-shimmer">San Fernando</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
