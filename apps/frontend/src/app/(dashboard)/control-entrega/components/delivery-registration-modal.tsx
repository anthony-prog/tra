"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface DeliveryRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  deliveryId: string
  deliveryInfo?: {
    order: string
    location: string
    date: string
  }
}

type DeliveryStatus = "fallida" | "con_reclamo" | "completada" | ""

export default function DeliveryRegistrationModal({
  isOpen,
  onClose,
  deliveryId,
  deliveryInfo,
}: DeliveryRegistrationModalProps) {
  const [step, setStep] = useState(1)
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("")
  const [clientSignature, setClientSignature] = useState<File | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [observations, setObservations] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStatusChange = (value: DeliveryStatus) => {
    setDeliveryStatus(value)
  }

  const handleContinue = () => {
    if (deliveryStatus === "completada") {
      setStep(2)
    } else {
      // Para entregas fallidas o con reclamo, registrar directamente
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      onClose()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "signature" | "photos") => {
    const files = event.target.files
    if (!files) return

    if (type === "signature") {
      setClientSignature(files[0])
    } else if (type === "photos") {
      setPhotos(Array.from(files))
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simular envío de datos
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const registrationData = {
        deliveryId,
        status: deliveryStatus,
        clientSignature: clientSignature?.name || null,
        photos: photos.map((p) => p.name),
        observations,
        timestamp: new Date().toISOString(),
      }

      console.log("Registro de entrega:", registrationData)

      // Aquí harías el POST a tu API
      // await axios.post('/api/deliveries/register', registrationData)

      onClose()
      // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al registrar entrega:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setDeliveryStatus("")
    setClientSignature(null)
    setPhotos([])
    setObservations("")
    setIsSubmitting(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case "completada":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "fallida":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "con_reclamo":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Formulario de registro de entrega</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            ID de entrega: <span className="font-mono text-xs">{deliveryId}</span>
          </DialogDescription>
        </DialogHeader>

        {deliveryInfo && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Orden:</span> {deliveryInfo.order}
                </div>
                <div>
                  <span className="font-medium">Fecha:</span> {deliveryInfo.date}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Ubicación:</span> {deliveryInfo.location}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">La entrega ha sido:</Label>
              <RadioGroup value={deliveryStatus} onValueChange={handleStatusChange} className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="fallida" id="fallida" />
                  <Label htmlFor="fallida" className="flex items-center gap-2 cursor-pointer flex-1">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Fallida
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="con_reclamo" id="con_reclamo" />
                  <Label htmlFor="con_reclamo" className="flex items-center gap-2 cursor-pointer flex-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    Con Reclamo
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="completada" id="completada" />
                  <Label htmlFor="completada" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Completada
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <Button onClick={handleContinue} disabled={!deliveryStatus || isSubmitting} className="flex-1">
                {deliveryStatus === "completada" ? "Continuar" : "Registrar"}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Para la entrega completada subir:</p>
            </div>

            <div className="space-y-4">
              {/* Firma del cliente */}
              <div>
                <Label htmlFor="signature" className="text-sm font-medium mb-2 block">
                  Firma de cliente:
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="signature"
                    type="text"
                    value={clientSignature?.name || ""}
                    placeholder="Seleccionar archivo..."
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("signature-upload")?.click()}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                  <input
                    id="signature-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "signature")}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Fotos */}
              <div>
                <Label htmlFor="photos" className="text-sm font-medium mb-2 block">
                  Fotos:
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="photos"
                    type="text"
                    value={photos.length > 0 ? `${photos.length} archivo(s) seleccionado(s)` : ""}
                    placeholder="Seleccionar archivos..."
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("photos-upload")?.click()}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                  <input
                    id="photos-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, "photos")}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <Label htmlFor="observations" className="text-sm font-medium mb-2 block">
                  Observaciones:
                </Label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Comentarios adicionales sobre la entrega..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Registrando..." : "Registrar"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
