"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Truck, User, CalendarIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface AsignacionFormProps {
  vehiculos: any[]
  conductores: any[]
  planesEntrega: any[]
  onAsignacionCreada: (asignacion: any) => void
}

export default function AsignacionForm({
  vehiculos,
  conductores,
  planesEntrega,
  onAsignacionCreada,
}: AsignacionFormProps) {
  const [formData, setFormData] = useState({
    id_vehiculo: "",
    id_conductor: "",
    id_plan_entrega: "",
    estado_asignacion: "pendiente",
    fecha_inicio_estimada: "",
    fecha_fin_estimada: "",
    observaciones: "",
  })

  const [selectedVehiculo, setSelectedVehiculo] = useState<any>(null)
  const [selectedConductor, setSelectedConductor] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [validaciones, setValidaciones] = useState({
    vehiculoDisponible: true,
    conductorDisponible: true,
    fechasValidas: true,
  })

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    // Actualizar selecciones
    if (field === "id_vehiculo") {
      const vehiculo = vehiculos.find((v) => v.id_vehiculo === value)
      setSelectedVehiculo(vehiculo || null)

      // Validar disponibilidad del vehículo
      setValidaciones({
        ...validaciones,
        vehiculoDisponible: vehiculo ? vehiculo.estado_vehiculo : false,
      })
    } else if (field === "id_conductor") {
      const conductor = conductores.find((c) => c.id_conductor === value)
      setSelectedConductor(conductor || null)

      // Validar disponibilidad del conductor
      setValidaciones({
        ...validaciones,
        conductorDisponible: conductor ? conductor.estado_conductor : false,
      })
    } else if (field === "id_plan_entrega") {
      const plan = planesEntrega.find((p) => p.id_plan_entrega === value)
      setSelectedPlan(plan || null)
    }
  }

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      const fechaFormateada = format(date, "yyyy-MM-dd'T'HH:mm")
      setFormData({
        ...formData,
        [field]: fechaFormateada,
      })

      // Validar fechas
      if (field === "fecha_inicio_estimada" || field === "fecha_fin_estimada") {
        const inicio = field === "fecha_inicio_estimada" ? date : new Date(formData.fecha_inicio_estimada)
        const fin = field === "fecha_fin_estimada" ? date : new Date(formData.fecha_fin_estimada)

        if (formData.fecha_inicio_estimada && formData.fecha_fin_estimada) {
          setValidaciones({
            ...validaciones,
            fechasValidas: inicio < fin,
          })
        }
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Crear objeto de asignación
    const asignacion = {
      id_asignacion_transporte: `550e8400-e29b-41d4-a716-${Date.now().toString().slice(-12)}`,
      ...formData,
      vehiculo: selectedVehiculo,
      conductor: selectedConductor,
      plan_entrega: selectedPlan,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString(),
    }

    onAsignacionCreada(asignacion)
  }

  const isFormValid = () => {
    return (
      formData.id_vehiculo &&
      formData.id_conductor &&
      formData.id_plan_entrega &&
      formData.fecha_inicio_estimada &&
      formData.fecha_fin_estimada &&
      validaciones.vehiculoDisponible &&
      validaciones.conductorDisponible &&
      validaciones.fechasValidas
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Formulario de Asignación de Transporte</CardTitle>
          <CardDescription>Complete todos los campos para crear una nueva asignación de transporte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selección de recursos */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="id_plan_entrega">Plan de Entrega *</Label>
                <Select
                  value={formData.id_plan_entrega}
                  onValueChange={(value) => handleChange("id_plan_entrega", value)}
                  required
                >
                  <SelectTrigger id="id_plan_entrega">
                    <SelectValue placeholder="Seleccionar plan de entrega" />
                  </SelectTrigger>
                  <SelectContent>
                    {planesEntrega.map((plan) => (
                      <SelectItem key={plan.id_plan_entrega} value={plan.id_plan_entrega}>
                        {plan.codigo_plan} - {plan.destino}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPlan && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Destino: {selectedPlan.destino} | Fecha: {selectedPlan.fecha_entrega}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="id_vehiculo">Selección de Vehículo *</Label>
                <Select
                  value={formData.id_vehiculo}
                  onValueChange={(value) => handleChange("id_vehiculo", value)}
                  required
                >
                  <SelectTrigger id="id_vehiculo">
                    <SelectValue placeholder="Seleccionar vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehiculos.map((vehiculo) => (
                      <SelectItem key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                        {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo} ({vehiculo.capacidad_carga} kg)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedVehiculo && (
                  <div className="flex items-center gap-2 mt-1">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {selectedVehiculo.tipo_vehiculo} - {selectedVehiculo.color} - {selectedVehiculo.año}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="id_conductor">Selección de Conductor *</Label>
                <Select
                  value={formData.id_conductor}
                  onValueChange={(value) => handleChange("id_conductor", value)}
                  required
                >
                  <SelectTrigger id="id_conductor">
                    <SelectValue placeholder="Seleccionar conductor" />
                  </SelectTrigger>
                  <SelectContent>
                    {conductores.map((conductor) => (
                      <SelectItem key={conductor.id_conductor} value={conductor.id_conductor}>
                        {conductor.nombre_conductor} - {conductor.DNI} ({conductor.tipo_licencia})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedConductor && (
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Tel: {selectedConductor.telefono_conductor} | Licencia: {selectedConductor.tipo_licencia}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fechas y observaciones */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="estado_asignacion">Estado de Asignación</Label>
                <Select
                  value={formData.estado_asignacion}
                  onValueChange={(value) => handleChange("estado_asignacion", value)}
                >
                  <SelectTrigger id="estado_asignacion">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_progreso">En Progreso</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fecha_inicio_estimada">Fecha Inicio Estimada *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="fecha_inicio_estimada"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.fecha_inicio_estimada && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fecha_inicio_estimada ? (
                        format(new Date(formData.fecha_inicio_estimada), "dd/MM/yyyy HH:mm")
                      ) : (
                        <span>Seleccionar fecha y hora</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.fecha_inicio_estimada ? new Date(formData.fecha_inicio_estimada) : undefined}
                      onSelect={(date) => handleDateChange("fecha_inicio_estimada", date)}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="fecha_fin_estimada">Fecha Fin Estimada *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="fecha_fin_estimada"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.fecha_fin_estimada && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fecha_fin_estimada ? (
                        format(new Date(formData.fecha_fin_estimada), "dd/MM/yyyy HH:mm")
                      ) : (
                        <span>Seleccionar fecha y hora</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.fecha_fin_estimada ? new Date(formData.fecha_fin_estimada) : undefined}
                      onSelect={(date) => handleDateChange("fecha_fin_estimada", date)}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleChange("observaciones", e.target.value)}
                  placeholder="Observaciones adicionales sobre la asignación..."
                  maxLength={400}
                  rows={3}
                />
              </div>

              {/* Validaciones */}
              {selectedVehiculo && !validaciones.vehiculoDisponible && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Vehículo no disponible</AlertTitle>
                  <AlertDescription>
                    El vehículo seleccionado no está activo o disponible para asignación.
                  </AlertDescription>
                </Alert>
              )}

              {selectedConductor && !validaciones.conductorDisponible && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Conductor no disponible</AlertTitle>
                  <AlertDescription>
                    El conductor seleccionado no está activo o disponible para asignación.
                  </AlertDescription>
                </Alert>
              )}

              {formData.fecha_inicio_estimada && formData.fecha_fin_estimada && !validaciones.fechasValidas && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error en fechas</AlertTitle>
                  <AlertDescription>La fecha de inicio debe ser anterior a la fecha de fin.</AlertDescription>
                </Alert>
              )}

              {selectedVehiculo &&
                selectedConductor &&
                selectedPlan &&
                validaciones.vehiculoDisponible &&
                validaciones.conductorDisponible && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Recursos disponibles</AlertTitle>
                    <AlertDescription>
                      El vehículo, conductor y plan de entrega están disponibles para esta asignación.
                    </AlertDescription>
                  </Alert>
                )}
            </div>
          </div>

          {selectedPlan && selectedVehiculo && selectedConductor && (
            <>
              <Separator />
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Resumen de la asignación</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Plan de Entrega</p>
                    <p className="text-sm text-muted-foreground">{selectedPlan.codigo_plan}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Destino</p>
                    <p className="text-sm text-muted-foreground">{selectedPlan.destino}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fecha Entrega</p>
                    <p className="text-sm text-muted-foreground">{selectedPlan.fecha_entrega}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vehículo</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedVehiculo.placa} - {selectedVehiculo.marca} {selectedVehiculo.modelo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Conductor</p>
                    <p className="text-sm text-muted-foreground">{selectedConductor.nombre_conductor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estado</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {formData.estado_asignacion.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!isFormValid()}>
            Crear Asignación de Transporte
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
