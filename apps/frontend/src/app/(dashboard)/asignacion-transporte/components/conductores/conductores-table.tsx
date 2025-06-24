"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Conductor {
  id_conductor: string
  DNI: string
  nombre_conductor: string
  telefono_conductor: string
  email_conductor: string
  direccion_conductor?: string
  estado_conductor: boolean
  tipo_licencia: string
  fecha_emision_licencia: string
  fecha_vencimiento_licencia: string
  fecha_nacimiento: string
  genero: string
  foto_conductor?: string
}

interface ConductoresTableProps {
  conductores: Conductor[]
  onEdit: (conductor: Conductor) => void
  onDelete: (id: string) => void
}

export default function ConductoresTable({ conductores, onEdit, onDelete }: ConductoresTableProps) {
  const getEstadoBadge = (estado: boolean) => {
    return estado ? <Badge className="bg-green-500">Activo</Badge> : <Badge variant="destructive">Inactivo</Badge>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const isLicenciaVencida = (fechaVencimiento: string) => {
    const today = new Date()
    const vencimiento = new Date(fechaVencimiento)
    return vencimiento < today
  }

  const calcularEdad = (fechaNacimiento: string) => {
    const today = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = today.getFullYear() - nacimiento.getFullYear()
    const mes = today.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && today.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-sanfernando-blue bg-opacity-5">
          <TableRow>
            <TableHead>DNI</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Edad/Género</TableHead>
            <TableHead>Licencia</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conductores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No hay conductores registrados
              </TableCell>
            </TableRow>
          ) : (
            conductores.map((conductor) => (
              <TableRow key={conductor.id_conductor}>
                <TableCell className="font-medium">{conductor.DNI}</TableCell>
                <TableCell>{conductor.nombre_conductor}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{conductor.telefono_conductor}</div>
                    <div className="text-xs text-muted-foreground">{conductor.email_conductor}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{calcularEdad(conductor.fecha_nacimiento)} años</div>
                    <div className="text-xs text-muted-foreground capitalize">{conductor.genero}</div>
                  </div>
                </TableCell>
                <TableCell>{conductor.tipo_licencia}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{formatDate(conductor.fecha_vencimiento_licencia)}</div>
                    {isLicenciaVencida(conductor.fecha_vencimiento_licencia) && (
                      <Badge variant="destructive" className="text-xs">
                        Vencida
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getEstadoBadge(conductor.estado_conductor)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => {}}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(conductor)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(conductor.id_conductor)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
