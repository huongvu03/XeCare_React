"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Building2, 
  Settings,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  DollarSign,
  Clock,
  Search
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getMyGarageById } from "@/lib/api/UserApi"
import type { GarageInfo } from "@/hooks/use-auth"

// Mock service data
interface GarageService {
  id: number
  serviceId: number
  serviceName: string
  serviceDescription: string
  basePrice: number
  estimatedTimeMinutes: number
  isActive: boolean
}

const mockServices: GarageService[] = [
  {
    id: 1,
    serviceId: 1,
    serviceName: "Thay nhớt xe máy",
    serviceDescription: "Thay nhớt động cơ xe máy",
    basePrice: 150000,
    estimatedTimeMinutes: 30,
    isActive: true
  },
  {
    id: 2,
    serviceId: 2,
    serviceName: "Sửa phanh xe máy",
    serviceDescription: "Kiểm tra và sửa chữa hệ thống phanh",
    basePrice: 300000,
    estimatedTimeMinutes: 60,
    isActive: true
  },
  {
    id: 3,
    serviceId: 3,
    serviceName: "Bảo dưỡng định kỳ",
    serviceDescription: "Bảo dưỡng toàn diện xe máy",
    basePrice: 500000,
    estimatedTimeMinutes: 120,
    isActive: false
  }
]

export default function ServicesPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const garageId = Number(params.garageId)
  
  const [garage, setGarage] = useState<GarageInfo | null>(null)
  const [services, setServices] = useState<GarageService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingService, setEditingService] = useState<GarageService | null>(null)

  // Form data for add/edit
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDescription: "",
    basePrice: "",
    estimatedTimeMinutes: ""
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        // Kiểm tra quyền sở hữu
        const isOwner = user && user.garages && user.garages.some(g => g.id === garageId)
        if (!isOwner) {
          setError("Bạn không có quyền quản lý garage này")
          setLoading(false)
          return
        }

        // Load garage info
        const response = await getMyGarageById(garageId)
        setGarage(response.data)
        
        // Load services (mock data for now)
        setServices(mockServices)
        
        setLoading(false)
      } catch (err: any) {
        console.error("Error loading data:", err)
        setError("Không thể tải dữ liệu")
        setLoading(false)
      }
    }

    if (garageId) {
      loadData()
    }
  }, [garageId, user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddService = () => {
    setShowAddForm(true)
    setEditingService(null)
    setFormData({
      serviceName: "",
      serviceDescription: "",
      basePrice: "",
      estimatedTimeMinutes: ""
    })
  }

  const handleEditService = (service: GarageService) => {
    setEditingService(service)
    setShowAddForm(false)
    setFormData({
      serviceName: service.serviceName,
      serviceDescription: service.serviceDescription,
      basePrice: service.basePrice.toString(),
      estimatedTimeMinutes: service.estimatedTimeMinutes.toString()
    })
  }

  const handleSaveService = async () => {
    try {
      if (editingService) {
        // Update existing service
        const updatedServices = services.map(service =>
          service.id === editingService.id
            ? {
                ...service,
                serviceName: formData.serviceName,
                serviceDescription: formData.serviceDescription,
                basePrice: Number(formData.basePrice),
                estimatedTimeMinutes: Number(formData.estimatedTimeMinutes)
              }
            : service
        )
        setServices(updatedServices)
      } else {
        // Add new service
        const newService: GarageService = {
          id: Math.max(...services.map(s => s.id)) + 1,
          serviceId: Math.max(...services.map(s => s.serviceId)) + 1,
          serviceName: formData.serviceName,
          serviceDescription: formData.serviceDescription,
          basePrice: Number(formData.basePrice),
          estimatedTimeMinutes: Number(formData.estimatedTimeMinutes),
          isActive: true
        }
        setServices([...services, newService])
      }
      
      // Reset form
      setFormData({
        serviceName: "",
        serviceDescription: "",
        basePrice: "",
        estimatedTimeMinutes: ""
      })
      setShowAddForm(false)
      setEditingService(null)
    } catch (err) {
      console.error("Error saving service:", err)
    }
  }

  const handleToggleService = (serviceId: number) => {
    setServices(services.map(service =>
      service.id === serviceId
        ? { ...service, isActive: !service.isActive }
        : service
    ))
  }

  const handleDeleteService = (serviceId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      setServices(services.filter(service => service.id !== serviceId))
    }
  }

  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.serviceDescription.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "USER_AND_GARAGE", "GARAGE", "ADMIN"]}
        title="Quản lý dịch vụ"
        description="Đang tải..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error && !garage) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "USER_AND_GARAGE", "GARAGE", "ADMIN"]}
        title="Lỗi"
        description="Không thể tải dữ liệu"
      >
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "USER_AND_GARAGE", "GARAGE", "ADMIN"]}
      title={`Quản lý dịch vụ - ${garage?.name}`}
      description="Quản lý dịch vụ của garage"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push(`/garage/${garageId}?owner=true`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          
          <Button 
            onClick={handleAddService}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm dịch vụ
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{services.length}</p>
                  <p className="text-sm text-slate-600">Tổng dịch vụ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {services.filter(s => s.isActive).length}
                  </p>
                  <p className="text-sm text-slate-600">Đang hoạt động</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {services.filter(s => !s.isActive).length}
                  </p>
                  <p className="text-sm text-slate-600">Tạm ngưng</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-gray-100">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {(showAddForm || editingService) && (
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span>{editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Tên dịch vụ *</Label>
                  <Input
                    id="serviceName"
                    value={formData.serviceName}
                    onChange={(e) => handleInputChange("serviceName", e.target.value)}
                    placeholder="Nhập tên dịch vụ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basePrice">Giá cơ bản (VNĐ) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => handleInputChange("basePrice", e.target.value)}
                    placeholder="150000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedTimeMinutes">Thời gian ước tính (phút) *</Label>
                  <Input
                    id="estimatedTimeMinutes"
                    type="number"
                    value={formData.estimatedTimeMinutes}
                    onChange={(e) => handleInputChange("estimatedTimeMinutes", e.target.value)}
                    placeholder="30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceDescription">Mô tả</Label>
                  <Input
                    id="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={(e) => handleInputChange("serviceDescription", e.target.value)}
                    placeholder="Mô tả dịch vụ"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingService(null)
                    setFormData({
                      serviceName: "",
                      serviceDescription: "",
                      basePrice: "",
                      estimatedTimeMinutes: ""
                    })
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSaveService}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingService ? "Cập nhật" : "Thêm dịch vụ"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services List */}
        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Danh sách dịch vụ ({filteredServices.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredServices.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Chưa có dịch vụ nào</h3>
                <p className="text-slate-600">Hãy thêm dịch vụ đầu tiên cho garage của bạn!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">{service.serviceName}</h3>
                      <Badge className={service.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {service.isActive ? "Hoạt động" : "Tạm ngưng"}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">{service.serviceDescription}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {service.basePrice.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{service.estimatedTimeMinutes} phút</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={service.isActive ? "destructive" : "outline"}
                        onClick={() => handleToggleService(service.id)}
                      >
                        {service.isActive ? "Tạm ngưng" : "Kích hoạt"}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
