"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

interface VehiculoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vehiculo: any) => void
  vehiculo: any
}

export default function VehiculoFormModal({ isOpen, onClose, onSave, vehiculo }: VehiculoFormModalProps) {
  const [formData, setFormData] = useState({
    id_vehiculo: null,
    placa: "",
    marca: "",
    modelo: "",
    año: new Date().getFullYear(),
    color: "",
    tipo_vehiculo: "",
    capacidad_carga: "",
    capacidad_combustible: "",
    estado_vehiculo: true,
    numero_soat: "",
    fecha_vencimiento_soat: "",
    gps_imei: "",
    gps_estado: true,
    foto_vehiculo: "",
  })

  useEffect(() => {
    if (vehiculo) {
      setFormData(vehiculo)
    } else {
      setFormData({
        id_vehiculo: null,
        placa: "",
        marca: "",
        modelo: "",
        año: new Date().getFullYear(),
        color: "",
        tipo_vehiculo: "",
        capacidad_carga: "",
        capacidad_combustible: "",
        estado_vehiculo: true,
        numero_soat: "",
        fecha_vencimiento_soat: "",
        gps_imei: "",
        gps_estado: true,
        foto_vehiculo: "",
      })
    }
  }, [vehiculo, isOpen])

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        fecha_vencimiento_soat: format(date, "yyyy-MM-dd"),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehiculo ? "Editar vehículo" : "Agregar nuevo vehículo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Información básica */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa *</Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => handleChange("placa", e.target.value.toUpperCase())}
                  placeholder="ABC-123"
                  maxLength={7}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marca">Marca *</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => handleChange("marca", e.target.value)}
                  placeholder="Toyota"
                  maxLength={15}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo *</Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => handleChange("modelo", e.target.value)}
                  placeholder="Hilux"
                  maxLength={15}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="año">Año *</Label>
                <Select
                  value={formData.año.toString()}
                  onValueChange={(value) => handleChange("año", Number.parseInt(value))}
                >
                  <SelectTrigger id="año">
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  placeholder="Blanco"
                  maxLength={15}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_vehiculo">Tipo de vehículo *</Label>
                <Select value={formData.tipo_vehiculo} onValueChange={(value) => handleChange("tipo_vehiculo", value)}>
                  <SelectTrigger id="tipo_vehiculo">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camion">Camión</SelectItem>
                    <SelectItem value="furgon">Furgón</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="camioneta">Camioneta</SelectItem>
                    <SelectItem value="motocicleta">Motocicleta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacidad_carga">Capacidad de carga (kg) *</Label>
                <Input
                  id="capacidad_carga"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.capacidad_carga}
                  onChange={(e) => handleChange("capacidad_carga", e.target.value)}
                  placeholder="1000.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacidad_combustible">Capacidad combustible (L) *</Label>
                <Input
                  id="capacidad_combustible"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.capacidad_combustible}
                  onChange={(e) => handleChange("capacidad_combustible", e.target.value)}
                  placeholder="60.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero_soat">Número SOAT *</Label>
                <Input
                  id="numero_soat"
                  value={formData.numero_soat}
                  onChange={(e) => handleChange("numero_soat", e.target.value)}
                  placeholder="1234567"
                  maxLength={7}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_vencimiento_soat">Fecha vencimiento SOAT *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="fecha_vencimiento_soat"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.fecha_vencimiento_soat && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fecha_vencimiento_soat ? (
                        format(new Date(formData.fecha_vencimiento_soat), "dd/MM/yyyy")
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.fecha_vencimiento_soat ? new Date(formData.fecha_vencimiento_soat) : undefined}
                      onSelect={handleDateChange}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gps_imei">GPS IMEI *</Label>
                <Input
                  id="gps_imei"
                  value={formData.gps_imei}
                  onChange={(e) => handleChange("gps_imei", e.target.value)}
                  placeholder="123456789012345"
                  maxLength={30}
                  required
                />
              </div>
            </div>

            {/* Estados */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="estado_vehiculo"
                  checked={formData.estado_vehiculo}
                  onCheckedChange={(checked: boolean) => handleChange("estado_vehiculo", checked)}
                />
                <Label htmlFor="estado_vehiculo">Vehículo activo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="gps_estado"
                  checked={formData.gps_estado}
                  onCheckedChange={(checked: boolean) => handleChange("gps_estado", checked)}
                />
                <Label htmlFor="gps_estado">GPS activo</Label>
              </div>
            </div>

            {/* Foto del vehículo */}
            <div className="space-y-2">
              <Label htmlFor="foto_vehiculo">Foto del vehículo (URL)</Label>
              <div className="flex gap-2">
                <Input
                  id="foto_vehiculo"
                  value={formData.foto_vehiculo}
                  onChange={(e) => handleChange("foto_vehiculo", e.target.value)}
                  placeholder="https://ejemplo.com/foto.jpg"
                  maxLength={255}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{vehiculo ? "Guardar cambios" : "Agregar vehículo"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
