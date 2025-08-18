"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone, Car, Upload, Building2, CheckCircle, Save } from "lucide-react"
import { getGarageById, updateGarage, uploadGarageImage, type Garage } from "@/lib/api/GarageApi"
import { useAuth } from "@/hooks/use-auth"

// Mock data for services and vehicle types (sẽ được lấy từ API)
const availableServices = [
  { id: 1, name: "Thay nhớt", description: "Thay nhớt động cơ" },
  { id: 2, name: "Sửa phanh", description: "Sửa chữa hệ thống phanh" },
  { id: 3, name: "Bảo dưỡng", description: "Bảo dưỡng định kỳ" },
  { id: 4, name: "Sửa động cơ", description: "Sửa chữa động cơ" },
  { id: 5, name: "Thay lốp", description: "Thay lốp xe" },
  { id: 6, name: "Rửa xe", description: "Rửa xe" },
]

const availableVehicleTypes = [
  { id: 1, name: "Xe máy", description: "Xe máy các loại" },
  { id: 2, name: "Ô tô", description: "Ô tô các loại" },
  { id: 3, name: "Xe tải", description: "Xe tải các loại" },
]

export default function GarageEditPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [garage, setGarage] = useState<Garage | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form data
  const [garageName, setGarageName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")
  const [openTime, setOpenTime] = useState("")
  const [closeTime, setCloseTime] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [selectedServices, setSelectedServices] = useState<number[]>([])
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<number[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  // Load garage info
  useEffect(() => {
    const loadGarage = async () => {
      try {
        // TODO: Get garage by owner ID from user
        // For now, we'll use mock data
        const mockGarage: Garage = {
          id: 1,
          name: "Garage Thành Công",
          address: "123 Lê Lợi, Q1, TP.HCM",
          phone: "0909123456",
          email: "garage@example.com",
          description: "Garage uy tín với hơn 10 năm kinh nghiệm",
          imageUrl: "",
          latitude: 10.8231,
          longitude: 106.6297,
          openTime: "08:00",
          closeTime: "18:00",
          status: "ACTIVE",
          isVerified: true,
          createdAt: "2024-01-01",
          ownerId: 1,
          services: [
            { id: 1, serviceId: 1, serviceName: "Thay nhớt", serviceDescription: "Thay nhớt động cơ", price: 150000, estimatedTimeMinutes: 30, isActive: true },
            { id: 2, serviceId: 2, serviceName: "Sửa phanh", serviceDescription: "Sửa chữa hệ thống phanh", price: 500000, estimatedTimeMinutes: 120, isActive: true },
          ],
          vehicleTypes: [
            { id: 1, vehicleTypeId: 1, vehicleTypeName: "Xe máy", vehicleTypeDescription: "Xe máy các loại", isActive: true },
            { id: 2, vehicleTypeId: 2, vehicleTypeName: "Ô tô", vehicleTypeDescription: "Ô tô các loại", isActive: true },
          ]
        }

        setGarage(mockGarage)
        setGarageName(mockGarage.name)
        setAddress(mockGarage.address)
        setPhone(mockGarage.phone)
        setEmail(mockGarage.email)
        setDescription(mockGarage.description || "")
        setOpenTime(mockGarage.openTime)
        setCloseTime(mockGarage.closeTime)
        setLatitude(mockGarage.latitude)
        setLongitude(mockGarage.longitude)
        setSelectedServices(mockGarage.services?.map(s => s.serviceId) || [])
        setSelectedVehicleTypes(mockGarage.vehicleTypes?.map(v => v.vehicleTypeId) || [])
        setImagePreview(mockGarage.imageUrl || "")

        setLoading(false)
      } catch (err: any) {
        setError("Không thể tải thông tin garage. Vui lòng thử lại.")
        setLoading(false)
      }
    }

    if (user) {
      loadGarage()
    }
  }, [user])

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Không thể lấy vị trí hiện tại. Vui lòng nhập thủ công.")
        }
      )
    } else {
      setError("Trình duyệt không hỗ trợ định vị.")
    }
  }

  // Handle service selection
  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  // Handle vehicle type selection
  const handleVehicleTypeToggle = (vehicleTypeId: number) => {
    setSelectedVehicleTypes(prev => 
      prev.includes(vehicleTypeId) 
        ? prev.filter(id => id !== vehicleTypeId)
        : [...prev, vehicleTypeId]
    )
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!garage || !user) return

    // Validation
    if (!garageName || !address || !phone || !email || !description) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      // Update garage info
      const updateData = {
        name: garageName,
        address,
        phone,
        email,
        description,
        openTime,
        closeTime,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
      }

      const response = await updateGarage(garage.id, updateData)
      
      setSuccess("Cập nhật thông tin garage thành công!")
      
      // Redirect to garage dashboard after 2 seconds
      setTimeout(() => {
        router.push("/garage/dashboard")
      }, 2000)

    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật garage. Vui lòng thử lại.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["garage"]}
        title="Chỉnh sửa Garage"
        description="Đang tải thông tin..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Đang tải thông tin garage...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!garage) {
    return (
      <DashboardLayout
        allowedRoles={["garage"]}
        title="Lỗi"
        description="Không tìm thấy garage"
      >
        <Card className="border-red-200">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">Không tìm thấy garage</p>
            <Button onClick={() => router.push("/garage/register")}>
              Đăng ký garage
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["garage"]}
      title="Chỉnh sửa Garage"
      description={`Cập nhật thông tin ${garage.name}`}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Thông tin Garage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên garage *</Label>
                  <Input
                    id="name"
                    value={garageName}
                    onChange={(e) => setGarageName(e.target.value)}
                    placeholder="Nhập tên garage"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ *</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ đầy đủ"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả về garage, dịch vụ, kinh nghiệm..."
                  rows={4}
                  required
                />
              </div>

              {/* Operating Hours */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Giờ mở cửa</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closeTime">Giờ đóng cửa</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Vị trí (GPS)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Lấy vị trí hiện tại
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Vĩ độ</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={latitude || ""}
                      onChange={(e) => setLatitude(e.target.value ? Number(e.target.value) : null)}
                      placeholder="Ví dụ: 10.8231"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Kinh độ</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={longitude || ""}
                      onChange={(e) => setLongitude(e.target.value ? Number(e.target.value) : null)}
                      placeholder="Ví dụ: 106.6297"
                    />
                  </div>
                </div>

                {latitude && longitude && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Vị trí: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle Types */}
              <div className="space-y-2">
                <Label>Loại xe phục vụ</Label>
                <div className="grid md:grid-cols-3 gap-3">
                  {availableVehicleTypes.map(vehicleType => (
                    <div
                      key={vehicleType.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedVehicleTypes.includes(vehicleType.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => handleVehicleTypeToggle(vehicleType.id)}
                    >
                      <div className="font-medium">{vehicleType.name}</div>
                      <div className="text-sm text-slate-600">{vehicleType.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="space-y-2">
                <Label>Dịch vụ cung cấp</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {availableServices.map(service => (
                    <div
                      key={service.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedServices.includes(service.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-slate-600">{service.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Hình ảnh garage</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Garage preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg mx-auto"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImage(null)
                          setImagePreview("")
                        }}
                      >
                        Xóa hình ảnh
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 mb-2">
                        Tải lên hình ảnh garage để khách hàng dễ nhận biết
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                      >
                        Chọn hình ảnh
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 flex-1"
                >
                  {submitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang cập nhật...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Lưu thay đổi</span>
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/garage/dashboard")}
                >
                  Hủy
                </Button>
              </div>

              {/* Info */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-700">
                  <strong>Lưu ý:</strong> Một số thay đổi có thể cần được admin phê duyệt trước khi có hiệu lực.
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
