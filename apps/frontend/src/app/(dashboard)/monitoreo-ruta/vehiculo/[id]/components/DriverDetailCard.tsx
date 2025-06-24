import { User, Phone, Mail, MapPin, IdCard, Car, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DriverDetailCardProps {
  driverData: {
    nombre: string
    telefono: string
    dni: string
    licencia: string
    tipo_licencia: string
    estado: boolean
    experiencia: string
    fecha_emision: string
    fecha_vencimiento: string
    fecha_nacimiento: string
    email: string
    direccion: string
    foto: string | null
  }
  isLoading: boolean
}

export function DriverDetailCard({ driverData, isLoading }: DriverDetailCardProps) {
  const [imgError, setImgError] = useState(false)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Calcular edad del conductor
  const getAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // Calcular experiencia en años desde la fecha de emisión
  const getExperienceYears = (fechaEmision: string) => {
    if (!fechaEmision) return '0'
    const today = new Date()
    const emision = new Date(fechaEmision)
    let years = today.getFullYear() - emision.getFullYear()
    const monthDiff = today.getMonth() - emision.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < emision.getDate())) {
      years--
    }
    return years < 0 ? 0 : years
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Información del Conductor</h2>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
          {driverData.foto && !imgError ? (
            <img
              src={driverData.foto}
              alt="Foto del conductor"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-600 text-4xl font-bold bg-blue-100">
              C
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{driverData.nombre}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            <div>
              <p className="text-xs text-gray-500">DNI</p>
              <p className="text-sm font-medium">{driverData.dni}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Edad</p>
              <p className="text-sm font-medium">{getAge(driverData.fecha_nacimiento)} años</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Licencia</p>
              <p className="text-sm font-medium">{driverData.licencia}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tipo</p>
              <p className="text-sm font-medium">{driverData.tipo_licencia}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{driverData.telefono}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-gray-400" />
          <span>{driverData.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-xs">{driverData.direccion}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Phone className="h-4 w-4 mr-2" />
          Llamar
        </Button>
        <Button variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
      </div>

      {/* Licencia Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Información de Licencia</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-500">Emisión</p>
            <p className="font-medium">{new Date(driverData.fecha_emision).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Vencimiento</p>
            <p className="font-medium">
              {new Date(driverData.fecha_vencimiento).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Experiencia</p>
            <p className="font-medium">{getExperienceYears(driverData.fecha_emision)} años</p>
          </div>
          <div>
            <p className="text-gray-500">Estado</p>
            <p className={`font-medium ${driverData.estado ? "text-green-600" : "text-red-600"}`}>
              {driverData.estado ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>
      </div>
    </>
  )
} 