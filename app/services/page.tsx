"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Clock,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { apiClient, Service } from "@/services/api"
import { mapServiceToUI } from "@/lib/utils/serviceMapper"

// Services will be loaded from the database

const categories = [
  { value: "all", label: "Tất cả dịch vụ" },
  { value: "maintenance", label: "Bảo dưỡng" },
  { value: "repair", label: "Sửa chữa" },
  { value: "safety", label: "An toàn" },
  { value: "electrical", label: "Điện" },
  { value: "comfort", label: "Tiện nghi" },
  { value: "cosmetic", label: "Thẩm mỹ" },
  { value: "legal", label: "Pháp lý" },
  { value: "emergency", label: "Khẩn cấp" },
]

const vehicles = [
  { value: "all", label: "Tất cả loại xe" },
  { value: "Xe máy", label: "Xe máy" },
  { value: "Ô tô", label: "Ô tô" },
  { value: "Xe tải", label: "Xe tải" },
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState("all")
  const [selectedService, setSelectedService] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const dbServices = await apiClient.getAllServices()
        const mappedServices = dbServices.map(mapServiceToUI)
        setServices(mappedServices)
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const matchesVehicle = selectedVehicle === "all" || service.vehicles.includes(selectedVehicle)

    return matchesSearch && matchesCategory && matchesVehicle
  })

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "ADMIN", "GARAGE"]}
        title="Dịch vụ sửa chữa xe"
        description="Tìm hiểu chi tiết về các dịch vụ sửa chữa và bảo dưỡng xe"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Đang tải danh sách dịch vụ...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "ADMIN", "GARAGE"]}
        title="Dịch vụ sửa chữa xe"
        description="Tìm hiểu chi tiết về các dịch vụ sửa chữa và bảo dưỡng xe"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "ADMIN", "GARAGE"]}
      title="Dịch vụ sửa chữa xe"
      description="Tìm hiểu chi tiết về các dịch vụ sửa chữa và bảo dưỡng xe"
    >
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <Card className="border-blue-100 sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <span>Bộ lọc</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tìm kiếm dịch vụ</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Nhập tên dịch vụ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Loại dịch vụ</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Loại xe</label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.value} value={vehicle.value}>
                        {vehicle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Popular Services */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Dịch vụ phổ biến</label>
                <div className="space-y-1">
                  {services
                    .filter((s) => s.popular)
                    .slice(0, 4)
                    .map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        {service.title}
                      </button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Tìm thấy {filteredServices.length} dịch vụ</h2>
            <Select defaultValue="popular">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="duration">Thời gian ngắn nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className={`border-blue-100 hover:shadow-lg transition-all duration-300 cursor-pointer relative ${
                  service.popular ? "ring-2 ring-blue-200" : ""
                }`}
                onClick={() => setSelectedService(service)}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1">Phổ biến</Badge>
                  </div>
                )}

                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-sm">{service.title}</h3>
                      <p className="text-blue-600 font-medium text-sm">{service.priceRange}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Thời gian:</span>
                      <span className="font-medium">{service.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {service.vehicles.map((vehicle: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          {vehicle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600" asChild>
                      <Link href={`/search?service=${service.id}`}>Tìm garage</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedService(service)
                      }}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Không tìm thấy dịch vụ nào</h3>
              <p className="text-slate-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedVehicle("all")
                }}
                variant="outline"
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <selectedService.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>{selectedService.title}</CardTitle>
                  <p className="text-blue-600 font-medium">{selectedService.priceRange}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedService(null)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600">{selectedService.description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Thông tin cơ bản</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Thời gian:</span>
                      <span className="font-medium">{selectedService.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bảo hành:</span>
                      <span className="font-medium">{selectedService.details.warranty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Loại xe:</span>
                      <span className="font-medium">{selectedService.vehicles.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Dịch vụ bao gồm</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedService.details.included.map((item: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Quy trình thực hiện</h4>
                <div className="space-y-2">
                  {selectedService.details.process.map((step: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600" asChild>
                  <Link href={`/search?service=${selectedService.id}`}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Tìm garage gần tôi
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1 border-blue-200 text-blue-600" asChild>
                  <Link href="/booking">
                    <Clock className="h-4 w-4 mr-2" />
                    Đặt lịch ngay
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
