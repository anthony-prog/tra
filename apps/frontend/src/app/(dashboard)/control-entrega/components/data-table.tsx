"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Grid3X3, List, Calendar } from "lucide-react"
import DeliveryRegistrationModal from "./delivery-registration-modal"

interface DeliveryItem {
  id: string
  order: string
  location: string
  date: string
  status: string
  area: string
  user: string
}

interface DataTableProps {
  userId: string
}

export default function DataTable({ userId }: DataTableProps) {
  const [deliveryData, setDeliveryData] = useState<DeliveryItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null)

  useEffect(() => {
    console.log("useEffect disparado, userId:", userId)
    if (!userId) {
      console.warn("userId está vacío, se detiene fetch")
      return
    }
    const fetchData = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

      if (!token || !userId) return

      try {
        const response = await axios.get(`http://localhost:3001/api/control-entrega/ordenes-pendientes/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const ordenes = response.data?.data?.ordenes;

        if (Array.isArray(ordenes)) {
          const mappedData = ordenes.map(
            (item: any): DeliveryItem => ({
              id: item.id_entrega,
              order: `ORD-${item.id_entrega}`,
              location: item.nombre_punto,
              date: new Date(item.fecha_entrega).toLocaleString(),
              status: "Pendiente",
              area: item.coordenada_punto,
              user: "👤",
            })
          );
          setDeliveryData(mappedData);
        } else {
          console.warn("No se encontraron órdenes en la respuesta:", response.data);
        }

      } catch (error) {
        console.error("Error al cargar órdenes pendientes:", error)
      }
    }

    fetchData()
  }, [userId])

  const handleRegister = (delivery: DeliveryItem) => {
    setSelectedDelivery(delivery)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedDelivery(null)
    // Opcional: recargar datos después del registro
    // fetchData()
  }

  return (
    <div className="min-h-screen bg-[#ffffff] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#1e1e1e]">San Fernando - M6</h1>
          <div className="text-sm text-[#757575]">{new Date().toLocaleDateString()}</div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b3b3b3] w-4 h-4" />
            <Input placeholder="Buscar entregas..." className="pl-10 border-[#e0e0e0]" />
          </div>
          <Button variant="outline" size="sm" className="border-[#e0e0e0] text-[#757575]">
            <Filter className="w-4 h-4 mr-2" />
            Filtro
          </Button>
          <div className="flex border border-[#e0e0e0] rounded-md">
            <Button variant="ghost" size="sm" className="border-r border-[#e0e0e0]">
              <Calendar className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="border-r border-[#e0e0e0]">
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-[#ffffff] border border-[#e6e6e6] rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-4 p-4 bg-[#f5f5f5] border-b border-[#e6e6e6] text-sm font-medium text-[#757575]">
            <div className="col-span-1">ID</div>
            <div className="col-span-1">Orden</div>
            <div className="col-span-2">Ubicación</div>
            <div className="col-span-1">Fecha</div>
            <div className="col-span-1">Estado</div>
            <div className="col-span-1">Acción</div>
          </div>

          {deliveryData.length === 0 ? (
            <div className="p-8 text-center text-[#999]">
              <p className="text-lg mb-2">No hay entregas pendientes</p>
              <p className="text-sm">Todas las entregas han sido completadas</p>
            </div>
          ) : (
            deliveryData.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-7 gap-4 p-4 border-b border-[#e6e6e6] text-sm hover:bg-[#f7f7f7] transition-colors"
              >
                <div className="col-span-1 text-[#1e1e1e] font-mono text-xs">{item.id.substring(0, 8)}...</div>
                <div className="col-span-1 text-[#757575] font-medium">{item.order.substring(0, 8)}...</div>
                <div className="col-span-2 text-[#757575]">{item.location}</div>
                <div className="col-span-1 text-[#757575] text-xs">{item.date}</div>
                <div className="col-span-1">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {item.status}
                  </Badge>
                </div>
                <div className="col-span-1">
                  <Button
                    size="sm"
                    className="bg-[#1e1e1e] hover:bg-[#2c2c2c] text-white text-xs px-3 py-1"
                    onClick={() => handleRegister(item)}
                  >
                    Registrar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de registro */}
        <DeliveryRegistrationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          deliveryId={selectedDelivery?.id || ""}
          deliveryInfo={
            selectedDelivery
              ? {
                  order: selectedDelivery.order,
                  location: selectedDelivery.location,
                  date: selectedDelivery.date,
                }
              : undefined
          }
        />
      </div>
    </div>
  )
}
