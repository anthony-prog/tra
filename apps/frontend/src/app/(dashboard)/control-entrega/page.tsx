"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import SignupForm from "./components/signup-form"
import DataTable from "./components/data-table"
import IncidentForm from "./components/incident-form"
import DeliveryPerformanceSummary from "./components/delivery-performance-summary"

export default function ControlEntregaPage() {
  const [currentView, setCurrentView] = useState<"signup" | "summary" | "table" | "form">("signup")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Verificar si hay una sesión activa
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
      setCurrentView("summary")
    }
  }, [])

  const handleLoginSuccess = () => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsAuthenticated(true)
    setCurrentView("summary")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("user_id")
    setIsAuthenticated(false)
    setUser(null)
    setCurrentView("signup")
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Navegación solo visible si hay sesión activa */}
      {isAuthenticated && (
        <div className="sticky top-0 z-50 bg-white border-b border-[#e6e6e6] px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-[#1e1e1e]">San Fernando - M6</h1>
              {user && <span className="text-sm text-[#757575]">Bienvenido, {user.name}</span>}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={currentView === "summary" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("summary")}
                className={currentView === "summary" ? "bg-[#1e1e1e] text-white" : "border-[#e0e0e0] text-[#757575]"}
              >
                Resumen
              </Button>
              <Button
                variant={currentView === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("table")}
                className={currentView === "table" ? "bg-[#1e1e1e] text-white" : "border-[#e0e0e0] text-[#757575]"}
              >
                Entregas
              </Button>
              <Button
                variant={currentView === "form" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("form")}
                className={currentView === "form" ? "bg-[#1e1e1e] text-white" : "border-[#e0e0e0] text-[#757575]"}
              >
                Formularios
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-[#e0e0e0] text-[#757575] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Vistas de la aplicación */}
      {!isAuthenticated && <SignupForm onLoginSuccess={handleLoginSuccess} />}

      {isAuthenticated && currentView === "summary" && (
        <div className="container mx-auto py-8 px-4">
          <DeliveryPerformanceSummary />

          <div className="mt-8 p-6 border border-[#e6e6e6] rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-4 text-[#1e1e1e]">Entregas pendientes</h3>
            <p className="text-[#757575]">Aquí se mostrarían las entregas pendientes del repartidor...</p>
            <Button className="mt-4 bg-[#1e1e1e] hover:bg-[#2c2c2c] text-white" onClick={() => setCurrentView("table")}>
              Ver todas las entregas
            </Button>
          </div>
        </div>
      )}

      {isAuthenticated && currentView === "table" && <DataTable userId={localStorage.getItem("user_id") ?? ""} />}

      {isAuthenticated && currentView === "form" && <IncidentForm />}
    </div>
  )
}
