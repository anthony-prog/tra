"use client"

import { useState } from "react"
import {
  X,
  CheckCircle,
  Clock,
  Info,
  DollarSign,
  Timer,
  MessageSquare,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { severityColors, incidentStatusColors, incidentTypeIcons } from "@/data/constants"

interface FinalizeModalProps {
  isOpen: boolean
  onClose: () => void
  incident: any
  attendMode: "process" | "resolve"
  resolveFormData: {
    solution: string
    cost: string
    time: string
    observations: string
    assignedTechnician: string
    status: string
  }
  onSubmit: () => void
}

// Funciones de formateo
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

export default function FinalizeModal({
  isOpen,
  onClose,
  incident,
  attendMode,
  resolveFormData,
  onSubmit
}: FinalizeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 ${attendMode === "resolve" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"} rounded-full flex items-center justify-center`}
              >
                {attendMode === "resolve" ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {attendMode === "resolve" ? "Confirmar Resolución de Incidencia" : "Confirmar Atención de Incidencia"}
                </h2>
                <p className="text-sm text-gray-500">Revise la información antes de finalizar el proceso</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Resumen de la Incidencia */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Resumen de la Incidencia
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <div className="flex items-center gap-1 mt-1">
                    {incidentTypeIcons[incident?.tipo_incidencia]}
                    <span className="font-medium">{formatIncidentType(incident?.tipo_incidencia)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Severidad:</span>
                  <span className={`font-medium ml-2 px-2 py-0.5 rounded-full text-xs ${severityColors[incident?.severidad]}`}>
                    {formatSeverity(incident?.severidad)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Estado actual:</span>
                  <span className={`font-medium ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusColor(incident?.estado_incidencia)}`}>
                    {formatStatus(incident?.estado_incidencia)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Reportado por:</span>
                  <span className="font-medium ml-2">{incident?.nombre_usuario}</span>
                </div>
                <div>
                  <span className="text-gray-500">Vehículo:</span>
                  <span className="font-medium ml-2">{incident?.modelo} - {incident?.placa}</span>
                </div>
                <div>
                  <span className="text-gray-500">Conductor:</span>
                  <span className="font-medium ml-2">{incident?.nombre_conductor}</span>
                </div>
                <div>
                  <span className="text-gray-500">Fecha de registro:</span>
                  <span className="font-medium ml-2">{new Date(incident?.fecha_registro).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Velocidad:</span>
                  <span className="font-medium ml-2">{incident?.velocidad} km/h</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-gray-500">Descripción:</span>
                <p className="font-medium mt-1 text-sm">{incident?.descripcion}</p>
              </div>
            </div>

            {/* Detalles de la Atención */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Detalles de la Atención
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Modo de atención:</span>
                  <span
                    className={`font-medium ml-2 ${attendMode === "resolve" ? "text-green-600" : "text-blue-600"}`}
                  >
                    {attendMode === "resolve" ? "Resolver Completamente" : "Marcar En Proceso"}
                  </span>
                </div>
                {attendMode === "resolve" && (
                  <>
                    <div>
                      <span className="text-gray-500">Técnico asignado:</span>
                      <span className="font-medium ml-2">
                        {resolveFormData.assignedTechnician || "No especificado"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Costo de solución:</span>
                      <span className="font-medium ml-2">
                        {resolveFormData.cost ? `$${resolveFormData.cost}` : "No especificado"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tiempo empleado:</span>
                      <span className="font-medium ml-2">
                        {resolveFormData.time ? `${resolveFormData.time} horas` : "No especificado"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {attendMode === "resolve" && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Solución Aplicada
                </h3>
                <p className="text-sm">{resolveFormData.solution || "No se ha especificado una solución."}</p>
                {resolveFormData.observations && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-1">Observaciones:</h4>
                    <p className="text-sm text-gray-600">{resolveFormData.observations}</p>
                  </div>
                )}
              </div>
            )}

            <div
              className={`p-4 rounded-lg border ${attendMode === "resolve" ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Info className={`h-4 w-4 ${attendMode === "resolve" ? "text-green-600" : "text-blue-600"}`} />
                <h3 className={`font-medium ${attendMode === "resolve" ? "text-green-800" : "text-blue-800"}`}>
                  {attendMode === "resolve" ? "Información de Resolución" : "Información de Proceso"}
                </h3>
              </div>
              <p className={`text-sm ${attendMode === "resolve" ? "text-green-700" : "text-blue-700"}`}>
                {attendMode === "resolve" ? (
                  <>
                    Al confirmar esta acción, el estado de la incidencia cambiará a{" "}
                    <span className="font-medium">Resuelto</span>. Se registrará la solución completa en el
                    sistema y se notificará a todas las partes involucradas.
                  </>
                ) : (
                  <>
                    Al confirmar esta acción, el estado de la incidencia cambiará a{" "}
                    <span className="font-medium">En proceso</span>. La incidencia quedará marcada como en atención
                    y podrá ser resuelta posteriormente.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className={attendMode === "resolve" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
              onClick={onSubmit}
            >
              {attendMode === "resolve" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolver Incidencia
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Marcar En Proceso
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 