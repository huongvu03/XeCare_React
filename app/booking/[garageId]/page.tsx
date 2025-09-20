"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, Phone, Car, Upload, ArrowLeft } from "lucide-react"
import { getGarageById, type Garage, type GarageService, type GarageVehicleType } from "@/lib/api/GarageApi"
import { createAppointment, type CreateAppointmentRequest } from "@/lib/api/AppointmentApi"
import { useAuth } from "@/hooks/use-auth"
import { getPublicGarageById, type PublicGarageInfo } from "@/lib/api/UserApi"
import { formatOperatingHours } from "@/lib/utils/operatingHours"
import { VehicleApi } from "@/lib/api/userVehicleApi"
import type { Vehicle } from "@/types/users/userVehicle"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  
  const [garage, setGarage] = useState<Garage | null>(null)
  const [services, setServices] = useState<GarageService[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<GarageVehicleType[]>([])
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [availableVehicleTypes, setAvailableVehicleTypes] = useState<GarageVehicleType[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form data
  const [appointmentDate, setAppointmentDate] = useState("")
  const [description, setDescription] = useState("")
  const [contactPhone, setContactPhone] = useState(user?.phone || "")
  const [contactEmail, setContactEmail] = useState(user?.email || "")
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedVehicleType, setSelectedVehicleType] = useState<number | null>(null)
  const [images, setImages] = useState<File[]>([])

  const garageId = Number(params.garageId)

  // Lấy danh sách services của garage
  const fetchGarageServices = async (garageId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/apis/garage/${garageId}/services`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const servicesData = await response.json()
      setServices(servicesData)
    } catch (err: any) {
      console.error("Error fetching garage services:", err)
      setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại.")
    }
  }

  // Lấy danh sách vehicle types của garage
  const fetchGarageVehicleTypes = async (garageId: number) => {
    try {
      console.log(`🚗 Fetching garage vehicle types for garage ${garageId}`)
      const response = await fetch(`http://localhost:8080/apis/garage/${garageId}/vehicle-types`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const vehicleTypesData = await response.json()
      console.log("📋 Garage vehicle types received:", vehicleTypesData)
      setVehicleTypes(vehicleTypesData)
    } catch (err: any) {
      console.error("Error fetching garage vehicle types:", err)
      setError("Không thể tải danh sách loại xe. Vui lòng thử lại.")
    }
  }

  // Lấy danh sách xe của user
  const fetchUserVehicles = async () => {
    try {
      console.log("👤 Fetching user vehicles...")
      const response = await VehicleApi.getAll()
      console.log("📋 User vehicles API response:", response.data)
      
      if (response.data && response.data.content) {
        console.log("📋 User vehicles (from content):", response.data.content)
        setUserVehicles(response.data.content)
      } else if (Array.isArray(response.data)) {
        console.log("📋 User vehicles (direct array):", response.data)
        setUserVehicles(response.data)
      } else {
        console.log("📋 No user vehicles found")
        setUserVehicles([])
      }
    } catch (err: any) {
      console.error("Error fetching user vehicles:", err)
      // Don't show error for vehicles as it's optional
    }
  }

  // Lấy thông tin garage
  useEffect(() => {
    const fetchGarage = async () => {
      try {
        const response = await getGarageById(garageId)
        setGarage(response.data)
        
        // Lấy danh sách services, vehicle types và user vehicles
        await Promise.all([
          fetchGarageServices(garageId),
          fetchGarageVehicleTypes(garageId),
          fetchUserVehicles()
        ])
      } catch (err: any) {
        setError("Không thể tải thông tin garage. Vui lòng thử lại.")
        console.error("Error fetching garage:", err)
      } finally {
        setLoading(false)
      }
    }

    if (garageId) {
      fetchGarage()
    }
  }, [garageId])

  // Lọc vehicle types dựa trên xe của user
  useEffect(() => {
    console.log("🔍 Debug Vehicle Type Filtering:")
    console.log("  - vehicleTypes (garage):", vehicleTypes)
    console.log("  - userVehicles:", userVehicles)
    
    if (vehicleTypes.length > 0 && userVehicles.length > 0) {
      // Lấy danh sách vehicle type IDs mà user có xe
      const userVehicleTypeIds = new Set(userVehicles.map(vehicle => vehicle.vehicleTypeId))
      console.log("  - userVehicleTypeIds:", Array.from(userVehicleTypeIds))
      
      // Lọc vehicle types của garage chỉ giữ lại những loại mà user có xe
      const filtered = vehicleTypes.filter(garageVehicleType => {
        const hasMatch = userVehicleTypeIds.has(garageVehicleType.vehicleTypeId)
        console.log(`  - Checking garage vehicle type ${garageVehicleType.vehicleTypeId} (${garageVehicleType.vehicleTypeName}): ${hasMatch}`)
        return hasMatch
      })
      
      console.log("  - filtered vehicle types:", filtered)
      setAvailableVehicleTypes(filtered)
    } else if (vehicleTypes.length > 0 && userVehicles.length === 0) {
      console.log("  - User has no vehicles, setting empty array")
      // Nếu user chưa có xe nào, không hiển thị loại xe nào
      setAvailableVehicleTypes([])
    } else {
      console.log("  - No vehicle types or user vehicles available")
      setAvailableVehicleTypes([])
    }
  }, [vehicleTypes, userVehicles])


  // Handle dropdown selections
  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId === "" ? null : Number(serviceId))
  }

  const handleVehicleTypeChange = (vehicleTypeId: string) => {
    const newVehicleTypeId = vehicleTypeId === "" ? null : Number(vehicleTypeId)
    setSelectedVehicleType(newVehicleTypeId)
    setSelectedVehicle(null) // Reset selected vehicle when vehicle type changes
    
    // Filter user vehicles based on selected vehicle type
    if (newVehicleTypeId) {
      const filtered = userVehicles.filter(vehicle => 
        vehicle.vehicleTypeId === newVehicleTypeId && !vehicle.locked
      )
      setFilteredVehicles(filtered)
    } else {
      setFilteredVehicles([])
    }
  }

  const handleVehicleChange = (vehicleId: string) => {
    const newVehicleId = vehicleId === "" ? null : Number(vehicleId)
    if (newVehicleId && filteredVehicles.length > 0) {
      const vehicle = filteredVehicles.find(v => v.id === newVehicleId)
      setSelectedVehicle(vehicle || null)
    } else {
      setSelectedVehicle(null)
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!garage) return
    
    if (!user) {
      setError("Bạn cần đăng nhập để đặt lịch hẹn. Vui lòng đăng nhập tại trang chủ.")
      return
    }

    // Validation
    if (!appointmentDate || !description || !contactPhone || !contactEmail) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.")
      return
    }

    if (!selectedService) {
      setError("Vui lòng chọn dịch vụ.")
      return
    }

    if (availableVehicleTypes.length > 0 && !selectedVehicleType) {
      setError("Vui lòng chọn loại xe.")
      return
    }

    if (availableVehicleTypes.length === 0) {
      setError("Bạn không có xe nào phù hợp với garage này. Vui lòng thêm xe vào tài khoản hoặc chọn garage khác.")
      return
    }

    // Check if user has vehicles of the selected type but hasn't selected a specific vehicle
    if (filteredVehicles.length > 0 && !selectedVehicle) {
      setError("Vui lòng chọn xe cụ thể để đặt lịch hẹn.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const appointmentData: CreateAppointmentRequest = {
        garageId: garage.id,
        vehicleTypeId: selectedVehicleType,
        appointmentDate,
        appointmentTime: "09:00", // Default time, garage will schedule specific time
        description,
        contactPhone,
        contactEmail,
        services: [selectedService],
        // Vehicle information
        vehicleBrand: selectedVehicle?.brand || "",
        vehicleModel: selectedVehicle?.model || "",
        licensePlate: selectedVehicle?.licensePlate || "",
        vehicleYear: selectedVehicle?.year || null
      }

      const response = await createAppointment(appointmentData)
      
      setSuccess("Đặt lịch hẹn thành công! Garage sẽ liên hệ với bạn sớm nhất.")
      
      // Redirect to appointments page after 2 seconds
      setTimeout(() => {
        router.push("/user/appointments")
      }, 2000)

    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi đặt lịch hẹn. Vui lòng thử lại.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE"]}
        title="Đặt lịch hẹn"
        description="Đang tải thông tin garage..."
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
        allowedRoles={["USER", "GARAGE"]}
        title="Lỗi"
        description="Không tìm thấy garage"
      >
        <Card className="border-red-200">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">Không tìm thấy garage</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE"]}
      title="Đặt lịch hẹn"
      description={`Đặt lịch hẹn tại ${garage.name}`}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Garage Info */}
        <div className="lg:col-span-1">
          <Card className="border-blue-100 sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-blue-600" />
                <span>Thông tin Garage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-slate-900">{garage.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{garage.address}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Phone className="h-4 w-4" />
                <span>{garage.phone}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>
                  {garage.operatingHours 
                    ? formatOperatingHours(garage.operatingHours)
                    : garage.openTime && garage.closeTime
                    ? `${garage.openTime} - ${garage.closeTime}`
                    : "08:00 - 18:00 (Thời gian mặc định)"
                  }
                </span>
              </div>

              {garage.description && (
                <p className="text-sm text-slate-600">{garage.description}</p>
              )}

              <div className="flex items-center space-x-2">
                <Badge className={garage.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {garage.status === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động"}
                </Badge>
                {garage.verified && (
                  <Badge className="bg-blue-100 text-blue-700">Đã xác thực</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Thông tin đặt lịch</span>
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

                {/* Date Only */}
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày hẹn *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="max-w-xs"
                  />
                  <p className="text-sm text-slate-500">Garage sẽ liên hệ để xác nhận thời gian cụ thể</p>
                </div>


                {/* Services */}
                <div className="space-y-2">
                  <Label htmlFor="service">Dịch vụ *</Label>
                  <select
                    id="service"
                    value={selectedService || ""}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">-- Chọn dịch vụ --</option>
                    {services.map(service => (
                      <option key={service.id} value={service.serviceId}>
                        {service.serviceName} - {service.basePrice.toLocaleString()}đ ({service.estimatedTimeMinutes} phút)
                      </option>
                    ))}
                  </select>
                  {selectedService && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      {(() => {
                        const service = services.find(s => s.serviceId === selectedService)
                        return service ? (
                          <div>
                            <div className="font-medium text-blue-900">{service.serviceName}</div>
                            <div className="text-sm text-blue-700 mt-1">{service.description}</div>
                            <div className="text-sm text-blue-600 mt-1">
                              Giá: <span className="font-semibold">{service.basePrice.toLocaleString()}đ</span> | 
                              Thời gian: <span className="font-semibold">{service.estimatedTimeMinutes} phút</span>
                            </div>
                          </div>
                        ) : null
                      })()}
                    </div>
                  )}
                </div>

                {/* Vehicle Types */}
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Loại xe *</Label>
                  {availableVehicleTypes.length > 0 ? (
                    <>
                      <select
                        id="vehicleType"
                        value={selectedVehicleType || ""}
                        onChange={(e) => handleVehicleTypeChange(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">-- Chọn loại xe --</option>
                        {availableVehicleTypes.map(vehicleType => (
                          <option key={vehicleType.id} value={vehicleType.vehicleTypeId}>
                            {vehicleType.vehicleTypeName}
                          </option>
                        ))}
                      </select>
                      {selectedVehicleType && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          {(() => {
                            const vehicleType = availableVehicleTypes.find(vt => vt.vehicleTypeId === selectedVehicleType)
                            return vehicleType ? (
                              <div>
                                <div className="font-medium text-green-900">{vehicleType.vehicleTypeName}</div>
                                <div className="text-sm text-green-700 mt-1">{vehicleType.vehicleTypeDescription}</div>
                              </div>
                            ) : null
                          })()}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-red-800">
                        <strong>Không có loại xe phù hợp:</strong> Bạn không có xe nào thuộc các loại mà garage này phục vụ.
                      </div>
                      <div className="text-sm text-red-700 mt-1">
                        Vui lòng thêm xe vào tài khoản hoặc chọn garage khác phù hợp với xe của bạn.
                      </div>
                    </div>
                  )}
                </div>

                {/* User Vehicle Selection */}
                {selectedVehicleType && filteredVehicles.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Chọn xe của bạn *</Label>
                    <select
                      id="vehicle"
                      value={selectedVehicle?.id || ""}
                      onChange={(e) => handleVehicleChange(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">-- Chọn xe của bạn --</option>
                      {filteredVehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.vehicleName} - {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                        </option>
                      ))}
                    </select>
                    {selectedVehicle && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div>
                          <div className="font-medium text-blue-900">{selectedVehicle.vehicleName}</div>
                          <div className="text-sm text-blue-700 mt-1">
                            {selectedVehicle.brand} {selectedVehicle.model} • {selectedVehicle.year} • {selectedVehicle.licensePlate}
                          </div>
                          <div className="text-sm text-blue-600 mt-1">
                            Màu: {selectedVehicle.color} • Loại: {selectedVehicle.vehicleTypeName}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Show message if no vehicles match the selected type */}
                {selectedVehicleType && filteredVehicles.length === 0 && userVehicles.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-yellow-800">
                      <strong>Không có xe nào phù hợp:</strong> Bạn không có xe nào thuộc loại "{availableVehicleTypes.find(vt => vt.vehicleTypeId === selectedVehicleType)?.vehicleTypeName}" 
                      hoặc tất cả xe của bạn đang bị khóa.
                    </div>
                    <div className="text-sm text-yellow-700 mt-1">
                      Bạn có thể tiếp tục đặt lịch mà không chọn xe cụ thể.
                    </div>
                  </div>
                )}

                {/* Show message if user has no vehicles */}
                {selectedVehicleType && userVehicles.length === 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-800">
                      <strong>Chưa có xe nào:</strong> Bạn chưa thêm xe nào vào tài khoản.
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      Bạn có thể tiếp tục đặt lịch mà không chọn xe cụ thể, hoặc thêm xe vào tài khoản trước.
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả vấn đề *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả chi tiết vấn đề của xe hoặc dịch vụ cần thực hiện..."
                    rows={4}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Hình ảnh xe (tùy chọn)</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 mb-2">
                      Tải lên hình ảnh xe để garage có thể đánh giá tốt hơn
                    </p>
                    <input
                      type="file"
                      multiple
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

                  {/* Preview Images */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting || garage.status !== "ACTIVE" || availableVehicleTypes.length === 0 || (filteredVehicles.length > 0 && !selectedVehicle)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 flex-1"
                  >
                    {submitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang đặt lịch...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Đặt lịch hẹn</span>
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                  </Button>
                </div>

                {garage.status !== "ACTIVE" && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-yellow-700">
                      Garage hiện không hoạt động. Vui lòng chọn garage khác.
                    </AlertDescription>
                  </Alert>
                )}

                {availableVehicleTypes.length === 0 && garage.status === "ACTIVE" && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                      Bạn không có xe nào phù hợp với garage này. Vui lòng thêm xe vào tài khoản hoặc chọn garage khác.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
