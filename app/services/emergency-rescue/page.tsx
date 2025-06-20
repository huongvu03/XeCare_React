"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  Car,
  Bike,
  Truck,
  Navigation,
  Zap,
  Wrench,
  Shield,
  Star,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

const emergencyServices = [
  {
    id: "breakdown",
    name: "Xe chết máy",
    icon: "⚡",
    description: "Xe không nổ máy, hết điện, lỗi hệ thống",
    solutions: ["Nổ máy bằng dây", "Thay ắc quy", "Sửa chữa tại chỗ", "Kéo về garage"],
    avgTime: "15-30 phút",
    price: "150,000 - 500,000",
  },
  {
    id: "flat-tire",
    name: "Thủng lốp",
    icon: "🛞",
    description: "Lốp xe bị thủng, nổ lốp trên đường",
    solutions: ["Vá lốp tại chỗ", "Thay lốp dự phòng", "Bơm lốp khẩn cấp", "Kéo đến tiệm lốp"],
    avgTime: "20-45 phút",
    price: "100,000 - 300,000",
  },
  {
    id: "accident",
    name: "Tai nạn giao thông",
    icon: "💥",
    description: "Xe bị hư hỏng do tai nạn",
    solutions: ["Đánh giá tình trạng", "Sơ cứu", "Kéo xe", "Hỗ trợ bảo hiểm"],
    avgTime: "30-60 phút",
    price: "200,000 - 1,000,000",
  },
  {
    id: "out-of-fuel",
    name: "Hết xăng",
    icon: "⛽",
    description: "Xe hết nhiên liệu giữa đường",
    solutions: ["Cấp xăng khẩn cấp", "Dẫn đến trạm xăng", "Kiểm tra hệ thống nhiên liệu"],
    avgTime: "15-25 phút",
    price: "100,000 - 200,000",
  },
  {
    id: "overheating",
    name: "Quá nhiệt",
    icon: "🌡️",
    description: "Động cơ quá nóng, thiếu nước làm mát",
    solutions: ["Thêm nước làm mát", "Kiểm tra két nước", "Sửa chữa tạm thời", "Kéo về garage"],
    avgTime: "20-40 phút",
    price: "150,000 - 400,000",
  },
  {
    id: "locked-out",
    name: "Khóa trong xe",
    icon: "🔐",
    description: "Chìa khóa bị khóa trong xe",
    solutions: ["Mở khóa chuyên nghiệp", "Làm chìa khóa mới", "Hỗ trợ vào xe"],
    avgTime: "10-30 phút",
    price: "200,000 - 500,000",
  },
]

const rescueTeams = [
  {
    id: 1,
    name: "Cứu hộ 24/7 Express",
    phone: "1900 1234",
    rating: 4.9,
    responseTime: "15-20 phút",
    coverage: "Toàn TP.HCM",
    services: ["Kéo xe", "Sửa lốp", "Nổ máy", "Cấp cứu"],
    available: true,
    vehicles: ["Xe máy", "Ô tô", "Xe tải"],
    price: "Từ 150,000 VNĐ",
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
    vehicles: ["Ô tô", "Xe tải"],
    price: "Từ 200,000 VNĐ",
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
    vehicles: ["Xe máy", "Ô tô"],
    price: "Từ 120,000 VNĐ",
  },
]

