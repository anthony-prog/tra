import { Truck, Gauge, Package, FileText, Fuel, Settings, AlertTriangle, Thermometer } from "lucide-react"
import { useState } from "react"

interface VehicleDetailCardProps {
  vehicleData: {
    placa: string
    modelo: string
    tipo: string
    estado: boolean
    capacidad: number
    gps_estado: boolean
    gps_imei: string
    soat: string
    vencimiento_soat: string
    marca: string
    año: string
    color: string
    capacidad_combustible: string
    foto: string | null
  }
  isLoading: boolean
}

export function VehicleDetailCard({ vehicleData, isLoading }: VehicleDetailCardProps) {
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

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-orange-600" />
          <h2 className="text-lg font-semibold">Detalles del Vehículo</h2>
        </div>
      </div>

      <div className="flex gap-5 mb-5">
        <div className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
          {vehicleData.foto && !imgError ? (
            <img
              src={vehicleData.foto}
              alt="Foto del vehículo"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-orange-600 text-4xl font-bold bg-orange-100">
              V
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">
            {vehicleData.marca} {vehicleData.modelo}
          </h3>
          <p className="text-sm text-gray-600 mb-1">{vehicleData.tipo}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            <div>
              <p className="text-xs text-gray-500">Placa</p>
              <p className="text-sm font-medium">{vehicleData.placa}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Año</p>
              <p className="text-sm font-medium">{vehicleData.año}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Color</p>
              <p className="text-sm font-medium">{vehicleData.color}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Estado</p>
              <p
                className={`text-sm font-medium ${vehicleData.estado ? "text-green-600" : "text-red-600"}`}
              >
                {vehicleData.estado ? "Activo" : "Inactivo"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Specifications */}
      <div className="bg-gray-50 rounded-lg p-4 mb-5">
        <h4 className="font-medium mb-3 text-sm">Especificaciones Técnicas</h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-xs text-gray-500">Capacidad de carga</p>
            <p className="font-medium">{vehicleData.capacidad} Ton</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Capacidad combustible</p>
            <p className="font-medium">{vehicleData.capacidad_combustible} L</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">IMEI GPS</p>
            <p className="font-medium text-xs">{vehicleData.gps_imei}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">GPS Estado</p>
            <p className={`font-medium ${vehicleData.gps_estado ? "text-green-600" : "text-red-600"}`}>
              {vehicleData.gps_estado ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Combustible</span>
          </div>
          <span className="text-sm font-semibold text-green-600">85%</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Motor</span>
          </div>
          <span className="text-sm font-semibold text-blue-600">Activo</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">Mantenimiento</span>
          </div>
          <span className="text-sm font-semibold text-yellow-600">Próximo</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Temperatura</span>
          </div>
          <span className="text-sm font-semibold text-purple-600">Normal</span>
        </div>
      </div>
    </>
  )
} 