"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
  Navigation,
  Star,
  Phone,
  Clock,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  Car,
  Bike,
  Truck,
  AlertCircle,
  Map,
  Info,
  ExternalLink,
  Settings,
  Zap,
} from "lucide-react"

// Google Maps types
declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

interface Garage {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  distance?: number
  rating: number
  reviewCount: number
  phone: string
  isOpen: boolean
  openTime: string
  services: string[]
  vehicleTypes: string[]
  priceRange: string
  image?: string
}

interface InteractiveMapProps {
  garages: Garage[]
  userLocation?: { lat: number; lng: number } | null
  onGarageSelect?: (garage: Garage) => void
  className?: string
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  selectedGarage?: Garage | null
}

export function InteractiveMap({
  garages,
  userLocation,
  onGarageSelect,
  className,
  isFullscreen = false,
  onToggleFullscreen,
  selectedGarage,
}: InteractiveMapProps) {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    userLocation || { lat: 10.7769, lng: 106.7009 },
  )
  const [mapZoom, setMapZoom] = useState(13)
  const [mapType, setMapType] = useState("roadmap")
  const [showTraffic, setShowTraffic] = useState(false)
  const [hasGoogleMapsAPI, setHasGoogleMapsAPI] = useState<boolean | null>(null)
  const [mapLoadError, setMapLoadError] = useState<string | null>(null)
  const [isMapLoading, setIsMapLoading] = useState(true)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const trafficLayerRef = useRef<any>(null)
  const infoWindowRef = useRef<any>(null)

  // Check if Google Maps API is available
  useEffect(() => {
    const checkGoogleMapsAPI = async () => {
      setIsMapLoading(true)

      // Check if API key exists (simulated check)
      const hasAPIKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || localStorage.getItem("google_maps_api_key")

      if (!hasAPIKey) {
        setHasGoogleMapsAPI(false)
        setIsMapLoading(false)
        return
      }

      try {
        // Try to load Google Maps
        if (!window.google) {
          const script = document.createElement("script")
          script.src = `https://maps.googleapis.com/maps/api/js?key=${hasAPIKey}&libraries=places`
          script.async = true
          script.defer = true

          script.onload = () => {
            setHasGoogleMapsAPI(true)
            setIsMapLoading(false)
            initializeMap()
          }

          script.onerror = () => {
            setHasGoogleMapsAPI(false)
            setMapLoadError("Failed to load Google Maps API. Please check your API key.")
            setIsMapLoading(false)
          }

          document.head.appendChild(script)
        } else {
          setHasGoogleMapsAPI(true)
          setIsMapLoading(false)
          initializeMap()
        }
      } catch (error) {
        setHasGoogleMapsAPI(false)
        setMapLoadError("Error loading Google Maps")
        setIsMapLoading(false)
      }
    }

    checkGoogleMapsAPI()
  }, [])

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: mapZoom,
        mapTypeId: mapType,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      mapInstanceRef.current = map

      // Add user location marker
      if (userLocation) {
        new window.google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Your Location",
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
          },
        })
      }

      // Add garage markers
      markersRef.current = garages.map((garage) => {
        const marker = new window.google.maps.Marker({
          position: { lat: garage.lat, lng: garage.lng },
          map: map,
          title: garage.name,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1"/>
                <circle cx="12" cy="9" r="2.5" fill="#FFFFFF"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          },
        })

        marker.addListener("click", () => {
          if (onGarageSelect) {
            onGarageSelect(garage)
          }

          if (infoWindowRef.current) {
            infoWindowRef.current.close()
          }

          infoWindowRef.current = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2 max-w-xs">
                <h3 class="font-semibold text-sm">${garage.name}</h3>
                <p class="text-xs text-gray-600 mb-1">${garage.address}</p>
                <div class="flex items-center space-x-2 text-xs mb-1">
                  <span class="flex items-center">
                    <span class="text-yellow-500">★</span>
                    <span class="ml-1">${garage.rating}</span>
                  </span>
                  <span class="${garage.isOpen ? "text-green-600" : "text-red-600"}">${garage.isOpen ? "Open" : "Closed"}</span>
                </div>
                <div class="flex flex-wrap gap-1 mt-1">
                  ${garage.services
                    .slice(0, 2)
                    .map(
                      (service) =>
                        `<span class="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded">${service}</span>`,
                    )
                    .join("")}
                </div>
              </div>
            `,
          })

          infoWindowRef.current.open(map, marker)
        })

        return marker
      })
    } catch (error) {
      setMapLoadError("Error initializing map")
    }
  }

  const handleMapTypeChange = (type: string) => {
    setMapType(type)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(type)
    }
  }

  const toggleTraffic = () => {
    if (!mapInstanceRef.current) return

    if (showTraffic) {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null)
      }
    } else {
      trafficLayerRef.current = new window.google.maps.TrafficLayer()
      trafficLayerRef.current.setMap(mapInstanceRef.current)
    }
    setShowTraffic(!showTraffic)
  }

  const resetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(mapCenter)
      mapInstanceRef.current.setZoom(13)
    }
  }

  // Fallback Map Component (when no Google Maps API)
  const FallbackMap = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-slate-300"></div>
          ))}
        </div>
      </div>

      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Map className="h-4 w-4 text-blue-600" />
              <span>Interactive Map (Simulation Mode)</span>
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Smart Mode
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-700">
                Google Maps API not configured. Showing simulation mode with garage locations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* User Location Indicator */}
      {userLocation && (
        <div
          className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-20"
          style={{
            left: "45%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        </div>
      )}

      {/* Garage Markers */}
      {garages.slice(0, 6).map((garage, index) => {
        const positions = [
          { left: "30%", top: "35%" },
          { left: "60%", top: "25%" },
          { left: "25%", top: "65%" },
          { left: "70%", top: "60%" },
          { left: "40%", top: "75%" },
          { left: "80%", top: "40%" },
        ]

        return (
          <div
            key={garage.id}
            className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={positions[index]}
            onClick={() => onGarageSelect?.(garage)}
          >
            <div className="relative group">
              <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <MapPin className="h-4 w-4 text-white" />
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white rounded-lg shadow-lg border p-2 text-xs whitespace-nowrap">
                  <div className="font-semibold">{garage.name}</div>
                  <div className="text-gray-600">
                    {garage.rating}★ • {garage.isOpen ? "Open" : "Closed"}
                  </div>
                  {garage.distance && <div className="text-blue-600">{garage.distance.toFixed(1)}km away</div>}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                <span>Garages ({garages.length})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm max-w-xs">
          <CardContent className="p-3">
            <div className="text-xs space-y-2">
              <div className="flex items-center space-x-2 text-blue-600 font-medium">
                <Settings className="h-3 w-3" />
                <span>Enable Google Maps</span>
              </div>
              <div className="text-gray-600">
                Add <code className="bg-gray-100 px-1 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to
                environment variables for full map functionality.
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs bg-transparent"
                onClick={() =>
                  window.open("https://developers.google.com/maps/documentation/javascript/get-api-key", "_blank")
                }
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Get API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Loading State
  if (isMapLoading) {
    return (
      <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <div className="text-sm text-slate-600">Loading map...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map Controls */}
      {hasGoogleMapsAPI && (
        <div className="absolute top-4 right-4 z-10 space-y-2">
          <div className="bg-white rounded-lg shadow-lg border p-2">
            <div className="flex flex-col space-y-2">
              <Button
                size="sm"
                variant={mapType === "roadmap" ? "default" : "outline"}
                onClick={() => handleMapTypeChange("roadmap")}
                className="text-xs"
              >
                Road
              </Button>
              <Button
                size="sm"
                variant={mapType === "satellite" ? "default" : "outline"}
                onClick={() => handleMapTypeChange("satellite")}
                className="text-xs"
              >
                Satellite
              </Button>
              <Button
                size="sm"
                variant={showTraffic ? "default" : "outline"}
                onClick={toggleTraffic}
                className="text-xs"
              >
                <Layers className="h-3 w-3 mr-1" />
                Traffic
              </Button>
              <Button size="sm" variant="outline" onClick={resetMap} className="text-xs bg-transparent">
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              {onToggleFullscreen && (
                <Button size="sm" variant="outline" onClick={onToggleFullscreen} className="text-xs bg-transparent">
                  {isFullscreen ? <Minimize2 className="h-3 w-3 mr-1" /> : <Maximize2 className="h-3 w-3 mr-1" />}
                  {isFullscreen ? "Exit" : "Full"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="w-full h-full rounded-lg overflow-hidden">
        {hasGoogleMapsAPI === false ? <FallbackMap /> : <div ref={mapRef} className="w-full h-full" />}
      </div>

      {/* Selected Garage Info Panel */}
      {selectedGarage && (
        <div className="absolute bottom-4 left-4 z-10 max-w-sm">
          <Card className="bg-white/95 backdrop-blur-sm border-blue-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{selectedGarage.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{selectedGarage.rating}</span>
                      <span>({selectedGarage.reviewCount})</span>
                      <span className={selectedGarage.isOpen ? "text-green-600" : "text-red-600"}>
                        {selectedGarage.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedGarage.priceRange}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span className="truncate">{selectedGarage.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span>{selectedGarage.openTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span>{selectedGarage.phone}</span>
                  </div>
                  {selectedGarage.distance && (
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-3 w-3 text-gray-500" />
                      <span>{selectedGarage.distance.toFixed(1)}km away</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {selectedGarage.services.slice(0, 3).map((service) => (
                    <Badge key={service} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  {selectedGarage.vehicleTypes.includes("Xe máy") && <Bike className="h-4 w-4 text-blue-600" />}
                  {selectedGarage.vehicleTypes.includes("Ô tô") && <Car className="h-4 w-4 text-blue-600" />}
                  {selectedGarage.vehicleTypes.includes("Xe tải") && <Truck className="h-4 w-4 text-blue-600" />}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                    <Info className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Display */}
      {mapLoadError && (
        <div className="absolute inset-4 z-10 flex items-center justify-center">
          <Alert className="max-w-md border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{mapLoadError}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
