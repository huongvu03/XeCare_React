"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Loader2, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

interface LocationServiceProps {
  onLocationUpdate: (location: { lat: number; lng: number; address?: string }) => void
  className?: string
}

export function LocationService({ onLocationUpdate, className }: LocationServiceProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)

  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị GPS")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        setLocation(newLocation)
        setAccuracy(position.coords.accuracy)

        // Try to get address from coordinates (reverse geocoding)
        try {
          const address = await reverseGeocode(newLocation.lat, newLocation.lng)
          const locationWithAddress = { ...newLocation, address }
          setLocation(locationWithAddress)
          onLocationUpdate(locationWithAddress)
        } catch {
          onLocationUpdate(newLocation)
        }

        setLoading(false)
      },
      (error) => {
        let errorMessage = "Không thể lấy vị trí hiện tại"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép trong cài đặt trình duyệt."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Thông tin vị trí không khả dụng. Hãy thử lại sau."
            break
          case error.TIMEOUT:
            errorMessage = "Yêu cầu vị trí đã hết thời gian. Hãy thử lại."
            break
        }
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  // Mock reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // In a real app, you would use a geocoding service like Google Maps API
    // For demo purposes, we'll return a mock address based on coordinates
    const mockAddresses = [
      "Quận 1, TP. Hồ Chí Minh",
      "Quận 3, TP. Hồ Chí Minh", 
      "Quận 5, TP. Hồ Chí Minh",
      "Quận 10, TP. Hồ Chí Minh",
      "Quận 11, TP. Hồ Chí Minh",
      "Quận Bình Thạnh, TP. Hồ Chí Minh",
      "Quận Gò Vấp, TP. Hồ Chí Minh",
      "Quận Phú Nhuận, TP. Hồ Chí Minh",
      "Quận Tân Bình, TP. Hồ Chí Minh",
      "Quận Tân Phú, TP. Hồ Chí Minh",
    ]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Use coordinates to generate a more realistic address
    const index = Math.floor((lat + lng) * 1000) % mockAddresses.length
    return mockAddresses[index]
  }

  const getAccuracyLevel = (accuracy: number) => {
    if (accuracy <= 10) return { level: "Rất chính xác", color: "bg-green-100 text-green-800" }
    if (accuracy <= 50) return { level: "Chính xác", color: "bg-blue-100 text-blue-800" }
    if (accuracy <= 100) return { level: "Khá chính xác", color: "bg-yellow-100 text-yellow-800" }
    return { level: "Ít chính xác", color: "bg-red-100 text-red-800" }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>Dịch vụ định vị</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Status */}
        {location && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <div className="space-y-1">
                <div className="font-medium">Đã xác định vị trí thành công!</div>
                {location.address && <div className="text-sm">{location.address}</div>}
                <div className="text-xs">
                  Tọa độ: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </div>
                {accuracy && (
                  <Badge className={getAccuracyLevel(accuracy).color} variant="secondary">
                    {getAccuracyLevel(accuracy).level} (±{accuracy.toFixed(0)}m)
                  </Badge>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={getCurrentLocation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Target className="h-4 w-4 mr-2" />}
            {location ? "Cập nhật vị trí" : "Lấy vị trí hiện tại"}
          </Button>

          {location && (
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              disabled={loading}
              className="w-full border-blue-200 text-blue-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới vị trí
            </Button>
          )}
        </div>

        {/* Location Tips */}
        <div className="text-xs text-slate-600 space-y-1">
          <div className="font-medium">💡 Mẹo để có vị trí chính xác:</div>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Cho phép truy cập vị trí trong trình duyệt</li>
            <li>Bật GPS/Location Services trên thiết bị</li>
            <li>Sử dụng ở ngoài trời để có tín hiệu tốt hơn</li>
            <li>Đảm bảo kết nối internet ổn định</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
