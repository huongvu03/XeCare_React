"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Navigation,
  Star,
  Clock,
  Car,
  Bike,
  Truck,
  Phone,
  Maximize2,
  Minimize2,
  Target,
  Layers,
  Route,
  AlertTriangle,
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
}

export function InteractiveMap({
  garages,
  userLocation,
  onGarageSelect,
  className,
  isFullscreen = false,
  onToggleFullscreen,
}: InteractiveMapProps) {
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 10.7769, lng: 106.7009 }) // Ho Chi Minh City
  const [mapZoom, setMapZoom] = useState(13)
  const [mapType, setMapType] = useState("roadmap")
  const [showTraffic, setShowTraffic] = useState(false)
  const [routeMode, setRouteMode] = useState(false)
  const [searchRadius, setSearchRadius] = useState(5)
  const [useSimulatedMap, setUseSimulatedMap] = useState(true)
  const [mapLoadError, setMapLoadError] = useState<string | null>(null)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // Update center when user location changes
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation)
      setMapZoom(15)
    }
  }, [userLocation])

  // Try to load Google Maps
  useEffect(() => {
    // Check if we already have Google Maps loaded
    if (window.google && window.google.maps) {
      setUseSimulatedMap(false)
      return
    }

    // Try to load Google Maps with no API key for development
    const loadGoogleMapsWithoutKey = () => {
      const script = document.createElement("script")
      script.src = "https://maps.googleapis.com/maps/api/js?libraries=places,geometry&callback=initMap"
      script.async = true
      script.defer = true

      window.initMap = () => {
        setUseSimulatedMap(false)
      }

      script.onerror = () => {
        setMapLoadError("Không thể tải Google Maps. Sử dụng bản đồ mô phỏng.")
        setUseSimulatedMap(true)
      }

      document.head.appendChild(script)
    }

    loadGoogleMapsWithoutKey()

    // Fallback to simulated map after 3 seconds if Google Maps doesn't load
    const timeout = setTimeout(() => {
      if (!window.google || !window.google.maps) {
        setUseSimulatedMap(true)
      }
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  // Initialize Google Maps if available
  useEffect(() => {
    if (useSimulatedMap || !mapRef.current || !window.google || !window.google.maps || mapInstanceRef.current) return

    try {
      const center = userLocation || mapCenter

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: userLocation ? 15 : 13,
        mapTypeId: mapType,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: false,
        zoomControl: true,
      })

      // Add markers for garages
      garages.forEach((garage, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: garage.lat, lng: garage.lng },
          map: mapInstanceRef.current,
          title: garage.name,
          label: {
            text: (index + 1).toString(),
            color: "white",
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: garage.isOpen ? "#10b981" : "#ef4444",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 12,
          },
        })

        marker.addListener("click", () => {
          setSelectedGarage(garage)
          onGarageSelect?.(garage)
        })

        markersRef.current.push(marker)
      })

      // Add user location marker if available
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: userLocation,
          map: mapInstanceRef.current,
          title: "Vị trí của bạn",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 8,
          },
          zIndex: 1000,
        })

        markersRef.current.push(userMarker)
      }

      // Add traffic layer if enabled
      if (showTraffic) {
        const trafficLayer = new window.google.maps.TrafficLayer()
        trafficLayer.setMap(mapInstanceRef.current)
      }
    } catch (error) {
      console.error("Error initializing Google Maps:", error)
      setMapLoadError("Lỗi khởi tạo Google Maps. Sử dụng bản đồ mô phỏng.")
      setUseSimulatedMap(true)
    }

    return () => {
      // Clean up markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach((marker) => marker.setMap(null))
        markersRef.current = []
      }
    }
  }, [garages, userLocation, mapType, showTraffic, useSimulatedMap, mapCenter, onGarageSelect])

  // Handle garage click in simulated map
  const handleGarageClick = (garage: Garage) => {
    setSelectedGarage(garage)
    setMapCenter({ lat: garage.lat, lng: garage.lng })
    setMapZoom(16)
    onGarageSelect?.(garage)
  }

  // Get directions to garage
  const getDirections = (garage: Garage) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${garage.lat},${garage.lng}`
      window.open(url, "_blank")
    }
  }

  // Center on user location
  const centerOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation)
      setMapZoom(15)

      if (!useSimulatedMap && mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(userLocation)
        mapInstanceRef.current.setZoom(15)
      }
    }
  }

  // Center to show all garages
  const centerOnGarages = () => {
    if (garages.length > 0) {
      // Calculate bounds to fit all garages
      const lats = garages.map((g) => g.lat)
      const lngs = garages.map((g) => g.lng)
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
      setMapCenter({ lat: centerLat, lng: centerLng })
      setMapZoom(12)

      if (!useSimulatedMap && mapInstanceRef.current && window.google) {
        const bounds = new window.google.maps.LatLngBounds()
        garages.forEach((garage) => {
          bounds.extend({ lat: garage.lat, lng: garage.lng })
        })
        mapInstanceRef.current.fitBounds(bounds)
      }
    }
  }

  const getMarkerColor = (garage: Garage) => {
    if (selectedGarage?.id === garage.id) return "bg-blue-600"
    if (garage.isOpen) return "bg-green-500"
    return "bg-red-500"
  }

  const getDistanceColor = (distance?: number) => {
    if (!distance) return "text-slate-600"
    if (distance <= 2) return "text-green-600"
    if (distance <= 5) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className={`${className} ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>Bản đồ garage ({garages.length})</span>
          {mapLoadError && (
            <Badge variant="outline" className="ml-2 text-amber-600 border-amber-300 bg-amber-50">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Bản đồ mô phỏng
            </Badge>
          )}
        </CardTitle>

        <div className="flex items-center space-x-2">
          {/* Map Controls */}
          <Select value={mapType} onValueChange={setMapType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roadmap">Đường phố</SelectItem>
              <SelectItem value="satellite">Vệ tinh</SelectItem>
              <SelectItem value="hybrid">Kết hợp</SelectItem>
              <SelectItem value="terrain">Địa hình</SelectItem>
            </SelectContent>
          </Select>

          <Button variant={showTraffic ? "default" : "outline"} size="sm" onClick={() => setShowTraffic(!showTraffic)}>
            <Layers className="h-4 w-4" />
          </Button>

          <Button variant={routeMode ? "default" : "outline"} size="sm" onClick={() => setRouteMode(!routeMode)}>
            <Route className="h-4 w-4" />
          </Button>

          {onToggleFullscreen && (
            <Button variant="outline" size="sm" onClick={onToggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className={`relative ${isFullscreen ? "h-screen" : "h-96"}`}>
          {/* Google Maps Container */}
          {!useSimulatedMap && <div ref={mapRef} className="w-full h-full bg-slate-100 rounded-lg" />}

          {/* Simulated Map Container */}
          {useSimulatedMap && (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg relative overflow-hidden">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200">
                {/* Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Roads Simulation */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-400 opacity-60"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-500 opacity-70"></div>
                  <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-400 opacity-60"></div>
                  <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-400 opacity-60"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gray-500 opacity-70"></div>
                  <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-400 opacity-60"></div>
                </div>

                {/* Traffic Layer */}
                {showTraffic && (
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/4 right-1/4 h-2 bg-red-400 opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 right-1/4 h-2 bg-yellow-400 opacity-50"></div>
                  </div>
                )}
              </div>

              {/* User Location Marker */}
              {userLocation && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: `${50}%`,
                    top: `${50}%`,
                  }}
                >
                  <div className="relative">
                    <div className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-lg border-2 border-white">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute -inset-2 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Vị trí của bạn
                    </div>
                  </div>
                </div>
              )}

              {/* Garage Markers */}
              {garages.map((garage, index) => {
                const offsetX = 20 + (index % 5) * 15
                const offsetY = 20 + Math.floor(index / 5) * 15

                return (
                  <div
                    key={garage.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                    style={{
                      left: `${offsetX}%`,
                      top: `${offsetY}%`,
                    }}
                    onClick={() => handleGarageClick(garage)}
                  >
                    <div className="relative group">
                      <div
                        className={`${getMarkerColor(garage)} text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg hover:scale-110 transition-transform border-2 border-white`}
                      >
                        {index + 1}
                      </div>

                      {/* Distance Badge */}
                      {garage.distance && (
                        <div
                          className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs px-1 py-0.5 rounded ${getDistanceColor(garage.distance)} bg-white shadow-sm border`}
                        >
                          {garage.distance.toFixed(1)}km
                        </div>
                      )}

                      {/* Hover Info */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-white rounded-lg shadow-lg p-3 min-w-48 border">
                          <div className="font-medium text-slate-900">{garage.name}</div>
                          <div className="text-sm text-slate-600 flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{garage.rating}</span>
                            <span>•</span>
                            <span className={garage.isOpen ? "text-green-600" : "text-red-600"}>
                              {garage.isOpen ? "Mở" : "Đóng"}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{garage.services.slice(0, 2).join(", ")}</div>
                        </div>
                      </div>

                      {/* Route Line */}
                      {routeMode && selectedGarage?.id === garage.id && userLocation && (
                        <svg
                          className="absolute inset-0 pointer-events-none"
                          style={{ width: "100vw", height: "100vh", left: "-50vw", top: "-50vh" }}
                        >
                          <line
                            x1="50%"
                            y1="50%"
                            x2={`${offsetX}%`}
                            y2={`${offsetY}%`}
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeDasharray="5,5"
                            className="animate-pulse"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Search Radius Circle */}
              {userLocation && (
                <div
                  className="absolute border-2 border-blue-400 border-dashed rounded-full opacity-30 pointer-events-none"
                  style={{
                    left: `${50 - searchRadius}%`,
                    top: `${50 - searchRadius}%`,
                    width: `${searchRadius * 2}%`,
                    height: `${searchRadius * 2}%`,
                  }}
                />
              )}

              {/* Map Controls Overlay */}
              <div className="absolute top-4 right-4 space-y-2">
                <div className="bg-white rounded-lg shadow-lg p-2 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                  <div className="text-xs text-center text-slate-600">{mapZoom}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMapZoom(Math.max(mapZoom - 1, 8))}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-2 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={centerOnUser}
                    disabled={!userLocation}
                    className="w-8 h-8 p-0"
                    title="Về vị trí của tôi"
                  >
                    <Target className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={centerOnGarages}
                    className="w-8 h-8 p-0"
                    title="Xem tất cả garage"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Map Info */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                <div className="text-sm font-medium text-slate-900 mb-2">Chú thích</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Garage đang mở</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Garage đã đóng</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Garage đã chọn</span>
                  </div>
                  {userLocation && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                      <span>Vị trí của bạn</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* API Key Missing Warning */}
          {useSimulatedMap && (
            <div className="absolute top-4 left-4 bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-lg max-w-xs">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 text-sm">Google Maps API Key cần được cấu hình</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Đang sử dụng bản đồ mô phỏng. Để sử dụng Google Maps, bạn cần thêm API key vào code.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 h-7 text-xs border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    onClick={() =>
                      window.open("https://developers.google.com/maps/documentation/javascript/get-api-key", "_blank")
                    }
                  >
                    Xem hướng dẫn
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Selected Garage Info Panel */}
          {selectedGarage && (
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900">{selectedGarage.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{selectedGarage.rating}</span>
                    <span>({selectedGarage.reviewCount})</span>
                    {selectedGarage.distance && (
                      <>
                        <span>•</span>
                        <span className={getDistanceColor(selectedGarage.distance)}>
                          {selectedGarage.distance.toFixed(1)}km
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedGarage(null)} className="p-1">
                  ×
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedGarage.address}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className={selectedGarage.isOpen ? "text-green-600" : "text-red-600"}>
                    {selectedGarage.openTime} • {selectedGarage.isOpen ? "Đang mở" : "Đã đóng"}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-slate-600">
                  <Phone className="h-4 w-4" />
                  <span>{selectedGarage.phone}</span>
                </div>

                <div className="flex items-center space-x-1">
                  {selectedGarage.vehicleTypes.includes("Xe máy") && <Bike className="h-4 w-4 text-blue-600" />}
                  {selectedGarage.vehicleTypes.includes("Ô tô") && <Car className="h-4 w-4 text-blue-600" />}
                  {selectedGarage.vehicleTypes.includes("Xe tải") && <Truck className="h-4 w-4 text-blue-600" />}
                </div>

                <div className="flex flex-wrap gap-1">
                  {selectedGarage.services.slice(0, 3).map((service) => (
                    <Badge key={service} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => getDirections(selectedGarage)}
                  disabled={!userLocation}
                  className="flex-1"
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Chỉ đường
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-1" />
                  Gọi
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Map Footer */}
        {!isFullscreen && (
          <div className="p-4 border-t bg-slate-50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-slate-600">Hiển thị {garages.length} garage</span>
                {userLocation && <span className="text-blue-600">Trong bán kính {searchRadius}km</span>}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/garage/@${mapCenter.lat},${mapCenter.lng},${mapZoom}z`,
                      "_blank",
                    )
                  }
                >
                  Mở Google Maps
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
