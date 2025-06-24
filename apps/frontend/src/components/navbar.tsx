"use client"

import { Settings, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'supervisor':
        return 'Supervisor'
      case 'operador':
        return 'Operador'
      case 'monitor':
        return 'Monitor'
      default:
        return role
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
      <div className="flex items-center">
        <SidebarTrigger className="mr-2" />
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>{user?.nombre_usuario?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <div className="text-sm font-medium">{user?.nombre_usuario || 'Usuario'}</div>
            <div className="text-xs text-gray-500">{user?.rol ? getRoleDisplayName(user.rol) : 'Usuario'}</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-1 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-down"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {}}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 