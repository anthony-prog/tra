"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Clock, MapPin, Truck, User, Package, Route, AlertCircle, Play, RotateCcw } from "lucide-react"
import Image from "next/image"

// Datos de ejemplo
const asignacion = {
  id: 12345,
  pedido: "PED-78901",
  fechaCreacion: "2023-05-15T10:30:00",
  fechaSalida: null,
  estado: "Pendiente",
  ruta: {
    id: 1,
    nombre: "Lima - Arequipa",
    distancia: "1020 km",
    tiempo: "14 horas",
    puntos: [
      { nombre: "Lima", estado: "Completado", hora: "2023-05-15T14:00:00" },
      { nombre: "Ica", estado: "Pendiente", hora: null },
      { nombre: "Nazca", estado: "Pendiente", hora: null },
      { nombre: "Arequipa", estado: "Pendiente", hora: null },
    ],
  },
  vehiculo: {
    id: 1,
    placa: "ABC-123",
    tipo: "Camión",
    capacidad: "10 ton",
    refrigeracion: "Sí",
  },
  conductor: {
    id: 1,
    nombre: "Juan Pérez",
    dni: "45678912",
    licencia: "Q45678912",
  },
  carga: {
    peso: "8 ton",
    volumen: "15 m³",
  },
  cliente: {
    nombre: "Distribuidora Sur SAC",
    direccion: "Av. Ejercito 123, Arequipa",
    telefono: "+51 987 654 321",
  },
}

export default function HojaRutaPage() {
  const [estadoDespacho, setEstadoDespacho] = useState(asignacion.estado)
  const [showReasignar, setShowReasignar] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return <Badge className="bg-sanfernando-red">Pendiente</Badge>
      case "En tránsito":
        return <Badge className="bg-sanfernando-blue">En tránsito</Badge>
      case "Completado":
        return <Badge className="bg-green-500">Completado</Badge>
      case "Cancelado":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  const getPuntoEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Completado":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "En progreso":
        return <Clock className="h-4 w-4 text-sanfernando-blue" />
      case "Pendiente":
        return <Clock className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const handleConfirmarSalida = () => {
    setEstadoDespacho("En tránsito")
    // Aquí iría la lógica para actualizar en el backend
  }

  const handleReasignar = () => {
    setShowReasignar(true)
    // Aquí iría la lógica para reasignar
  }

  const puedeReasignar = estadoDespacho === "Pendiente"

  return (
    <div className="space-y-6 h-full w-full p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {puedeReasignar && (
              <Button variant="outline" onClick={handleReasignar}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reasignar transporte
              </Button>
            )}
            {estadoDespacho === "Pendiente" && (
              <Button onClick={handleConfirmarSalida}>
                <Play className="mr-2 h-4 w-4" />
                Confirmar salida
              </Button>
            )}
          </div>
        </div>
      </div>

      {showReasignar && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Reasignación de transporte</AlertTitle>
          <AlertDescription>
            La funcionalidad de reasignación te permitirá cambiar el vehículo o conductor asignado. Esta función estará
            disponible solo si el despacho no ha iniciado.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Detalles del Despacho */}
        <Card>
          <CardHeader className="bg-sanfernando-blue bg-opacity-5">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-sanfernando-blue" />
              Detalles del Despacho
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID Asignación</p>
                <p className="font-medium">{asignacion.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pedido</p>
                <p className="font-medium">{asignacion.pedido}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                {getEstadoBadge(estadoDespacho)}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de creación</p>
                <p className="font-medium">{formatDate(asignacion.fechaCreacion)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hora de salida</p>
                <p className="font-medium">{formatDate(asignacion.fechaSalida)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Destino</p>
                <p className="font-medium">Arequipa</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Información de Carga</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Peso: {asignacion.carga.peso}</p>
                </div>
                <div>
                  <p className="text-sm">Volumen: {asignacion.carga.volumen}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del Cliente */}
        <Card>
          <CardHeader className="bg-sanfernando-blue bg-opacity-5">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-sanfernando-blue" />
              Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="font-medium">{asignacion.cliente.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección de entrega</p>
              <p className="font-medium">{asignacion.cliente.direccion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono de contacto</p>
              <p className="font-medium">{asignacion.cliente.telefono}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trazabilidad */}
      <Card>
        <CardHeader className="bg-sanfernando-blue bg-opacity-5">
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-sanfernando-blue" />
            Trazabilidad del Proceso
          </CardTitle>
          <CardDescription>Seguimiento completo: Pedido → Vehículo → Conductor → Cliente</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Vehículo Asignado */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-sanfernando-blue" />
                <h3 className="font-medium">Vehículo Asignado</h3>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <p className="font-medium">{asignacion.vehiculo.placa}</p>
                <p className="text-sm text-muted-foreground">
                  {asignacion.vehiculo.tipo} - {asignacion.vehiculo.capacidad}
                </p>
                <p className="text-sm text-muted-foreground">
                  {asignacion.vehiculo.refrigeracion === "Sí" ? "Con refrigeración" : "Sin refrigeración"}
                </p>
              </div>
            </div>

            {/* Conductor Asignado */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-sanfernando-red" />
                <h3 className="font-medium">Conductor Asignado</h3>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <p className="font-medium">{asignacion.conductor.nombre}</p>
                <p className="text-sm text-muted-foreground">DNI: {asignacion.conductor.dni}</p>
                <p className="text-sm text-muted-foreground">Licencia: {asignacion.conductor.licencia}</p>
              </div>
            </div>

            {/* Ruta Asignada */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sanfernando-blue" />
                <h3 className="font-medium">Ruta Asignada</h3>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <p className="font-medium">{asignacion.ruta.nombre}</p>
                <p className="text-sm text-muted-foreground">Distancia: {asignacion.ruta.distancia}</p>
                <p className="text-sm text-muted-foreground">Tiempo estimado: {asignacion.ruta.tiempo}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progreso de la Ruta */}
      <Card>
        <CardHeader className="bg-sanfernando-blue bg-opacity-5">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-sanfernando-blue" />
            Progreso de la Ruta
          </CardTitle>
          <CardDescription>Seguimiento en tiempo real de los puntos de control</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {asignacion.ruta.puntos.map((punto, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-muted">
                  {getPuntoEstadoBadge(punto.estado)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{punto.nombre}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(punto.hora)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">{punto.estado}</p>
                </div>
                {index < asignacion.ruta.puntos.length - 1 && <div className="w-px h-8 bg-muted ml-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