export default function EmergencyRescuePage() {
  const [selectedProblem, setSelectedProblem] = useState("")
  const [location, setLocation] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

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
        (error) => console.log("Error getting location:", error),
      )
    }
  }, [])

  const selectedService = emergencyServices.find((s) => s.id === selectedProblem)

  return (
    <DashboardLayout
      allowedRoles={["user", "admin", "garage"]}
      title="Cứu hộ xe khẩn cấp 24/7"
      description="Hỗ trợ cứu hộ nhanh chóng khi xe gặp sự cố bất ngờ"
    >
      <div className="space-y-8">
        {/* Emergency Header */}
        <Card className="border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Cứu hộ xe 24/7</h1>
                    <p className="text-red-600 font-medium">Hỗ trợ khẩn cấp mọi lúc, mọi nơi</p>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  Dịch vụ cứu hộ xe chuyên nghiệp với thời gian phản hồi nhanh nhất. Đội ngũ kỹ thuật viên giàu kinh
                  nghiệm, trang bị đầy đủ để xử lý mọi tình huống.
                </p>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-600">24/7</div>
                    <div className="text-sm text-slate-600">Hoạt động</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">15</div>
                    <div className="text-sm text-slate-600">Phút đến</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">50+</div>
                    <div className="text-sm text-slate-600">Đội cứu hộ</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    <strong>Khẩn cấp?</strong> Gọi ngay hotline để được hỗ trợ nhanh nhất!
                  </AlertDescription>
                </Alert>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-lg py-6"
                  onClick={() => window.open("tel:1900123456")}
                >
                  <Phone className="h-6 w-6 mr-3" />
                  Gọi cứu hộ: 1900 123 456
                </Button>

                <div className="flex space-x-4">
                  <Button variant="outline" className="flex-1 border-red-200 text-red-600" asChild>
                    <Link href="#request-form">Yêu cầu cứu hộ</Link>
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-200 text-red-600" asChild>
                    <Link href="/tracking">Theo dõi cứu hộ</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Types */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Các tình huống cứu hộ</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyServices.map((service) => (
              <Card
                key={service.id}
                className={`border-red-100 cursor-pointer transition-all hover:shadow-lg ${
                  selectedProblem === service.id ? "ring-2 ring-red-200 bg-red-50" : ""
                }`}
                onClick={() => setSelectedProblem(service.id)}
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{service.icon}</div>
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-sm text-slate-600">{service.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Thời gian:</span>
                        <span className="font-medium">{service.avgTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Chi phí:</span>
                        <span className="font-medium text-red-600">{service.price}</span>
                      </div>
                    </div>

                    {selectedProblem === service.id && (
                      <div className="mt-4 p-3 bg-white rounded border">
                        <h4 className="font-medium text-sm mb-2">Giải pháp:</h4>
                        <ul className="space-y-1">
                          {service.solutions.map((solution, index) => (
                            <li key={index} className="flex items-center space-x-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span>{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Request Form */}
        <div id="request-form" className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Yêu cầu cứu hộ</h2>

          <Card className="border-red-100">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vị trí hiện tại</label>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loại xe</label>
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
                    <label className="text-sm font-medium">Vấn đề gặp phải</label>
                    <Select value={selectedProblem} onValueChange={setSelectedProblem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vấn đề" />
                      </SelectTrigger>
                      <SelectContent>
                        {emergencyServices.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            <span>
                              {service.icon} {service.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedService && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-800 mb-2">Thông tin dịch vụ</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Thời gian dự kiến:</span>
                          <span className="font-medium">{selectedService.avgTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Chi phí ước tính:</span>
                          <span className="font-medium">{selectedService.price}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h5 className="font-medium text-xs mb-1">Giải pháp có thể:</h5>
                        <ul className="space-y-1">
                          {selectedService.solutions.slice(0, 2).map((solution, index) => (
                            <li key={index} className="text-xs text-red-700">
                              • {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600"
                    disabled={!location || !vehicleType || !selectedProblem}
                    asChild
                  >
                    <Link href={`/emergency?problem=${selectedProblem}&location=${location}&vehicle=${vehicleType}`}>
                      <Zap className="h-4 w-4 mr-2" />
                      Gửi yêu cầu cứu hộ
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rescue Teams */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Đội cứu hộ gần bạn</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rescueTeams.map((team) => (
              <Card key={team.id} className="border-red-100">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{team.rating}</span>
                        <span className="text-slate-500">• {team.responseTime}</span>
                      </div>
                    </div>
                    <Badge variant={team.available ? "default" : "secondary"}>
                      {team.available ? "Sẵn sàng" : "Bận"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{team.coverage}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{team.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="font-medium text-red-600">{team.price}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {team.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {team.vehicles.map((vehicle, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {vehicle}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(`tel:${team.phone}`)}
                      disabled={!team.available}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Gọi ngay
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-red-600 to-orange-600"
                      disabled={!team.available || !location || !vehicleType || !selectedProblem}
                    >
                      Yêu cầu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Mẹo an toàn khi chờ cứu hộ</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-lg text-green-700 flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>An toàn cá nhân</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Đỗ xe ở vị trí an toàn, tránh xa đường",
                    "Bật đèn cảnh báo và đặt biển báo",
                    "Đứng ở nơi an toàn, tránh xa xe",
                    "Mặc áo phản quang nếu có",
                    "Giữ liên lạc với đội cứu hộ",
                  ].map((tip, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-700 flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Thông tin cần chuẩn bị</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Vị trí chính xác (địa chỉ, cột km)",
                    "Loại xe và biển số",
                    "Mô tả vấn đề gặp phải",
                    "Số điện thoại liên hệ",
                    "Giấy tờ xe và bảo hiểm",
                  ].map((tip, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Contacts */}
        <Card className="border-red-100 bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Hotline cứu hộ 24/7</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-3xl font-bold">1900 1234</div>
                <div className="text-red-100">Cứu hộ tổng đài</div>
              </div>
              <div>
                <div className="text-3xl font-bold">113</div>
                <div className="text-red-100">Cảnh sát giao thông</div>
              </div>
              <div>
                <div className="text-3xl font-bold">115</div>
                <div className="text-red-100">Cấp cứu y tế</div>
              </div>
            </div>
            <p className="text-red-100 mb-6">Trong trường hợp khẩn cấp, hãy gọi ngay để được hỗ trợ nhanh nhất</p>
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
              <Phone className="h-5 w-5 mr-2" />
              Gọi cứu hộ ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
