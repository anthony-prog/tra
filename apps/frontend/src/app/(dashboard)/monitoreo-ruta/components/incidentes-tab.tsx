"use client"

import { useState, useRef, useEffect } from "react"
import { Phone, ChevronLeft, ChevronRight } from "lucide-react"
import { incidentStatusColors } from "@/data/constants"
import { incidentsData } from "@/data/transport-data"
import { MonitoreoEnRutaService } from "@/api/generated"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface IncidentesTabProps {
  onIncidentSelect: (incident: any) => void;
  selectedIncident: any;
  onViewDetails: (id: string) => void;
  onError?: (message: string) => void;
  onIncidentsCountChange?: (count: number) => void;
}

export default function IncidentesTab({ 
  onIncidentSelect, 
  selectedIncident,
  onViewDetails,
  onError,
  onIncidentsCountChange
}: IncidentesTabProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [incidents, setIncidents] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalIncidents, setTotalIncidents] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const selectedIncidentRef = useRef<HTMLTableRowElement>(null)
  const router = useRouter()

  const fetchIncidents = async (page: number = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      onError?.('')
      const result = await MonitoreoEnRutaService
        .monitoreoEnRutaControllerGetIncidenciasPaginadas(page, 10);
      
      if (result && result.status) {
        const incidentesData = result.data.items || []
        const meta = result.data.meta
        
        setIncidents(incidentesData)
        setTotalPages(meta.totalPages)
        setTotalIncidents(meta.total)
        setHasNextPage(meta.hasNextPage)
        setHasPreviousPage(meta.hasPreviousPage)
        setCurrentPage(meta.page)
        
        // Notificar el cambio en el conteo
        onIncidentsCountChange?.(meta.total)
        
        if (incidentesData.length > 0 && !selectedIncident) {
          onIncidentSelect(incidentesData[0])
        }
      } else {
        setIncidents([])
        const errorMessage = result.message || 'No se pudieron cargar los incidentes'
        setError(errorMessage)
        onError?.(errorMessage)
      }
    } catch (error: any) {
      console.error('Error al obtener los incidentes:', error)
      setIncidents([])
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setIncidents(incidentsData)
        onIncidentsCountChange?.(incidentsData.length)
        if (!selectedIncident) {
          onIncidentSelect(incidentsData[0])
        }
      } else if (error.body?.message) {
        const errorMessage = error.body.message
        setError(errorMessage)
        onError?.(errorMessage)
      } else {
        const errorMessage = 'Ha ocurrido un error al cargar los incidentes'
        setError(errorMessage)
        onError?.(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents(1)
  }, [])

  useEffect(() => {
    if (selectedIncidentRef.current) {
      selectedIncidentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [selectedIncident])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchIncidents(newPage)
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

    return (
        <div className="bg-white rounded-lg border overflow-hidden">
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Cargando incidentes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-sm text-red-500">😢 {error}</p>
        </div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No se encontraron incidentes</p>
        </div>
      ) : (
        <>
          {/* Paginación Superior */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <div className="text-xs text-gray-500">
              Mostrando {incidents.length} de {totalIncidents} incidencias
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
                className="h-7 px-2 text-xs"
              >
                <ChevronLeft className="h-3 w-3" />
                Anterior
              </Button>
              <span className="text-xs text-gray-600 px-2">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="h-7 px-2 text-xs"
              >
                Siguiente
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">HORA</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">UNIDAD</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">PLACA</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">CONDUCTOR</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">UBICACIÓN</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-500">ESTADO</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500">CONTACTO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {incidents.map((incident) => {
                  const isSelected = selectedIncident?.id_incidencia === incident.id_incidencia
                  return (
                    <tr
                      key={incident.id_incidencia}
                      ref={isSelected ? selectedIncidentRef : null}
                      className={`cursor-pointer ${
                        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                      } transition-colors`}
                      onClick={() => onIncidentSelect(incident)}
                    >
                      <td className="px-3 py-2">{new Date(incident.fecha_registro).toLocaleTimeString()}</td>
                      <td className="px-3 py-2">{incident.modelo}</td>
                      <td className="px-3 py-2">{incident.placa_vehiculo}</td>
                      <td className="px-3 py-2">{incident.nombre_conductor}</td>
                      <td className="px-3 py-2">{`${incident.ubicacion_actual.x}, ${incident.ubicacion_actual.y}`}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.estado_incidencia)}`}
                        >
                          {formatStatus(incident.estado_incidencia)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button 
                          className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/monitoreo-ruta/incidencia/${incident.id_incidencia}`)
                          }}
                        >
                          <Phone className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
    )
}