"use client"

import { useState } from "react"
import AsignacionForm from "../components/asignacion/asignacion-form"
import AsignacionSuccessModal from "../components/asignacion/asignacion-success-modal"
import Image from "next/image"

// Datos de ejemplo actualizados según la estructura SQL
const vehiculos = [
  {
    id_vehiculo: "550e8400-e29b-41d4-a716-446655440001",
    placa: "ABC-123",
    marca: "Toyota",
    modelo: "Hilux",
    año: 2022,
    color: "Blanco",
    tipo_vehiculo: "camioneta",
    capacidad_carga: 1000.0,
    estado_vehiculo: true,
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
    estado_vehiculo: true,
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
    estado_vehiculo: true,
  },
]

const conductores = [
  {
    id_conductor: "550e8400-e29b-41d4-a716-446655440001",
    DNI: "45678912",
    nombre_conductor: "Juan Carlos Pérez García",
    telefono_conductor: "987654321",
    tipo_licencia: "B-IIb",
    estado_conductor: true,
  },
  {
    id_conductor: "550e8400-e29b-41d4-a716-446655440002",
    DNI: "23456789",
    nombre_conductor: "María Elena López Rodríguez",
    telefono_conductor: "976543210",
    tipo_licencia: "B-IIa",
    estado_conductor: true,
  },
  {
    id_conductor: "550e8400-e29b-41d4-a716-446655440003",
    DNI: "34567891",
    nombre_conductor: "Carlos Alberto Rodríguez Sánchez",
    telefono_conductor: "965432109",
    tipo_licencia: "B-IIc",
    estado_conductor: true,
  },
]

const planesEntrega = [
  {
    id_plan_entrega: "550e8400-e29b-41d4-a716-446655440001",
    codigo_plan: "PE-001",
    destino: "Lima - Arequipa",
    fecha_entrega: "2024-01-15",
    descripcion: "Entrega de productos alimentarios",
  },
  {
    id_plan_entrega: "550e8400-e29b-41d4-a716-446655440002",
    codigo_plan: "PE-002",
    destino: "Lima - Trujillo",
    fecha_entrega: "2024-01-16",
    descripcion: "Entrega de productos congelados",
  },
  {
    id_plan_entrega: "550e8400-e29b-41d4-a716-446655440003",
    codigo_plan: "PE-003",
    destino: "Lima - Cusco",
    fecha_entrega: "2024-01-17",
    descripcion: "Entrega de productos frescos",
  },
]

export default function AsignacionPage() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [asignacionCreada, setAsignacionCreada] = useState<any>(null)

  const handleAsignacionCreada = (asignacion: any) => {
    setAsignacionCreada(asignacion)
    setIsSuccessModalOpen(true)
  }

  return (
    <div className="space-y-6 h-full w-full p-8 max-w-7xl mx-auto">

      <AsignacionForm
        vehiculos={vehiculos}
        conductores={conductores}
        planesEntrega={planesEntrega}
        onAsignacionCreada={handleAsignacionCreada}
      />

      <AsignacionSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        asignacion={asignacionCreada}
      />
    </div>
  )
}
