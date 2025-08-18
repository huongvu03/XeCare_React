"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone, Star, Car, Search, Filter } from "lucide-react"
import { findNearbyGarages, type Garage } from "@/lib/api/GarageApi"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function GarageSearchPage() {
  const [garages, setGarages] = useState<Garage[]>([])
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchRadius, setSearchRadius] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState("")

  const { user } = useAuth()
  const router = useRouter()

  // Lấy vị trí hiện tại của user
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Fallback to default location (Ho Chi Minh City)
          setUserLocation({ lat: 10.8231, lng: 106.6297 })
        }
      )
    } else {
      // Fallback to default location
      setUserLocation({ lat: 10.8231, lng: 106.6297 })
    }
  }, [])

  // Tìm garage gần nhất
  const searchGarages = async () => {
    if (!userLocation) return

    setLoading(true)
    setError("")

    try {
      const response = await findNearbyGarages({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        radius: searchRadius,
        page: currentPage,
        size: 10,
      })

      setGarages(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err: any) {
      setError("Không thể tìm kiếm garage. Vui lòng thử lại.")
      console.error("Error searching garages:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userLocation) {
      searchGarages()
    }
  }, [userLocation, searchRadius, currentPage])

  const handleBookAppointment = (garage: Garage) => {
    router.push(`/booking/${garage.id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700"
      case "INACTIVE":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động"
      case "PENDING":
        return "Chờ phê duyệt"
      case "INACTIVE":
        return "Không hoạt động"
      default:
        return status
    }
  }

  return (
    <DashboardLayout
      allowedRoles={["user"]}
      title="Tìm kiếm Garage"
      description="Tìm garage sửa xe gần bạn"
    >
      {/* Search Controls */}
      <Card className="border-blue-100 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>Tìm kiếm Garage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Bán kính tìm kiếm (km)
              </label>
              <Input
                type="number"
                min="1"
                max="50"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={searchGarages}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang tìm...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Tìm kiếm</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="p-4">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Garage List */}
      <div className="space-y-4">
        {garages.map((garage) => (
          <Card key={garage.id} className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Garage Image */}
                <div className="w-full md:w-48 h-32 bg-slate-100 rounded-lg overflow-hidden">
                  {garage.imageUrl ? (
                    <img
                      src={garage.imageUrl}
                      alt={garage.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <Car className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Garage Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{garage.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{garage.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(garage.status)}>
                        {getStatusText(garage.status)}
                      </Badge>
                      {garage.isVerified && (
                        <Badge className="bg-blue-100 text-blue-700">Đã xác thực</Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">{garage.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{garage.openTime} - {garage.closeTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{garage.phone}</span>
                    </div>
                    {garage.distance && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{garage.distance.toFixed(1)} km</span>
                      </div>
                    )}
                  </div>

                  {/* Services */}
                  {garage.services && garage.services.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Dịch vụ:</h4>
                      <div className="flex flex-wrap gap-2">
                        {garage.services.slice(0, 3).map((service) => (
                          <Badge key={service.id} variant="outline" className="text-xs">
                            {service.serviceName} - {service.price.toLocaleString()}đ
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

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-2">
                    <Button
                      onClick={() => handleBookAppointment(garage)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600"
                    >
                      Đặt lịch hẹn
                    </Button>
                    <Button variant="outline" className="border-blue-200 text-blue-600">
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Trước
          </Button>
          <span className="text-sm text-slate-600">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Sau
          </Button>
        </div>
      )}

      {/* No Results */}
      {!loading && garages.length === 0 && (
        <Card className="border-blue-100">
          <CardContent className="p-8 text-center">
            <Car className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Không tìm thấy garage nào
            </h3>
            <p className="text-slate-600">
              Thử tăng bán kính tìm kiếm hoặc thay đổi vị trí của bạn.
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
