"use client"

import { Truck, Users, FileSpreadsheet, FileText, History, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
    {
        title: "Dashboard",
        href: "/asignacion-transporte",
        icon: LayoutDashboard,
    },
    {
        title: "Gestión de Vehículos",
        href: "/asignacion-transporte/vehiculos",
        icon: Truck,
    },
    {
        title: "Gestión de Conductores",
        href: "/asignacion-transporte/conductores",
        icon: Users,
    },
    {
        title: "Asignación de Transporte",
        href: "/asignacion-transporte/asignacion",
        icon: FileSpreadsheet,
    },
    {
        title: "Hoja de Ruta",
        href: "/asignacion-transporte/hoja-ruta",
        icon: FileText,
    },
    {
        title: "Historial de Asignaciones",
        href: "/asignacion-transporte/historial",
        icon: History,
    },
]

export default function AsignacionTransporteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full">
            {/* Navegación fija */}
            <div className="flex border-b bg-white shadow-sm">
                <div className="flex max-w-7xl mx-auto w-full">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-1 px-4 py-3 text-sm font-medium transition-all",
                                pathname === item.href
                                    ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Contenido principal */}
            <main className="flex-1 overflow-auto bg-gray-50">
                {children}
            </main>
        </div>
    );
}
