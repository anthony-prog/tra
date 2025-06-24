"use client"

import { useState, useRef, useEffect } from "react"
import { Truck, User, MapPin, Calendar, AlertTriangle, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { statusColors } from "@/data/constants"
import { vehiclesData } from "@/data/transport-data"
import { MonitoreoEnRutaService } from "@/api/generated"

interface VehiculosTabProps {
  onVehicleSelect: (vehicle: any) => void;
  selectedVehicle: any;
  onReportIncident: () => void;
  onViewDetails: (id: string) => void;
  onError?: (error: string | null) => void;
  onVehiclesCountChange?: (count: number) => void;
}

export default function VehiculosTab({ 
  onVehicleSelect, 
  selectedVehicle,
  onReportIncident,
  onViewDetails,
  onError,
  onVehiclesCountChange
}: VehiculosTabProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(10)
  const selectedRef = useRef<HTMLDivElement>(null)

  const fetchVehicles = async (page: number = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      onError?.(null)
      
      const response = await MonitoreoEnRutaService
        .monitoreoEnRutaControllerGetDespachosPaginados(page, pageSize);
      
      if (response && response.data) {
        const despachosPorId = response.data.items.reduce((acc: any, despacho: any) => {
          const idDespacho = despacho.id_despacho;
          if (!acc[idDespacho]) {
            acc[idDespacho] = {
              id: despacho.id_despacho,
              placa_vehiculo: despacho.placa_vehiculo,
              driver: despacho.nombre_conductor || 'Sin conductor',
              status: despacho.estado_recorrido,
              origin: despacho.ubicacion_origen,
              totalStops: parseInt(despacho.total_paradas) || 0,
              completedStops: 0,
              dispatchDate: new Date(despacho.fecha_despacho).toLocaleDateString(),
              estimatedCompletion: `${despacho.tiempo_total_estimado.hours || 0} hr ${despacho.tiempo_total_estimado.minutes} min ${despacho.tiempo_total_estimado.seconds} seg`,
              cargo: despacho.tipo_conservacion,
              weight: despacho.peso_total,
              stops: despacho.stops,
              driverPhone: despacho.telefono_conductor,
              tipo_vehiculo: despacho.tipo_vehiculo,
              modelo: despacho.modelo
            };
          }
          
          return acc;
        }, {});

        const vehiculos = Object.values(despachosPorId).map((vehiculo: any) => ({
          ...vehiculo,
          stops: vehiculo.stops.sort((a: any, b: any) => a.orden_parada - b.orden_parada)
        }));
        
        setVehicles(vehiculos);
        setTotalItems(response.data.meta.total || vehiculos.length);
        setTotalPages(Math.ceil((response.data.meta.total || vehiculos.length) / pageSize));
        
        // Notificar el cambio en el conteo de vehículos
        onVehiclesCountChange?.(response.data.meta.total || vehiculos.length);
        
        if (vehiculos.length > 0 && !selectedVehicle) {
          onVehicleSelect(vehiculos[0]);
        }
      }
    } catch (error: any) {
      console.error('Error al obtener los despachos:', error);
      console.log(error);
      // Solo usar datos mockeados si es un error de conexión
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setVehicles(vehiclesData);
        setTotalItems(vehiclesData.length);
        setTotalPages(Math.ceil(vehiclesData.length / pageSize));
        onVehiclesCountChange?.(vehiclesData.length);
        
        if (!selectedVehicle) {
          onVehicleSelect(vehiclesData[0]);
        }
      } else {
        setVehicles([]);
        setTotalItems(0);
        setTotalPages(1);
        onVehiclesCountChange?.(0);
        
        // Si el error viene del backend, mostrar su mensaje
        if (error.body?.message) {
          const errorMessage = error.body.message;
          setError(errorMessage);
          onError?.(errorMessage);
        } else {
          const errorMessage = 'Ha ocurrido un error al cargar los vehículos';
          setError(errorMessage);
          onError?.(errorMessage);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchVehicles(currentPage)
  }, [currentPage])

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [selectedVehicle])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }

  const renderPagination = () => {
    // Mostrar paginación si hay datos o si hay más de una página
    if (totalItems === 0 && totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="text-xs text-gray-500">
          Mostrando {vehicles.length} de {totalItems} vehículos
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
            className="h-7 px-2 text-xs"
          >
            Siguiente
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <>
        {renderPagination()}
        <div className="text-center py-8">
          <div className="text-4xl mb-2">😢</div>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-4">
      {/* Paginación en la parte superior */}
      {renderPagination()}
      
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Cargando vehículos...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No se encontraron vehículos</p>
          </div>
        ) : (
          vehicles.map((vehicle) => {
            const isSelected = selectedVehicle?.id === vehicle.id
            return (
              <div
                key={vehicle.id}
                ref={isSelected ? selectedRef : null}
                className={`border rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 p-4 shadow-md scale-[1.02]"
                    : "bg-white hover:border-gray-300 p-3 hover:shadow-sm"
                }`}
                onClick={() => onVehicleSelect(vehicle)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-blue-500 rounded-md flex items-center justify-center">
                      <Truck className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{vehicle.placa_vehiculo}</div>
                      <div className="text-xs text-gray-500">{(vehicle.modelo || 'N/A').toUpperCase()}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vehicle.status]}`}>
                    {vehicle.status === 'en_ruta' ? 'En Ruta' : 
                     vehicle.status === 'completada' ? 'Completada' :
                     vehicle.status === 'cancelada' ? 'Cancelada' : vehicle.status}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="font-medium">{vehicle.driver}</span>
                  </div>

                  {isSelected && (
                    <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium">Origen:</div>
                          <div className="text-gray-600">{vehicle.origin}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 text-blue-500 mt-0.5" />
                        <div>
                          <div className="font-medium">Paradas:</div>
                          <div className="text-gray-600">
                            {vehicle.totalStops} paradas
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>Despachado: {vehicle.dispatchDate}</span>
                      </div>

                      <div className="mt-2 flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            onReportIncident()
                          }}
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Reportar Incidencia
                        </Button>
                        <Button
                          size="sm"
                          className="h-6 text-xs bg-white text-black border border-black hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            onViewDetails(vehicle.id)
                          }}
                        >
                          <Info className="h-3 w-3 mr-1" />
                          Más Detalles
                        </Button>
                      </div>
                    </div>
                  )}

                  {!isSelected && (
                    <div className="text-gray-500">
                      {vehicle.totalStops} paradas • {vehicle.cargo}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}