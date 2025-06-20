"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InteractiveMap } from "@/components/interactive-map"
import {
  MapPin,
  Search,
  Star,
  Clock,
  Phone,
  Navigation,
  Filter,
  SlidersHorizontal,
  Car,
  Bike,
  Truck,
  Loader2,
  AlertCircle,
  Target,
  Map,
  List,
  Grid3X3,
} from "lucide-react"

// Mock data for garages with GPS coordinates
const mockGarages = [
  {
    id: 1,
    name: "Garage Thành Công",
    address: "123 Lê Lợi, Q1, TP.HCM",
    lat: 10.7769,
    lng: 106.7009,
    rating: 4.8,
    reviewCount: 245,
    phone: "0909123456",
    isOpen: true,
    openTime: "7:00 - 19:00",
    services: ["Thay nhớt", "Sửa phanh", "Bảo dưỡng"],
    vehicleTypes: ["Xe máy", "Ô tô"],
    priceRange: "$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Garage 24/7",
    address: "456 Nguyễn Huệ, Q1, TP.HCM",
    lat: 10.7743,
    lng: 106.7038,
    rating: 4.7,
    reviewCount: 189,
    phone: "0909234567",
    isOpen: true,
    openTime: "24/7",
    services: ["Cứu hộ", "Sửa chữa khẩn cấp"],
    vehicleTypes: ["Xe máy", "Ô tô", "Xe tải"],
    priceRange: "$$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Garage ABC",
    address: "789 Trần Hưng Đạo, Q5, TP.HCM",
    lat: 10.7546,
    lng: 106.6787,
    rating: 4.5,
    reviewCount: 156,
    phone: "0909345678",
    isOpen: false,
    openTime: "8:00 - 18:00",
    services: ["Sơn xe", "Rửa xe", "Đồng sơn"],
    vehicleTypes: ["Ô tô"],
    priceRange: "$$$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Garage Pro",
    address: "321 Võ Văn Tần, Q3, TP.HCM",
    lat: 10.7829,
    lng: 106.6934,
    rating: 4.9,
    reviewCount: 312,
    phone: "0909456789",
    isOpen: true,
    openTime: "6:00 - 20:00",
    services: ["Thay nhớt", "Sửa động cơ", "Kiểm định"],
    vehicleTypes: ["Xe máy", "Ô tô"],
    priceRange: "$$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    name: "Garage Express",
    address: "555 Cách Mạng Tháng 8, Q10, TP.HCM",
    lat: 10.7722,
    lng: 106.6602,
    rating: 4.6,
    reviewCount: 98,
    phone: "0909567890",
    isOpen: true,
    openTime: "8:00 - 17:00",
    services: ["Thay nhớt", "Bảo dưỡng", "Rửa xe"],
    vehicleTypes: ["Xe máy"],
    priceRange: "$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    name: "Garage Premium",
    address: "888 Lý Thường Kiệt, Q11, TP.HCM",
    lat: 10.764,
    lng: 106.65,
    rating: 4.4,
    reviewCount: 67,
    phone: "0909678901",
    isOpen: true,
    openTime: "9:00 - 18:00",
    services: ["Sửa phanh", "Sửa động cơ", "Kiểm định"],
    vehicleTypes: ["Ô tô", "Xe tải"],
    priceRange: "$$$$",
    image: "/placeholder.svg?height=200&width=300",
  },
]

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [filteredGarages, setFilteredGarages] = useState(mockGarages)
  const [showFilters, setShowFilters] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("distance")
  const [viewMode, setViewMode] = useState<"list" | "map" | "grid">("list")
  const [selectedGarage, setSelectedGarage] = useState<any>(null)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)

  // Filter states
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [maxDistance, setMaxDistance] = useState([10])
  const [minRating, setMinRating] = useState([0])
  const [priceRange, setPriceRange] = useState("all")
  const [openNow, setOpenNow] = useState(false)

  // Get user location
  const getCurrentLocation = () => {
    setLocationLoading(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Trình duyệt không hỗ trợ định vị")
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(newLocation)
        setLocation("Vị trí hiện tại")
        setLocationLoading(false)
        setSortBy("distance")
      },
      (error) => {
        let errorMessage = "Không thể lấy vị trí hiện tại"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Bạn đã từ chối quyền truy cập vị trí"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Thông tin vị trí không khả dụng"
            break
          case error.TIMEOUT:
            errorMessage = "Yêu cầu vị trí đã hết thời gian"
            break
        }
        setLocationError(errorMessage)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  // Calculate distances and sort garages
  const processGarages = (garages: typeof mockGarages) => {
    let processed = garages.map((garage) => ({
      ...garage,
      distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, garage.lat, garage.lng) : 0,
    }))

    switch (sortBy) {
      case "distance":
        processed = processed.sort((a, b) => a.distance - b.distance)
        break
      case "rating":
        processed = processed.sort((a, b) => b.rating - a.rating)
        break
      case "reviews":
        processed = processed.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case "price-low":
        processed = processed.sort((a, b) => a.priceRange.length - b.priceRange.length)
        break
      case "price-high":
        processed = processed.sort((a, b) => b.priceRange.length - a.priceRange.length)
        break
    }

    return processed
  }

  // Filter garages based on criteria
  useEffect(() => {
    const filtered = mockGarages.filter((garage) => {
      const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, garage.lat, garage.lng) : 0

      const matchesSearch =
        garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garage.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garage.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesLocation = location === "" || garage.address.toLowerCase().includes(location.toLowerCase())
      const matchesServices =
        selectedServices.length === 0 || selectedServices.some((service) => garage.services.includes(service))
      const matchesVehicles =
        selectedVehicles.length === 0 || selectedVehicles.some((vehicle) => garage.vehicleTypes.includes(vehicle))
      const matchesDistance = !userLocation || distance <= maxDistance[0]
      const matchesRating = garage.rating >= minRating[0]
      const matchesPrice = priceRange === "all" || garage.priceRange === priceRange
      const matchesOpenNow = !openNow || garage.isOpen

      return (
        matchesSearch &&
        matchesLocation &&
        matchesServices &&
        matchesVehicles &&
        matchesDistance &&
        matchesRating &&
        matchesPrice &&
        matchesOpenNow
      )
    })

    setFilteredGarages(processGarages(filtered))
  }, [
    searchTerm,
    location,
    selectedServices,
    selectedVehicles,
    maxDistance,
    minRating,
    priceRange,
    openNow,
    userLocation,
    sortBy,
  ])

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  const handleVehicleToggle = (vehicle: string) => {
    setSelectedVehicles((prev) => (prev.includes(vehicle) ? prev.filter((v) => v !== vehicle) : [...prev, vehicle]))
  }

  const clearFilters = () => {
    setSelectedServices([])
    setSelectedVehicles([])
    setMaxDistance([10])
    setMinRating([0])
    setPriceRange("all")
    setOpenNow(false)
  }

  const findNearestGarages = () => {
    getCurrentLocation()
  }

  const allServices = ["Thay nhớt", "Sửa phanh", "Bảo dưỡng", "Sửa động cơ", "Cứu hộ", "Sơn xe", "Rửa xe", "Kiểm định"]
  const allVehicles = ["Xe máy", "Ô tô", "Xe tải"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Tìm garage gần bạn</h1>

          {locationError && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{locationError}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Tìm theo tên garage, dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Nhập địa chỉ hoặc quận..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 pr-10"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={findNearestGarages}
                disabled={locationLoading}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
              >
                {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              onClick={findNearestGarages}
              disabled={locationLoading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {locationLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Target className="h-4 w-4 mr-2" />
              )}
              Tìm gần nhất
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-blue-200 text-blue-600"
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc{" "}
              {selectedServices.length + selectedVehicles.length > 0 &&
                `(${selectedServices.length + selectedVehicles.length})`}
            </Button>
          </div>

          {userLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 text-green-700">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Đã xác định vị trí: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </span>
              </div>
            </div>
          )}

          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-fit grid-cols-3">
                <TabsTrigger value="list" className="flex items-center space-x-2">
                  <List className="h-4 w-4" />
                  <span>Danh sách</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center space-x-2">
                  <Map className="h-4 w-4" />
                  <span>Bản đồ</span>
                </TabsTrigger>
                <TabsTrigger value="grid" className="flex items-center space-x-2">
                  <Grid3X3 className="h-4 w-4" />
                  <span>Lưới</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance" disabled={!userLocation}>
                      Gần nhất {!userLocation && "(Cần vị trí)"}
                    </SelectItem>
                    <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                    <SelectItem value="reviews">Nhiều đánh giá nhất</SelectItem>
                    <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <TabsContent value="list" className="mt-0">
                <div className="grid lg:grid-cols-4 gap-8">
                  {/* Filters Sidebar */}
                  {showFilters && (
                    <div className="lg:col-span-1">
                      <Card className="border-blue-100 sticky top-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                            <span>Bộ lọc</span>
                          </CardTitle>
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Xóa tất cả
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Distance Filter */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">
                              Khoảng cách (km) {!userLocation && "(Cần vị trí)"}
                            </label>
                            <Slider
                              value={maxDistance}
                              onValueChange={setMaxDistance}
                              max={20}
                              min={1}
                              step={0.5}
                              className="w-full"
                              disabled={!userLocation}
                            />
                            <div className="text-xs text-slate-500">Trong vòng {maxDistance[0]} km</div>
                          </div>

                          {/* Rating Filter */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Đánh giá tối thiểu</label>
                            <Slider
                              value={minRating}
                              onValueChange={setMinRating}
                              max={5}
                              min={0}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="text-xs text-slate-500">Từ {minRating[0]} sao trở lên</div>
                          </div>

                          {/* Price Range */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Mức giá</label>
                            <Select value={priceRange} onValueChange={setPriceRange}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="$">$ - Rẻ</SelectItem>
                                <SelectItem value="$$">$$ - Trung bình</SelectItem>
                                <SelectItem value="$$$">$$$ - Cao</SelectItem>
                                <SelectItem value="$$$$">$$$$ - Cao cấp</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Vehicle Types */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Loại xe</label>
                            <div className="space-y-2">
                              {allVehicles.map((vehicle) => (
                                <div key={vehicle} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={vehicle}
                                    checked={selectedVehicles.includes(vehicle)}
                                    onCheckedChange={() => handleVehicleToggle(vehicle)}
                                  />
                                  <label htmlFor={vehicle} className="text-sm">
                                    {vehicle}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Services */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Dịch vụ</label>
                            <div className="space-y-2">
                              {allServices.map((service) => (
                                <div key={service} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={service}
                                    checked={selectedServices.includes(service)}
                                    onCheckedChange={() => handleServiceToggle(service)}
                                  />
                                  <label htmlFor={service} className="text-sm">
                                    {service}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Open Now */}
                          <div className="flex items-center space-x-2">
                            <Checkbox id="openNow" checked={openNow} onCheckedChange={setOpenNow} />
                            <label htmlFor="openNow" className="text-sm">
                              Chỉ hiển thị garage đang mở
                            </label>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Results */}
                  <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-slate-900">
                        Tìm thấy {filteredGarages.length} garage
                        {userLocation && sortBy === "distance" && " (sắp xếp theo khoảng cách)"}
                      </h2>
                    </div>

                    <div className="grid gap-6">
                      {filteredGarages.map((garage, index) => (
                        <Card key={garage.id} className="border-blue-100 hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="grid md:grid-cols-4 gap-6">
                              <div className="md:col-span-1">
                                <img
                                  src={garage.image || "/placeholder.svg"}
                                  alt={garage.name}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                {userLocation && sortBy === "distance" && index < 3 && (
                                  <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                                    #{index + 1} Gần nhất
                                  </Badge>
                                )}
                              </div>

                              <div className="md:col-span-2 space-y-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-900">{garage.name}</h3>
                                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span>{garage.rating}</span>
                                      <span>({garage.reviewCount} đánh giá)</span>
                                    </div>
                                    <span className="text-green-600 font-medium">{garage.priceRange}</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                      {garage.address}
                                      {userLocation && (
                                        <span className="text-blue-600 font-medium ml-2">
                                          • {garage.distance.toFixed(1)}km
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Clock className="h-4 w-4" />
                                    <span className={garage.isOpen ? "text-green-600" : "text-red-600"}>
                                      {garage.openTime} • {garage.isOpen ? "Đang mở" : "Đã đóng"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <Phone className="h-4 w-4" />
                                    <span>{garage.phone}</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {garage.services.slice(0, 3).map((service) => (
                                    <Badge key={service} variant="secondary" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                  {garage.services.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{garage.services.length - 3}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  {garage.vehicleTypes.includes("Xe máy") && <Bike className="h-4 w-4 text-blue-600" />}
                                  {garage.vehicleTypes.includes("Ô tô") && <Car className="h-4 w-4 text-blue-600" />}
                                  {garage.vehicleTypes.includes("Xe tải") && (
                                    <Truck className="h-4 w-4 text-blue-600" />
                                  )}
                                </div>
                              </div>

                              <div className="md:col-span-1 flex flex-col space-y-2">
                                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">Đặt lịch ngay</Button>
                                <Button variant="outline" className="border-blue-200 text-blue-600">
                                  Xem chi tiết
                                </Button>
                                <Button variant="ghost" size="sm" className="text-blue-600">
                                  <Phone className="h-4 w-4 mr-2" />
                                  Gọi ngay
                                </Button>
                                {userLocation && (
                                  <Button variant="ghost" size="sm" className="text-green-600">
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Chỉ đường
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredGarages.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-slate-400 mb-4">
                          <Search className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Không tìm thấy garage nào</h3>
                        <p className="text-slate-600 mb-4">Thử thay đổi bộ lọc hoặc mở rộng khu vực tìm kiếm</p>
                        <div className="space-x-2">
                          <Button onClick={clearFilters} variant="outline">
                            Xóa bộ lọc
                          </Button>
                          {!userLocation && (
                            <Button onClick={findNearestGarages} className="bg-green-600 hover:bg-green-700">
                              <Target className="h-4 w-4 mr-2" />
                              Tìm theo vị trí
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="map" className="mt-0">
                <InteractiveMap
                  garages={filteredGarages}
                  userLocation={userLocation}
                  onGarageSelect={setSelectedGarage}
                  isFullscreen={isMapFullscreen}
                  onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
                  className="h-[600px]"
                />
              </TabsContent>

              <TabsContent value="grid" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGarages.map((garage, index) => (
                    <Card key={garage.id} className="border-blue-100 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <img
                          src={garage.image || "/placeholder.svg"}
                          alt={garage.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 truncate">{garage.name}</h3>
                            {userLocation && sortBy === "distance" && index < 3 && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                #{index + 1}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 text-sm">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{garage.rating}</span>
                            <span className="text-slate-500">({garage.reviewCount})</span>
                          </div>

                          <div className="text-sm text-slate-600">
                            <div className="flex items-center space-x-1 mb-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{garage.address}</span>
                            </div>
                            {userLocation && (
                              <div className="text-blue-600 font-medium">{garage.distance.toFixed(1)}km</div>
                            )}
                          </div>

                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span className={`text-xs ${garage.isOpen ? "text-green-600" : "text-red-600"}`}>
                              {garage.isOpen ? "Mở" : "Đóng"}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {garage.services.slice(0, 2).map((service) => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex space-x-1 pt-2">
                            <Button size="sm" className="flex-1 text-xs">
                              Đặt lịch
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              Chi tiết
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
