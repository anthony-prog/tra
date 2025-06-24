"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import ConductoresTable from "../components/conductores/conductores-table"
import ConductorFormModal from "../components/conductores/conductor-form-modal"
import DeleteConfirmModal from "../components/delete-confirm-modal"
import Image from "next/image"

// Datos de ejemplo actualizados según la estructura SQL
const conductoresIniciales = [
  {
    id_conductor: "550e8400-e29b-41d4-a716-446655440001",
    DNI: "45678912",
    nombre_conductor: "Juan Carlos Pérez García",
    telefono_conductor: "987654321",
    email_conductor: "juan.perez@email.com",
    direccion_conductor: "Av. Los Olivos 123, Lima",
    estado_conductor: true,
    tipo_licencia: "B-IIb",
    fecha_emision_licencia: "2020-06-15",
    fecha_vencimiento_licencia: "2025-06-15",
    fecha_nacimiento: "1985-03-20",
    genero: "masculino",
    foto_conductor: "",
  },
  {
    id_conductor: "550e8400-e29b-41d4-a716-446655440002",
    DNI: "23456789",
    nombre_conductor: "María Elena López Rodríguez",
    telefono_conductor: "976543210",
    email_conductor: "maria.lopez@email.com",
    direccion_conductor: "Jr. Las Flores 456, Lima",
    estado_conductor: true,
    tipo_licencia: "B-IIa",
    fecha_emision_licencia: "2021-08-22",
    fecha_vencimiento_licencia: "2024-08-22",
    fecha_nacimiento: "1990-07-15",
    genero: "femenino",
    foto_conductor: "",
  },
  {
    id_conductor: "550e8400-e29b-41d4-a716-446655440003",
    DNI: "34567891",
    nombre_conductor: "Carlos Alberto Rodríguez Sánchez",
    telefono_conductor: "965432109",
    email_conductor: "carlos.rodriguez@email.com",
    direccion_conductor: "Av. Principal 789, Lima",
    estado_conductor: false,
    tipo_licencia: "B-IIc",
    fecha_emision_licencia: "2019-12-10",
    fecha_vencimiento_licencia: "2023-12-10",
    fecha_nacimiento: "1982-11-05",
    genero: "masculino",
    foto_conductor: "",
  },
]

export default function ConductoresPage() {
  const [conductores, setConductores] = useState(conductoresIniciales)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentConductor, setCurrentConductor] = useState<any>(null)
  const [conductorToDelete, setConductorToDelete] = useState<string | null>(null)

  const handleOpenForm = (conductor: any) => {
    setCurrentConductor(conductor)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setCurrentConductor(null)
    setIsFormOpen(true)
  }

  const handleOpenDelete = (id: string) => {
    setConductorToDelete(id)
    setIsDeleteOpen(true)
  }

  const handleSaveConductor = (conductor: any) => {
    if (conductor.id_conductor) {
      // Editar
      setConductores(conductores.map((c) => (c.id_conductor === conductor.id_conductor ? conductor : c)))
    } else {
      // Agregar - generar nuevo UUID simulado
      const newId = `550e8400-e29b-41d4-a716-${Date.now().toString().slice(-12)}`
      setConductores([...conductores, { ...conductor, id_conductor: newId }])
    }
    setIsFormOpen(false)
  }

  const handleDeleteConductor = () => {
    if (conductorToDelete) {
      setConductores(conductores.filter((c) => c.id_conductor !== conductorToDelete))
      setIsDeleteOpen(false)
      setConductorToDelete(null)
    }
  }

  return (
    <div className="space-y-6 h-full w-full p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">  
        <div className="flex items-center gap-4">
          <Button onClick={() => handleAddNew()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar conductor
          </Button>
        </div>
      </div>

      <ConductoresTable conductores={conductores} onEdit={handleOpenForm} onDelete={handleOpenDelete} />

      <ConductorFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveConductor}
        conductor={currentConductor}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConductor}
        title="Eliminar conductor"
        description="¿Estás seguro de que deseas eliminar este conductor? Esta acción no se puede deshacer."
      />
    </div>
  )
}
