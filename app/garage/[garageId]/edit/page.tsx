"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone, Car, Upload, Building2, CheckCircle, Search, AlertCircle, ArrowLeft, Save, Loader2, XCircle } from "lucide-react"
import { getMyGarageById, updateGarage } from "@/lib/api/UserApi"
import { uploadTempGarageImage, OperatingHours } from "@/lib/api/GarageApi"
import { useAuth } from "@/hooks/use-auth"
import { useGeocoding } from "@/hooks/use-geocoding"
import { OperatingHoursForm } from "@/components/operating-hours-form"
import { createDefaultOperatingHours } from "@/lib/utils/operatingHours"

// Mock data for services and vehicle types (giống hệt form đăng ký)
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

export default function EditGaragePage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const garageId = Number(params.garageId)
  
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Geocoding hook (giống hệt form đăng ký)
  const { geocodeAddress, isLoading: geocodingLoading, error: geocodingError, result: geocodingResult, clearError: clearGeocodingError } = useGeocoding(1500)

  // Form data (giống hệt form đăng ký)
  const [garageName, setGarageName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")
  const [openTime, setOpenTime] = useState("08:00")
  const [closeTime, setCloseTime] = useState("18:00")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [selectedServices, setSelectedServices] = useState<number[]>([])
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<number[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [operatingHours, setOperatingHours] = useState<OperatingHours>(createDefaultOperatingHours())

  // Get current location (giống hệt form đăng ký)
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          setLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Không thể lấy vị trí hiện tại. Vui lòng nhập thủ công.")
          setLoading(false)
        }
      )
    } else {
      setError("Trình duyệt không hỗ trợ định vị.")
    }
  }

  // Handle address change with geocoding (giống hệt form đăng ký)
  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress)
    if (newAddress.length >= 10) {
      geocodeAddress(newAddress)
    }
  }

  // Auto-fill coordinates when geocoding result is available (giống hệt form đăng ký)
  useEffect(() => {
    if (geocodingResult) {
      setLatitude(geocodingResult.lat)
      setLongitude(geocodingResult.lon)
    }
  }, [geocodingResult])

  // Clear geocoding error when address changes
  useEffect(() => {
    if (geocodingError) {
      clearGeocodingError()
    }
  }, [address, geocodingError, clearGeocodingError])

  // Handle service selection (giống hệt form đăng ký)
  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  // Handle vehicle type selection (giống hệt form đăng ký)
  const handleVehicleTypeToggle = (vehicleTypeId: number) => {
    setSelectedVehicleTypes(prev => 
      prev.includes(vehicleTypeId) 
        ? prev.filter(id => id !== vehicleTypeId)
        : [...prev, vehicleTypeId]
    )
  }

  // Handle image upload (giống hệt form đăng ký)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Load garage data
  useEffect(() => {
    const loadGarage = async () => {
      try {
        setLoading(true)
        const response = await getMyGarageById(garageId)
        const garageData = response.data
        
        // Populate form data (giống hệt form đăng ký)
        setGarageName(garageData.name || "")
        setAddress(garageData.address || "")
        setPhone(garageData.phone || "")
        setEmail(garageData.email || "")
        setDescription(garageData.description || "")
        setOpenTime(garageData.openTime || "08:00")
        setCloseTime(garageData.closeTime || "18:00")
        setLatitude(garageData.latitude || null)
        setLongitude(garageData.longitude || null)
        
        // Populate services and vehicle types
        if (garageData.services) {
          setSelectedServices(garageData.services.map(s => s.serviceId))
        }
        if (garageData.vehicleTypes) {
          setSelectedVehicleTypes(garageData.vehicleTypes.map(v => v.vehicleTypeId))
        }
        
        // Set image preview
        if (garageData.imageUrl) {
          // Ensure the image URL is absolute
          const imageUrl = garageData.imageUrl.startsWith('http') 
            ? garageData.imageUrl 
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${garageData.imageUrl}`
          setImagePreview(imageUrl)
        }
        
        // Set operating hours if available
        if (garageData.operatingHours) {
          try {
            const parsedHours = JSON.parse(garageData.operatingHours)
            setOperatingHours(parsedHours)
          } catch (e) {
            console.warn("Could not parse operating hours, using default")
          }
        }
        
        setLoading(false)
      } catch (err: any) {
        console.error("Error loading garage:", err)
        setError("Không thể tải thông tin garage")
        setLoading(false)
      }
    }

    if (garageId) {
      loadGarage()
    }
  }, [garageId])

  // Handle form submission (giống hệt form đăng ký)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    // Validation (giống hệt form đăng ký)
    if (!garageName || !address || !phone || !email || !description) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.")
      return
    }

    // Validate phone number format (10-11 digits)
    const phoneRegex = /^[0-9]{10,11}$/
    if (!phoneRegex.test(phone)) {
      setError("Số điện thoại phải có 10-11 chữ số.")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.")
      return
    }

    // Validate name length
    if (garageName.length < 2 || garageName.length > 100) {
      setError("Tên garage phải từ 2-100 ký tự.")
      return
    }

    // Validate description length
    if (description.length > 500) {
      setError("Mô tả không được quá 500 ký tự.")
      return
    }

    // Validate address length
    if (address.length > 255) {
      setError("Địa chỉ không được quá 255 ký tự.")
      return
    }

    if (selectedServices.length === 0) {
      setError("Vui lòng chọn ít nhất một dịch vụ.")
      return
    }

    if (selectedVehicleTypes.length === 0) {
      setError("Vui lòng chọn ít nhất một loại xe.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      let imageUrl = ""
      
      // Upload image if selected (giống hệt form đăng ký)
      if (image) {
        const imageResponse = await uploadTempGarageImage(image)
        imageUrl = imageResponse.data
      }

      // Prepare update data (giống hệt form đăng ký)
      const garageData: any = {
        name: garageName,
        address,
        phone,
        email,
        description,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        serviceIds: selectedServices.map(id => Number(id)),
        vehicleTypeIds: selectedVehicleTypes.map(id => Number(id)),
        operatingHours: JSON.stringify({
          ...operatingHours,
          customSchedule: operatingHours.customSchedule || {}
        }),
      }

      // Only include time fields if they are valid
      if (openTime && openTime.trim()) {
        garageData.openTime = openTime
      }
      if (closeTime && closeTime.trim()) {
        garageData.closeTime = closeTime
      }

      // Only include imageUrl if a new image was uploaded
      if (imageUrl) {
        garageData.imageUrl = imageUrl
      }

      console.log("Sending garage data:", JSON.stringify(garageData, null, 2))
      const response = await updateGarage(garageId, garageData)
      console.log("Update response:", response)
      
      setSuccess("Cập nhật thông tin garage thành công! Garage sẽ được gửi lại cho admin phê duyệt.")
      
      // Redirect back to garage detail page after 3 seconds
      setTimeout(() => {
        router.push(`/garage/${garageId}?owner=true`)
      }, 3000)
      
    } catch (err: any) {
      console.error("Error updating garage:", err)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)
      setError(err.response?.data?.message || "Không thể cập nhật thông tin garage")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE", "ADMIN"]}
        title="Chỉnh sửa Garage"
        description="Đang tải..."
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

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE", "ADMIN"]}
      title={`Chỉnh sửa: ${garageName}`}
      description="Cập nhật thông tin garage"
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
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Edit Form - giống hệt form đăng ký */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Thông tin Garage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Thông tin Garage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    required
                  />
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
                  <div className="relative">
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="Nhập địa chỉ đầy đủ (sẽ tự động tìm tọa độ)"
                      required
                    />
                    {geocodingLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                  {geocodingError && (
                    <div className="flex items-center space-x-2 text-sm text-amber-600 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{geocodingError}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearGeocodingError}
                        className="h-auto p-1 text-amber-600 hover:text-amber-700"
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                  {geocodingResult && (
                    <div className="flex items-center space-x-2 text-sm text-green-600 mt-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Đã tìm thấy: {geocodingResult.display_name}</span>
                    </div>
                  )}
                </div>
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
            </CardContent>
          </Card>

          {/* Giờ làm việc */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Giờ làm việc</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OperatingHoursForm
                value={operatingHours}
                onChange={setOperatingHours}
              />
            </CardContent>
          </Card>

          {/* Vị trí (GPS) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Vị trí (GPS)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Vĩ độ</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={latitude || ""}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || null)}
                    placeholder="Ví dụ: 10.8231"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Kinh độ</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={longitude || ""}
                      onChange={(e) => setLongitude(parseFloat(e.target.value) || null)}
                      placeholder="Ví dụ: 106.6297"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={loading}
                      className="whitespace-nowrap"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Lấy vị trí hiện tại"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {latitude && longitude && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Tọa độ đã được thiết lập: {latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loại xe phục vụ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-blue-600" />
                <span>Loại xe phục vụ *</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {availableVehicleTypes.map((vehicleType) => (
                  <div key={vehicleType.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50">
                    <input
                      type="checkbox"
                      id={`vehicle-${vehicleType.id}`}
                      checked={selectedVehicleTypes.includes(vehicleType.id)}
                      onChange={() => handleVehicleTypeToggle(vehicleType.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`vehicle-${vehicleType.id}`} className="flex-1 cursor-pointer">
                      <div className="font-medium">{vehicleType.name}</div>
                      <div className="text-sm text-gray-500">{vehicleType.description}</div>
                    </label>
                  </div>
                ))}
              </div>
              {selectedVehicleTypes.length === 0 && (
                <p className="text-sm text-red-600 mt-2">Vui lòng chọn ít nhất một loại xe</p>
              )}
            </CardContent>
          </Card>

          {/* Dịch vụ cung cấp */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Dịch vụ cung cấp *</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {availableServices.map((service) => (
                  <div key={service.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50">
                    <input
                      type="checkbox"
                      id={`service-${service.id}`}
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`service-${service.id}`} className="flex-1 cursor-pointer">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.description}</div>
                    </label>
                  </div>
                ))}
              </div>
              {selectedServices.length === 0 && (
                <p className="text-sm text-red-600 mt-2">Vui lòng chọn ít nhất một dịch vụ</p>
              )}
            </CardContent>
          </Card>

          {/* Hình ảnh garage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <span>Hình ảnh garage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Tải lên hình ảnh garage để khách hàng dễ nhận biết
                </p>
                {imagePreview && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Hình ảnh đã được tải lên</span>
                  </div>
                )}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Chọn hình ảnh</span>
                  </Button>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Garage preview"
                      className="w-48 h-32 object-cover rounded-lg mx-auto border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/garage/${garageId}?owner=true`)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>

          {/* Note */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Lưu ý: Sau khi cập nhật, garage của bạn sẽ cần được admin phê duyệt lại trước khi có thể nhận lịch hẹn từ khách hàng.
            </p>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
