"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  ClipboardList,
  Calendar,
  Truck,
  Package,
  Map,
  ClipboardCheck,
  AlertCircle,
  Settings,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

const menuItems = [
  { icon: ClipboardList, label: "Recepción de Orden", route: "/recepcion-orden" },
  { icon: Calendar, label: "Planificación de Entrega", route: "/planificacion-entrega" },
  { icon: Truck, label: "Asignación de Transporte", route: "/asignacion-transporte" },
  { icon: Package, label: "Gestión de Despacho", route: "/gestion-despacho" },
  { icon: Map, label: "Monitoreo de Ruta", route: "/monitoreo-ruta" },
  { icon: ClipboardCheck, label: "Control de Entrega", route: "/control-entrega" },
  { icon: AlertCircle, label: "Reclamo y Devolución", route: "/reclamo-devolucion" },
]

const bottomMenuItems = [
  { icon: Settings, label: "Configuración", route: "/configuracion" },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <SidebarUI collapsible="icon" className="bg-white border-r">
      {/* Logo y nombre empresa */}
      <div className="flex items-center justify-center h-14 w-full border-b border-gray-200">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Logo expandido */}
          <img 
            src="/images/san-fernando-logo.png" 
            alt="Logo San Fernando" 
            className="h-12 w-auto transition-all duration-300 ease-in-out opacity-100 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0"
          />
          {/* Logo contraído */}
          <img 
            src="/images/logo-san-fernando.png" 
            alt="Logo San Fernando" 
            className="h-12 w-auto absolute transition-all duration-300 ease-in-out opacity-0 group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:w-12"
          />
        </div>
      </div>
      <SidebarContent className="flex flex-col justify-between flex-1 w-full py-4">
        <SidebarMenu className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-full">
          {menuItems.map((item) => {
            const isActive = pathname.includes(item.route)
            return (
              <SidebarMenuItem key={item.route} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                <SidebarMenuButton
                  isActive={isActive}
                  onClick={() => router.push(item.route)}
                  tooltip={item.label}
                  className={`flex items-center w-full py-2 transition-all
                    px-4
                    group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0
                    ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 transition-all mx-0 ${isActive ? "text-blue-600" : ""}`} />
                  <span className="ml-3 text-sm group-data-[collapsible=icon]:hidden transition-all">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
        <SidebarMenu className="mb-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-full">
          {bottomMenuItems.map((item) => {
            const isActive = pathname === item.route
            return (
              <SidebarMenuItem key={item.route} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                <SidebarMenuButton
                  isActive={isActive}
                  onClick={() => router.push(item.route)}
                  tooltip={item.label}
                  className={`flex items-center w-full py-2 transition-all
                    px-4
                    group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0
                    ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 transition-all mx-0 ${isActive ? "text-blue-600" : ""}`} />
                  <span className="ml-3 text-sm group-data-[collapsible=icon]:hidden transition-all">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
          {/* Botón de logout separado */}
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Cerrar Sesión"
              className="flex items-center w-full py-2 transition-all
                px-4
                group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0
                text-gray-500 hover:bg-gray-100 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 flex-shrink-0 transition-all mx-0" />
              <span className="ml-3 text-sm group-data-[collapsible=icon]:hidden transition-all">Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </SidebarUI>
  )
}
