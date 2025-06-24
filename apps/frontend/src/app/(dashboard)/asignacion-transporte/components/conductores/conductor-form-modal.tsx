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
import { Textarea } from "@/components/ui/textarea"

interface ConductorFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (conductor: any) => void
  conductor: any
}

export default function ConductorFormModal({ isOpen, onClose, onSave, conductor }: ConductorFormModalProps) {
  const [formData, setFormData] = useState({
    id_conductor: null,
    DNI: "",
    nombre_conductor: "",
    telefono_conductor: "",
    email_conductor: "",
    direccion_conductor: "",
    estado_conductor: true,
    tipo_licencia: "",
    fecha_emision_licencia: "",
    fecha_vencimiento_licencia: "",
    fecha_nacimiento: "",
    genero: "",
    foto_conductor: "",
  })

  useEffect(() => {
    if (conductor) {
      setFormData(conductor)
    } else {
      setFormData({
        id_conductor: null,
        DNI: "",
        nombre_conductor: "",
        telefono_conductor: "",
        email_conductor: "",
        direccion_conductor: "",
        estado_conductor: true,
        tipo_licencia: "",
        fecha_emision_licencia: "",
        fecha_vencimiento_licencia: "",
        fecha_nacimiento: "",
        genero: "",
        foto_conductor: "",
      })
    }
  }, [conductor, isOpen])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        [field]: format(date, "yyyy-MM-dd"),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{conductor ? "Editar conductor" : "Agregar nuevo conductor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Información personal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="DNI">DNI *</Label>
                <Input
                  id="DNI"
                  value={formData.DNI}
                  onChange={(e) => handleChange("DNI", e.target.value.replace(/\D/g, ""))}
                  placeholder="12345678"
                  maxLength={8}
                  pattern="[0-9]{8}"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre_conductor">Nombre completo *</Label>
                <Input
                  id="nombre_conductor"
                  value={formData.nombre_conductor}
                  onChange={(e) => handleChange("nombre_conductor", e.target.value)}
                  placeholder="Juan Pérez García"
                  maxLength={60}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono_conductor">Teléfono *</Label>
                <Input
                  id="telefono_conductor"
                  value={formData.telefono_conductor}
                  onChange={(e) => handleChange("telefono_conductor", e.target.value.replace(/\D/g, ""))}
                  placeholder="987654321"
                  maxLength={9}
                  pattern="[0-9]{9}"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_conductor">Email *</Label>
                <Input
                  id="email_conductor"
                  type="email"
                  value={formData.email_conductor}
                  onChange={(e) => handleChange("email_conductor", e.target.value)}
                  placeholder="conductor@ejemplo.com"
                  maxLength={80}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genero">Género *</Label>
                <Select value={formData.genero} onValueChange={(value) => handleChange("genero", value)}>
                  <SelectTrigger id="genero">
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de nacimiento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="fecha_nacimiento"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.fecha_nacimiento && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fecha_nacimiento ? (
                        format(new Date(formData.fecha_nacimiento), "dd/MM/yyyy")
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.fecha_nacimiento ? new Date(formData.fecha_nacimiento) : undefined}
                      onSelect={(date) => handleDateChange("fecha_nacimiento", date)}
                      initialFocus
                      locale={es}
                      defaultMonth={new Date(1990, 0)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion_conductor">Dirección</Label>
              <Textarea
                id="direccion_conductor"
                value={formData.direccion_conductor}
                onChange={(e) => handleChange("direccion_conductor", e.target.value)}
                placeholder="Av. Principal 123, Lima"
                maxLength={120}
                rows={2}
              />
            </div>

            {/* Información de licencia */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Información de Licencia</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo_licencia">Tipo de licencia *</Label>
                  <Select
                    value={formData.tipo_licencia}
                    onValueChange={(value) => handleChange("tipo_licencia", value)}
                  >
                    <SelectTrigger id="tipo_licencia">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A-I">A-I (Motocicleta hasta 125cc)</SelectItem>
                      <SelectItem value="A-IIa">A-IIa (Motocicleta hasta 250cc)</SelectItem>
                      <SelectItem value="A-IIb">A-IIb (Motocicleta más de 250cc)</SelectItem>
                      <SelectItem value="A-III">A-III (Mototaxi)</SelectItem>
                      <SelectItem value="B-I">B-I (Automóvil)</SelectItem>
                      <SelectItem value="B-IIa">B-IIa (Camioneta hasta 3.5 ton)</SelectItem>
                      <SelectItem value="B-IIb">B-IIb (Camión hasta 8 ton)</SelectItem>
                      <SelectItem value="B-IIc">B-IIc (Camión más de 8 ton)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha_emision_licencia">Fecha de emisión *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="fecha_emision_licencia"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.fecha_emision_licencia && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fecha_emision_licencia ? (
                          format(new Date(formData.fecha_emision_licencia), "dd/MM/yyyy")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          formData.fecha_emision_licencia ? new Date(formData.fecha_emision_licencia) : undefined
                        }
                        onSelect={(date) => handleDateChange("fecha_emision_licencia", date)}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha_vencimiento_licencia">Fecha de vencimiento *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="fecha_vencimiento_licencia"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.fecha_vencimiento_licencia && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fecha_vencimiento_licencia ? (
                          format(new Date(formData.fecha_vencimiento_licencia), "dd/MM/yyyy")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          formData.fecha_vencimiento_licencia
                            ? new Date(formData.fecha_vencimiento_licencia)
                            : undefined
                        }
                        onSelect={(date) => handleDateChange("fecha_vencimiento_licencia", date)}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    id="estado_conductor"
                    checked={formData.estado_conductor}
                    onCheckedChange={(checked) => handleChange("estado_conductor", checked)}
                  />
                  <Label htmlFor="estado_conductor">Conductor activo</Label>
                </div>
              </div>
            </div>

            {/* Foto del conductor */}
            <div className="space-y-2">
              <Label htmlFor="foto_conductor">Foto del conductor (URL)</Label>
              <div className="flex gap-2">
                <Input
                  id="foto_conductor"
                  value={formData.foto_conductor}
                  onChange={(e) => handleChange("foto_conductor", e.target.value)}
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
            <Button type="submit">{conductor ? "Guardar cambios" : "Agregar conductor"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
