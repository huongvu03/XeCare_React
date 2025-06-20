"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wrench,
  Droplets,
  Zap,
  Disc,
  Settings,
  Car,
  Paintbrush,
  Sparkles,
  Gauge,
  Wind,
  Hammer,
  Cog,
  Search,
  Filter,
  Clock,
  MapPin,
} from "lucide-react"
import Link from "next/link"

const services = [
  {
    id: "thay-nhot",
    icon: Droplets,
    title: "Thay nhớt - Bảo dưỡng",
    description: "Thay nhớt định kỳ, lọc gió, bugi, dây curoa. Bảo dưỡng toàn diện",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "80K - 350K",
    duration: "30-60 phút",
    popular: true,
    category: "maintenance",
    details: {
      included: ["Thay nhớt động cơ", "Thay lọc nhớt", "Kiểm tra mức dầu", "Vệ sinh bugi"],
      process: ["Kiểm tra tình trạng xe", "Xả nhớt cũ", "Thay lọc nhớt mới", "Đổ nhớt mới", "Kiểm tra hoạt động"],
      warranty: "3 tháng hoặc 3,000km",
    },
  },
  {
    id: "sua-dong-co",
    icon: Settings,
    title: "Sửa chữa động cơ",
    description: "Chẩn đoán lỗi động cơ, sửa chữa hệ thống đánh lửa, làm mát",
    vehicles: ["Xe máy", "Ô tô", "Xe tải"],
    priceRange: "200K - 5M",
    duration: "2-8 giờ",
    popular: false,
    category: "repair",
    details: {
      included: ["Chẩn đoán lỗi", "Sửa chữa động cơ", "Thay phụ tùng", "Test thử"],
      process: ["Chẩn đoán bằng máy", "Tháo rời kiểm tra", "Sửa chữa/thay thế", "Lắp ráp lại", "Chạy thử"],
      warranty: "6-12 tháng",
    },
  },
  {
    id: "he-thong-phanh",
    icon: Disc,
    title: "Hệ thống phanh",
    description: "Thay má phanh, dầu phanh, đĩa phanh. Kiểm tra an toàn",
    vehicles: ["Xe máy", "Ô tô", "Xe tải"],
    priceRange: "150K - 2M",
    duration: "1-3 giờ",
    popular: true,
    category: "safety",
    details: {
      included: ["Thay má phanh", "Thay dầu phanh", "Kiểm tra đĩa phanh", "Điều chỉnh phanh"],
      process: ["Kiểm tra hệ thống", "Tháo bánh xe", "Thay má phanh", "Thay dầu phanh", "Test phanh"],
      warranty: "6 tháng",
    },
  },
  {
    id: "he-thong-dien",
    icon: Zap,
    title: "Hệ thống điện",
    description: "Sửa đèn, còi, bình ắc quy, máy phát điện, hệ thống đánh lửa",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "100K - 1.5M",
    duration: "1-4 giờ",
    popular: false,
    category: "electrical",
    details: {
      included: ["Kiểm tra hệ thống điện", "Sửa đèn/còi", "Thay ắc quy", "Sửa máy phát"],
      process: ["Chẩn đoán lỗi điện", "Kiểm tra dây dẫn", "Sửa chữa/thay thế", "Test hoạt động"],
      warranty: "3-6 tháng",
    },
  },
  {
    id: "lop-mam-xe",
    icon: Car,
    title: "Lốp và mâm xe",
    description: "Thay lốp, vá lốp, cân chỉnh mâm, kiểm tra áp suất",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "50K - 8M",
    duration: "30 phút - 2 giờ",
    popular: true,
    category: "maintenance",
    details: {
      included: ["Thay lốp mới", "Vá lốp", "Cân chỉnh mâm", "Kiểm tra áp suất"],
      process: ["Kiểm tra lốp", "Tháo lốp cũ", "Lắp lốp mới", "Cân chỉnh", "Kiểm tra áp suất"],
      warranty: "Theo hãng sản xuất",
    },
  },
  {
    id: "dieu-hoa",
    icon: Wind,
    title: "Điều hòa ô tô",
    description: "Bảo dưỡng, sửa chữa hệ thống điều hòa, thay gas lạnh",
    vehicles: ["Ô tô"],
    priceRange: "200K - 3M",
    duration: "1-3 giờ",
    popular: false,
    category: "comfort",
    details: {
      included: ["Vệ sinh điều hòa", "Thay gas lạnh", "Sửa máy nén", "Thay lọc gió"],
      process: ["Kiểm tra hệ thống", "Vệ sinh bay hơi", "Thay gas", "Test nhiệt độ"],
      warranty: "6 tháng",
    },
  },
  {
    id: "son-xe",
    icon: Paintbrush,
    title: "Sơn xe - Đồng sơn",
    description: "Sơn lại toàn bộ hoặc từng phần, xử lý trầy xước, đánh bóng",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "500K - 15M",
    duration: "1-5 ngày",
    popular: false,
    category: "cosmetic",
    details: {
      included: ["Sơn toàn bộ", "Sơn từng phần", "Xử lý trầy xước", "Đánh bóng"],
      process: ["Chuẩn bị bề mặt", "Sơn lót", "Sơn màu", "Sơn bóng", "Đánh bóng"],
      warranty: "12 tháng",
    },
  },
  {
    id: "rua-xe",
    icon: Sparkles,
    title: "Rửa xe - Chăm sóc",
    description: "Rửa xe, đánh bóng, phủ ceramic, bảo dưỡng nội thất",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "30K - 500K",
    duration: "30 phút - 3 giờ",
    popular: true,
    category: "cosmetic",
    details: {
      included: ["Rửa xe cơ bản", "Đánh bóng", "Phủ ceramic", "Vệ sinh nội thất"],
      process: ["Xịt nước", "Xà phòng", "Chà rửa", "Xịt sạch", "Lau khô"],
      warranty: "1 tháng",
    },
  },
  {
    id: "kiem-dinh",
    icon: Gauge,
    title: "Kiểm định - Đăng kiểm",
    description: "Hỗ trợ kiểm định an toàn kỹ thuật, đăng kiểm xe",
    vehicles: ["Ô tô", "Xe tải"],
    priceRange: "300K - 800K",
    duration: "2-4 giờ",
    popular: false,
    category: "legal",
    details: {
      included: ["Kiểm tra kỹ thuật", "Hỗ trợ đăng kiểm", "Làm giấy tờ", "Tư vấn"],
      process: ["Chuẩn bị xe", "Kiểm tra kỹ thuật", "Làm hồ sơ", "Nộp đăng kiểm"],
      warranty: "Theo quy định",
    },
  },
  {
    id: "sua-than-vo",
    icon: Hammer,
    title: "Sửa chữa thân vỏ",
    description: "Sửa móp méo, hàn xì, thay thế phụ tùng thân xe",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "200K - 10M",
    duration: "2 giờ - 3 ngày",
    popular: false,
    category: "repair",
    details: {
      included: ["Sửa móp méo", "Hàn xì", "Thay phụ tùng", "Chỉnh hình"],
      process: ["Đánh giá hư hỏng", "Tháo rời", "Sửa chữa", "Lắp ráp", "Kiểm tra"],
      warranty: "6-12 tháng",
    },
  },
  {
    id: "hop-so",
    icon: Cog,
    title: "Hộp số - Ly hợp",
    description: "Sửa chữa hộp số, thay dầu hộp số, sửa ly hợp",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "300K - 8M",
    duration: "2-6 giờ",
    popular: false,
    category: "repair",
    details: {
      included: ["Sửa hộp số", "Thay dầu hộp số", "Sửa ly hợp", "Điều chỉnh"],
      process: ["Chẩn đoán", "Tháo hộp số", "Sửa chữa", "Lắp ráp", "Test vận hành"],
      warranty: "6-12 tháng",
    },
  },
  {
    id: "cuu-ho",
    icon: Wrench,
    title: "Cứu hộ khẩn cấp",
    description: "Cứu hộ 24/7, kéo xe, sửa chữa tại chỗ, hỗ trợ khẩn cấp",
    vehicles: ["Xe máy", "Ô tô", "Xe tải"],
    priceRange: "150K - 1M",
    duration: "15-60 phút",
    popular: true,
    category: "emergency",
    details: {
      included: ["Cứu hộ 24/7", "Kéo xe", "Sửa tại chỗ", "Hỗ trợ khẩn cấp"],
      process: ["Nhận cuộc gọi", "Di chuyển đến", "Đánh giá tình trạng", "Xử lý", "Hoàn thành"],
      warranty: "Theo dịch vụ",
    },
  },
]

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

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const matchesVehicle = selectedVehicle === "all" || service.vehicles.includes(selectedVehicle)

    return matchesSearch && matchesCategory && matchesVehicle
  })

  return (
    <DashboardLayout
      allowedRoles={["user", "admin", "garage"]}
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
                      {service.vehicles.map((vehicle, idx) => (
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
