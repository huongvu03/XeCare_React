"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
import { getAllSystemServices, type Service } from "@/lib/api/ServiceApi"
import { getAllVehicleTypes, type VehicleType } from "@/lib/api/VehicleTypeApi"
import { useAuth } from "@/hooks/use-auth"
import { useGeocoding } from "@/hooks/use-geocoding"
import { useDebouncedCallback } from "@/hooks/use-debounce"
import Swal from 'sweetalert2'
import { checkAddressAvailability, checkAddressAvailabilityForEdit } from "@/lib/api/GarageApi"
import { OperatingHoursForm } from "@/components/operating-hours-form"
import { createDefaultOperatingHours } from "@/lib/utils/operatingHours"

export default function EditGaragePage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const garageId = Number(params.garageId)
  
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Geocoding hook (same as registration form)
  const { geocodeAddress, isLoading: geocodingLoading, error: geocodingError, result: geocodingResult, clearError: clearGeocodingError } = useGeocoding(1500)

  // Form data (same as registration form)
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
  
  // API data states
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [availableVehicleTypes, setAvailableVehicleTypes] = useState<VehicleType[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [vehicleTypesLoading, setVehicleTypesLoading] = useState(true)

  // Address validation state
  const [addressValidation, setAddressValidation] = useState({
    isValidating: false,
    isTaken: false,
    message: ""
  })

  // Refs for tracking validation state
  const lastValidatedAddress = useRef<string>("")
  const lastGeocodingResult = useRef<string>("")
  const lastAddressInput = useRef<string>("")
  const hasAutoFilled = useRef<boolean>(false)

  // Get current location (same as registration form)
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

  // Merge address with house number (same as registration form)
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

  // Address validation function (without debounce for immediate validation)
  const validateAddress = useCallback(async (newAddress: string) => {
    const trimmedAddress = newAddress.trim()
    
    // Skip validation if same address was already validated
    if (trimmedAddress === lastValidatedAddress.current) {
      console.log('⏭️ Skipping validation - same address already validated:', trimmedAddress)
      return
    }
    
    if (trimmedAddress.length > 0) {
      // 🔥 FIXED: Validate địa chỉ cơ bản trước khi gọi API
      if (trimmedAddress.length < 10) {
        console.log('🚫 Address is too short, showing validation error')
        setAddressValidation({
          isValidating: false,
          isTaken: true,
          message: "Địa chỉ quá ngắn, vui lòng nhập địa chỉ đầy đủ"
        })
        lastValidatedAddress.current = ""
        return
      }
      
      // 🔥 FIXED: Đơn giản hóa validation - chỉ kiểm tra độ dài
      // Thay vì kiểm tra từ khóa phức tạp, chỉ cần đủ dài để có thể geocoding
      if (trimmedAddress.length < 10) {
        console.log('🚫 Address is too short for geocoding, showing validation error')
        setAddressValidation({
          isValidating: false,
          isTaken: true,
          message: "Địa chỉ quá ngắn, vui lòng nhập địa chỉ đầy đủ"
        })
        lastValidatedAddress.current = ""
        return
      }
      
      setAddressValidation(prev => ({ ...prev, isValidating: true }))
      
      try {
        console.log('🔍 Validating address for edit:', trimmedAddress)
        console.log('   Garage ID:', garageId)
        console.log('   Last validated address:', lastValidatedAddress.current)
        const response = await checkAddressAvailabilityForEdit(trimmedAddress, garageId)
        
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
          // Note: useGeocoding hook doesn't have cancelGeocoding in edit page yet
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
      // 🔥 FIXED: Bỏ validation trống vì Save Change đã có validation này
      setAddressValidation({
        isValidating: false,
        isTaken: false,
        message: ""
      })
      lastValidatedAddress.current = ""
    }
  }, [garageId])

  // Force validation (bypass cache) for auto-filled addresses
  const forceValidateAddress = useCallback(async (newAddress: string) => {
    const trimmedAddress = newAddress.trim()
    
    if (trimmedAddress.length > 0) {
      // 🔥 FIXED: Validate địa chỉ cơ bản trước khi gọi API
      if (trimmedAddress.length < 10) {
        console.log('🚫 Address is too short, showing validation error')
        setAddressValidation({
          isValidating: false,
          isTaken: true,
          message: "Địa chỉ quá ngắn, vui lòng nhập địa chỉ đầy đủ"
        })
        lastValidatedAddress.current = ""
        return
      }
      
      // 🔥 FIXED: Đơn giản hóa validation - chỉ kiểm tra độ dài
      // Thay vì kiểm tra từ khóa phức tạp, chỉ cần đủ dài để có thể geocoding
      if (trimmedAddress.length < 10) {
        console.log('🚫 Address is too short for geocoding, showing validation error')
        setAddressValidation({
          isValidating: false,
          isTaken: true,
          message: "Địa chỉ quá ngắn, vui lòng nhập địa chỉ đầy đủ"
        })
        lastValidatedAddress.current = ""
        return
      }
      
      console.log('🔍 Force validating address (bypassing cache):', trimmedAddress)
      setAddressValidation(prev => ({ ...prev, isValidating: true }))
      
      try {
        const response = await checkAddressAvailabilityForEdit(trimmedAddress, garageId)
        
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
  }, [garageId])

  // Debounced address validation function (for user typing)
  const debouncedAddressValidation = useDebouncedCallback(validateAddress, 500)

  // Handle address change with geocoding and validation
  const handleAddressChange = useCallback(async (newAddress: string) => {
    setAddress(newAddress)
    lastAddressInput.current = newAddress
    
    // Reset validation nếu địa chỉ thay đổi đáng kể (nhưng không reset khi địa chỉ trống)
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
    
    // 🔥 FIXED: Bỏ validation trống vì Save Change đã có validation này
    // Cho phép user nhập trống để có thể xóa địa chỉ
    if (newAddress.trim().length === 0) {
      console.log('🚫 Address is empty, clearing validation')
      setAddressValidation({
        isValidating: false,
        isTaken: false,
        message: ""
      })
      lastValidatedAddress.current = ""
      return
    }
    
    // 🔥 FIXED: Validate địa chỉ cơ bản trước khi gọi API
    if (newAddress.trim().length < 10) {
      console.log('🚫 Address is too short, showing validation error')
      setAddressValidation({
        isValidating: false,
        isTaken: true,
        message: "Địa chỉ quá ngắn, vui lòng nhập địa chỉ đầy đủ"
      })
      lastValidatedAddress.current = ""
      return
    }
    
    // 🔥 FIXED: Đơn giản hóa validation - chỉ kiểm tra độ dài và có số nhà
    // Thay vì kiểm tra từ khóa phức tạp, chỉ cần có số nhà và đủ dài
    const hasHouseNumber = /^\d+/.test(newAddress.trim())
    const hasMinimumLength = newAddress.trim().length >= 10
    
    if (!hasMinimumLength) {
      console.log('🚫 Address is too short, showing validation error')
      setAddressValidation({
        isValidating: false,
        isTaken: true,
        message: "Địa chỉ quá ngắn, vui lòng nhập địa chỉ đầy đủ"
      })
      lastValidatedAddress.current = ""
      return
    }
    
    // Nếu có số nhà và đủ dài, cho phép geocoding
    if (!hasHouseNumber) {
      console.log('⚠️ Address does not start with house number, but allowing geocoding')
    }
    
    // 🔥 FIXED: Luôn validate địa chỉ bất kể geocoding có thành công hay không
    // Validation cần chạy để phát hiện địa chỉ trùng lặp ngay cả khi geocoding thất bại
    
    // Chỉ geocode nếu:
    // 1. User nhập địa chỉ ngắn (có thể cần auto-fill)
    // 2. Hoặc địa chỉ hiện tại khác với địa chỉ auto-fill trước đó
    const shouldGeocode = newAddress.length < 50 || newAddress !== lastGeocodingResult.current
    
    if (shouldGeocode) {
      console.log('🗺️ STEP 1: Triggering geocoding for:', newAddress)
      geocodeAddress(newAddress)
    } else {
      console.log('⏭️ Skipping geocoding - address seems complete:', newAddress)
    }
    
    // 🔥 QUAN TRỌNG: Luôn validate địa chỉ (với debounce)
    // Điều này đảm bảo validation chạy ngay cả khi geocoding thất bại
    debouncedAddressValidation(newAddress)
  }, [geocodeAddress, debouncedAddressValidation])

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
        
        // 🔥 FIXED: Không auto-fill nếu user đã xóa địa chỉ (để trống)
        if (originalUserInput.length === 0) {
          console.log('🚫 User has cleared address, skipping auto-fill')
          return
        }
        
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

  // Clear geocoding error when address changes
  useEffect(() => {
    if (geocodingError) {
      clearGeocodingError()
    }
  }, [address, geocodingError, clearGeocodingError])

  // Handle service selection (same as registration form)
  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  // Handle vehicle type selection (same as registration form)
  const handleVehicleTypeToggle = (vehicleTypeId: number) => {
    setSelectedVehicleTypes(prev => 
      prev.includes(vehicleTypeId) 
        ? prev.filter(id => id !== vehicleTypeId)
        : [...prev, vehicleTypeId]
    )
  }

  // Handle image upload (same as registration form)
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
        
        // Populate form data (same as registration form)
        setGarageName(garageData.name || "")
        const currentAddress = garageData.address || ""
        setAddress(currentAddress)
        setPhone(garageData.phone || "")
        setEmail(garageData.email || "")
        setDescription(garageData.description || "")
        setOpenTime(garageData.openTime || "08:00")
        setCloseTime(garageData.closeTime || "18:00")
        setLatitude(garageData.latitude || null)
        setLongitude(garageData.longitude || null)
        
        // Set current address as validated to avoid duplicate validation
        if (currentAddress) {
          lastValidatedAddress.current = currentAddress
          lastGeocodingResult.current = currentAddress
          console.log('✅ Loaded garage address, setting as validated:', currentAddress)
        } else {
          // Clear validation cache if no address (bỏ validation trống)
          lastValidatedAddress.current = ""
          lastGeocodingResult.current = ""
          setAddressValidation({
            isValidating: false,
            isTaken: false,
            message: ""
          })
          console.log('✅ No garage address loaded, clearing validation')
        }
        
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
        setError("Cannot load garage information")
        setLoading(false)
      }
    }

    if (garageId) {
      loadGarage()
    }
  }, [garageId])

  // Load services and vehicle types from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load services
        const servicesResponse = await getAllSystemServices()
        setAvailableServices(servicesResponse.data)
        setServicesLoading(false)
        
        // Load vehicle types
        const vehicleTypesResponse = await getAllVehicleTypes()
        setAvailableVehicleTypes(vehicleTypesResponse.data)
        setVehicleTypesLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setServicesLoading(false)
        setVehicleTypesLoading(false)
      }
    }
    
    loadData()
  }, [garageId])

  // Handle form submission (giống hệt form đăng ký)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    // Validation (same as registration form)
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

    // Validate phone number format (10-11 digits)
    const phoneRegex = /^[0-9]{10,11}$/
    if (!phoneRegex.test(phone)) {
      await Swal.fire({
        title: 'Invalid Phone Number!',
        text: 'Phone number must have 10-11 digits.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true
      })
      setError("Phone number must have 10-11 digits.")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      await Swal.fire({
        title: 'Invalid Email!',
        text: 'Please enter a valid email address.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true
      })
      setError("Invalid email format.")
      return
    }

    // Validate name length
    if (garageName.length < 2 || garageName.length > 100) {
      await Swal.fire({
        title: 'Invalid Garage Name!',
        text: 'Garage name must be 2-100 characters.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true
      })
      setError("Garage name must be 2-100 characters.")
      return
    }

    // Validate description length
    if (description.length > 500) {
      await Swal.fire({
        title: 'Description Too Long!',
        text: 'Description cannot exceed 500 characters.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true
      })
      setError("Description cannot exceed 500 characters.")
      return
    }

    // Validate address length
    if (address.length > 255) {
      await Swal.fire({
        title: 'Address Too Long!',
        text: 'Address cannot exceed 255 characters.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true
      })
      setError("Address cannot exceed 255 characters.")
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

    setSubmitting(true)
    setError("")

    try {
      let imageUrl = ""
      
      // Upload image if selected (same as registration form)
      if (image) {
        const imageResponse = await uploadTempGarageImage(image)
        imageUrl = imageResponse.data
      }

      // Prepare update data (same as registration form)
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
      
      // Show SweetAlert success message
      await Swal.fire({
        title: 'Success!',
        text: 'Garage information has been updated successfully! Garage will be sent to admin for re-approval.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: true
      })
      
      // Redirect back to garage detail page after user clicks OK or timer expires
        router.push(`/garage/${garageId}?owner=true`)
      
    } catch (err: any) {
      console.error("Error updating garage:", err)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)
      
      // Show SweetAlert error message
      await Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || "Cannot update garage information",
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true
      })
      
      setError(err.response?.data?.message || "Cannot update garage information")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE", "ADMIN"]}
        title="Edit Garage"
        description="Loading..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading garage information...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE", "ADMIN"]}
      title={`Edit: ${garageName}`}
      description="Update garage information"
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
            <span>Back</span>
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
                <span>Garage Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
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
                      <span>Found and automatically updated: {geocodingResult.display_name}</span>
                    </div>
                  )}
                  
                  {/* Address validation messages */}
                  {addressValidation.isValidating && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600 mt-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Checking address availability...</span>
                </div>
                  )}
                  
                  {addressValidation.message && !addressValidation.isValidating && (
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
                  
                  {addressValidation.isTaken && (
                    <div className="text-xs text-gray-600 mt-1 flex items-center space-x-1">
                      <span>💡</span>
                      <span>Mẹo: Thử thêm số nhà cụ thể hoặc tên đường khác để tránh trùng lặp</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe garage, services, experience..."
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
                <span>Working Hours</span>
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
                <span>Location (GPS)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={latitude || ""}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || null)}
                    placeholder="e.g., 10.8231"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={longitude || ""}
                      onChange={(e) => setLongitude(parseFloat(e.target.value) || null)}
                      placeholder="e.g., 106.6297"
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
                        "Get Current Location"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {latitude && longitude && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Coordinates set: {latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
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
                <span>Vehicle Types Served *</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehicleTypesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Loading vehicle types...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
                    <div className="grid md:grid-cols-2 gap-3">
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
                  </div>
                  {selectedVehicleTypes.length === 0 && (
                    <p className="text-sm text-red-600 mt-2">Please select at least one vehicle type</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Dịch vụ cung cấp */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Services Provided *</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Loading services...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
                    <div className="grid md:grid-cols-2 gap-3">
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
                  </div>
                  {selectedServices.length === 0 && (
                    <p className="text-sm text-red-600 mt-2">Please select at least one service</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Hình ảnh garage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <span>Garage Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Upload garage image for customers to easily identify
                </p>
                {imagePreview && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Image uploaded successfully</span>
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
                    <span>Select Image</span>
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Note */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Note: After updating, your garage will need to be re-approved by admin before it can receive appointments from customers.
            </p>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
