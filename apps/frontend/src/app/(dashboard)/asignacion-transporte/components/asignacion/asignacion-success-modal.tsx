"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, Printer } from "lucide-react"
import Link from "next/link"

interface AsignacionSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  asignacion: any
}

export default function AsignacionSuccessModal({ isOpen, onClose, asignacion }: AsignacionSuccessModalProps) {
  if (!asignacion) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl">¡Asignación creada con éxito!</DialogTitle>
          <DialogDescription className="text-center">
            La asignación de transporte ha sido creada correctamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">ID Asignación:</span>
              <span className="text-sm">{asignacion.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Pedido:</span>
              <span className="text-sm">{asignacion.pedido}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Fecha de creación:</span>
              <span className="text-sm">{formatDate(asignacion.fechaCreacion)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Ruta:</span>
              <span className="text-sm">{asignacion.ruta.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Vehículo:</span>
              <span className="text-sm">{asignacion.vehiculo.placa}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Conductor:</span>
              <span className="text-sm">{asignacion.conductor.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Estado:</span>
              <span className="text-sm font-semibold text-orange-500">{asignacion.estado}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/hoja-ruta">
              <FileText className="mr-2 h-4 w-4" />
              Ver hoja de ruta
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
