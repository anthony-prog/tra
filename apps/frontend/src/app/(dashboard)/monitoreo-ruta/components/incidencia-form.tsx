import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react"
import { MonitoreoEnRutaService } from "@/api/generated"
import { useState, useEffect } from "react"

export default function IncidenciaForm({ showIncidentForm, setShowIncidentForm, selectedVehicle, incidentFormData, setIncidentFormData, handleSubmitIncident }: { showIncidentForm: boolean, setShowIncidentForm: (show: boolean) => void, selectedVehicle: any, incidentFormData: any, setIncidentFormData: (data: any) => void, handleSubmitIncident: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vehicleData, setVehicleData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isNetworkError, setIsNetworkError] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicleData = async () => {
      if (showIncidentForm && selectedVehicle?.id) {
        try {
          setIsLoading(true)
          setError(null)
          setIsNetworkError(false)
          setSuccessMessage(null)
          const result = await MonitoreoEnRutaService.monitoreoEnRutaControllerGetUltimoMonitoreo(selectedVehicle.id)
          if (result && result.status) {
            setVehicleData(result.data)
          } else {
            setError('No se pudo obtener la información del vehículo')
          }
        } catch (error: any) {
          console.error('Error al obtener datos del vehículo:', error)
          if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            setIsNetworkError(true)
            setError('Error de conexión. Mostrando última ubicación conocida.')
            // Datos genéricos de ubicación
            setVehicleData({
              ubicacion_actual: {
                x: selectedVehicle.coordinates?.x || 0,
                y: selectedVehicle.coordinates?.y || 0
              }
            })
          } else if (error.body?.message) {
            setError(error.body.message)
          } else {
            setError('Ha ocurrido un error al obtener la información del vehículo')
          }
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchVehicleData()
  }, [showIncidentForm, selectedVehicle?.id])

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)
      setSuccessMessage(null)

      const incidenciaData = {
        id_monitoreo_ruta: vehicleData?.id_monitoreo_ruta,
        tipo_incidencia: incidentFormData.type,
        severidad: incidentFormData.severity,
        descripcion: incidentFormData.description
      }

      const response = await MonitoreoEnRutaService.monitoreoEnRutaControllerCreateIncidencia(incidenciaData)
      
      // Mostrar mensaje de éxito
      setSuccessMessage(response.message || 'Incidencia reportada exitosamente')
      
      // Esperar 2 segundos antes de cerrar el modal
      setTimeout(() => {
        handleSubmitIncident()
        setShowIncidentForm(false)
        setSuccessMessage(null)
      }, 2000)
      
    } catch (error: any) {
      console.error('Error al crear la incidencia:', error)
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Error de conexión. Por favor, intente nuevamente.')
      } else if (error.body?.message) {
        setError(error.body.message)
      } else {
        setError('Ha ocurrido un error al crear la incidencia')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reportar Incidencia</h3>
          <Button variant="ghost" size="icon" onClick={() => setShowIncidentForm(false)} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className={`mb-4 p-3 text-sm rounded-md ${isNetworkError ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-500'}`}>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 text-sm rounded-md bg-green-50 text-green-500">
            {successMessage}
          </div>
        )}

        <div className="space-y-4">
          {/* Información del Vehículo (Solo lectura) */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">Información del Vehículo</div>
            {isLoading ? (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-xs text-gray-500 mt-1">Cargando información...</p>
              </div>
            ) : (
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Conductor:</span>
                  <span className="font-medium">{selectedVehicle.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Placa:</span>
                  <span className="font-medium">{selectedVehicle.placa_vehiculo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Modelo:</span>
                  <span className="font-medium">{selectedVehicle.modelo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ubicación Actual:</span>
                  <span className="font-medium">
                    {vehicleData?.ubicacion_actual ? 
                      `${vehicleData.ubicacion_actual.x}, ${vehicleData.ubicacion_actual.y}` : 
                      'No disponible'}
                    {isNetworkError && ' (Última ubicación conocida)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Formulario de Incidencia */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidencia</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={incidentFormData.type}
                onChange={(e) => setIncidentFormData({ ...incidentFormData, type: e.target.value })}
              >
                <option value="">Seleccionar tipo</option>
                <option value="accidente">Accidente de Tránsito</option>
                <option value="averia_vehiculo">Avería del Vehículo</option>
                <option value="desvio_ruta">Desvío de Ruta</option>
                <option value="problema_temperatura">Problema de Temperatura</option>
                <option value="retraso">Retraso en la Entrega</option>
                <option value="clima_adverso">Clima Adverso</option>
                <option value="problema_trafico">Problema de Tráfico</option>
                <option value="apertura_no_autorizada">Apertura No Autorizada</option>
                <option value="otro">Otro</option>
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
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
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
              onClick={handleSubmit}
              disabled={!incidentFormData.type || !incidentFormData.severity || !incidentFormData.description || isSubmitting || isLoading || !!successMessage}
            >
              <Save className="h-4 w-4 mr-1" />
              {isSubmitting ? 'Enviando...' : successMessage ? '¡Enviado!' : 'Reportar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}