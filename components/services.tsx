"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Star,
  Clock,
  Search,
  Filter,
  ArrowRight,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react"
import { apiClient, Service } from "@/services/api"
import { mapServiceToUI } from "@/lib/utils/serviceMapper"
import Link from "next/link"

// Services will be loaded from the database

export function Services() {
  const [services, setServices] = useState<any[]>([])
  const [filteredServices, setFilteredServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState("all")
  const [showAll, setShowAll] = useState(false)

  // Categories for filtering
  const categories = [
    { value: "all", label: "Tất cả dịch vụ" },
    { value: "maintenance", label: "Bảo dưỡng" },
    { value: "repair", label: "Sửa chữa" },
    { value: "safety", label: "An toàn" },
    { value: "electrical", label: "Điện" },
    { value: "comfort", label: "Tiện nghi" },
    { value: "cosmetic", label: "Thẩm mỹ" },
    { value: "emergency", label: "Khẩn cấp" },
  ]

  const vehicles = [
    { value: "all", label: "Tất cả loại xe" },
    { value: "Xe máy", label: "Xe máy" },
    { value: "Ô tô", label: "Ô tô" },
    { value: "Xe tải", label: "Xe tải" },
  ]

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const dbServices = await apiClient.getAllServices()
        const mappedServices = dbServices.map(mapServiceToUI)
        setServices(mappedServices)
        setFilteredServices(mappedServices)
      } catch (err) {
        console.error('Error fetching services:', err)
        // Fallback to empty array on error
        setServices([])
        setFilteredServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Filter services based on search and filters
  useEffect(() => {
    let filtered = services

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(service => service.category === selectedCategory)
    }

    // Vehicle filter
    if (selectedVehicle !== "all") {
      filtered = filtered.filter(service => service.vehicles.includes(selectedVehicle))
    }

    setFilteredServices(filtered)
  }, [services, searchTerm, selectedCategory, selectedVehicle])

  // Get services to display (limited or all)
  const displayServices = showAll ? filteredServices : filteredServices.slice(0, 8)

  if (loading) {
    return (
      <section id="services" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Đang tải danh sách dịch vụ...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Dịch vụ sửa chữa toàn diện</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Từ bảo dưỡng định kỳ đến sửa chữa chuyên sâu, chúng tôi kết nối bạn với các garage chuyên nghiệp cho mọi nhu
            cầu về xe
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* Vehicle Filter */}
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {vehicles.map((vehicle) => (
                  <option key={vehicle.value} value={vehicle.value}>
                    {vehicle.label}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory !== "all" || selectedVehicle !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedVehicle("all")
                  }}
                  className="px-4 py-3 border-slate-200 hover:bg-slate-50"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-center">
            <p className="text-slate-600">
              Tìm thấy <span className="font-semibold text-blue-600">{filteredServices.length}</span> dịch vụ
            </p>
          </div>
        </div>

        {/* Services Grid */}
        {displayServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayServices.map((service, index) => (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-300 border-blue-100 hover:border-blue-200 bg-white relative ${
                  service.popular ? "ring-2 ring-blue-200" : ""
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1">Phổ biến</Badge>
                  </div>
                )}

                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          {vehicle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      asChild
                    >
                      <Link href={`/search?service=${service.id}`} onClick={() => {
                        console.log('=== SERVICES.TSX DEBUG ===');
                        console.log('Service clicked:', service.title);
                        console.log('Service ID:', service.id, 'Type:', typeof service.id);
                        console.log('Generated URL:', `/search?service=${service.id}`);
                        console.log('========================');
                      }}>
                        <MapPin className="h-4 w-4 mr-2" />
                        Tìm garage
                      </Link>
                    </Button>
                    {/* <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                      asChild
                    >
                      <Link href="/booking">
                        <Calendar className="h-4 w-4 mr-2" />
                        Đặt lịch
                      </Link>
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
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

        {/* Show More/Less Button */}
        {filteredServices.length > 8 && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="px-8 py-3 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              {showAll ? (
                <>
                  Thu gọn
                  <ArrowRight className="h-4 w-4 ml-2 rotate-180" />
                </>
              ) : (
                <>
                  Xem thêm ({filteredServices.length - 8} dịch vụ khác)
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Service Statistics */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">{services.length}</span>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Dịch vụ đa dạng</h4>
            <p className="text-sm text-slate-600">Từ bảo dưỡng đến sửa chữa chuyên sâu</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">{services.filter(s => s.popular).length}</span>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Dịch vụ phổ biến</h4>
            <p className="text-sm text-slate-600">Được khách hàng tin tưởng nhất</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Hỗ trợ 24/7</h4>
            <p className="text-sm text-slate-600">Luôn sẵn sàng tư vấn và hỗ trợ</p>
          </div>
        </div>

        {/* Service guarantee */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">Cam kết chất lượng dịch vụ</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-900">Bảo hành rõ ràng</h4>
                <p className="text-sm text-slate-600">3-12 tháng tùy dịch vụ</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900">Garage uy tín</h4>
                <p className="text-sm text-slate-600">Đánh giá 4.5+ sao</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-900">Thời gian nhanh</h4>
                <p className="text-sm text-slate-600">30 phút - 3 ngày tùy dịch vụ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Sẵn sàng tìm garage phù hợp?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Kết nối với hàng trăm garage uy tín trong khu vực của bạn. Tìm kiếm, so sánh và đặt lịch dễ dàng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link href="/search">
                <MapPin className="h-5 w-5 mr-2" />
                Tìm garage ngay
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/booking">
                <Calendar className="h-5 w-5 mr-2" />
                Đặt lịch trực tiếp
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
