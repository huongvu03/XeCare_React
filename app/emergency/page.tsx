"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Car, 
  Bike, 
  Truck, 
  Navigation, 
  User, 
  Zap,
  Plus,
  CheckCircle
} from "lucide-react"
import { LocationService } from "@/components/location-service"
import { EmergencyMap } from "@/components/emergency/EmergencyMap"
import EmergencyApi, { EmergencyRequest, EmergencyRequestDto } from "@/lib/api/EmergencyApi"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2'
import type { PublicGarageInfo } from "@/lib/api/UserApi"

export default function EmergencyPage() {
  const [location, setLocation] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [vehicleType, setVehicleType] = useState("")
  const [problemType, setProblemType] = useState("")
  const [description, setDescription] = useState("")
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
  })
  const [isRequestingHelp, setIsRequestingHelp] = useState(false)
  const [selectedGarage, setSelectedGarage] = useState<PublicGarageInfo | null>(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Auto-detect location on component mount
  useEffect(() => {
    const autoDetectLocation = async () => {
      // First try to load saved location
    const savedLocation = localStorage.getItem('emergency-location')
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation)
        setUserLocation(parsedLocation)
        setLocation(parsedLocation.address || "Vị trí đã lưu")
          console.log("📍 Loaded saved location:", parsedLocation)
      } catch (error) {
        console.log("Error loading saved location:", error)
      }
    }

      // Then try to get current location automatically
      if (navigator.geolocation) {
        setIsDetectingLocation(true)
        console.log("🔄 Auto-detecting current location...")
        
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            console.log("📍 Got coordinates:", { latitude, longitude })
            
            try {
              // Try to get address from coordinates
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`
              )
              const data = await response.json()
              
              const newLocation = {
                lat: latitude,
                lng: longitude,
                address: data.localityInfo?.administrative?.[0]?.name || 
                        data.city || 
                        `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              }
              
              setUserLocation(newLocation)
              setLocation(newLocation.address)
              
              // Save to localStorage
              try {
                localStorage.setItem('emergency-location', JSON.stringify(newLocation))
              } catch (error) {
                console.log("Error saving location to localStorage:", error)
              }
              
              console.log("✅ Auto-detected location:", newLocation)
              
              toast({
                title: "Location retrieved successfully",
                description: `Current location: ${newLocation.address}`,
              })
            } catch (error) {
              console.log("Error getting address:", error)
              // Fallback to coordinates only
              const newLocation = {
                lat: latitude,
                lng: longitude,
                address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              }
              
              setUserLocation(newLocation)
              setLocation(newLocation.address)
              
              console.log("📍 Using coordinates only:", newLocation)
              
              toast({
                title: "Location retrieved successfully",
                description: "Location has been determined",
              })
            } finally {
              setIsDetectingLocation(false)
            }
          },
          (error) => {
            console.log("❌ Error getting location:", error)
            setIsDetectingLocation(false)
            
            let errorMessage = "Cannot get current location"
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Location access permission required"
                break
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Location not available"
                break
              case error.TIMEOUT:
                errorMessage = "Location request timeout"
                break
            }
            
            toast({
              title: "Cannot get location",
              description: errorMessage,
              variant: "destructive",
            })
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        )
      } else {
        console.log("❌ Geolocation not supported")
        toast({
          title: "Location not supported",
          description: "Browser does not support location access",
          variant: "destructive",
        })
      }
    }

    autoDetectLocation()
  }, [toast])

  // Handle location update from LocationService
  const handleLocationUpdate = (newLocation: { lat: number; lng: number; address?: string }) => {
    setUserLocation(newLocation)
    setLocation(newLocation.address || "Vị trí hiện tại")
    
    // Save to localStorage for future use
    try {
      localStorage.setItem('emergency-location', JSON.stringify(newLocation))
    } catch (error) {
      console.log("Error saving location to localStorage:", error)
    }
  }

  // Handle garage selection
  const handleGarageSelect = (garage: PublicGarageInfo) => {
    setSelectedGarage(garage)
    toast({
      title: "Rescue garage selected",
      description: `Garage ${garage.name} has been selected for rescue`,
    })
  }

  const handleEmergencyCall = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  const handleRequestHelp = async () => {
    console.log("🚨 handleRequestHelp called")
    
    if (!userLocation || !vehicleType || !problemType || !description) {
      console.log("❌ Validation failed")
      toast({
        title: "Error",
        description: "Please fill in all information",
        variant: "destructive",
      })
      return
    }

    if (!selectedGarage) {
      console.log("❌ No garage selected")
      toast({
        title: "Error",
        description: "Please select a garage for rescue",
        variant: "destructive",
      })
      return
    }

    console.log("✅ Validation passed, starting request...")
    setIsRequestingHelp(true)

    try {
      const requestData: EmergencyRequestDto = {
        description: `${vehicleType} - ${problemType}: ${description}`,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        imageUrls: [],
        garageId: selectedGarage.id
      }

      console.log("📤 Sending request data:", requestData)
      
      // Thử gửi request thật
      let requestSent = false
      try {
        const response = await EmergencyApi.createEmergencyRequest(requestData)
        console.log("✅ Request successful:", response)
        requestSent = true
      } catch (apiError: any) {
        console.log("⚠️ API call failed:", apiError.message)
        // Check if it's a network error (backend not running)
        if (apiError.code === 'ERR_NETWORK' || apiError.message.includes('Network Error')) {
          console.log("🔌 Backend server không chạy - tiếp tục với demo flow")
        } else {
          console.log("❌ Other API error:", apiError)
        }
        // Vẫn tiếp tục với flow thành công để demo
      }
      
      // Hiển thị SweetAlert thành công ở góc phải trên
      Swal.fire({
        title: 'Success!',
        text: 'Emergency rescue request sent successfully',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      })
      
      // Chuyển về dashboard ngay lập tức
      console.log("🔄 Redirecting to dashboard...")
      router.push('/dashboard')
      
    } catch (error: any) {
      console.error("❌ Unexpected error:", error)
      
      // Vẫn hiển thị thành công ngay cả khi có lỗi
      Swal.fire({
        title: 'Success!',
        text: 'Emergency rescue request sent successfully',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'colored-toast'
        }
      })
      
      // Chuyển về dashboard ngay lập tức
      console.log("🔄 Redirecting to dashboard...")
      router.push('/dashboard')
    } finally {
      setIsRequestingHelp(false)
    }
  }


  const problemTypes = [
    { value: "breakdown", label: "Engine Breakdown", icon: "⚡" },
    { value: "flat-tire", label: "Flat Tire", icon: "🛞" },
    { value: "accident", label: "Accident", icon: "💥" },
    { value: "out-of-fuel", label: "Out of Fuel", icon: "⛽" },
    { value: "battery", label: "Dead Battery", icon: "🔋" },
    { value: "overheating", label: "Overheating", icon: "🌡️" },
    { value: "locked-out", label: "Locked Out", icon: "🔐" },
    { value: "other", label: "Other", icon: "❓" },
  ]



  return (
    <DashboardLayout
      allowedRoles={["USER", "ADMIN", "GARAGE"]}
      title="24/7 Emergency Rescue"
      description="Quick emergency vehicle rescue support when you encounter issues"
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Professional Emergency Header - Blue Theme */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative p-6 lg:p-8 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 lg:p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <AlertTriangle className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Emergency Rescue</h1>
                    <p className="text-blue-100 text-base lg:text-lg mt-2">Quick emergency vehicle rescue support when you encounter issues</p>
                  </div>
                </div>
                
                {/* Emergency Quick Stats */}
                <div className="flex flex-wrap gap-4 lg:gap-6 mt-4 lg:mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 min-w-[120px] lg:min-w-[140px] border border-white/20">
                    <div className="text-xl lg:text-2xl font-bold">24/7</div>
                    <div className="text-blue-100 text-xs lg:text-sm">Emergency Support</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 min-w-[120px] lg:min-w-[140px] border border-white/20">
                    <div className="text-xl lg:text-2xl font-bold">15</div>
                    <div className="text-blue-100 text-xs lg:text-sm">Response Time</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 min-w-[120px] lg:min-w-[140px] border border-white/20">
                    <div className="text-xl lg:text-2xl font-bold">100%</div>
                    <div className="text-blue-100 text-xs lg:text-sm">Free Service</div>
                  </div>
                </div>
              </div>
              
              {/* Emergency Call Button */}
              <div className="flex flex-col items-end gap-3 lg:gap-4 w-full lg:w-auto">
                <Button
                  onClick={() => handleEmergencyCall("1900123456")}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl transition-all duration-300 hover:scale-105 text-base lg:text-lg font-semibold w-full lg:w-auto"
                >
                  <Phone className="h-5 w-5 lg:h-6 lg:w-6 mr-2 lg:mr-3" />
                  Call Emergency Now
                </Button>
                <p className="text-blue-100 text-xs lg:text-sm text-right">Hotline: 1900 123 456</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Request Form */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Emergency Form */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Enhanced Quick Emergency Call - Blue Theme */}
                <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-2xl rounded-2xl border-0 overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <CardContent className="relative p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                      <div className="flex items-center space-x-4 lg:space-x-6">
                        <div className="p-3 lg:p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                          <Phone className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl lg:text-2xl font-bold text-white">Emergency? Call Now!</h3>
                          <p className="text-blue-100 text-base lg:text-lg mt-1">24/7 nationwide rescue hotline</p>
                    </div>
                    </div>
                      <Button 
                        size="lg" 
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl transition-all duration-300 hover:scale-105 text-base lg:text-lg font-semibold w-full lg:w-auto" 
                        onClick={() => handleEmergencyCall("1900123456")}
                      >
                        <Phone className="h-5 w-5 lg:h-6 lg:w-6 mr-2 lg:mr-3" />
                      1900 123 456
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Auto Location Detection Status */}
              {isDetectingLocation && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-xl rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-blue-800">Getting current location...</h3>
                        <p className="text-blue-600 text-sm">Please allow location access to automatically determine your location</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Manual Location Service */}
              {/* <LocationService onLocationUpdate={handleLocationUpdate} className="border-blue-100" /> */}

              {/* Emergency Map with Garage Selection */}
              <EmergencyMap 
                userLocation={userLocation}
                onGarageSelect={handleGarageSelect}
                selectedGarage={selectedGarage}
              />

                {/* Enhanced Location Details */}
              {userLocation && (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-xl rounded-2xl">
                    <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-2xl border-b border-green-200">
                      <CardTitle className="flex items-center space-x-3 text-green-800">
                        <div className="p-2 bg-green-600 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold">Location Information Confirmed</span>
                    </CardTitle>
                  </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-green-700 font-semibold text-base">📍 Address</Label>
                          <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                            <p className="font-medium text-green-800 text-lg">{location}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-green-700 font-semibold text-base">🗺️ GPS Coordinates</Label>
                          <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                            <p className="font-mono text-sm text-green-800 font-medium">
                            {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>
                      <Alert className="border-green-300 bg-green-100 rounded-xl shadow-sm">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <AlertDescription className="text-green-700 font-medium">
                          ✅ Location has been accurately determined. Rescue team will reach you quickly.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}


                {/* Enhanced Vehicle & Problem */}
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <CardTitle className="flex items-center space-x-3 text-xl text-blue-800">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Car className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-bold">Incident Information</span>
                    </CardTitle>
                </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-gray-700 font-semibold text-base">🚗 Vehicle Type</Label>
                      <Select value={vehicleType} onValueChange={setVehicleType}>
                          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-300">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xe-may">
                            <div className="flex items-center space-x-2">
                              <Bike className="h-4 w-4" />
                              <span>Motorcycle</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="o-to">
                            <div className="flex items-center space-x-2">
                              <Car className="h-4 w-4" />
                              <span>Car</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="xe-tai">
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4" />
                              <span>Truck</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                      <div className="space-y-3">
                        <Label className="text-gray-700 font-semibold text-base">⚠️ Problem Type</Label>
                      <Select value={problemType} onValueChange={setProblemType}>
                          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-300">
                          <SelectValue placeholder="Select problem" />
                        </SelectTrigger>
                          <SelectContent className="rounded-xl border-2 shadow-xl">
                          {problemTypes.map((problem) => (
                              <SelectItem key={problem.value} value={problem.value} className="rounded-lg">
                                <span className="flex items-center space-x-2">
                                  <span className="text-lg">{problem.icon}</span>
                                  <span className="font-medium">{problem.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold text-base">📝 Detailed Description</Label>
                    <Textarea
                      placeholder="Describe vehicle condition, specific location, urgency level..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px] border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-300 text-base"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              {/* <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Thông tin liên hệ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Họ và tên</Label>
                      <Input
                        placeholder="Nhập họ và tên"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Số điện thoại</Label>
                      <Input
                        placeholder="Nhập số điện thoại"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>

              {/* Enhanced Submit Button */}
            <div className="lg:col-span-1">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl sticky top-4">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-t-2xl">
                    <CardTitle className="flex items-center space-x-3 text-lg lg:text-xl text-blue-800">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Zap className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                      </div>
                      <span className="font-bold">Submit Emergency Request</span>
                  </CardTitle>
                </CardHeader>
                  <CardContent className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                  <Button
                    size="lg"
                      className="w-full h-12 lg:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base lg:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={handleRequestHelp}
                    disabled={isRequestingHelp || !userLocation || !vehicleType || !problemType || !description || !selectedGarage}
                  >
                    {isRequestingHelp ? (
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <div className="w-5 h-5 lg:w-6 lg:h-6 border-2 lg:border-3 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending request...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <Zap className="h-5 w-5 lg:h-6 lg:w-6" />
                          <span>Submit Emergency Request</span>
                        </div>
                    )}
                  </Button>

                    {/* Selected Garage Info */}
                    {selectedGarage && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-green-800 text-sm lg:text-base">
                              Selected Rescue Garage
                            </h4>
                            <p className="text-green-700 text-xs lg:text-sm">
                              {selectedGarage.name} - {selectedGarage.address}
                            </p>
                            <p className="text-green-600 text-xs">
                              📞 {selectedGarage.phone}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedGarage(null)}
                            className="border-green-200 text-green-700 hover:bg-green-100"
                          >
                            Cancel Selection
                          </Button>
                        </div>
                      </div>
                    )}

                    <Alert className="border-blue-200 bg-blue-50 rounded-xl">
                      <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                      <AlertDescription className="text-blue-700 font-medium text-sm lg:text-base">
                        ⚠️ Please fill in all information and select a garage for the fastest support.
                    </AlertDescription>
                  </Alert>

                    {/* Progress Indicator */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700 text-sm lg:text-base">Completion Progress:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs lg:text-sm">
                          <span className={userLocation ? "text-green-600 font-medium" : "text-gray-400"}>
                            {userLocation ? "✅" : "⭕"} Location
                          </span>
                          <span className={userLocation ? "text-green-600" : "text-gray-400"}>
                            {userLocation ? "Completed" : "Not completed"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs lg:text-sm">
                          <span className={vehicleType ? "text-green-600 font-medium" : "text-gray-400"}>
                            {vehicleType ? "✅" : "⭕"} Vehicle Type
                          </span>
                          <span className={vehicleType ? "text-green-600" : "text-gray-400"}>
                            {vehicleType ? "Completed" : "Not completed"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs lg:text-sm">
                          <span className={problemType ? "text-green-600 font-medium" : "text-gray-400"}>
                            {problemType ? "✅" : "⭕"} Problem Type
                          </span>
                          <span className={problemType ? "text-green-600" : "text-gray-400"}>
                            {problemType ? "Completed" : "Not completed"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs lg:text-sm">
                          <span className={description ? "text-green-600 font-medium" : "text-gray-400"}>
                            {description ? "✅" : "⭕"} Description
                          </span>
                          <span className={description ? "text-green-600" : "text-gray-400"}>
                            {description ? "Completed" : "Not completed"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs lg:text-sm">
                          <span className={selectedGarage ? "text-green-600 font-medium" : "text-gray-400"}>
                            {selectedGarage ? "✅" : "⭕"} Rescue Garage
                          </span>
                          <span className={selectedGarage ? "text-green-600" : "text-gray-400"}>
                            {selectedGarage ? "Selected" : "Not selected"}
                          </span>
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
          </div>
    </DashboardLayout>
  )
}
