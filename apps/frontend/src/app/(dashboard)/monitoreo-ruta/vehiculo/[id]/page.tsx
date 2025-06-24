"use client"

import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  AlertTriangle,
  X,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { MonitoreoEnRutaService } from "@/api/generated"
import { VehicleDetailCard } from "./components/VehicleDetailCard"
import { DriverDetailCard } from "./components/DriverDetailCard"
import { SafetyComplianceCard } from "./components/SafetyComplianceCard"
import { CargoRouteCard } from "./components/CargoRouteCard"
import { MapCard } from "./components/MapCard"

interface MapData {
  origin: string
  coordinates: string
  stops: any[]
  totalStops: number
  currentLocation: string
  completedStops: number
  ruta_planificada: any[]
  recorrido_km: number
  distancia_km: number
  tiempo_estimado: any
}

interface CargoData {
  tipo_conservacion: string
  peso_total: number
  fecha_despacho: string
  estado_recorrido: string
  rango_temperatura_inicial: number
  rango_temperatura_final: number
  paradas: any[]
  paradas_completadas: number
}

export default function VehicleDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string

  const [showIncidentForm, setShowIncidentForm] = useState(false)
  const [incidentFormData, setIncidentFormData] = useState({
    type: "",
    severity: "",
    description: "",
  })
  const [vehicle, setVehicle] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [isDriverLoading, setIsDriverLoading] = useState(true)
  const [isVehicleLoading, setIsVehicleLoading] = useState(true)
  const [isCargoLoading, setIsCargoLoading] = useState(true)
  const [isSafetyLoading, setIsSafetyLoading] = useState(true)

  const [mapData, setMapData] = useState<any>(null)
  const [driverData, setDriverData] = useState<any>(null)
  const [vehicleData, setVehicleData] = useState<any>(null)
  const [cargoData, setCargoData] = useState<any>(null)
  const [safetyData, setSafetyData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        
        const [result, result2, result3] = await Promise.all([
          MonitoreoEnRutaService.monitoreoEnRutaControllerGetDespachoDatos(vehicleId),
          MonitoreoEnRutaService.monitoreoEnRutaControllerGetPuntosRuta(vehicleId),
          MonitoreoEnRutaService.monitoreoEnRutaControllerGetPuntosVisitados(vehicleId)
        ])

        if (result?.data) {
          setDriverData({
            nombre: result.data.conductor?.nombre_conductor || 'Sin conductor',
            telefono: result.data.conductor?.telefono_conductor || 'Sin teléfono',
            dni: result.data.conductor?.dni || 'Sin DNI',
            licencia: result.data.conductor?.tipo_licencia || 'Sin licencia',
            tipo_licencia: result.data.conductor?.tipo_licencia || 'Sin tipo de licencia',
            estado: result.data.conductor?.estado_conductor || false,
            experiencia: result.data.conductor?.fecha_vencimiento_licencia || 'Sin experiencia',
            fecha_emision: result.data.conductor?.fecha_emision_licencia || 'Sin fecha de emisión',
            fecha_vencimiento: result.data.conductor?.fecha_vencimiento_licencia || 'Sin fecha de vencimiento',
            email: result.data.conductor?.email_conductor || 'Sin email',
            direccion: result.data.conductor?.direccion_conductor || 'Sin dirección',
            fecha_nacimiento: result.data.conductor?.fecha_nacimiento || 'Sin fecha de nacimiento',
            foto: result.data.conductor?.foto_conductor || null
          })
          setIsDriverLoading(false)

          setVehicleData({
            placa: result.data.vehiculo?.placa || 'Sin placa',
            modelo: result.data.vehiculo?.modelo || 'Sin modelo',
            marca: result.data.vehiculo?.marca || 'Sin marca',
            color: result.data.vehiculo?.color || 'Sin color',
            año: result.data.vehiculo?.año || 0,
            estado: result.data.vehiculo?.estado_vehiculo || false,
            capacidad: result.data.vehiculo?.capacidad_carga || 0,
            capacidad_combustible: result.data.vehiculo?.capacidad_combustible || 0,
            gps_estado: result.data.vehiculo?.gps_estado || false,
            gps_imei: result.data.vehiculo?.gps_imei || 'Sin IMEI',
            soat: result.data.vehiculo?.numero_soat || 'Sin SOAT',
            vencimiento_soat: result.data.vehiculo?.fecha_vencimiento_soat || 'Sin fecha de vencimiento',
            foto: result.data.vehiculo?.foto_vehiculo || null
          })
          setIsVehicleLoading(false)

          setSafetyData({
            soat: result.data.vehiculo?.numero_soat || 'Sin SOAT',
            vencimiento_soat: result.data.vehiculo?.fecha_vencimiento_soat || 'Sin fecha de vencimiento',
            licencia: result.data.conductor?.tipo_licencia || 'Sin licencia',
            vencimiento_licencia: result.data.conductor?.fecha_vencimiento_licencia || 'Sin fecha de vencimiento',
            gps_estado: result.data.vehiculo?.gps_estado || false
          })
          setIsSafetyLoading(false)

          setCargoData({
            cargas: result.data.cargas || [],
            fecha_despacho: result.data.fecha_despacho || 'Sin fecha de despacho',
            estado_recorrido: result.data.estado_recorrido || 'Sin estado',
            paradas: [],
            paradas_completadas: 0
          })
          setIsCargoLoading(false)

          setVehicle({
            id: vehicleId,
            shipmentId: result.data.vehiculo?.placa || 'Sin placa',
            driver: result.data.conductor?.nombre_conductor || 'Sin conductor',
            vehicle: result.data.vehiculo?.placa || 'Sin vehículo',
            status: result.data.estado_recorrido || 'Sin estado'
          })
        }

        if (result2?.data) {
          setMapData((prev: MapData) => ({
            ...prev,
            origin: result2.data[0]?.nombre_origen || 'Sin origen',
            coordinates: `${result2.data[0]?.coordenada_origen?.lat}, ${result2.data[0]?.coordenada_origen?.lng}` || 'Sin coordenadas',
            stops: result2.data || [],
            totalStops: result2.data.length || 0,
            ruta_planificada: result2.data[0]?.ruta_planificada || [],
            recorrido_km: result2.data[0]?.recorrido_km || 0,
            distancia_km: result2.data[0]?.distancia_km || 0,
            tiempo_estimado: result2.data[0]?.tiempo_estimado || null
          }))

          setCargoData((prev: CargoData) => ({
            ...prev,
            paradas: result2.data || []
          }))
        }

        if (result3?.data) {
          setMapData((prev: MapData) => ({
            ...prev,
            currentLocation: result3.data[0]?.nombre_punto || 'Sin ubicación actual',
            completedStops: result3.data.filter((stop: any) => stop.visitado).length || 0
          }))

          setCargoData((prev: CargoData) => ({
            ...prev,
            paradas_completadas: result3.data.filter((stop: any) => stop.visitado).length || 0
          }))
        }

        if (result2?.data && result3?.data) {
          setIsMapLoading(false)
        }

      } catch (error: any) {
        console.error('Error al obtener datos del vehículo:', error)
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          setError('Error de conexión. Por favor, intente nuevamente.')
        } else if (error.body?.message) {
          setError(error.body.message)
        } else {
          setError('Ha ocurrido un error al obtener la información del vehículo')
        }
      }
    }

    fetchData()
  }, [vehicleId])

  // Componente de loading genérico
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Cargando...</p>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    )
  }


  // Calcular tiempo estimado restante
  const getEstimatedTimeRemaining = () => {
    const now = new Date()
    const estimatedCompletion = new Date(vehicle.estimatedCompletion)
    const diffInHours = Math.round((estimatedCompletion.getTime() - now.getTime()) / (1000 * 60 * 60))
    return `${diffInHours} horas`
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

  const handleReportIncident = () => {
    setShowIncidentForm(true)
    setIncidentFormData({ type: "", severity: "", description: "" })
  }

  const handleSubmitIncident = () => {
    console.log("Nueva incidencia:", {
      vehicle,
      ...incidentFormData,
    })
    setShowIncidentForm(false)
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">Vehículo</h1>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-blue-600">{vehicleData?.placa}</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      vehicle?.status === "en_ruta"
                        ? "bg-blue-100 text-blue-800"
                        : vehicle?.status === "despachado"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {vehicle?.status === "en_ruta" ? "En Ruta" : 
                     vehicle?.status === "despachado" ? "Despachado" : 
                     vehicle?.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Última actualización</p>
                  <p className="text-sm font-medium">Hace 35 minutos</p>
                </div>
                <Button className="bg-red-500 hover:bg-red-600 text-sm h-8" onClick={handleReportIncident}>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Reportar Incidencia
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex-1 lg:overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full">
        {/* Map Section */}
          <div className="w-full lg:w-[calc(100%-400px)] h-[400px] lg:h-full relative">
            <MapCard mapData={mapData} isLoading={isMapLoading} />
        </div>

        {/* Right Sidebar */}
          <div className="w-full lg:w-[400px] bg-white border-t lg:border-l lg:border-t-0 lg:overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 p-4">
          {/* Driver Details Section */}
              <div className="bg-white rounded-lg shadow-sm">
                <DriverDetailCard driverData={driverData} isLoading={isDriverLoading} />
          </div>

          {/* Vehicle Details Section */}
              <div className="bg-white rounded-lg shadow-sm">
                <VehicleDetailCard vehicleData={vehicleData} isLoading={isVehicleLoading} />
          </div>

          {/* Cargo & Route Section */}
              <div className="bg-white rounded-lg shadow-sm md:col-span-2 lg:col-span-1">
                <CargoRouteCard cargoData={cargoData} isLoading={isCargoLoading} />
          </div>

          {/* Safety & Compliance */}
              <div className="bg-white rounded-lg shadow-sm md:col-span-2 lg:col-span-1">
                <SafetyComplianceCard safetyData={safetyData} isLoading={isSafetyLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Reportar Incidencia */}
      {showIncidentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Reportar Incidencia</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowIncidentForm(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Información del Vehículo (Solo lectura) */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Información del Vehículo</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Conductor:</span>
                    <span className="font-medium">{driverData?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vehículo:</span>
                    <span className="font-medium">{vehicleData?.placa} - {vehicleData?.marca} {vehicleData?.modelo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ubicación Actual:</span>
                    <span className="font-medium">{mapData?.currentLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Coordenadas:</span>
                    <span className="font-medium">{mapData?.coordinates}</span>
                  </div>
                </div>
              </div>

              {/* Formulario de Incidencia */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidencia</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={incidentFormData.type}
                    onChange={(e) => setIncidentFormData({ ...incidentFormData, type: e.target.value })}
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Accidente de tráfico">Accidente de tráfico</option>
                    <option value="Falla mecánica">Falla mecánica</option>
                    <option value="Retraso">Retraso</option>
                    <option value="Problema con cliente">Problema con cliente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severidad</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={incidentFormData.severity}
                    onChange={(e) => setIncidentFormData({ ...incidentFormData, severity: e.target.value })}
                  >
                    <option value="">Seleccionar severidad</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <Textarea
                    placeholder="Describe detalladamente la incidencia..."
                    className="w-full text-sm"
                    rows={3}
                    value={incidentFormData.description}
                    onChange={(e) => setIncidentFormData({ ...incidentFormData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowIncidentForm(false)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={handleSubmitIncident}
                  disabled={!incidentFormData.type || !incidentFormData.severity || !incidentFormData.description}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Reportar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">😢</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
              <div className="flex justify-center gap-4">
                <Button onClick={() => setError(null)}>Cerrar</Button>
                <Button onClick={() => router.back()}>Volver</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
