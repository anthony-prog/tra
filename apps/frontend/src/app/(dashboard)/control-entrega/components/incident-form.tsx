"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Grid3X3, List } from "lucide-react"

export default function IncidentForm() {
  return (
    <div className="min-h-screen bg-[#ffffff] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#1e1e1e]">San Fernando - M6</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#757575]">12 de Abril, 2025</div>
            <div className="text-sm text-[#757575]">Bienvenido, Mauricio Cano Quesada</div>
            <div className="text-sm text-[#757575]">Control: SFS-245</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b3b3b3] w-4 h-4" />
            <Input placeholder="Search tickets..." className="pl-10 border-[#e0e0e0]" />
          </div>
          <Button variant="outline" size="sm" className="border-[#e0e0e0] text-[#757575]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <div className="flex border border-[#e0e0e0] rounded-md">
            <Button variant="ghost" size="sm" className="border-r border-[#e0e0e0]">
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border border-[#e6e6e6]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1e1e1e]">Formulario de R. de Entr.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#757575] mb-2">Clave de Recepción</label>
                <Input placeholder="12345" className="border-[#e0e0e0]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#757575] mb-2">Firma digital del Receptor</label>
                <div className="flex items-center gap-2">
                  <Input placeholder="Subir" className="border-[#e0e0e0] flex-1" readOnly />
                  <Button variant="outline" size="sm" className="border-[#e0e0e0]">
                    Subir
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#757575] mb-2">Observaciones</label>
                <Textarea placeholder="Observaciones adicionales..." className="border-[#e0e0e0] min-h-[100px]" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="entregado" />
                  <label htmlFor="entregado" className="text-sm text-[#757575]">
                    Entregado exitoso
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="incidencia" />
                  <label htmlFor="incidencia" className="text-sm text-[#757575]">
                    Con incidencia
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-[#1e1e1e] hover:bg-[#2c2c2c] text-white">Confirmar</Button>
                <Button variant="outline" className="flex-1 border-[#e0e0e0] text-[#757575]">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#e6e6e6]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1e1e1e]">Incidencias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#757575] mb-2">Confirmación de hora secundaria</label>
                <Input placeholder="00:00" className="border-[#e0e0e0]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#757575] mb-2">Firma digital del Receptor</label>
                <div className="flex items-center gap-2">
                  <Input placeholder="Subir" className="border-[#e0e0e0] flex-1" readOnly />
                  <Button variant="outline" size="sm" className="border-[#e0e0e0]">
                    Subir
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#757575] mb-2">Observaciones</label>
                <Textarea placeholder="Observaciones adicionales..." className="border-[#e0e0e0] min-h-[100px]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#757575] mb-2">Foto</label>
                <div className="flex items-center gap-2">
                  <Input placeholder="Subir" className="border-[#e0e0e0] flex-1" readOnly />
                  <Button variant="outline" size="sm" className="border-[#e0e0e0]">
                    Subir
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-[#1e1e1e] hover:bg-[#2c2c2c] text-white">Enviar</Button>
                <Button variant="outline" className="flex-1 border-[#e0e0e0] text-[#757575]">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
