"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { MapPin, Navigation, BarChart3, AlertTriangle } from "lucide-react"

interface MapData {
  origin?: string
  coordinates?: string
  stops?: any[]
  totalStops?: number
  currentLocation?: string
  completedStops?: number
  ruta_planificada?: any[]
  recorrido_km?: number
  distancia_km?: number
  tiempo_estimado?: any
}

interface MapCardProps {
  mapData?: MapData
  isLoading: boolean
}

// Componente de fallback cuando no hay API key
function FallbackMap({ mapData }: { mapData?: MapData }) {
  return (
    <div className="h-full w-full bg-gray-900 relative overflow-hidden">
      {/* Satellite-style map background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: "#1a1a1a",
        }}
      >
        {/* Route Path - Usar ruta planificada si está disponible */}
        {mapData?.ruta_planificada && mapData.ruta_planificada.length > 0 ? (
          <svg className="absolute inset-0 w-full h-full">
            <path
              d={mapData.ruta_planificada.map((punto: any, index: number) => {
                const x = 100 + (index * 50)
                const y = 500 - (index * 30)
                return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
              }).join(' ')}
              stroke="#10B981"
              strokeWidth="4"
              fill="none"
              strokeDasharray="0"
              className="drop-shadow-lg"
            />
          </svg>
        ) : (
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 100 500 Q 200 400 300 350 Q 450 300 600 250 Q 750 200 900 150"
              stroke="#10B981"
              strokeWidth="4"
              fill="none"
              strokeDasharray="0"
              className="drop-shadow-lg"
            />
          </svg>
        )}

        {/* Route Points */}
        {mapData?.stops && mapData.stops.map((stop, index) => (
          <div 
            key={index}
            className="absolute"
            style={{
              top: `${20 + (index * 12)}%`,
              left: `${20 + (index * 8)}%`
            }}
          >
            {index === 0 ? (
              // Punto inicial - ubicación actual
              <div className="relative">
                <div className="h-4 w-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                  <div className="absolute -top-2 -left-2 h-8 w-8 bg-blue-500 rounded-full opacity-25 animate-ping"></div>
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  📍 Actual
                </div>
              </div>
            ) : (
              // Otros puntos
              <div className="relative">
                <div className={`h-3 w-3 rounded-full border-2 border-white shadow-lg ${
                  stop.visitado ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {!stop.visitado && (
                    <div className="absolute -top-1 -left-1 h-5 w-5 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  {stop.visitado ? '✅' : '⏳'} {index + 1}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Route Label */}
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
          {mapData?.origin || "Ruta de entrega"}
        </div>

        {/* Route Info */}
        <div className="absolute top-1/2 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-xs">
          <div className="font-medium mb-1">Ruta Completa</div>
          <div>Puntos: {mapData?.stops?.length || 0}</div>
          <div>Completados: {mapData?.completedStops || 0}</div>
          <div>Pendientes: {(mapData?.stops?.length || 0) - (mapData?.completedStops || 0)}</div>
          {mapData?.ruta_planificada && mapData.ruta_planificada.length > 0 && (
            <div className="mt-1 text-green-400">✓ Ruta Planificada</div>
          )}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="bg-white p-2 rounded shadow hover:bg-gray-50 text-lg font-bold">+</button>
        <button className="bg-white p-2 rounded shadow hover:bg-gray-50 text-lg font-bold">-</button>
      </div>
    </div>
  )
}

export function MapCard({ mapData, isLoading }: MapCardProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [error, setError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    if (!mapData || isLoading) return

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    console.log("API Key disponible:", !!apiKey)
    console.log("API Key:", apiKey?.substring(0, 10) + "...")
    console.log("MapData completo:", mapData)
    console.log("Ruta planificada:", mapData.ruta_planificada)
    console.log("Stops:", mapData.stops)
    
    // Si no hay API key, usar fallback
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      console.log("Usando fallback - No hay API key válida")
      setUseFallback(true)
      return
    }

    console.log("Intentando cargar Google Maps...")
    setUseFallback(false)

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places"]
        })

        console.log("Cargando Google Maps API...")
        const google = await loader.load()
        console.log("Google Maps API cargada exitosamente")
        
        if (!mapRef.current) {
          console.log("Error: mapRef.current es null")
          return
        }

        // Crear el mapa
        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: -12.0464, lng: -77.0428 }, // Lima, Perú por defecto
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        })

        console.log("Mapa creado exitosamente")

        // Inicializar servicios
        const newDirectionsService = new google.maps.DirectionsService()
        const newDirectionsRenderer = new google.maps.DirectionsRenderer({
          map: newMap,
          suppressMarkers: true // No mostrar marcadores por defecto
        })

        setMap(newMap)
        setDirectionsService(newDirectionsService)
        setDirectionsRenderer(newDirectionsRenderer)

      } catch (err) {
        console.error("Error al cargar Google Maps:", err)
        setError("Error al cargar el mapa")
        setUseFallback(true)
      }
    }

    initMap()
  }, [mapData, isLoading])

  // Función para crear marcadores en el mapa
  useEffect(() => {
    if (!map || !mapData?.stops || mapData.stops.length === 0) return

    console.log("Creando marcadores...")
    console.log("Puntos de la ruta:", mapData.stops)

    // Limpiar marcadores existentes
    markers.forEach(marker => marker.setMap(null))
    const newMarkers: google.maps.Marker[] = []

    // Determinar la posición de inicio basada en la ruta planificada
    let startPosition = null
    if (mapData.ruta_planificada && mapData.ruta_planificada.length > 0) {
      const firstRoutePoint = mapData.ruta_planificada[0]
      if (firstRoutePoint.lat && firstRoutePoint.lng) {
        startPosition = {
          lat: parseFloat(firstRoutePoint.lat),
          lng: parseFloat(firstRoutePoint.lng)
        }
      } else if (firstRoutePoint.latitud && firstRoutePoint.longitud) {
        startPosition = {
          lat: parseFloat(firstRoutePoint.latitud),
          lng: parseFloat(firstRoutePoint.longitud)
        }
      } else if (firstRoutePoint.coordenada_origen) {
        startPosition = {
          lat: parseFloat(firstRoutePoint.coordenada_origen.lat),
          lng: parseFloat(firstRoutePoint.coordenada_origen.lng)
        }
      }
    }

    // Si no hay ruta planificada, usar el primer stop como inicio
    if (!startPosition && mapData.stops[0]?.coordenada_origen) {
      startPosition = {
        lat: parseFloat(mapData.stops[0].coordenada_origen.lat),
        lng: parseFloat(mapData.stops[0].coordenada_origen.lng)
      }
    }

    // Crear marcador de ubicación actual en el inicio de la ruta
    if (startPosition) {
      const currentLocationMarker = new google.maps.Marker({
        position: startPosition,
        map,
        title: "📍 Ubicación Actual",
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="white" stroke-width="3"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
              <circle cx="16" cy="16" r="20" fill="#3B82F6" opacity="0.3">
                <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      })

      // Info window para ubicación actual
      const currentInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #3B82F6;">
              📍 Ubicación Actual
            </h3>
            <p style="margin: 4px 0; font-size: 12px;">
              <strong>Estado:</strong> Inicio de la ruta
            </p>
            <p style="margin: 4px 0; font-size: 12px;">
              <strong>Coordenadas:</strong> ${startPosition.lat}, ${startPosition.lng}
            </p>
          </div>
        `
      })

      currentLocationMarker.addListener("click", () => {
        currentInfoWindow.open(map, currentLocationMarker)
      })

      newMarkers.push(currentLocationMarker)
    }

    // Crear marcadores para cada parada (excluyendo el primer stop si es el mismo que el inicio)
    mapData.stops.forEach((stop, index) => {
      if (stop.coordenada_origen) {
        const position = {
          lat: parseFloat(stop.coordenada_origen.lat),
          lng: parseFloat(stop.coordenada_origen.lng)
        }

        // Verificar si esta parada es la misma que el inicio
        const isStartPosition = startPosition && 
          Math.abs(position.lat - startPosition.lat) < 0.0001 && 
          Math.abs(position.lng - startPosition.lng) < 0.0001

        if (isStartPosition) {
          console.log(`Parada ${index + 1} es la misma que el inicio, saltando...`)
          return
        }

        console.log(`Punto ${index + 1}:`, stop.nombre_origen, position)

        // Determinar el tipo de marcador para paradas
        const markerIcon = {
          url: stop.visitado 
            ? "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#10B981" stroke="white" stroke-width="2"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            `)
            : "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#6B7280" stroke="white" stroke-width="2"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${index + 1}</text>
              </svg>
            `),
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12)
        }

        const markerTitle = stop.visitado 
          ? `✅ Parada ${index + 1} - ${stop.nombre_origen} (Completada)`
          : `⏳ Parada ${index + 1} - ${stop.nombre_origen} (Pendiente)`

        const marker = new google.maps.Marker({
          position,
          map,
          title: markerTitle,
          icon: markerIcon
        })

        // Info window para cada marcador
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: ${stop.visitado ? '#10B981' : '#6B7280'}">
                ${stop.visitado ? '✅' : '⏳'} Parada ${index + 1}
              </h3>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Nombre:</strong> ${stop.nombre_origen || `Parada ${index + 1}`}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Estado:</strong> ${stop.visitado ? 'Completada' : 'Pendiente'}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Coordenadas:</strong> ${stop.coordenada_origen.lat}, ${stop.coordenada_origen.lng}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Orden:</strong> ${index + 1} de ${mapData.stops?.length || 0}
              </p>
            </div>
          `
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })

        newMarkers.push(marker)
      }
    })

    setMarkers(newMarkers)

    // Centrar el mapa en todos los puntos
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition()!)
      })
      map.fitBounds(bounds)
      
      // Agregar un poco de padding para que no esté muy ajustado
      map.setZoom(Math.min(map.getZoom() || 12, 14))
    }

  }, [map, mapData])

  // Función para dibujar la ruta planificada
  useEffect(() => {
    if (!map || !mapData?.ruta_planificada || mapData.ruta_planificada.length === 0) {
      console.log("No se puede dibujar ruta planificada:", {
        map: !!map,
        ruta_planificada: mapData?.ruta_planificada,
        length: mapData?.ruta_planificada?.length
      })
      return
    }

    console.log("Dibujando ruta planificada...")
    console.log("Puntos de ruta planificada:", mapData.ruta_planificada)
    console.log("Primer punto:", mapData.ruta_planificada[0])
    console.log("Estructura del primer punto:", Object.keys(mapData.ruta_planificada[0] || {}))

    // Limpiar rutas existentes
    if (directionsRenderer) {
      directionsRenderer.setMap(null)
    }

    // Crear path con los puntos de la ruta planificada
    const path: Array<{ lat: number; lng: number }> = []
    
    mapData.ruta_planificada.forEach((punto: any, index: number) => {
      console.log(`Procesando punto ${index}:`, punto)
      
      // Intentar diferentes formatos de coordenadas
      let lat, lng
      
      if (punto.lat && punto.lng) {
        lat = parseFloat(punto.lat)
        lng = parseFloat(punto.lng)
      } else if (punto.latitud && punto.longitud) {
        lat = parseFloat(punto.latitud)
        lng = parseFloat(punto.longitud)
      } else if (punto.coordenada_origen) {
        lat = parseFloat(punto.coordenada_origen.lat)
        lng = parseFloat(punto.coordenada_origen.lng)
      } else {
        console.warn(`Punto ${index} sin coordenadas válidas:`, punto)
        return
      }
      
      console.log(`Coordenadas extraídas: lat=${lat}, lng=${lng}`)
      path.push({ lat, lng })
    })

    console.log("Path de la ruta final:", path)

    if (path.length > 1) {
      // Dibujar la ruta planificada
      new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#10B981',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map
      })

      console.log("Ruta planificada dibujada exitosamente")
    } else {
      console.warn("No hay suficientes puntos válidos para dibujar la ruta")
    }
  }, [map, mapData?.ruta_planificada])

  // Función para dibujar la ruta completa (fallback si no hay ruta planificada)
  useEffect(() => {
    if (!directionsService || !directionsRenderer || !mapData?.stops || mapData.stops.length < 2) return
    
    // Solo usar si no hay ruta planificada
    if (mapData.ruta_planificada && mapData.ruta_planificada.length > 0) return

    console.log("Dibujando ruta completa (fallback)...")
    console.log("Número de puntos:", mapData.stops.length)

    // Crear waypoints para todos los puntos intermedios
    const waypoints = mapData.stops.slice(1, -1).map(stop => ({
      location: new google.maps.LatLng(
        parseFloat(stop.coordenada_origen.lat),
        parseFloat(stop.coordenada_origen.lng)
      ),
      stopover: true
    }))

    console.log("Waypoints:", waypoints.length)

    const request = {
      origin: new google.maps.LatLng(
        parseFloat(mapData.stops[0].coordenada_origen.lat),
        parseFloat(mapData.stops[0].coordenada_origen.lng)
      ),
      destination: new google.maps.LatLng(
        parseFloat(mapData.stops[mapData.stops.length - 1].coordenada_origen.lat),
        parseFloat(mapData.stops[mapData.stops.length - 1].coordenada_origen.lng)
      ),
      waypoints,
      optimizeWaypoints: false, // Mantener el orden original
      travelMode: google.maps.TravelMode.DRIVING
    }

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result)
        console.log("Ruta completa dibujada exitosamente")
        
        // Personalizar el estilo de la ruta
        directionsRenderer.setOptions({
          polylineOptions: {
            strokeColor: '#10B981',
            strokeWeight: 4,
            strokeOpacity: 0.8
          }
        })
      } else {
        console.log("Error al dibujar ruta:", status)
        // Si falla la ruta, dibujar líneas simples entre puntos
        drawSimpleRoute()
      }
    })
  }, [directionsService, directionsRenderer, mapData?.stops, mapData?.ruta_planificada])

  // Función para dibujar ruta simple si falla la API de direcciones
  const drawSimpleRoute = () => {
    if (!map || !mapData?.stops || mapData.stops.length < 2) return

    console.log("Dibujando ruta simple...")

    const path = mapData.stops.map(stop => ({
      lat: parseFloat(stop.coordenada_origen.lat),
      lng: parseFloat(stop.coordenada_origen.lng)
    }))

    new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#10B981',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  // Si no hay datos del mapa, mostrar mensaje
  if (!mapData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No hay datos del mapa disponibles</p>
        </div>
      </div>
    )
  }

  // Si hay error o se usa fallback
  if (error || useFallback) {
    return (
      <div className="h-full w-full relative">
        {/* Fallback Map */}
        <FallbackMap mapData={mapData} />

        {/* Location Info Overlay - Movido a la parte inferior */}
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 min-w-[280px]">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-blue-500" />
            <div>
              <span className="font-medium text-lg">{mapData?.origin || "Ruta de entrega"}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Distancia restante</p>
                <p className="font-semibold">{mapData?.distancia_km || 0} KM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Paradas completadas</p>
                <p className="font-semibold">{mapData?.completedStops || 0}/{mapData?.totalStops || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Key Warning */}
        <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-xs">
          <AlertTriangle className="h-3 w-3 inline mr-1" />
          Mapa estático - Configura API key para Google Maps
        </div>
      </div>
    )
  }

  // Google Maps
  return (
    <div className="h-full w-full relative">
      {/* Google Maps Container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Location Info Overlay - Movido a la parte inferior */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 min-w-[280px]">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-blue-500" />
          <div>
            <span className="font-medium text-lg">{mapData?.origin || "Ruta de entrega"}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Navigation className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Distancia restante</p>
              <p className="font-semibold">{mapData?.distancia_km || 0} KM</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Paradas completadas</p>
              <p className="font-semibold">{mapData?.completedStops || 0}/{mapData?.totalStops || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 