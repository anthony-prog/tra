import { Package, CheckCircle, BarChart3 } from "lucide-react"

interface CargoRouteCardProps {
  cargoData: {
    cargas: any[]
    fecha_despacho: string
    estado_recorrido: string
    paradas: any[]
    paradas_completadas: number
  }
  isLoading: boolean
}

export function CargoRouteCard({ cargoData, isLoading }: CargoRouteCardProps) {
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
          <Package className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold">Carga y Ruta</h2>
        </div>
      </div>

      {/* Cargo Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-5 max-h-48 overflow-y-auto">
        <h4 className="font-medium mb-3 text-sm">Detalles de la Carga</h4>
        {cargoData.cargas.length === 0 ? (
          <div className="text-xs text-gray-500">No hay cargas registradas</div>
        ) : (
          cargoData.cargas.map((carga, idx) => (
            <div key={carga.id_carga || idx} className="mb-3 border-b last:border-b-0 pb-2 last:pb-0">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                <div>
                  <p className="text-xs text-gray-500">Tipo de conservación</p>
                  <p className="font-medium">{carga.tipo_conservacion}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Peso total</p>
                  <p className="font-medium">{carga.peso_total}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rango temperatura</p>
                  <p className="font-medium">{carga.rango_inicial_temperatura_requerida}°C a {carga.rango_final_temperatura_requerida}°C</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Route Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Progreso de Ruta</h4>
          <span className="text-sm text-blue-600 font-medium">
            {cargoData.paradas_completadas}/{cargoData.paradas.length} paradas
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(cargoData.paradas_completadas / cargoData.paradas.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mb-4">
          {Math.round((cargoData.paradas_completadas / cargoData.paradas.length) * 100)}% Completado
        </div>

        {/* Stops List */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 bg-green-600 rounded-full mt-0.5 flex items-center justify-center text-white">
              <CheckCircle className="h-3 w-3" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-medium">Origen</p>
                <p className="text-xs text-gray-500">09:15 AM</p>
              </div>
              <p className="text-sm text-gray-600">{cargoData.paradas[0].nombre_origen}</p>
            </div>
          </div>

          {cargoData.paradas.map((stop: any, index: number) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`h-5 w-5 rounded-full mt-0.5 flex items-center justify-center ${
                  index < cargoData.paradas_completadas
                    ? "bg-green-600 text-white"
                    : index === cargoData.paradas_completadas
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {index < cargoData.paradas_completadas ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Parada {index + 1}</p>
                  <p className="text-xs text-gray-500">
                    {index < cargoData.paradas_completadas ? "Completada" : "Pendiente"}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {stop.nombre_punto || stop.nombre_origen || stop.nombre_destino || 'Sin nombre'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Information */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium mb-3 text-sm text-blue-800">Información del Viaje</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Inicio:</span>
            <span className="font-medium">{new Date(cargoData.fecha_despacho).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ETA:</span>
            <span className="font-medium">{cargoData.fecha_despacho}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tiempo restante:</span>
            <span className="font-medium text-blue-700">240 horas</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Distancia restante:</span>
            <span className="font-medium">240 KM</span>
          </div>
        </div>
      </div>
    </>
  )
} 