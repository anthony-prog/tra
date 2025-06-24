import { Button } from "@/components/ui/button"
import { Info, Phone, CheckCircle } from "lucide-react"
import { statusColors, incidentStatusColors, severityColors, incidentTypeIcons } from "@/data/constants"
import { useRouter } from "next/navigation"

interface SidebarProps {
  activeTab: string;
  selectedVehicle: any;
  selectedIncident: any;
  handleViewVehicleDetails: (id: string) => void;
  handleAttendIncident: (id: string) => void;
  handleViewVehicleFromIncident: (incident: any) => void;
  error?: string | null;
}

export default function Sidebar({ 
  activeTab, 
  selectedVehicle, 
  selectedIncident,
  handleViewVehicleDetails,
  handleAttendIncident,
  handleViewVehicleFromIncident,
  error
}: SidebarProps) {
  const router = useRouter()

  const formatIncidentType = (tipo: string) => {
    switch (tipo) {
      case 'accidente':
        return 'Accidente de Tránsito'
      case 'averia_vehiculo':
        return 'Avería del Vehículo'
      case 'desvio_ruta':
        return 'Desvío de Ruta'
      case 'problema_temperatura':
        return 'Problema de Temperatura'
      case 'retraso':
        return 'Retraso en la Entrega'
      case 'clima_adverso':
        return 'Clima Adverso'
      case 'problema_trafico':
        return 'Problema de Tráfico'
      case 'apertura_no_autorizada':
        return 'Apertura No Autorizada'
      case 'otro':
        return 'Otro'
      default:
        return tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const formatSeverity = (severidad: string) => {
    switch (severidad) {
      case 'baja':
        return 'Baja'
      case 'media':
        return 'Media'
      case 'alta':
        return 'Alta'
      case 'critica':
        return 'Crítica'
      default:
        return severidad.charAt(0).toUpperCase() + severidad.slice(1)
    }
  }

  return (
    <div className="hidden lg:block lg:w-1/3 p-4 bg-white border-l">
    {activeTab === "Vehicles" && (
      <div className="space-y-2">
        <h2 className="text-base font-semibold">Detalles del Envío</h2>

        {!selectedVehicle ? (
          <div className="text-center py-8">
            {error ? (
              <>
                <div className="text-4xl mb-2">😢</div>
                <p className="text-sm text-gray-500">{error}</p>
              </>
            ) : (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Cargando detalles...</p>
              </>
            )}
          </div>
        ) : (
        <div className="space-y-2">
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-1">Información del Envío</div>
            <div className="space-y-0.5 text-xs">
              <div className="grid grid-cols-3">
                <span className="text-gray-500 col-span-1">Placa:</span>
                <span className="font-medium col-span-2">{selectedVehicle.placa_vehiculo}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-500 col-span-1">Peso Total:</span>
                <span className="font-medium col-span-2">{selectedVehicle.weight} kg</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-500 col-span-1">Estado:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${statusColors[selectedVehicle.status]}`}
                >
                    {selectedVehicle.status === 'en_ruta' ? 'En Ruta' : 
                     selectedVehicle.status === 'completada' ? 'Completada' :
                     selectedVehicle.status === 'cancelada' ? 'Cancelada' : selectedVehicle.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-1">Conductor y Vehículo</div>
            <div className="space-y-0.5 text-xs">
              <div className="grid grid-cols-3">
                <span className="text-gray-500 col-span-1">Conductor:</span>
                <span className="font-medium col-span-2">{selectedVehicle.driver}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-500 col-span-1">Modelo:</span>
                <span className="font-medium col-span-2">{(selectedVehicle.modelo || 'N/A').toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-1">Ruta y Paradas</div>
            <div className="space-y-1 text-xs">
              <div>
                <div className="font-medium text-gray-700">Origen:</div>
                <div className="text-gray-600">{selectedVehicle.origin}</div>
              </div>

              <div>
                <div className="font-medium text-gray-700">
                    Paradas ( {selectedVehicle.totalStops} ):
                </div>
                <div className="mt-0.5 space-y-0.5">
                    {selectedVehicle.stops.map((stop: { orden_parada: number; nombre_destino: string }, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center text-xs ${
                          index < selectedVehicle.completedStops
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {stop.orden_parada}
                      </div>
                      <span
                        className={`text-xs ${
                          index < selectedVehicle.completedStops ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {stop.nombre_destino}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-1">Carga</div>
            <div className="space-y-0.5 text-xs">
              <div className="grid grid-cols-3">
                <span className="text-gray-500 col-span-1">Tipo:</span>
                <span className="font-medium col-span-2">{selectedVehicle.cargo}</span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="text-xs font-medium text-blue-800 mb-1">Fechas</div>
            <div className="space-y-0.5 text-xs">
              <div className="grid grid-cols-3">
                <span className="text-blue-600 col-span-1">Despacho:</span>
                <span className="font-medium text-blue-900 col-span-2">{selectedVehicle.dispatchDate}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-blue-600 col-span-1">Finalización:</span>
                <span className="font-medium text-blue-900 col-span-2">
                  {selectedVehicle.estimatedCompletion}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 h-8 text-xs bg-white text-black border border-black hover:bg-gray-100"
              onClick={() => handleViewVehicleDetails(selectedVehicle.id)}
            >
              <Info className="h-3 w-3 mr-1" />
              Más Detalles
            </Button>
            <Button variant="outline" className="flex-1 h-8 text-xs">
              Contactar
            </Button>
          </div>
        </div>
        )}
      </div>
    )}

    {/* Incident Details */}
    {activeTab === "Incidents" && (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold">Detalles de la Incidencia</h2>
        </div>

        {!selectedIncident ? (
          <div className="text-center py-8">
            {error ? (
              <>
                <div className="text-4xl mb-2">😢</div>
                <p className="text-sm text-gray-500">{error}</p>
              </>
            ) : (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Cargando detalles...</p>
              </>
            )}
          </div>
        ) : (
        <div className="space-y-2">
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-1">Información General</div>
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Tipo:</span>
                <div className="flex items-center gap-1">
                  {incidentTypeIcons[selectedIncident.tipo_incidencia] || incidentTypeIcons.otro}
                  <span className="font-medium capitalize">{formatIncidentType(selectedIncident.tipo_incidencia)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estado:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedIncident.estado_incidencia === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    selectedIncident.estado_incidencia === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                    selectedIncident.estado_incidencia === 'resuelta' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {selectedIncident.estado_incidencia === 'pendiente' ? 'Pendiente' :
                   selectedIncident.estado_incidencia === 'en_proceso' ? 'En Proceso' :
                   selectedIncident.estado_incidencia === 'resuelta' ? 'Resuelta' :
                   selectedIncident.estado_incidencia}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Severidad:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    severityColors[selectedIncident.severidad] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {formatSeverity(selectedIncident.severidad)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reportado por:</span>
                <span className="font-medium">{selectedIncident.nombre_usuario}</span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-1">Vehículo y Conductor</div>
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Modelo:</span>
                <span className="font-medium">{selectedIncident.modelo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Placa:</span>
                <span className="font-medium">{selectedIncident.placa_vehiculo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Conductor:</span>
                <span className="font-medium">{selectedIncident.nombre_conductor}</span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-1">Ubicación y Hora</div>
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Ubicación:</span>
                <span className="font-medium">{`${selectedIncident.ubicacion_actual.x}, ${selectedIncident.ubicacion_actual.y}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hora:</span>
                <span className="font-medium">{new Date(selectedIncident.fecha_registro).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha:</span>
                <span className="font-medium">{new Date(selectedIncident.fecha_registro).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-1">Descripción</div>
            <div className="text-xs text-gray-700 mt-1">{selectedIncident.descripcion}</div>
          </div>

          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="text-xs font-medium text-blue-800 mb-1">Contacto</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-600">{selectedIncident.telefono_conductor}</span>
              <Button size="sm" variant="ghost" className="h-6 text-xs text-blue-600 hover:bg-blue-100">
                <Phone className="h-3 w-3 mr-1" />
                Llamar
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 h-8 text-xs bg-green-500 hover:bg-green-600"
              disabled={selectedIncident.estado_incidencia === "resuelta"}
              onClick={() => router.push(`/monitoreo-ruta/incidencia/${selectedIncident.id_incidencia}/atender`)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {selectedIncident.estado_incidencia === "pendiente" ? "Atender Incidencia" : "Resolver Incidencia"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={() => router.push(`/monitoreo-ruta/incidencia/${selectedIncident.id_incidencia}`)}
            >
              <Info className="h-3 w-3 mr-1" />
              Más Detalles
            </Button>
          </div>
        </div>
        )}
      </div>
    )}
  </div>
  );
}