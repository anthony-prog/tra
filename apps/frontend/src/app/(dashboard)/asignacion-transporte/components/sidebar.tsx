"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Truck, Users, FileSpreadsheet, FileText, History, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Gestión de Vehículos",
    href: "/vehiculos",
    icon: Truck,
  },
  {
    title: "Gestión de Conductores",
    href: "/conductores",
    icon: Users,
  },
  {
    title: "Asignación de Transporte",
    href: "/asignacion",
    icon: FileSpreadsheet,
  },
  {
    title: "Hoja de Ruta",
    href: "/hoja-ruta",
    icon: FileText,
  },
  {
    title: "Historial de Asignaciones",
    href: "/historial",
    icon: History,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-white md:block w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center justify-center border-b bg-sanfernando-blue px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="relative h-14 w-48">
              <Image
                src="/images/logo-sanfernando.png"
                alt="San Fernando Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-sanfernando-blue",
                  pathname === item.href ? "bg-muted text-sanfernando-blue font-semibold" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-sanfernando-blue">San Fernando</p>
              <p className="text-xs text-muted-foreground">Sistema de Logística</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-sanfernando-red flex items-center justify-center text-white font-bold">
              SF
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
