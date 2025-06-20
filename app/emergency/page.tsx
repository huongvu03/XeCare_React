"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, MapPin, Clock, AlertTriangle, Car, Bike, Truck, Navigation, CheckCircle, User, Zap } from "lucide-react"

// Mock emergency services
const emergencyServices = [
  {
    id: 1,
    name: "Cứu hộ 24/7 Express",
    phone: "1900 1234",
    rating: 4.9,
    responseTime: "15-20 phút",
    coverage: "Toàn TP.HCM",
    services: ["Kéo xe", "Sửa lốp", "Nổ máy", "Cấp cứu"],
    available: true,
  },
  {
    id: 2,
    name: "SOS Auto Rescue",
    phone: "1900 5678",
    rating: 4.7,
    responseTime: "20-30 phút",
    coverage: "TP.HCM & Bình Dương",
    services: ["Kéo xe", "Sửa chữa tại chỗ", "Cấp cứu"],
    available: true,
  },
  {
    id: 3,
    name: "Fast Rescue Team",
    phone: "1900 9999",
    rating: 4.8,
    responseTime: "10-25 phút",
    coverage: "Nội thành TP.HCM",
    services: ["Kéo xe", "Thay lốp", "Nổ máy", "Cấp xăng"],
    available: false,
  },
]

export default function EmergencyPage() {
  const [location, setLocation] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [vehicleType, setVehicleType] = useState("")
  const [problemType, setProblemType] = useState("")
  const [description, setDescription] = useState("")
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
  })
  const [isRequestingHelp, setIsRequestingHelp] = useState(false)
  const [helpRequested, setHelpRequested] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocation("Vị trí hiện tại")
        },
        (error) => {
          console.log("Error getting location:", error)
        },
      )
    }
  }, [])

  const handleEmergencyCall = (service: any) => {
    window.open(`tel:${service.phone}`)
  }

  const handleRequestHelp = async (service: any) => {
    setSelectedService(service)
    setIsRequestingHelp(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setHelpRequested(true)
    } catch (error) {
      console.error("Request failed:", error)
    } finally {
      setIsRequestingHelp(false)
    }
  }

  const problemTypes = [
    { value: "breakdown", label: "Xe chết máy", icon: "⚡" },
    { value: "flat-tire", label: "Thủng lốp", icon: "🛞" },
    { value: "accident", label: "Tai nạn", icon: "💥" },
    { value: "out-of-fuel", label: "Hết xăng", icon: "⛽" },
    { value: "battery", label: "Hết pin", icon: "🔋" },
    { value: "overheating", label: "Quá nhiệt", icon: "🌡️" },
    { value: "locked-out", label: "Khóa trong xe", icon: "🔐" },
    { value: "other", label: "Khác", icon: "❓" },
  ]

  if (helpRequested) {
    return (
      <DashboardLayout
        allowedRoles={["user", "admin", "garage"]}
        title="Cứu hộ đang đến"
        description="Đội cứu hộ đã nhận được yêu cầu của bạn"
      >
        <Card className="border-green-100 bg-green-50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Cứu hộ đang trên đường!</h2>
            <p className="text-green-700 mb-6">
              {selectedService?.name} đã nhận được yêu cầu và đang di chuyển đến vị trí của bạn.
            </p>

            <div className="bg-white rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-4 text-center">Thông tin cứu hộ</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Đội cứu hộ:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Thời gian dự kiến:</span>
                  <span className="font-medium text-orange-600">{selectedService?.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Hotline:</span>
                  <span className="font-medium text-blue-600">{selectedService?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Vị trí:</span>
                  <span className="font-medium">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Vấn đề:</span>
                  <span className="font-medium">{problemTypes.find((p) => p.value === problemType)?.label}</span>
                </div>
              </div>
            </div>

            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Vui lòng ở lại vị trí an toàn và giữ máy liên lạc. Đội cứu hộ sẽ gọi cho bạn khi đến gần.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open(`tel:${selectedService?.phone}`)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Gọi đội cứu hộ
              </Button>
              <Button variant="outline" onClick={() => setHelpRequested(false)}>
                Hủy yêu cầu
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["user", "admin", "garage"]}
      title="Cứu hộ khẩn cấp 24/7"
      description="Hỗ trợ cứu hộ xe nhanh chóng khi gặp sự cố"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Emergency Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Emergency Call */}
          <Card className="border-red-100 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-red-600 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800">Khẩn cấp? Gọi ngay!</h3>
                  <p className="text-red-700 text-sm">Hotline cứu hộ 24/7 toàn quốc</p>
                </div>
                <Button size="lg" className="bg-red-600 hover:bg-red-700" onClick={() => window.open("tel:1900123456")}>
                  <Phone className="h-5 w-5 mr-2" />
                  1900 123 456
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Vị trí của bạn</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Địa chỉ hiện tại</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nhập địa chỉ chi tiết..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                          setUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                          })
                          setLocation("Vị trí hiện tại")
                        })
                      }
                    }}
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {userLocation && (
                <Alert>
                  <AlertDescription>Đã xác định vị trí GPS của bạn. Đội cứu hộ sẽ tìm đến chính xác.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Vehicle & Problem */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle>Thông tin sự cố</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại xe</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xe-may">
                        <div className="flex items-center space-x-2">
                          <Bike className="h-4 w-4" />
                          <span>Xe máy</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="o-to">
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4" />
                          <span>Ô tô</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="xe-tai">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4" />
                          <span>Xe tải</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Loại sự cố</Label>
                  <Select value={problemType} onValueChange={setProblemType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vấn đề" />
                    </SelectTrigger>
                    <SelectContent>
                      {problemTypes.map((problem) => (
                        <SelectItem key={problem.value} value={problem.value}>
                          <span>
                            {problem.icon} {problem.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả chi tiết</Label>
                <Textarea
                  placeholder="Mô tả tình trạng xe, vị trí cụ thể, mức độ khẩn cấp..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Thông tin liên hệ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Họ và tên</Label>
                  <Input
                    placeholder="Nhập họ và tên"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input
                    placeholder="Nhập số điện thoại"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Services */}
        <div className="lg:col-span-1">
          <Card className="border-blue-100 sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span>Đội cứu hộ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyServices.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{service.name}</h4>
                      <div className="flex items-center space-x-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span>{service.rating}</span>
                      </div>
                    </div>
                    <Badge variant={service.available ? "default" : "secondary"}>
                      {service.available ? "Sẵn sàng" : "Bận"}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{service.responseTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>{service.coverage}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <span>{service.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {service.services.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEmergencyCall(service)}
                      disabled={!service.available}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Gọi ngay
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600"
                      onClick={() => handleRequestHelp(service)}
                      disabled={!service.available || isRequestingHelp || !location || !vehicleType || !problemType}
                    >
                      {isRequestingHelp ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Yêu cầu"
                      )}
                    </Button>
                  </div>
                </div>
              ))}

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Trong trường hợp khẩn cấp, hãy gọi trực tiếp hotline để được hỗ trợ nhanh nhất.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
