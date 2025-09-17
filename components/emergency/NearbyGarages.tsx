"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation,
  Car,
  Bike,
  Truck,
  Zap
} from "lucide-react"
import { getNearbyGarages } from "@/lib/api/GarageApi"
import { useToast } from "@/hooks/use-toast"

interface Garage {
  id: number
  name: string
  description: string
  address: string
  phone: string
  email: string
  latitude: number
  longitude: number
  openTime: string
  closeTime: string
  imageUrl: string
  isVerified: boolean
  status: string
  distance?: number
  services?: Array<{
    id: number
    name: string
    description: string
  }>
}

interface NearbyGaragesProps {
  userLatitude: number
  userLongitude: number
  onSelectGarage: (garage: Garage) => void
  selectedGarageId?: number
}

export function NearbyGarages({ 
  userLatitude, 
  userLongitude, 
  onSelectGarage, 
  selectedGarageId 
}: NearbyGaragesProps) {
  const [garages, setGarages] = useState<Garage[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadNearbyGarages()
  }, [userLatitude, userLongitude])

  const loadNearbyGarages = async () => {
    try {
      setLoading(true)
      const response = await getNearbyGarages(userLatitude, userLongitude, 10)
      const garagesWithDistance = response.data.map((garage: Garage) => ({
        ...garage,
        distance: calculateDistance(
          userLatitude,
          userLongitude,
          garage.latitude,
          garage.longitude
        )
      }))
      
      // Sắp xếp theo khoảng cách gần nhất
      garagesWithDistance.sort((a: Garage, b: Garage) => 
        (a.distance || 0) - (b.distance || 0)
      )
      
      setGarages(garagesWithDistance)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách garage gần nhất",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  const isGarageOpen = (openTime: string, closeTime: string): boolean => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const [openHour, openMin] = openTime.split(':').map(Number)
    const [closeHour, closeMin] = closeTime.split(':').map(Number)
    
    const openMinutes = openHour * 60 + openMin
    const closeMinutes = closeHour * 60 + closeMin
    
    return currentTime >= openMinutes && currentTime <= closeMinutes
  }

  const handleCallGarage = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  const handleNavigate = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2">Đang tìm garage gần nhất...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (garages.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy garage gần nhất</h3>
          <p className="text-gray-500">
            Không có garage nào trong bán kính 10km từ vị trí của bạn.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Garage gần nhất</h3>
        <Badge variant="outline" className="text-xs">
          {garages.length} garage
        </Badge>
      </div>

      {garages.map((garage) => {
        const isOpen = isGarageOpen(garage.openTime, garage.closeTime)
        
        return (
          <Card 
            key={garage.id} 
            className={`hover:shadow-md transition-all cursor-pointer ${
              selectedGarageId === garage.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onSelectGarage(garage)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-lg">{garage.name}</h4>
                    {garage.isVerified && (
                      <Badge variant="default" className="bg-green-600 text-xs">
                        Đã xác thực
                      </Badge>
                    )}
                    <Badge 
                      variant={isOpen ? "default" : "secondary"}
                      className={isOpen ? "bg-green-600" : "bg-gray-500"}
                    >
                      {isOpen ? "Đang mở" : "Đã đóng"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{garage.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{garage.openTime} - {garage.closeTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Navigation className="h-3 w-3" />
                      <span>{formatDistance(garage.distance || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {garage.services && garage.services.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {garage.services.slice(0, 3).map((service) => (
                      <Badge key={service.id} variant="outline" className="text-xs">
                        {service.name}
                      </Badge>
                    ))}
                    {garage.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{garage.services.length - 3} dịch vụ khác
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCallGarage(garage.phone)
                  }}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Gọi ngay
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNavigate(garage.latitude, garage.longitude)
                  }}
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  Chỉ đường
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Danh sách garage được sắp xếp theo khoảng cách gần nhất từ vị trí của bạn.
        </AlertDescription>
      </Alert>
    </div>
  )
}
