import { Shield, CreditCard, Calendar, CheckCircle, Navigation } from "lucide-react"

interface SafetyComplianceCardProps {
  safetyData: {
    soat: string
    vencimiento_soat: string
    licencia: string
    vencimiento_licencia: string
    gps_estado: boolean
  }
  isLoading: boolean
}

export function SafetyComplianceCard({ safetyData, isLoading }: SafetyComplianceCardProps) {
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
          <Shield className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Seguridad y Cumplimiento</h2>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">SOAT</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-green-600">Vigente</p>
            <p className="text-xs text-gray-500">{safetyData.soat}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Vencimiento SOAT</span>
          </div>
          <span className="text-sm font-semibold text-green-600">
            {new Date(safetyData.vencimiento_soat).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Licencia Conductor</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-green-600">Vigente</p>
            <p className="text-xs text-gray-500">
              Vence: {new Date(safetyData.vencimiento_licencia).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Sistema GPS</span>
          </div>
          <span className={`text-sm font-semibold ${safetyData.gps_estado ? "text-blue-600" : "text-red-600"}`}>
            {safetyData.gps_estado ? "Operativo" : "Desconectado"}
          </span>
        </div>
      </div>
    </>
  )
} 