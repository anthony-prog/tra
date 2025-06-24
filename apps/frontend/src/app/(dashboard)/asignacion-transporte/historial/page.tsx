"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Eye, Download } from "lucide-react"
import Image from "next/image"

// Datos de ejemplo
const historialAsignaciones = [
  {
    id: 12345,
    pedido: "PED-78901",
    fecha: "2023-05-15",
    ruta: "Lima - Arequipa",
    conductor: "Juan Pérez",
    vehiculo: "ABC-123",
    estado: "Completado",
    tiempoEntrega: "13.5 horas",
  },
  {
    id: 12344,
    pedido: "PED-78900",
    fecha: "2023-05-14",
    ruta: "Lima - Trujillo",
    conductor: "María López",
    vehiculo: "DEF-456",
    estado: "En tránsito",
    tiempoEntrega: "-",
  },
  {
    id: 12343,
    pedido: "PED-78899",
    fecha: "2023-05-14",
    ruta: "Lima - Cusco",
    conductor: "Carlos Rodríguez",
    vehiculo: "GHI-789",
    estado: "Cancelado",
    tiempoEntrega: "-",
  },
  {
    id: 12342,
    pedido: "PED-78898",
    fecha: "2023-05-13",
    ruta: "Lima - Chiclayo",
    conductor: "Ana Martínez",
    vehiculo: "JKL-012",
    estado: "Completado",
    tiempoEntrega: "10.2 horas",
  },
  {
    id: 12341,
    pedido: "PED-78897",
    fecha: "2023-05-13",
    ruta: "Lima - Piura",
    conductor: "Pedro Sánchez",
    vehiculo: "MNO-345",
    estado: "Completado",
    tiempoEntrega: "13.8 horas",
  },
  {
    id: 12340,
    pedido: "PED-78896",
    fecha: "2023-05-12",
    ruta: "Lima - Arequipa",
    conductor: "Juan Pérez",
    vehiculo: "ABC-123",
    estado: "Pendiente",
    tiempoEntrega: "-",
  },
  {
    id: 12339,
    pedido: "PED-78895",
    fecha: "2023-05-12",
    ruta: "Lima - Trujillo",
    conductor: "María López",
    vehiculo: "DEF-456",
    estado: "Completado",
    tiempoEntrega: "7.5 horas",
  },
  {
    id: 12338,
    pedido: "PED-78894",
    fecha: "2023-05-11",
    ruta: "Lima - Cusco",
    conductor: "Carlos Rodríguez",
    vehiculo: "GHI-789",
    estado: "Completado",
    tiempoEntrega: "17.2 horas",
  },
]

export default function HistorialPage() {
  const [filtros, setFiltros] = useState({
    busqueda: "",
    estado: "",
    fechaInicio: "",
    fechaFin: "",
  })

  const [asignacionesFiltradas, setAsignacionesFiltradas] = useState(historialAsignaciones)

  const handleFiltroChange = (campo: string, valor: string) => {
    const nuevosFiltros = { ...filtros, [campo]: valor }
    setFiltros(nuevosFiltros)
    aplicarFiltros(nuevosFiltros)
  }

  const aplicarFiltros = (filtrosActuales: typeof filtros) => {
    let resultado = historialAsignaciones

    // Filtro por búsqueda (pedido, conductor, vehículo)
    if (filtrosActuales.busqueda) {
      const busqueda = filtrosActuales.busqueda.toLowerCase()
      resultado = resultado.filter(
        (asignacion) =>
          asignacion.pedido.toLowerCase().includes(busqueda) ||
          asignacion.conductor.toLowerCase().includes(busqueda) ||
          asignacion.vehiculo.toLowerCase().includes(busqueda) ||
          asignacion.ruta.toLowerCase().includes(busqueda),
      )
    }

    // Filtro por estado
    if (filtrosActuales.estado) {
      resultado = resultado.filter((asignacion) => asignacion.estado === filtrosActuales.estado)
    }

    // Filtro por fecha
    if (filtrosActuales.fechaInicio) {
      resultado = resultado.filter((asignacion) => asignacion.fecha >= filtrosActuales.fechaInicio)
    }

    if (filtrosActuales.fechaFin) {
      resultado = resultado.filter((asignacion) => asignacion.fecha <= filtrosActuales.fechaFin)
    }

    setAsignacionesFiltradas(resultado)
  }

  const limpiarFiltros = () => {
    const filtrosVacios = {
      busqueda: "",
      estado: "",
      fechaInicio: "",
      fechaFin: "",
    }
    setFiltros(filtrosVacios)
    setAsignacionesFiltradas(historialAsignaciones)
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Completado":
        return <Badge className="bg-green-500">Completado</Badge>
      case "En tránsito":
        return <Badge className="bg-sanfernando-blue">En tránsito</Badge>
      case "Pendiente":
        return <Badge className="bg-sanfernando-red">Pendiente</Badge>
      case "Cancelado":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const exportarDatos = () => {
    // Aquí iría la lógica para exportar los datos
    console.log("Exportando datos...", asignacionesFiltradas)
  }

  return (
    <div className="space-y-6 h-full w-full p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={exportarDatos} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="bg-sanfernando-blue bg-opacity-5">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-sanfernando-blue" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription>Utiliza los filtros para encontrar asignaciones específicas</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="busqueda">Búsqueda general</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Pedido, conductor, vehículo..."
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange("busqueda", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado del despacho</Label>
              <Select value={filtros.estado} onValueChange={(value) => handleFiltroChange("estado", value)}>
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="En tránsito">En tránsito</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => handleFiltroChange("fechaInicio", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => handleFiltroChange("fechaFin", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {asignacionesFiltradas.length} de {historialAsignaciones.length} asignaciones
            </p>
            <Button variant="outline" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de resultados */}
      <Card>
        <CardHeader className="bg-sanfernando-blue bg-opacity-5">
          <CardTitle className="text-sanfernando-blue">Resultados</CardTitle>
          <CardDescription>Historial de asignaciones filtrado según los criterios seleccionados</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-sanfernando-blue bg-opacity-5">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Conductor</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tiempo Entrega</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {asignacionesFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      No se encontraron asignaciones con los filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  asignacionesFiltradas.map((asignacion) => (
                    <TableRow key={asignacion.id}>
                      <TableCell className="font-medium">{asignacion.id}</TableCell>
                      <TableCell>{asignacion.pedido}</TableCell>
                      <TableCell>{formatDate(asignacion.fecha)}</TableCell>
                      <TableCell>{asignacion.ruta}</TableCell>
                      <TableCell>{asignacion.conductor}</TableCell>
                      <TableCell>{asignacion.vehiculo}</TableCell>
                      <TableCell>{getEstadoBadge(asignacion.estado)}</TableCell>
                      <TableCell>{asignacion.tiempoEntrega}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalles</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-sanfernando-blue bg-opacity-5">
            <CardTitle className="text-sm font-medium text-sanfernando-blue">Total Asignaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{asignacionesFiltradas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
            <CardTitle className="text-sm font-medium text-green-700">Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {asignacionesFiltradas.filter((a) => a.estado === "Completado").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50">
            <CardTitle className="text-sm font-medium text-blue-700">En Tránsito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sanfernando-blue">
              {asignacionesFiltradas.filter((a) => a.estado === "En tránsito").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50">
            <CardTitle className="text-sm font-medium text-red-700">Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sanfernando-red">
              {asignacionesFiltradas.filter((a) => a.estado === "Cancelado").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} San Fernando - La buena familia</p>
      </div>
    </div>
  )
}
