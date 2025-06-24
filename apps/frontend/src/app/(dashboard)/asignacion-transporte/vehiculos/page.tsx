"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import VehiculosTable from "../components/vehiculos/vehiculos-table"
import VehiculoFormModal from "../components/vehiculos/vehiculo-form-modal"
import DeleteConfirmModal from "../components/delete-confirm-modal"
import Image from "next/image"

// Datos de ejemplo actualizados según la estructura SQL
const vehiculosIniciales = [
  {
    id_vehiculo: "550e8400-e29b-41d4-a716-446655440001",
    placa: "ABC-123",
    marca: "Toyota",
    modelo: "Hilux",
    año: 2022,
    color: "Blanco",
    tipo_vehiculo: "camioneta",
    capacidad_carga: 1000.0,
    capacidad_combustible: 80.0,
    estado_vehiculo: true,
    numero_soat: "1234567",
    fecha_vencimiento_soat: "2024-12-31",
    gps_imei: "123456789012345",
    gps_estado: true,
    foto_vehiculo: "",
  },
  {
    id_vehiculo: "550e8400-e29b-41d4-a716-446655440002",
    placa: "DEF-456",
    marca: "Hyundai",
    modelo: "H100",
    año: 2021,
    color: "Azul",
    tipo_vehiculo: "furgon",
    capacidad_carga: 1500.0,
    capacidad_combustible: 60.0,
    estado_vehiculo: false,
    numero_soat: "2345678",
    fecha_vencimiento_soat: "2024-06-15",
    gps_imei: "234567890123456",
    gps_estado: true,
    foto_vehiculo: "",
  },
  {
    id_vehiculo: "550e8400-e29b-41d4-a716-446655440003",
    placa: "GHI-789",
    marca: "Volvo",
    modelo: "FH",
    año: 2020,
    color: "Rojo",
    tipo_vehiculo: "camion",
    capacidad_carga: 15000.0,
    capacidad_combustible: 400.0,
    estado_vehiculo: true,
    numero_soat: "3456789",
    fecha_vencimiento_soat: "2025-03-20",
    gps_imei: "345678901234567",
    gps_estado: true,
    foto_vehiculo: "",
  },
]

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState(vehiculosIniciales)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentVehiculo, setCurrentVehiculo] = useState<any>(null)
  const [vehiculoToDelete, setVehiculoToDelete] = useState<string | null>(null)

  const handleOpenForm = (vehiculo: any) => {
    setCurrentVehiculo(vehiculo)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setCurrentVehiculo(null)
    setIsFormOpen(true)
  }

  const handleOpenDelete = (id: string) => {
    setVehiculoToDelete(id)
    setIsDeleteOpen(true)
  }

  const handleSaveVehiculo = (vehiculo: any) => {
    if (vehiculo.id_vehiculo) {
      // Editar
      setVehiculos(vehiculos.map((v) => (v.id_vehiculo === vehiculo.id_vehiculo ? vehiculo : v)))
    } else {
      // Agregar - generar nuevo UUID simulado
      const newId = `550e8400-e29b-41d4-a716-${Date.now().toString().slice(-12)}`
      setVehiculos([...vehiculos, { ...vehiculo, id_vehiculo: newId }])
    }
    setIsFormOpen(false)
  }

  const handleDeleteVehiculo = () => {
    if (vehiculoToDelete) {
      setVehiculos(vehiculos.filter((v) => v.id_vehiculo !== vehiculoToDelete))
      setIsDeleteOpen(false)
      setVehiculoToDelete(null)
    }
  }

  return (
    <div className="space-y-6 h-full w-full p-8 max-w-7xl mx-auto">

      <VehiculosTable vehiculos={vehiculos} onEdit={handleOpenForm} onDelete={handleOpenDelete} />

      <VehiculoFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveVehiculo}
        vehiculo={currentVehiculo}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteVehiculo}
        title="Eliminar vehículo"
        description="¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer."
      />
    </div>
  )
}
