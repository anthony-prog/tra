"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  DollarSign,
  Timer,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Calendar,
  FileText,
  PenToolIcon as Tool,
  Truck,
  ChevronRight,
  Info,
  BarChart3,
  Search,
  User,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { severityColors, incidentStatusColors, incidentTypeIcons } from "@/data/constants"
import FinalizeModal from "./components/finalize-modal"
import { MonitoreoEnRutaService } from "@/api/generated"
import { EstadoAccion } from "@/constants/accionEnums"
import { UpdateIncidenciaDto } from "@/api/generated/models/UpdateIncidenciaDto"
import { AutenticaciNService } from "@/api/generated"

export default function AtenderIncidenciaPage() {
  const params = useParams()
  const router = useRouter()
  const incidentId = params.id as string

  const [incident, setIncident] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado para controlar el modo de atención (En proceso vs Resolver)
  const [attendMode, setAttendMode] = useState<"process" | "resolve">("process")

  // Estado para el modal de finalización
  const [showFinalizeModal, setShowFinalizeModal] = useState(false)

  // Estado para el buscador de técnicos
  const [searchTechnician, setSearchTechnician] = useState("")
  const [selectedTechnician, setSelectedTechnician] = useState("")
  const [availableTechnicians, setAvailableTechnicians] = useState<any[]>([])
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(false)

  // Modificar la estructura de datos del formulario para alinearla con la tabla Solucion_incidencia
  const [resolveFormData, setResolveFormData] = useState({
    solution: "", // descripcion_solucion
    cost: "", // costo_solucion
    time: "", // tiempo_resolucion
    observations: "", // observaciones
    assignedTechnician: "", // id_usuario (referencia)
    status: "En proceso", // Por defecto, al atender pasa a "En proceso"
  })

  // Validación de formulario
  const [errors, setErrors] = useState({
    solution: "",
    assignedTechnician: "",
  })

  // Funciones de formateo para los enums
  const formatIncidentType = (tipo: string) => {
    switch (tipo) {
      case 'accidente':
        return 'Accidente'
      case 'averia_vehiculo':
        return 'Avería de Vehículo'
      case 'desvio_ruta':
        return 'Desvío de Ruta'
      case 'problema_temperatura':
        return 'Problema de Temperatura'
      case 'retraso':
        return 'Retraso'
      case 'clima_adverso':
        return 'Clima Adverso'
      case 'problema_trafico':
        return 'Problema de Tráfico'
      case 'apertura_no_autorizada':
        return 'Apertura No Autorizada'
      case 'otro':
        return 'Otro'
      default:
        return tipo
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
        return severidad
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

  // Fetch de usuarios
  const fetchUsers = async (searchTerm: string = "") => {
    try {
      setIsLoadingTechnicians(true)
      const result: any = await AutenticaciNService.authControllerSearchUsers(searchTerm, "20")
      
      console.log('Respuesta de usuarios:', result)
      
      if (result && result.status === true && result.data) {
        console.log('Usuarios encontrados:', result.data)
        setAvailableTechnicians(result.data)
      } else {
        console.log('No se encontraron usuarios o respuesta inválida')
        setAvailableTechnicians([])
      }
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error)
      setAvailableTechnicians([])
    } finally {
      setIsLoadingTechnicians(false)
    }
  }

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (attendMode === "resolve") {
      fetchUsers()
    }
  }, [attendMode])

  // Buscar usuarios cuando cambia el término de búsqueda
  useEffect(() => {
    if (attendMode === "resolve" && searchTechnician) {
      const timeoutId = setTimeout(() => {
        fetchUsers(searchTechnician)
      }, 300) // Debounce de 300ms

      return () => clearTimeout(timeoutId)
    }
  }, [searchTechnician, attendMode])

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const result = await MonitoreoEnRutaService.monitoreoEnRutaControllerGetIncidenciaDatos(incidentId)
        
        if (result && result.status) {
          setIncident(result.data)
        } else {
          setError('No se pudo cargar la incidencia')
        }
      } catch (error: any) {
        console.error('Error al obtener la incidencia:', error)
        setError('Error al cargar la incidencia')
      } finally {
        setIsLoading(false)
      }
    }

    if (incidentId) {
      fetchIncident()
    }
  }, [incidentId])

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

  // Modificar la validación para que solo requiera la solución cuando se está resolviendo completamente
  const validateForm = () => {
    const newErrors = {
      solution: "",
      assignedTechnician: "",
    }

    if (attendMode === "resolve" && !resolveFormData.solution) {
      newErrors.solution = "La descripción de la solución es obligatoria para resolver la incidencia"
    }

    // Solo requerir técnico asignado cuando se está resolviendo completamente
    if (attendMode === "resolve" && !resolveFormData.assignedTechnician) {
      newErrors.assignedTechnician = "Debe asignar un técnico responsable para resolver la incidencia"
    }

    setErrors(newErrors)
    return !newErrors.solution && !newErrors.assignedTechnician
  }

  const handleFinalize = () => {
    if (!validateForm()) return
    setShowFinalizeModal(true)
  }

  // Modificar el manejo del envío para que solo guarde en Solucion_incidencia cuando se resuelve completamente
  const handleSubmitResolve = async () => {
    try {
      if (attendMode === "resolve") {
        // Resolver la incidencia completamente
        
        // Preparar los datos de solución
        const solucionData: any = {
          descripcion_solucion: resolveFormData.solution,
          costo_solucion: resolveFormData.cost ? parseFloat(resolveFormData.cost) : null,
          tiempo_resolucion: resolveFormData.time ? resolveFormData.time : null,
          observaciones: resolveFormData.observations || null,
        }
        
        // Solo agregar id_usuario si no es "Yo mismo"
        if (resolveFormData.assignedTechnician !== "Yo mismo") {
          solucionData.id_usuario = resolveFormData.assignedTechnician
        }
        
        await MonitoreoEnRutaService.monitoreoEnRutaControllerSolucionarIncidencia(
          incidentId,
          solucionData
        )
      } else {
        // Solo actualizar estado a "en_proceso"
        await MonitoreoEnRutaService.monitoreoEnRutaControllerUpdateIncidenciaState(
          incidentId,
          {
            estado_incidencia: UpdateIncidenciaDto.estado_incidencia.EN_PROCESO
          }
        )
      }

      setShowFinalizeModal(false)
      router.back()
    } catch (error: any) {
      console.error('Error al actualizar la incidencia:', error)
      // Aquí podrías mostrar un toast de error
    }
  }

  // Filtrar técnicos según la búsqueda
  const filteredTechnicians = availableTechnicians.filter(tech =>
    tech.nombre_usuario.toLowerCase().includes(searchTechnician.toLowerCase()) ||
    tech.rol.toLowerCase().includes(searchTechnician.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Atender Incidencia</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatIncidentType(incident?.tipo_incidencia)}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident?.estado_incidencia)}`}
                  >
                    {formatStatus(incident?.estado_incidencia)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              className={attendMode === "resolve" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
              onClick={handleFinalize}
            >
              {attendMode === "resolve" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar Resolución
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Finalizar Atención
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Nota Informativa */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <h3 className="font-medium text-blue-800">Información Importante</h3>
          </div>
          <p className="text-sm text-blue-700">
            Al marcar como "En Proceso", se actualizará el estado de la incidencia pero no se registrará una
            solución. Solo al marcar como "Resolver" se registrará la solución completa en el sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel Izquierdo - Formulario de Resolución */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Tool className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Plan de Atención</h2>
                  <p className="text-sm text-gray-500">Defina cómo se atenderá la incidencia</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Modo de atención */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Modo de Atención</label>
                  <div className="flex gap-4">
                    <div
                      className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all ${
                        attendMode === "process"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setAttendMode("process")}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`h-4 w-4 rounded-full ${
                            attendMode === "process" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="font-medium">En Proceso</span>
                      </div>
                      <p className="text-xs text-gray-500 pl-6">
                        La incidencia está siendo atendida pero aún no se ha resuelto completamente.
                      </p>
                    </div>

                    <div
                      className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all ${
                        attendMode === "resolve"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setAttendMode("resolve")}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`h-4 w-4 rounded-full ${
                            attendMode === "resolve" ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="font-medium">Resolver</span>
                      </div>
                      <p className="text-xs text-gray-500 pl-6">
                        La incidencia ha sido completamente resuelta y puede cerrarse.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Técnico Asignado */}
                {/* Elimino el campo de técnico asignado de aquí */}

                {/* Descripción de la Solución */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de la Solución {attendMode === "resolve" && "*"}
                  </label>
                  <Textarea
                    placeholder="Describe detalladamente cómo se resolverá la incidencia..."
                    rows={6}
                    value={resolveFormData.solution}
                    onChange={(e) => setResolveFormData({ ...resolveFormData, solution: e.target.value })}
                    className={errors.solution ? "border-red-300" : ""}
                  />
                  {errors.solution && <p className="text-xs text-red-500 mt-1">{errors.solution}</p>}
                </div>

                {/* Costo y Tiempo */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Costo Estimado (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-10"
                        value={resolveFormData.cost}
                        onChange={(e) => setResolveFormData({ ...resolveFormData, cost: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo Empleado (horas)</label>
                    <div className="relative">
                      <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="0"
                        className="pl-10"
                        value={resolveFormData.time}
                        onChange={(e) => setResolveFormData({ ...resolveFormData, time: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones y Recomendaciones
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      placeholder="Observaciones adicionales, recomendaciones para prevenir futuros incidentes, etc..."
                      className="pl-10"
                      rows={7}
                      value={resolveFormData.observations}
                      onChange={(e) => setResolveFormData({ ...resolveFormData, observations: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Información de Referencia */}
          <div className="space-y-4">
            {/* Resumen de la Incidencia */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Resumen de la Incidencia</h2>
                  <p className="text-sm text-gray-500">Información clave para la atención</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Tipo:</span>
                    <div className="flex items-center gap-1">
                      {incidentTypeIcons[incident?.tipo_incidencia]}
                      <span className="text-sm">{formatIncidentType(incident?.tipo_incidencia)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Severidad:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[incident?.severidad]}`}
                    >
                      {formatSeverity(incident?.severidad)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Estado:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident?.estado_incidencia)}`}
                    >
                      {formatStatus(incident?.estado_incidencia)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reportado por:</span>
                    <span className="text-sm">{incident?.nombre_usuario}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Descripción</h4>
                  <p className="text-sm text-gray-700">{incident?.descripcion}</p>
                </div>
              </div>
            </div>

            {/* Selección de Técnico - Solo mostrar cuando se está resolviendo */}
            {attendMode === "resolve" && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[395px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Técnico Asignado</h2>
                    <p className="text-sm text-gray-500">Seleccione el técnico responsable</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Botón "Soy yo" */}
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => {
                        setSelectedTechnician("current-user")
                        setResolveFormData({ ...resolveFormData, assignedTechnician: "Yo mismo" })
                        setSearchTechnician("")
                      }}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Soy yo (Auto-asignación)
                    </Button>
                  </div>

                  {/* Buscador */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar técnico por nombre o especialidad..."
                      value={searchTechnician}
                      onChange={(e) => {
                        setSearchTechnician(e.target.value)
                        setSelectedTechnician("")
                        setResolveFormData({ ...resolveFormData, assignedTechnician: "" })
                      }}
                      className="pl-10"
                    />
                  </div>

                  {/* Recuadro de técnico seleccionado o mensaje por defecto */}
                  {selectedTechnician ? (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Técnico seleccionado: {resolveFormData.assignedTechnician}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Ningún técnico seleccionado
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Lista de técnicos */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {isLoadingTechnicians ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-xs text-gray-500 mt-1">Buscando usuarios...</p>
                      </div>
                    ) : filteredTechnicians.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-xs text-gray-500">
                          {searchTechnician ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
                        </p>
                      </div>
                    ) : (
                      filteredTechnicians.map((technician) => (
                        <div
                          key={technician.id_usuario}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedTechnician === technician.id_usuario
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedTechnician(technician.id_usuario || "")
                            setResolveFormData({ ...resolveFormData, assignedTechnician: technician.nombre_usuario || "" })
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{technician.nombre_usuario}</p>
                                <p className="text-xs text-gray-500">{technician.rol}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Disponible
                              </span>
                              {selectedTechnician === technician.id_usuario && (
                                <UserCheck className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {errors.assignedTechnician && (
                    <p className="text-xs text-red-500">{errors.assignedTechnician}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Finalización */}
        <FinalizeModal
          isOpen={showFinalizeModal}
          onClose={() => setShowFinalizeModal(false)}
          incident={incident}
          attendMode={attendMode}
          resolveFormData={resolveFormData}
          onSubmit={handleSubmitResolve}
        />
      </div>
    </div>
  )
} 