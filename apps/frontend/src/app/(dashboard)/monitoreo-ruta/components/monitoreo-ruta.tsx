"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Truck,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  Phone,
  CheckCircle,
  Info,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { vehiclesData, incidentsData } from "@/data/transport-data"
import { statusColors, incidentStatusColors, severityColors, incidentTypeIcons } from "@/data/constants"
import IncidenciaForm from "./incidencia-form"
import { MonitoreoEnRutaService } from "@/api/generated"
import Sidebar from "./sidebar"
import VehiculosTab from "./vehiculos-tab"
import IncidentesTab from "./incidentes-tab"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function MonitoreoRuta() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Vehicles")
  const [vehicles, setVehicles] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [incidentStatusFilter, setIncidentStatusFilter] = useState("Todos")
  const [showIncidentForm, setShowIncidentForm] = useState(false)
  const [vehiclesCount, setVehiclesCount] = useState(0)
  const [incidentsCount, setIncidentsCount] = useState(0)
  const [incidentFormData, setIncidentFormData] = useState({
    type: "",
    severity: "",
    description: "",
  })
  const selectedRef = useRef<HTMLDivElement>(null)
  const selectedIncidentRef = useRef<HTMLTableRowElement>(null)

  const handleError = (error: string | null) => {
    setError(error);
  };

  const handleVehiclesCountChange = (count: number) => {
    setVehiclesCount(count);
  };

  const handleIncidentsCountChange = (count: number) => {
    setIncidentsCount(count);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.placa_vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.cargo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "Todos" || vehicle.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.id_incidencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.nombre_conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${incident.ubicacion_actual.x}, ${incident.ubicacion_actual.y}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.tipo_incidencia.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = incidentStatusFilter === "Todos" || incident.estado_incidencia === incidentStatusFilter

    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [selectedVehicle])

  useEffect(() => {
    if (selectedIncidentRef.current) {
      selectedIncidentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [selectedIncident])

  const handleReportIncident = () => {
    setShowIncidentForm(true)
    setIncidentFormData({ type: "", severity: "", description: "" })
  }

  const handleSubmitIncident = () => {
    console.log("Nueva incidencia:", {
      vehicle: selectedVehicle,
      ...incidentFormData,
    })
    setShowIncidentForm(false)
  }

  const handleViewVehicleDetails = (vehicleId: string) => {
    router.push(`monitoreo-ruta/vehiculo/${vehicleId}`)
  }

  const handleAttendIncident = (incidentId: string) => {
    router.push(`monitoreo-ruta/incidencia/${incidentId}`)
  }

  const handleViewVehicleFromIncident = (incident: any) => {
    // Buscar el vehículo correspondiente basado en la información del incidente
    const relatedVehicle = vehiclesData.find(
      (vehicle) =>
        vehicle.driver === incident.driver || vehicle.vehicle.includes(incident.plate) || vehicle.id === incident.unit,
    )

    if (relatedVehicle) {
      router.push(`/vehiculo/${relatedVehicle.id}`)
    } else {
      // Si no se encuentra el vehículo, usar un ID por defecto o mostrar error
      router.push(`/vehiculo/VH-001`)
    }
  }

  return (
    <div className="flex h-full">
          <div className="w-full lg:w-2/3 overflow-auto">
            <div className="p-4">
              {/* Tab Selector */}
              <div className="flex border-b mb-4">
                <button
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${
                    activeTab === "Vehicles"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("Vehicles")}
                >
                  <Truck className="h-4 w-4" />
                  <span>Vehículos</span>
                </button>
                <button
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${
                    activeTab === "Incidents"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("Incidents")}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Incidentes</span>
                </button>
              </div>

              {/* Search and Filters for Vehicles */}
              {activeTab === "Vehicles" && (
                <div className="space-y-3 mb-4">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Buscar por vehiculo, conductor o tipo de carga..."
                        className="pl-7 h-8 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="px-2 py-1 border rounded text-xs bg-white h-8"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="Todos">Todos</option>
                      <option value="En Ruta">En Ruta</option>
                      <option value="Despachado">Despachado</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </div>
                  <div className="text-xs text-gray-600">{vehiclesCount} vehículos</div>
                </div>
              )}

              {/* Search and Filters for Incidents */}
              {activeTab === "Incidents" && (
                <div className="space-y-3 mb-4">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Buscar por ID, conductor, ubicación o tipo..."
                        className="pl-7 h-8 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="px-2 py-1 border rounded text-xs bg-white h-8"
                      value={incidentStatusFilter}
                      onChange={(e) => setIncidentStatusFilter(e.target.value)}
                    >
                      <option value="Todos">Todos</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Resuelto">Resuelto</option>
                    </select>
                  </div>
                  <div className="text-xs text-gray-600">{incidentsCount} incidencias</div>
                </div>
              )}

          {/* Vehicles Table */}
              {activeTab === "Vehicles" && (
            <VehiculosTab
              onVehicleSelect={setSelectedVehicle}
              selectedVehicle={selectedVehicle}
              onReportIncident={handleReportIncident}
              onViewDetails={handleViewVehicleDetails}
              onError={handleError}
              onVehiclesCountChange={handleVehiclesCountChange}
            />
              )}

              {/* Incidents Table */}
              {activeTab === "Incidents" && (
            <IncidentesTab
              onIncidentSelect={setSelectedIncident}
              selectedIncident={selectedIncident}
              onViewDetails={handleViewVehicleFromIncident}
              onError={handleError}
              onIncidentsCountChange={handleIncidentsCountChange}
            />
              )}
        </div>
      </div>

      <Sidebar
        activeTab={activeTab}
        selectedVehicle={selectedVehicle}
        selectedIncident={selectedIncident}
        handleViewVehicleDetails={handleViewVehicleDetails}
        handleAttendIncident={handleAttendIncident}
        handleViewVehicleFromIncident={handleViewVehicleFromIncident}
        error={error}
      />

      {/* Modal para Reportar Incidencia */}
      {showIncidentForm && (
        <IncidenciaForm
          showIncidentForm={showIncidentForm}
          setShowIncidentForm={setShowIncidentForm}
          selectedVehicle={selectedVehicle}
          incidentFormData={incidentFormData}
          setIncidentFormData={setIncidentFormData}
          handleSubmitIncident={handleSubmitIncident}
        />
      )}
    </div>
  )
}
