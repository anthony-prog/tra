"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Vehiculo {
  id_vehiculo: string
  placa: string
  marca: string
  modelo: string
  año: number
  color: string
  tipo_vehiculo: string
  capacidad_carga: number
  capacidad_combustible: number
  estado_vehiculo: boolean
  numero_soat: string
  fecha_vencimiento_soat: string
  gps_imei: string
  gps_estado: boolean
  foto_vehiculo?: string
}

interface VehiculosTableProps {
  vehiculos: Vehiculo[]
  onEdit: (vehiculo: Vehiculo) => void
  onDelete: (id: string) => void
}

export default function VehiculosTable({ vehiculos, onEdit, onDelete }: VehiculosTableProps) {
  const getEstadoBadge = (estado: boolean) => {
    return estado ? <Badge className="bg-green-500">Activo</Badge> : <Badge variant="destructive">Inactivo</Badge>
  }

  const getGpsBadge = (estado: boolean) => {
    return estado ? (
      <Badge className="bg-sanfernando-blue">GPS Activo</Badge>
    ) : (
      <Badge variant="secondary">GPS Inactivo</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const isSoatVencido = (fechaVencimiento: string) => {
    const today = new Date()
    const vencimiento = new Date(fechaVencimiento)
    return vencimiento < today
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-sanfernando-blue bg-opacity-5">
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>Marca/Modelo</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Capacidad Carga</TableHead>
            <TableHead>SOAT</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>GPS</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehiculos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                No hay vehículos registrados
              </TableCell>
            </TableRow>
          ) : (
            vehiculos.map((vehiculo) => (
              <TableRow key={vehiculo.id_vehiculo}>
                <TableCell className="font-medium">{vehiculo.placa}</TableCell>
                <TableCell>
                  {vehiculo.marca} {vehiculo.modelo}
                  <br />
                  <span className="text-sm text-muted-foreground">{vehiculo.color}</span>
                </TableCell>
                <TableCell>{vehiculo.año}</TableCell>
                <TableCell className="capitalize">{vehiculo.tipo_vehiculo}</TableCell>
                <TableCell>{vehiculo.capacidad_carga} kg</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{vehiculo.numero_soat}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(vehiculo.fecha_vencimiento_soat)}
                      {isSoatVencido(vehiculo.fecha_vencimiento_soat) && (
                        <Badge variant="destructive" className="ml-1 text-xs">
                          Vencido
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getEstadoBadge(vehiculo.estado_vehiculo)}</TableCell>
                <TableCell>{getGpsBadge(vehiculo.gps_estado)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => {}}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(vehiculo)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(vehiculo.id_vehiculo)}>
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
