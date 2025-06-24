import { AlertTriangle, Settings, Clock, User } from "lucide-react"
import { ReactNode } from "react"

export const statusColors: Record<string, string> = {
  "en_ruta": "bg-blue-100 text-blue-800",
  "completada": "bg-green-100 text-green-800",
  "cancelado": "bg-red-100 text-red-800",
}

export const incidentStatusColors: Record<string, string> = {
  Pendiente: "bg-yellow-100 text-yellow-800",
  "En proceso": "bg-blue-100 text-blue-800",
  Resuelto: "bg-green-100 text-green-800",
}

export const severityColors: Record<string, string> = {
  Baja: "bg-green-100 text-green-800",
  Media: "bg-yellow-100 text-yellow-800",
  Alta: "bg-red-100 text-red-800",
}

export const incidentTypeIcons: Record<string, ReactNode> = {
  "Accidente de tráfico": <AlertTriangle className="h-3 w-3" />,
  "Falla mecánica": <Settings className="h-3 w-3" />,
  Retraso: <Clock className="h-3 w-3" />,
  "Problema con cliente": <User className="h-3 w-3" />,
}
