"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("") // Limpia errores anteriores
    try {
      const res = await fetch("http://localhost:3001/api/control-entrega/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.access_token) {
        throw new Error(data.message || "Credenciales inválidas")
      }

      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user_id", data.user.id)
      localStorage.setItem("username", data.user.username)

      onLoginSuccess()
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
      //console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardHeader className="text-center pb-6">
          <div className="text-sm font-medium text-[#1e1e1e] mb-8">San Fernando - M6</div>
          <CardTitle className="text-xl font-semibold text-[#1e1e1e] mb-2">Create an account</CardTitle>
          <p className="text-sm text-[#757575]">Enter your email to sign up for this app</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="user"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-[#e0e0e0] text-[#757575] placeholder:text-[#b3b3b3]"
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[#e0e0e0] text-[#757575] placeholder:text-[#b3b3b3]"
          />

          <Button onClick={handleLogin} className="w-full bg-[#1e1e1e] hover:bg-[#2c2c2c] text-white font-medium py-2.5">
            Iniciar sesión
          </Button>

          {/* Mensaje de error elegante */}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <div className="text-center text-sm text-[#b3b3b3] my-4">or continue with</div>

          <Button
            variant="outline"
            className="w-full border-[#e0e0e0] text-[#757575] hover:bg-[#f5f5f5] font-medium py-2.5"
          >
            {/* Google Icon */}
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285f4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34a853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#fbbc05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#eb4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>

          <p className="text-xs text-[#b3b3b3] text-center mt-6">
            By clicking continue, you agree to our <span className="text-[#1e1e1e] underline">Terms of Service</span>{" "}
            and <span className="text-[#1e1e1e] underline">Privacy Policy</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
