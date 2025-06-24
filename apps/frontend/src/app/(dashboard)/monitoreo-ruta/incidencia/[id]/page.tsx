"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  DollarSign,
  Timer,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  FileText,
  PenToolIcon as Tool,
  Truck,
  ChevronRight,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { severityColors, incidentTypeIcons } from "@/data/constants"
import { MonitoreoEnRutaService } from "@/api/generated"

export default function AttendIncidentPage() {
  const params = useParams()
  const router = useRouter()
  const incidentId = params.id as string

  const [incident, setIncident] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const [isMapLoading, setIsMapLoading] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

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
      case 'temperatura':
        return 'Problema de Temperatura'
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

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800'
      case 'resuelta':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente'
      case 'en_proceso':
        return 'En Proceso'
      case 'resuelta':
        return 'Resuelta'
      default:
        return estado
    }
  }

  const initializeMap = async (lat: number, lng: number) => {
    try {
      setIsMapLoading(true)
      setMapError(null)
      setUseFallback(false)
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter({ lat, lng })
        setIsMapLoading(false)
        return
      }
      
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        setUseFallback(true)
        setIsMapLoading(false)
        return
      }
      
      if (!mapRef.current) {
        setMapError('Elemento del mapa no encontrado')
        setIsMapLoading(false)
        return
      }
      
      const { Loader } = await import('@googlemaps/js-api-loader')
      
      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['places']
      })

      const google = await loader.load()
      
      const map = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true
      })
      mapInstanceRef.current = map
      
      new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: 'Ubicación de la Incidencia',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#EF4444" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }
      })

      setIsMapLoading(false)
      setMapError(null)
      
    } catch (error) {
      setMapError('Error al cargar el mapa')
      setIsMapLoading(false)
      setUseFallback(true)
    }
  }

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const result = await MonitoreoEnRutaService.monitoreoEnRutaControllerGetIncidenciaDatos(incidentId)
        
        if (result && result.status) {
          setIncident(result.data)
          
          try {
            setIsLoadingHistory(true)
            const historyResult = await MonitoreoEnRutaService.monitoreoEnRutaControllerGetHistorialIncidencia(incidentId)
            if (historyResult && historyResult.status) {
              setHistory(historyResult.data)
            }
          } finally {
            setIsLoadingHistory(false)
          }
        } else {
          setError('No se pudo obtener la información de la incidencia')
        }
      } catch (error: any) {
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          setError('Error de conexión. Por favor, intente nuevamente.')
        } else if (error.body?.message) {
          setError(error.body.message)
        } else {
          setError('Ha ocurrido un error al cargar la incidencia')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncident()
  }, [incidentId])

  useEffect(() => {
    if (incident && incident.ubicacion_actual?.lat && incident.ubicacion_actual?.lng) {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          const lat = parseFloat((incident as any).ubicacion_actual.lat)
          const lng = parseFloat((incident as any).ubicacion_actual.lng)
          initializeMap(lat, lng)
        } else {
          setMapError('Elemento del mapa no disponible')
        }
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [incident])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Incidencia no encontrada</h1>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Detalles de la Incidencia</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{formatIncidentType(incident?.tipo_incidencia)}</span>
                <ChevronRight className="h-3 w-3" />
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident?.estado_incidencia)}`}
                >
                  {formatStatus(incident?.estado_incidencia)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Fila superior: Acciones Rápidas (izquierda) y Descripción del Incidente (derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Acciones Rápidas */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
            <h3 className="font-semibold mb-4">Acciones Rápidas</h3>
            <div className="flex flex-col gap-4 flex-1 justify-center">
              <Button className="w-full" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contactar Conductor
              </Button>
              {incident.estado_incidencia !== "Resuelto" && (
                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => router.push(`/monitoreo-ruta/incidencia/${incident.id_incidencia}/atender`)}
                >
                  Atender Incidencia
                </Button>
              )}
            </div>
            </div>
          {/* Descripción del Incidente (ahora a la derecha) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Descripción del Incidente</h2>
                <p className="text-sm text-gray-500">Detalles del reporte</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 flex-1">
              {incident?.descripcion || 'No hay descripción disponible'}
            </div>
          </div>
        </div>
        {/* El resto de tarjetas debajo, en su orden original pero intercambiando Vehículo y Ubicación */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información de la Incidencia */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Información de la Incidencia</h2>
                    <p className="text-sm text-gray-500">Detalles del incidente reportado</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-medium text-gray-500">Fecha y Hora</label>
                      <div className="font-medium text-sm">{new Date(incident?.fecha_registro).toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-medium text-gray-500">Reportado por</label>
                      <div className="font-medium text-sm">{incident?.nombre_usuario}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-medium text-gray-500">Tipo</label>
                      <div className="flex items-center gap-2 mt-1">
                        {incidentTypeIcons[incident?.tipo_incidencia] || incidentTypeIcons.otro}
                        <span className="font-medium text-sm">{formatIncidentType(incident?.tipo_incidencia)}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-medium text-gray-500">Severidad</label>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${severityColors[incident?.severidad] || 'bg-gray-100 text-gray-800'}`}>
                          {formatSeverity(incident?.severidad)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-medium text-gray-500">Estado Actual</label>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(incident?.estado_incidencia)}`}>
                          {formatStatus(incident?.estado_incidencia)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-medium text-gray-500">Descripción</label>
                      <div className="font-medium text-sm">{incident?.descripcion}</div>
                    </div>
                  </div>
                </div>
              </div>
          {/* Ubicación del Incidente (ahora a la derecha en la fila inferior) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Ubicación del Incidente</h2>
                <p className="text-sm text-gray-500">Localización geográfica</p>
              </div>
            </div>
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-medium text-gray-500">Coordenadas</label>
                <div className="font-medium text-sm">
                  {incident?.ubicacion_actual?.lat && incident?.ubicacion_actual?.lng 
                    ? `${incident.ubicacion_actual.lat}, ${incident.ubicacion_actual.lng}`
                    : 'No disponibles'
                  }
                </div>
              </div>
              {/* Mapa de Google Maps */}
              <div className="flex-1 min-h-[160px] bg-gray-100 rounded-lg relative overflow-hidden border border-gray-200">
                {/* Elemento del mapa siempre presente */}
                <div id="map" ref={mapRef} className="w-full h-full" />
                
                {/* Overlays condicionales */}
                {isMapLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-xs text-gray-600">Cargando mapa...</p>
                    </div>
                  </div>
                )}
                
                {useFallback && incident?.ubicacion_actual?.lat && incident?.ubicacion_actual?.lng && (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <div className="relative">
                      <div className="h-4 w-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        Ubicación del Incidente
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      {incident?.ubicacion_actual?.lat}, {incident?.ubicacion_actual?.lng}
                    </div>
                  </div>
                )}
                
                {mapError && !useFallback && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                    <div className="text-center p-4">
                      <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">{mapError}</p>
                    </div>
                  </div>
                )}
                
                {!incident?.ubicacion_actual?.lat || !incident?.ubicacion_actual?.lng ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                    <div className="text-center p-4">
                      <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">Ubicación no disponible</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {/* Vehículo Involucrado */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Vehículo Involucrado</h2>
                    <p className="text-sm text-gray-500">Información del vehículo afectado</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-medium text-gray-500">Modelo</label>
                      <div className="font-medium text-sm">{incident?.modelo}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-medium text-gray-500">Placa</label>
                      <div className="font-medium text-sm">{incident?.placa}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-medium text-gray-500">Conductor</label>
                      <div className="font-medium text-sm">{incident?.nombre_conductor}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-medium text-gray-500">Contacto</label>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{incident?.telefono_conductor}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-blue-600">
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          {/* Historial */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Incidencias Relacionadas</h2>
                <p className="text-sm text-gray-500">Registro de incidencias relacionadas</p>
              </div>
            </div>
            <div className="h-[144px] overflow-y-auto space-y-4 pr-2">
              {isLoadingHistory ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-xs text-gray-500 mt-1">Cargando historial...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500">No hay historial disponible</p>
                </div>
              ) : (
                history.slice(0, 10).map((item: any, index: number) => (
                  <div key={item.id_incidencia || index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="h-full w-px bg-gray-200"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{formatIncidentType(item.tipo_incidencia)}</span>
                        <span className="text-xs text-gray-500">{new Date(item.fecha_registro).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.descripcion}</p>
                      <p className="text-xs text-gray-400 mt-1">Relación: {item.tipo_relacion}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* Monitoreo en Tiempo Real - fila separada */}
        <div className="mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                <h2 className="text-lg font-semibold">Monitoreo Obtenido</h2>
                <p className="text-sm text-gray-500">Estado del vehículo</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">Velocidad</label>
                  <Timer className="h-3 w-3 text-gray-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-semibold">{incident?.velocidad || 0}</span>
                  <span className="text-xs text-gray-500">km/h</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">Combustible</label>
                  <DollarSign className="h-3 w-3 text-gray-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-semibold">{incident?.combustible_restante || 0}</span>
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">Temperatura</label>
                  <AlertTriangle className="h-3 w-3 text-gray-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-semibold">{incident?.temperatura_carga || 0}</span>
                  <span className="text-xs text-gray-500">°C</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">Compartimento</label>
                  <Tool className="h-3 w-3 text-gray-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-semibold capitalize">{incident?.estado_compartimento || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-right">
              Distancia recorrida: {incident?.distancia_recorrida || 0} km
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
