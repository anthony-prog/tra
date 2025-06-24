"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, TrendingUp, Calendar } from "lucide-react"

// Datos de ejemplo para la última semana
const weeklyData = [
  { day: "Lun", deliveries: 12, date: "15/04" },
  { day: "Mar", deliveries: 15, date: "16/04" },
  { day: "Mié", deliveries: 8, date: "17/04" },
  { day: "Jue", deliveries: 18, date: "18/04" },
  { day: "Vie", deliveries: 14, date: "19/04" },
  { day: "Sáb", deliveries: 10, date: "20/04" },
  { day: "Dom", deliveries: 6, date: "21/04" },
]

const maxDeliveries = Math.max(...weeklyData.map((d) => d.deliveries))

export default function DeliveryPerformanceSummary() {
  // Datos de ejemplo del repartidor
  const todayStats = {
    completedDeliveries: 14,
    onTimePercentage: 87,
    averageTimeSpan: "6h 45m",
    totalDeliveries: 16,
    pendingDeliveries: 2,
  }

  return (
    <div className="w-full space-y-6 p-6 bg-background">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">Resumen de rendimiento</h2>
        <Badge variant="secondary" className="ml-auto">
          Hoy -{" "}
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Badge>
      </div>

      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Entregas completadas hoy */}
        <Card className="border-l-4 border-l-green-500 dark:border-l-green-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Entregas completadas hoy</CardTitle>
            <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{todayStats.completedDeliveries}</div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-muted-foreground">de {todayStats.totalDeliveries} asignadas</p>
              <Badge variant="outline" className="text-xs">
                {todayStats.pendingDeliveries} pendientes
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Porcentaje de entregas puntuales */}
        <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Entregas puntuales</CardTitle>
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{todayStats.onTimePercentage}%</div>
            <div className="mt-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${todayStats.onTimePercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((todayStats.completedDeliveries * todayStats.onTimePercentage) / 100)} de{" "}
                {todayStats.completedDeliveries} a tiempo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tiempo promedio de jornada */}
        <Card className="border-l-4 border-l-purple-500 dark:border-l-purple-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duración de jornada</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{todayStats.averageTimeSpan}</div>
            <p className="text-xs text-muted-foreground mt-2">Primera a última entrega</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Dentro del promedio</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de entregas por día (última semana) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Entregas por día - Última semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Gráfico de barras simple */}
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="relative flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-primary/80 hover:bg-primary transition-colors duration-200 rounded-t-md min-h-[4px] flex items-end justify-center pb-1"
                      style={{
                        height: `${(day.deliveries / maxDeliveries) * 100}%`,
                        minHeight: "20px",
                      }}
                    >
                      <span className="text-xs font-medium text-primary-foreground">{day.deliveries}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-foreground">{day.day}</div>
                    <div className="text-xs text-muted-foreground">{day.date}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Estadísticas adicionales */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-sm font-medium text-foreground">
                  {weeklyData.reduce((sum, day) => sum + day.deliveries, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Total semanal</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-foreground">
                  {Math.round(weeklyData.reduce((sum, day) => sum + day.deliveries, 0) / weeklyData.length)}
                </div>
                <div className="text-xs text-muted-foreground">Promedio diario</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-foreground">
                  {Math.max(...weeklyData.map((d) => d.deliveries))}
                </div>
                <div className="text-xs text-muted-foreground">Mejor día</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
