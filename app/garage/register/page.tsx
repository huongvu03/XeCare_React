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
import { MapPin, Clock, Phone, Car, Upload, Building2, CheckCircle, Search, AlertCircle } from "lucide-react"
import { registerGarage } from "@/lib/api/UserApi"
import { uploadTempGarageImage, OperatingHours, checkAddressAvailability } from "@/lib/api/GarageApi"
import { getAllSystemServices, type Service } from "@/lib/api/ServiceApi"
import { getAllVehicleTypes, type VehicleType } from "@/lib/api/VehicleTypeApi"
import { useAuth } from "@/hooks/use-auth"
import { useGeocoding } from "@/hooks/use-geocoding"
import { OperatingHoursForm } from "@/components/operating-hours-form"
import { createDefaultOperatingHours } from "@/lib/utils/operatingHours"

export default function GarageRegistrationPage() {
  const router = useRouter()
  const { user, updateUser, refreshUser } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Geocoding hook
  const { geocodeAddress, isLoading: geocodingLoading, error: geocodingError, result: geocodingResult, clearError: clearGeocodingError } = useGeocoding(1500)

  // Form data
  const [garageName, setGarageName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState(user?.phone || "")
  const [email, setEmail] = useState(user?.email || "")
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
  
  // API data states
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [availableVehicleTypes, setAvailableVehicleTypes] = useState<VehicleType[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [vehicleTypesLoading, setVehicleTypesLoading] = useState(true)
  
  // Address validation state
  const [addressValidation, setAddressValidation] = useState<{
    isValidating: boolean
    isTaken: boolean
    message: string
  }>({
    isValidating: false,
    isTaken: false,
    message: ""
  })

  // Get current location
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

  // Handle address change with geocoding and validation
  const handleAddressChange = async (newAddress: string) => {
    setAddress(newAddress)
    geocodeAddress(newAddress)
    
    // Validate address if it's not empty
    if (newAddress.trim().length > 0) {
      setAddressValidation(prev => ({ ...prev, isValidating: true }))
      
      try {
        const response = await checkAddressAvailability(newAddress.trim())
        setAddressValidation({
          isValidating: false,
          isTaken: response.data.isTaken,
          message: response.data.message
        })
      } catch (error) {
        console.error("Error checking address availability:", error)
        setAddressValidation({
          isValidating: false,
          isTaken: false,
          message: "Không thể kiểm tra địa chỉ"
        })
      }
    } else {
      setAddressValidation({
        isValidating: false,
        isTaken: false,
        message: ""
      })
    }
  }

  // Auto-fill coordinates when geocoding result is available
  useEffect(() => {
    if (geocodingResult) {
      setLatitude(geocodingResult.lat)
      setLongitude(geocodingResult.lon)
    }
  }, [geocodingResult])

  // Load services and vehicle types from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load services
        const servicesResponse = await getAllSystemServices()
        console.log('Services response:', servicesResponse)
        
        // Ensure we have an array of services
        if (servicesResponse && servicesResponse.data && Array.isArray(servicesResponse.data)) {
          setAvailableServices(servicesResponse.data)
        } else {
          console.error('Services response is not an array:', servicesResponse)
          setAvailableServices([])
        }
        setServicesLoading(false)
        
        // Load vehicle types
        const vehicleTypesResponse = await getAllVehicleTypes()
        console.log('Vehicle types response:', vehicleTypesResponse)
        
        // Ensure we have an array of vehicle types
        if (vehicleTypesResponse && vehicleTypesResponse.data && Array.isArray(vehicleTypesResponse.data)) {
          setAvailableVehicleTypes(vehicleTypesResponse.data)
        } else {
          console.error('Vehicle types response is not an array:', vehicleTypesResponse)
          setAvailableVehicleTypes([])
        }
        setVehicleTypesLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        // Set empty arrays as fallback
        setAvailableServices([])
        setAvailableVehicleTypes([])
        setServicesLoading(false)
        setVehicleTypesLoading(false)
      }
    }
    
    loadData()
  }, [])

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
    
    if (!user) return

    // Debug: Kiểm tra token và user
    const token = localStorage.getItem("token")
    console.log("Debug - User:", user)
    console.log("Debug - Token:", token)
    console.log("Debug - User role:", user.role)

    // Validation
    if (!garageName || !address || !phone || !email || !description) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.")
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

    // Check if address is already taken
    if (addressValidation.isTaken) {
      setError("Địa chỉ này đã được sử dụng bởi một garage khác. Vui lòng chọn địa chỉ khác.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      let imageUrl = ""
      
      // Upload image if selected (sử dụng API tạm thời)
      if (image) {
        const imageResponse = await uploadTempGarageImage(image)
        imageUrl = imageResponse.data
      }

      // Register garage
      const garageData = {
        name: garageName,
        address,
        phone,
        email,
        description,
        openTime,
        closeTime,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        imageUrl: imageUrl || undefined, // Thêm imageUrl
        serviceIds: selectedServices,
        vehicleTypeIds: selectedVehicleTypes,
        operatingHours: operatingHours, // Thêm operating hours
      }

      console.log("Debug - Garage data:", garageData)

      const response = await registerGarage(garageData)
      
      console.log("Debug - Response:", response)
      
      setSuccess("Đăng ký garage thành công! Vui lòng chờ admin phê duyệt.")
      
      // Update user role to GARAGE immediately in frontend
      if (user) {
        const updatedUser = { ...user, role: "GARAGE" as const }
        updateUser(updatedUser)
      }
      
      // Force refresh user data to get updated garage information and role
      await refreshUser()
      
      // Clear any cached garage data to force reload
      if (typeof window !== 'undefined') {
        // Force reload localStorage to sync with backend
        const token = localStorage.getItem('token')
        if (token) {
          try {
            const response = await fetch('http://localhost:8080/apis/user/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            if (response.ok) {
              const latestUserData = await response.json()
              updateUser(latestUserData)
              localStorage.setItem('user', JSON.stringify(latestUserData))
            }
          } catch (error) {
            console.error('Error refreshing user data:', error)
          }
        }
      }
      
      // Redirect to dashboard with garage tab after 3 seconds
      setTimeout(() => {
        router.push("/dashboard?tab=garage")
      }, 3000)

    } catch (err: any) {
      console.error("Debug - Error details:", err)
      console.error("Debug - Error response:", err.response)
      setError(err.response?.data?.message || "Có lỗi xảy ra khi đăng ký garage. Vui lòng thử lại.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE"]}
      title="Đăng ký Garage"
      description="Đăng ký garage của bạn để bắt đầu nhận lịch hẹn"
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
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
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
                
                {/* Address validation message */}
                {addressValidation.isValidating && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600 mt-1">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Đang kiểm tra địa chỉ...</span>
                  </div>
                )}
                
                {!addressValidation.isValidating && addressValidation.message && (
                  <div className={`flex items-center space-x-2 text-sm mt-1 ${
                    addressValidation.isTaken ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {addressValidation.isTaken ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span>{addressValidation.message}</span>
                  </div>
                )}
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
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Giờ làm việc</h3>
                </div>
                <OperatingHoursForm
                  value={operatingHours}
                  onChange={setOperatingHours}
                />
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
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Đang lấy vị trí...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Lấy vị trí hiện tại</span>
                      </div>
                    )}
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
                     {geocodingResult && (
                       <div className="text-xs text-green-600 mt-1">
                         {geocodingResult.display_name}
                       </div>
                     )}
                   </div>
                 )}
              </div>

              {/* Vehicle Types */}
              <div className="space-y-2">
                <Label>Loại xe phục vụ *</Label>
                {vehicleTypesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Đang tải loại xe...</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      {Array.isArray(availableVehicleTypes) && availableVehicleTypes.map(vehicleType => (
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
                )}
              </div>

              {/* Services */}
              <div className="space-y-2">
                <Label>Dịch vụ cung cấp *</Label>
                {servicesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Đang tải dịch vụ...</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      {Array.isArray(availableServices) && availableServices.map(service => (
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
                )}
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
                      <span>Đang đăng ký...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>Đăng ký Garage</span>
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Hủy
                </Button>
              </div>

              {/* Info */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-700">
                  <strong>Lưu ý:</strong> Sau khi đăng ký, garage của bạn sẽ cần được admin phê duyệt trước khi có thể nhận lịch hẹn từ khách hàng.
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
