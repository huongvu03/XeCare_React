"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Star, Clock, Car, Bike, Truck } from "lucide-react"

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
}

interface GarageMapProps {
  garages: Garage[]
  userLocation?: { lat: number; lng: number } | null
  onGarageSelect?: (garage: Garage) => void
  className?: string
}

export function GarageMap({ garages, userLocation, onGarageSelect, className }: GarageMapProps) {
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 10.7769, lng: 106.7009 }) // Default to Ho Chi Minh City

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation)
    }
  }, [userLocation])

  const handleGarageClick = (garage: Garage) => {
    setSelectedGarage(garage)
    onGarageSelect?.(garage)
  }

  const getDirections = (garage: Garage) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${garage.lat},${garage.lng}`
      window.open(url, "_blank")
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${garage.lat},${garage.lng}`
      window.open(url, "_blank")
    }
  }

  const openInMaps = (garage: Garage) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${garage.name} ${garage.address}`
    window.open(url, "_blank")
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>Bản đồ garage ({garages.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder */}
        <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg h-64 mb-4 border-2 border-dashed border-blue-200 flex items-center justify-center">
          <div className="text-center text-slate-600">
            <MapPin className="h-12 w-12 mx-auto mb-2 text-blue-400" />
            <div className="font-medium">Bản đồ tương tác</div>
            <div className="text-sm">Hiển thị {garages.length} garage gần bạn</div>
            {userLocation && (
              <div className="text-xs mt-1 text-blue-600">
                Vị trí của bạn: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </div>
            )}
          </div>

          {/* Map Markers Simulation */}
          <div className="absolute inset-0 pointer-events-none">
            {garages.slice(0, 5).map((garage, index) => (
              <div
                key={garage.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`,
                }}
                onClick={() => handleGarageClick(garage)}
              >
                <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg hover:bg-red-600 transition-colors">
                  {index + 1}
                </div>
              </div>
            ))}

            {/* User Location Marker */}
            {userLocation && (
              <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "50%" }}>
                <div className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Garage List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {garages.map((garage, index) => (
            <div
              key={garage.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedGarage?.id === garage.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              }`}
              onClick={() => handleGarageClick(garage)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <h4 className="font-medium text-slate-900">{garage.name}</h4>
                    {garage.distance && (
                      <Badge variant="secondary" className="text-xs">
                        {garage.distance.toFixed(1)}km
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-slate-600 space-y-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{garage.address}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{garage.rating}</span>
                      </div>

                      <div
                        className={`flex items-center space-x-1 ${garage.isOpen ? "text-green-600" : "text-red-600"}`}
                      >
                        <Clock className="h-3 w-3" />
                        <span>{garage.isOpen ? "Mở" : "Đóng"}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {garage.vehicleTypes.includes("Xe máy") && <Bike className="h-3 w-3 text-blue-600" />}
                      {garage.vehicleTypes.includes("Ô tô") && <Car className="h-3 w-3 text-blue-600" />}
                      {garage.vehicleTypes.includes("Xe tải") && <Truck className="h-3 w-3 text-blue-600" />}
                      <span className="text-xs">{garage.services.slice(0, 2).join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-1 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      getDirections(garage)
                    }}
                    className="text-xs"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Chỉ đường
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      openInMaps(garage)
                    }}
                    className="text-xs"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Mở Maps
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Actions */}
        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://www.google.com/maps", "_blank")}
            className="flex-1"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Mở Google Maps
          </Button>

          {userLocation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = `https://www.google.com/maps/search/garage+near+me/@${userLocation.lat},${userLocation.lng},15z`
                window.open(url, "_blank")
              }}
              className="flex-1"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Tìm gần tôi
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
