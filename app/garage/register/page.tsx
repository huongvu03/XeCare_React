"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
import { useDebouncedCallback } from "@/hooks/use-debounce"
import { OperatingHoursForm } from "@/components/operating-hours-form"
import { createDefaultOperatingHours } from "@/lib/utils/operatingHours"
import Swal from 'sweetalert2'

export default function GarageRegistrationPage() {
  const router = useRouter()
  const { user, updateUser, refreshUser } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Geocoding hook - giảm delay từ 1500ms xuống 500ms để auto-fill nhanh hơn
  const { geocodeAddress, geocodeAddressImmediate, cancelGeocoding, isLoading: geocodingLoading, error: geocodingError, result: geocodingResult, clearError: clearGeocodingError } = useGeocoding(500)

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
  
  // Track last validated address to avoid re-validating same address
  const lastValidatedAddress = useRef<string>("")

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
          setError("Cannot get current location. Please enter manually.")
          setLoading(false)
        }
      )
    } else {
      setError("Browser does not support geolocation.")
    }
  }

  // Address validation function (without debounce for immediate validation)
  const validateAddress = useCallback(async (newAddress: string) => {
    const trimmedAddress = newAddress.trim()
    
    // Skip validation if same address was already validated
    if (trimmedAddress === lastValidatedAddress.current) {
      console.log('⏭️ Skipping validation - same address already validated:', trimmedAddress)
      return
    }
    
    if (trimmedAddress.length > 0) {
      setAddressValidation(prev => ({ ...prev, isValidating: true }))
      
      try {
        console.log('🔍 Validating address:', trimmedAddress)
        console.log('   Last validated address:', lastValidatedAddress.current)
        const response = await checkAddressAvailability(trimmedAddress)
        
        const validationResult = {
          isValidating: false,
          isTaken: response.data.isTaken,
          message: response.data.message
        }
        
        console.log('✅ Validation API response:', response.data)
        console.log('📝 Setting validation state:', validationResult)
        
        setAddressValidation(validationResult)
        lastValidatedAddress.current = trimmedAddress
        console.log('✅ Validation completed and cached:', response.data)
        
        // 🚫 Cancel geocoding nếu địa chỉ bị trùng lặp
        if (response.data.isTaken) {
          console.log('🚫 STEP 4: Address is taken, cancelling any pending geocoding')
          cancelGeocoding()
        } else {
          console.log('✅ STEP 4: Address is available, keeping auto-fill result')
        }
      } catch (error) {
        console.error("Error checking address availability:", error)
        setAddressValidation({
          isValidating: false,
          isTaken: false,
          message: "Cannot check address"
        })
      }
    } else {
      setAddressValidation({
        isValidating: false,
        isTaken: false,
        message: ""
      })
      lastValidatedAddress.current = ""
    }
  }, [cancelGeocoding])

  // Force validation (bypass cache) for auto-filled addresses
  const forceValidateAddress = useCallback(async (newAddress: string) => {
    const trimmedAddress = newAddress.trim()
    
    if (trimmedAddress.length > 0) {
      console.log('🔍 Force validating address (bypassing cache):', trimmedAddress)
      setAddressValidation(prev => ({ ...prev, isValidating: true }))
      
      try {
        const response = await checkAddressAvailability(trimmedAddress)
        
        const validationResult = {
          isValidating: false,
          isTaken: response.data.isTaken,
          message: response.data.message
        }
        
        console.log('✅ Force validation API response:', response.data)
        console.log('📝 Setting force validation state:', validationResult)
        
        setAddressValidation(validationResult)
        lastValidatedAddress.current = trimmedAddress
        console.log('✅ Force validation completed:', response.data)
        
      } catch (error) {
        console.error('❌ Force validation error:', error)
        setAddressValidation({
          isValidating: false,
          isTaken: false,
          message: "Có lỗi xảy ra khi kiểm tra địa chỉ"
        })
      }
    }
  }, [checkAddressAvailability])

  // Debounced address validation function (for user typing)
  const debouncedAddressValidation = useDebouncedCallback(validateAddress, 500)

  // Handle address change with geocoding and validation
  const handleAddressChange = useCallback(async (newAddress: string) => {
    setAddress(newAddress)
    
    // Reset validation nếu địa chỉ thay đổi đáng kể
    if (newAddress !== lastValidatedAddress.current && newAddress.length > 0) {
      console.log('🔄 Address changed, resetting validation state')
      console.log('   Old address:', lastValidatedAddress.current)
      console.log('   New address:', newAddress)
      setAddressValidation({
        isValidating: false,
        isTaken: false,
        message: ""
      })
    }
    
    // 🔥 FIXED: Luôn validate địa chỉ bất kể geocoding có thành công hay không
    // Validation cần chạy để phát hiện địa chỉ trùng lặp ngay cả khi geocoding thất bại
    
    // Chỉ geocode nếu:
    // 1. User nhập địa chỉ ngắn (có thể cần auto-fill)
    // 2. Hoặc địa chỉ hiện tại khác với địa chỉ auto-fill trước đó
    const shouldGeocode = newAddress.length < 50 || newAddress !== lastGeocodingResult.current
    
    if (shouldGeocode) {
      // Sử dụng immediate geocoding cho địa chỉ có vẻ đầy đủ (chứa số nhà + tên đường)
      const hasHouseNumber = /^\d+/.test(newAddress.trim())
      const hasStreetName = /\b(đường|phố|phường|xã|quận|huyện|thành phố|tỉnh|việt nam|vietnam|ward|district|street|road|avenue)\b/i.test(newAddress) ||
                           /\b[A-Z][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+ [A-Z][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+\b/.test(newAddress)
      
      if (hasHouseNumber && hasStreetName && newAddress.length >= 15) {
        console.log('⚡ STEP 1: Triggering IMMEDIATE geocoding for complete address:', newAddress)
        geocodeAddressImmediate(newAddress)
      } else {
        console.log('🗺️ STEP 1: Triggering NORMAL geocoding for:', newAddress)
        geocodeAddress(newAddress)
      }
    } else {
      console.log('⏭️ Skipping geocoding - address seems complete:', newAddress)
    }
    
    // 🔥 QUAN TRỌNG: Luôn validate địa chỉ (với debounce)
    // Điều này đảm bảo validation chạy ngay cả khi geocoding thất bại
    debouncedAddressValidation(newAddress)
  }, [geocodeAddress, geocodeAddressImmediate, debouncedAddressValidation])

  // Ref để tránh infinite loop khi auto-fill address
  const lastGeocodingResult = useRef<string | null>(null)
  const lastAddressInput = useRef<string>("")
  const hasAutoFilled = useRef<boolean>(false)

  // Reset geocoding result ref khi địa chỉ input thay đổi
  useEffect(() => {
    if (address !== lastAddressInput.current) {
      // Chỉ reset nếu user thực sự thay đổi input (không phải auto-fill)
      if (!hasAutoFilled.current) {
      lastGeocodingResult.current = null
        console.log('User manually changed address, reset geocoding ref. New address:', address)
      }
      lastAddressInput.current = address
      console.log('lastAddressInput updated to:', lastAddressInput.current)
    }
  }, [address])

  // Hàm helper để merge số nhà với địa chỉ đầy đủ
  const mergeAddressWithHouseNumber = (userInput: string, geocodingResult: string) => {
    console.log('Merging addresses:', { userInput, geocodingResult })
    
    // Tìm số nhà trong input của user (số ở đầu chuỗi)
    const houseNumberMatch = userInput.match(/^(\d+[a-zA-Z]?)\s*(.+)/)
    
    if (houseNumberMatch) {
      const houseNumber = houseNumberMatch[1] // Số nhà
      const streetName = houseNumberMatch[2].trim() // Tên đường
      
      console.log('Found house number:', houseNumber, 'Street name:', streetName)
      
      // 🔥 FIXED: Luôn giữ lại số nhà của user
      // Nếu geocoding result đã có số nhà, thay thế nó bằng số nhà của user
      // Nếu chưa có, thêm vào đầu
      let mergedAddress
      if (/^\d+[a-zA-Z]?\s/.test(geocodingResult)) {
        // Geocoding result đã có số nhà, thay thế nó
        mergedAddress = geocodingResult.replace(/^\d+[a-zA-Z]?\s*/, `${houseNumber} `)
        console.log('Replaced house number in geocoding result:', mergedAddress)
      } else {
        // Geocoding result chưa có số nhà, thêm vào đầu
        mergedAddress = `${houseNumber} ${geocodingResult}`
        console.log('Added house number to geocoding result:', mergedAddress)
      }
        return mergedAddress
    }
    
    // Nếu không tìm thấy số nhà, trả về geocoding result
    console.log('No house number found, using geocoding result')
    return geocodingResult
  }

  // Auto-fill coordinates and address when geocoding result is available
  useEffect(() => {
    if (geocodingResult) {
      setLatitude(geocodingResult.lat)
      setLongitude(geocodingResult.lon)
      
      // Tự động fill địa chỉ đầy đủ khi tìm thấy (chỉ khi khác với kết quả trước đó)
      if (geocodingResult.display_name && 
          geocodingResult.display_name !== lastGeocodingResult.current) {
        
        // Sử dụng địa chỉ gốc từ lastAddressInput để merge số nhà
        const originalUserInput = lastAddressInput.current.trim()
        const geocodingAddress = geocodingResult.display_name.trim()
        
        console.log('Original user input:', originalUserInput)
        console.log('Geocoding result:', geocodingAddress)
        
        // Merge số nhà của user với địa chỉ đầy đủ từ geocoding
        const mergedAddress = mergeAddressWithHouseNumber(originalUserInput, geocodingAddress)
                      
                      console.log('🔄 STEP 2: Auto-filling address:', mergedAddress)
                      
                      // 🔥 FIXED: Reset validation state trước khi auto-fill
                      // Điều này đảm bảo không hiển thị validation state cũ
                      setAddressValidation({
                        isValidating: false,
                        isTaken: false,
                        message: ""
                      })
                      
                      // Set flag để đánh dấu đây là auto-fill
                      hasAutoFilled.current = true
        
        setAddress(mergedAddress)
        lastGeocodingResult.current = mergedAddress
                      console.log('✅ Auto-fill completed:', mergedAddress)
                      
                      // Reset flag sau khi set address
                      setTimeout(() => {
                        hasAutoFilled.current = false
                      }, 100)
                      
                      // 🔥 STEP 3: Gọi validation ngay lập tức cho địa chỉ đã auto-fill
                      // Force validate để bỏ qua cache và có kết quả ngay
                      console.log('🔍 STEP 3: Force validating auto-filled address immediately')
                      forceValidateAddress(mergedAddress)
                    }
                  }
                }, [geocodingResult, forceValidateAddress])

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
      await Swal.fire({
        title: 'Missing Information!',
        text: 'Please fill in all required information.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f59e0b',
        showConfirmButton: true
      })
      setError("Please fill in all required information.")
      return
    }

    if (selectedServices.length === 0) {
      await Swal.fire({
        title: 'Missing Services!',
        text: 'Please select at least one service.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f59e0b',
        showConfirmButton: true
      })
      setError("Please select at least one service.")
      return
    }

    if (selectedVehicleTypes.length === 0) {
      await Swal.fire({
        title: 'Missing Vehicle Types!',
        text: 'Please select at least one vehicle type.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f59e0b',
        showConfirmButton: true
      })
      setError("Please select at least one vehicle type.")
      return
    }

    // Check if address is already taken
    if (addressValidation.isTaken) {
      await Swal.fire({
        title: 'Address Already Used!',
        text: 'This address is already used by another garage. Please choose a different address.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true
      })
      setError("This address is already used by another garage. Please choose a different address.")
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
      
      // Show SweetAlert success notification
      await Swal.fire({
        title: '🎉 Registration Successful!',
        html: `
          <div class="text-center">
            <p class="text-lg mb-4">Garage <strong>"${garageName}"</strong> has been registered successfully!</p>
            <p class="text-sm text-gray-600 mb-4">Please wait for admin approval to start receiving appointments from customers.</p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p class="text-sm text-blue-700">
                <strong>Note:</strong> You will be redirected to the garage dashboard in a few seconds...
              </p>
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Great!',
        confirmButtonColor: '#3b82f6',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          // Auto redirect after 5 seconds
          setTimeout(() => {
            router.push("/dashboard?tab=garage")
          }, 5000)
        }
      })
      
      // Redirect to dashboard with garage tab
      router.push("/dashboard?tab=garage")

    } catch (err: any) {
      console.error("Debug - Error details:", err)
      console.error("Debug - Error response:", err.response)
      const errorMessage = err.response?.data?.message || "An error occurred while registering the garage. Please try again."
      setError(errorMessage)
      
      // Show SweetAlert error notification
      await Swal.fire({
        title: '❌ Registration Failed!',
        html: `
          <div class="text-center">
            <p class="text-lg mb-4">Cannot register garage</p>
            <p class="text-sm text-gray-600 mb-4">${errorMessage}</p>
            <div class="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
              <p class="text-sm text-red-700">
                <strong>Suggestion:</strong> Please check the information and try again.
              </p>
            </div>
          </div>
        `,
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444',
        allowOutsideClick: true,
        allowEscapeKey: true
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE"]}
      title="Register Garage"
      description="Register your garage to start receiving appointments"
    >
      <div className="max-w-4xl mx-auto">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Garage Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Messages */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Garage Name *</Label>
                  <Input
                    id="name"
                    value={garageName}
                    onChange={(e) => setGarageName(e.target.value)}
                    placeholder="Enter garage name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
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
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    placeholder="Enter full address (coordinates will be found automatically)"
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
                    <span>Found and automatically updated: {geocodingResult.display_name}</span>
                  </div>
                )}
                
                {/* Address validation message */}
                {addressValidation.isValidating && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600 mt-1">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Checking address...</span>
                  </div>
                )}
                
                {!addressValidation.isValidating && addressValidation.message && (
                  <div className={`flex items-start space-x-2 text-sm mt-1 ${
                    addressValidation.isTaken ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {addressValidation.isTaken ? (
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                    <span>{addressValidation.message}</span>
                      {addressValidation.isTaken && (
                        <div className="text-xs text-red-500 mt-1">
                          💡 Mẹo: Thử thêm số nhà cụ thể hoặc tên đường khác để tránh trùng lặp
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe about garage, services, experience..."
                  rows={4}
                  required
                />
              </div>

              {/* Operating Hours */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Operating Hours</h3>
                </div>
                <OperatingHoursForm
                  value={operatingHours}
                  onChange={setOperatingHours}
                />
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Location (GPS)</Label>
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
                        <span>Getting location...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Get Current Location</span>
                      </div>
                    )}
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={latitude || ""}
                      onChange={(e) => setLatitude(e.target.value ? Number(e.target.value) : null)}
                      placeholder="e.g., 10.8231"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={longitude || ""}
                      onChange={(e) => setLongitude(e.target.value ? Number(e.target.value) : null)}
                      placeholder="e.g., 106.6297"
                    />
                  </div>
                </div>

                                 {latitude && longitude && (
                   <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                     <div className="flex items-center space-x-2 text-green-700">
                       <CheckCircle className="h-4 w-4" />
                       <span className="text-sm">
                         Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
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
                <Label>Vehicle Types Served *</Label>
                {vehicleTypesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Loading vehicle types...</p>
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
                <Label>Services Provided *</Label>
                {servicesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Loading services...</p>
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
                <Label>Garage Image</Label>
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
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 mb-2">
                        Upload garage image for customers to easily identify
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
                        Select Image
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
                      <span>Registering...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>Register Garage</span>
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>

              {/* Info */}
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-700">
                  <strong>Note:</strong> After registration, your garage will need admin approval before it can receive appointments from customers.
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
