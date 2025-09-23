"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft,
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  Car, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  MessageSquare,
  Star,
  Navigation,
  RefreshCw,
  Route,
  Timer,
  Map
} from "lucide-react"
import { EmergencyStatusTracker } from "@/components/emergency/EmergencyStatusTracker"
import EmergencyApi, { EmergencyRequest, EmergencyQuote } from "@/lib/api/EmergencyApi"
import { useToast } from "@/hooks/use-toast"

export default function EmergencyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [request, setRequest] = useState<EmergencyRequest | null>(null)
  const [quotes, setQuotes] = useState<EmergencyQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [routeInfo, setRouteInfo] = useState<{
    distance: string
    duration: string
    status: 'loading' | 'loaded' | 'error'
  }>({
    distance: '',
    duration: '',
    status: 'loading'
  })

  const [carProgress, setCarProgress] = useState<{
    progress: number // 0-100
    status: 'preparing' | 'traveling' | 'arrived'
    currentLocation: string
    remainingTime: number // thời gian còn lại (giây)
    estimatedTotalTime: number // tổng thời gian dự tính (giây)
    currentSpeed: number // tốc độ hiện tại (km/h)
    distance: number // khoảng cách (km)
  }>({
    progress: 0,
    status: 'preparing',
    currentLocation: 'Garage',
    remainingTime: 0,
    estimatedTotalTime: 0,
    currentSpeed: 0,
    distance: 0
  })

  // Refs để lưu trữ interval IDs
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const preparingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (params.id) {
      loadRequestDetails(Number(params.id))
    }
  }, [params.id])

  useEffect(() => {
    if (request && request.garage) {
      calculateRoute()
    }
  }, [request])

  // Bắt đầu animation sau khi đã tính toán xong route info và status là ACCEPTED
  useEffect(() => {
    if (routeInfo.status === 'loaded' && request && (request.status as string) === 'ACCEPTED') {
      startCarAnimation()
    }
  }, [routeInfo.status, request?.status])

  // Cleanup intervals khi component unmount
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
      if (preparingIntervalRef.current) {
        clearInterval(preparingIntervalRef.current)
      }
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current)
      }
    }
  }, [])

  // Hàm cleanup để dừng tất cả animations
  const stopAllAnimations = () => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current)
      animationIntervalRef.current = null
    }
    if (preparingIntervalRef.current) {
      clearInterval(preparingIntervalRef.current)
      preparingIntervalRef.current = null
    }
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current)
      cleanupTimeoutRef.current = null
    }
  }

  // Hàm để bắt đầu animation xe di chuyển dựa theo thời gian dự tính thực tế
  const startCarAnimation = () => {
    if (!request) return

    // Dừng tất cả animations hiện tại
    stopAllAnimations()

    // Lấy thời gian dự tính từ routeInfo hoặc tính toán
    let estimatedTimeMinutes = 25 // Default fallback
    
    if (routeInfo.duration) {
      // Parse thời gian từ string "25 phút" thành số
      const timeMatch = routeInfo.duration.match(/(\d+)/)
      if (timeMatch) {
        estimatedTimeMinutes = parseInt(timeMatch[1])
      }
    }

    const estimatedTotalSeconds = estimatedTimeMinutes * 60
    // Animation chỉ mất 1/3 thời gian thực tế
    const animationDurationSeconds = estimatedTotalSeconds / 3
    const startTime = Date.now()

    // Lấy khoảng cách từ routeInfo
    let distanceKm = 5 // Default fallback
    if (routeInfo.distance) {
      const distanceMatch = routeInfo.distance.match(/(\d+(?:\.\d+)?)/)
      if (distanceMatch) {
        distanceKm = parseFloat(distanceMatch[1])
      }
    }

    // Reset progress với thời gian animation (1/2 thời gian thực tế)
    setCarProgress({
      progress: 0,
      status: 'preparing',
      currentLocation: 'Garage',
      remainingTime: animationDurationSeconds,
      estimatedTotalTime: animationDurationSeconds,
      currentSpeed: 0,
      distance: distanceKm
    })

    // Phase 1: Chuẩn bị (10% thời gian animation)
    const preparingTime = Math.max(1000, animationDurationSeconds * 1000 * 0.1) // ít nhất 1 giây
    
    // Countdown timer cho phase chuẩn bị
    preparingIntervalRef.current = setInterval(() => {
      setCarProgress(prev => {
        const newRemaining = Math.max(0, prev.estimatedTotalTime - (Date.now() - startTime) / 1000)
        return {
          ...prev,
          remainingTime: Math.round(newRemaining)
        }
      })
    }, 1000)
    
    setTimeout(() => {
      if (preparingIntervalRef.current) {
        clearInterval(preparingIntervalRef.current)
        preparingIntervalRef.current = null
      }
      setCarProgress(prev => ({
        ...prev,
        status: 'traveling',
        currentLocation: 'Đang rời garage'
      }))
    }, preparingTime)

    // Phase 2: Di chuyển (90% thời gian animation)
    const travelingTime = animationDurationSeconds * 1000 * 0.9 // 90% thời gian animation
    const interval = 100 // Update mỗi 100ms
    const totalSteps = travelingTime / interval
    let currentStep = 0

    animationIntervalRef.current = setInterval(() => {
      currentStep++
      const progress = Math.min((currentStep / totalSteps) * 100, 100)
      
      // Tính thời gian còn lại dựa trên progress
      const elapsedSeconds = (Date.now() - startTime) / 1000
      const remainingSeconds = Math.max(0, animationDurationSeconds - elapsedSeconds)
      
      // Tính tốc độ hiện tại dựa trên progress và khoảng cách
      let currentSpeed = 0
      if (progress > 0 && elapsedSeconds > 0) {
        const distanceTraveled = (progress / 100) * distanceKm
        const speedKmh = (distanceTraveled / elapsedSeconds) * 3600 // km/h
        // Đảm bảo tốc độ tối thiểu 50km/h khi đang di chuyển
        currentSpeed = Math.max(50, Math.round(speedKmh))
      }
      
      setCarProgress(prev => ({
        ...prev,
        progress: progress,
        remainingTime: Math.round(remainingSeconds),
        currentSpeed: currentSpeed
      }))

      // Update location based on progress với timing hợp lý
      let location = 'Đang di chuyển'
      if (progress < 15) {
        location = 'Đang rời garage'
      } else if (progress < 35) {
        location = 'Trên đường chính'
      } else if (progress < 60) {
        location = 'Tiếp tục hành trình'
      } else if (progress < 80) {
        location = 'Gần đến khu vực'
      } else if (progress < 95) {
        location = 'Sắp đến vị trí sự cố'
      } else if (progress >= 100) {
        location = 'Đã đến vị trí sự cố'
        setCarProgress(prev => ({
          ...prev,
          status: 'arrived',
          remainingTime: 0,
          currentSpeed: 0
        }))
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current)
          animationIntervalRef.current = null
        }
      }

      if (progress < 100) {
        setCarProgress(prev => ({
          ...prev,
          currentLocation: location
        }))
      }
    }, interval)

    // Auto cleanup sau khi hoàn thành
    cleanupTimeoutRef.current = setTimeout(() => {
      stopAllAnimations()
    }, preparingTime + travelingTime + 1000)
  }

  const loadRequestDetails = async (requestId: number) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Loading request details for ID:', requestId)
      
      // Try to load real data from API
      const requestResponse = await EmergencyApi.getRequestById(requestId)
      console.log('✅ Request data loaded:', requestResponse.data)
      
      if (requestResponse.data) {
        setRequest(requestResponse.data)
        console.log('📋 Set request:', requestResponse.data.description)
        
        // Try to load quotes
        try {
          const quotesResponse = await EmergencyApi.getQuotes(requestId)
          setQuotes(quotesResponse.data || [])
          console.log('💰 Quotes loaded:', quotesResponse.data?.length || 0)
        } catch (quotesError) {
          console.log('⚠️ No quotes found for request:', requestId)
          setQuotes([])
        }
      } else {
        throw new Error('No data received from API')
      }
      
    } catch (error: any) {
      console.error("❌ Error loading request details:", error)
      
      if (error.response?.status === 404) {
        setError("Không tìm thấy yêu cầu cứu hộ này")
      } else if (error.code === 'ERR_NETWORK') {
        setError("Không thể kết nối tới server backend")
      } else {
        setError("Không thể tải chi tiết yêu cầu cứu hộ")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptQuote = async (quoteId: number) => {
    try {
      const response = await EmergencyApi.acceptQuote(quoteId)
      
      // Update local state
      setQuotes(prev => prev.map(quote => 
        quote.id === quoteId 
          ? { ...quote, accepted: true }
          : quote
      ))
      
      if (request) {
        setRequest(prev => prev ? { ...prev, status: 'ACCEPTED' } : null)
      }
      
      toast({
        title: "Thành công",
        description: "Đã chấp nhận báo giá",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể chấp nhận báo giá. Đang sử dụng chế độ demo.",
        variant: "destructive",
      })
      
      // Mock success for demo
      setQuotes(prev => prev.map(quote => 
        quote.id === quoteId 
          ? { ...quote, accepted: true }
          : quote
      ))
      
      if (request) {
        setRequest(prev => prev ? { ...prev, status: 'ACCEPTED' } : null)
      }
      
      setTimeout(() => {
        toast({
          title: "Demo Success",
          description: "Báo giá đã được chấp nhận (demo mode)",
        })
      }, 1000)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VNĐ'
  }

  const calculateRoute = async () => {
    if (!request) {
      setRouteInfo({
        distance: 'N/A',
        duration: 'N/A',
        status: 'error'
      })
      return
    }

    try {
      setRouteInfo(prev => ({ ...prev, status: 'loading' }))

      // Nếu garage có tọa độ, sử dụng để tính khoảng cách chính xác
      if (request.garage && request.garage.latitude && request.garage.longitude) {
        const origin = `${request.garage.latitude},${request.garage.longitude}`
        const destination = `${request.latitude},${request.longitude}`
        
        // Trong thực tế, sử dụng Google Maps Distance Matrix API
        // Đây là demo với mock data dựa trên tọa độ thực
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Tính khoảng cách thô dựa trên tọa độ (Haversine formula simplified)
        const distance = calculateDistance(
          request.garage.latitude, request.garage.longitude,
          request.latitude, request.longitude
        )
        
        // Ước tính thời gian dựa trên khoảng cách (giả sử tốc độ trung bình 30km/h trong thành phố)
        const estimatedTime = Math.round((distance / 30) * 60) // phút
        
        setRouteInfo({
          distance: `${distance.toFixed(1)} km`,
          duration: `${estimatedTime} phút`,
          status: 'loaded'
        })
      } else {
        // Nếu không có tọa độ garage, sử dụng mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockDistance = Math.floor(Math.random() * 20) + 5 // 5-25 km
        const mockDuration = Math.floor(Math.random() * 30) + 10 // 10-40 phút
        
        setRouteInfo({
          distance: `${mockDistance} km`,
          duration: `${mockDuration} phút`,
          status: 'loaded'
        })
      }

    } catch (error) {
      console.error('Error calculating route:', error)
      setRouteInfo(prev => ({ ...prev, status: 'error' }))
    }
  }

  // Hàm tính khoảng cách giữa hai điểm (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const openGoogleMapsNavigation = () => {
    if (!request) {
      toast({
        title: "Lỗi",
        description: "Không thể lấy thông tin yêu cầu",
        variant: "destructive",
      })
      return
    }

    // Nếu có tọa độ garage, sử dụng tọa độ chính xác
    if (request.garage && request.garage.latitude && request.garage.longitude) {
      const origin = `${request.garage.latitude},${request.garage.longitude}`
      const destination = `${request.latitude},${request.longitude}`
      const url = `https://www.google.com/maps/dir/${origin}/${destination}`
      window.open(url, '_blank')
    } else if (request.garage && request.garage.address) {
      // Nếu không có tọa độ nhưng có địa chỉ, sử dụng địa chỉ
      const origin = encodeURIComponent(request.garage.address)
      const destination = `${request.latitude},${request.longitude}`
      const url = `https://www.google.com/maps/dir/${origin}/${destination}`
      window.open(url, '_blank')
    } else {
      toast({
        title: "Lỗi",
        description: "Không thể lấy thông tin vị trí garage",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "ADMIN", "GARAGE"]}
        title="Chi tiết yêu cầu cứu hộ"
        description="Xem chi tiết và quản lý yêu cầu cứu hộ"
      >
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg font-semibold text-gray-700">Đang tải chi tiết...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !request) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "ADMIN", "GARAGE"]}
        title="Chi tiết yêu cầu cứu hộ"
        description="Xem chi tiết và quản lý yêu cầu cứu hộ"
      >
        <div className="space-y-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || "Không tìm thấy yêu cầu cứu hộ"}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "ADMIN", "GARAGE"]}
      title={`Yêu cầu cứu hộ #${request.id}`}
      description="Chi tiết yêu cầu cứu hộ và báo giá"
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-6 lg:py-8 space-y-6 lg:space-y-8">
          {/* Professional Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Quay lại</span>
                </Button>
                
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                    #{request.id}
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Yêu cầu cứu hộ</h1>
                    <p className="text-sm text-gray-600">Chi tiết và quản lý yêu cầu</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => loadRequestDetails(request.id)}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Làm mới</span>
                </Button>
                
                <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">Trạng thái: {request.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
            <EmergencyStatusTracker 
              request={request}
              onRefresh={() => loadRequestDetails(request.id)}
            />
          </div>

          {/* Enhanced Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <Tabs defaultValue="details" className="w-full">
              <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-b border-gray-200">
                <TabsList className="bg-transparent border-0 h-auto p-4 lg:p-6">
                  <TabsTrigger 
                    value="details" 
                    className="flex items-center gap-2 bg-white/90 hover:bg-white border border-gray-200 rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-indigo-300 data-[state=active]:text-indigo-700 transition-all duration-200"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-medium">Chi tiết yêu cầu</span>
                  </TabsTrigger>
                  {/* <TabsTrigger 
                    value="quotes" 
                    className="flex items-center gap-2 bg-white/90 hover:bg-white border border-gray-200 rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-indigo-300 data-[state=active]:text-indigo-700 transition-all duration-200"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Báo giá</span>
                  </TabsTrigger> */}
                  <TabsTrigger 
                    value="location" 
                    className="flex items-center gap-2 bg-white/90 hover:bg-white border border-gray-200 rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-indigo-300 data-[state=active]:text-indigo-700 transition-all duration-200"
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Vị trí sự cố</span>
                  </TabsTrigger>
                  {(request.status as string) === 'ACCEPTED' && (
                    <TabsTrigger 
                      value="route" 
                      className="flex items-center gap-2 bg-white/90 hover:bg-white border border-gray-200 rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border-indigo-300 data-[state=active]:text-indigo-700 transition-all duration-200"
                    >
                      <Route className="h-4 w-4" />
                      <span className="font-medium">Hành trình</span>
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <TabsContent value="details" className="p-6 lg:p-8">
                <div className="space-y-8">
                  <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Enhanced Request Info */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Thông tin khách hàng</h3>
                          <p className="text-sm text-gray-600">Chi tiết người yêu cầu cứu hộ</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Tên khách hàng</p>
                              <p className="text-lg font-semibold text-gray-900">{request.user?.name || 'Chưa có thông tin'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 border border-green-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Phone className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                              <p className="text-lg font-semibold text-gray-900">{request.user?.phone || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Thời gian tạo</p>
                              <p className="text-lg font-semibold text-gray-900">{formatDate(request.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Problem Description */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Mô tả sự cố</h3>
                          <p className="text-sm text-gray-600">Chi tiết về tình trạng xe và sự cố</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-6 border border-orange-100">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</p>
                            <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
                              {request.description || 'Không có mô tả chi tiết về sự cố'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Vị trí sự cố</p>
                            <p className="text-sm font-mono text-gray-600 bg-blue-50 px-3 py-1 rounded-lg">
                              {request.latitude?.toFixed(6)}, {request.longitude?.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Garage Info */}
                  {request.garage && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <Car className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Garage phụ trách</h3>
                          <p className="text-sm text-gray-600">Thông tin garage cứu hộ</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-6 border border-purple-100">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Car className="h-4 w-4 text-purple-600" />
                              </div>
                              <p className="text-sm font-medium text-gray-700">Tên garage</p>
                            </div>
                            <p className="text-lg font-bold text-purple-800">{request.garage.name}</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <Phone className="h-4 w-4 text-green-600" />
                              </div>
                              <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                            </div>
                            <p className="text-lg font-bold text-green-800">{request.garage.phone}</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 md:col-span-1 lg:col-span-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-blue-600" />
                              </div>
                              <p className="text-sm font-medium text-gray-700">Địa chỉ</p>
                            </div>
                            <p className="text-sm font-bold text-blue-800 leading-relaxed">{request.garage.address}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Button
                            onClick={() => window.open(`tel:${request.garage?.phone}`)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Gọi garage ngay
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const url = `https://www.google.com/maps/search/?api=1&query=${request.garage?.address}`
                              window.open(url, '_blank')
                            }}
                            className="border-purple-300 text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-xl transition-all duration-200"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Xem vị trí garage
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="quotes" className="p-6 lg:p-8">
                {quotes.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200 p-8 lg:p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-3">Chưa có báo giá</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Các garage sẽ gửi báo giá sớm nhất có thể. Vui lòng chờ đợi hoặc liên hệ trực tiếp với garage.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {quotes.map((quote) => (
                      <div 
                        key={quote.id} 
                        className={`bg-gradient-to-br rounded-2xl border p-6 lg:p-8 transition-all duration-200 ${
                          quote.accepted 
                            ? 'from-green-50 to-emerald-50 border-green-200 ring-2 ring-green-500/20' 
                            : 'from-white to-gray-50 border-gray-200 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                <Car className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">{quote.garage.name}</h3>
                                <p className="text-sm text-gray-600">{quote.garage.address}</p>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
                              <p className="text-sm font-medium text-gray-700 mb-2">Mô tả dịch vụ:</p>
                              <p className="text-gray-800">{quote.message}</p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{quote.garage.phone}</span>
                            </div>
                          </div>
                          
                          <div className="lg:text-right">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 mb-4">
                              <p className="text-3xl font-bold text-green-700 mb-1">
                                {formatPrice(quote.price)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(quote.createdAt)}
                              </p>
                            </div>
                            
                            {quote.accepted && (
                              <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-medium mb-4">
                                <CheckCircle className="h-4 w-4" />
                                Đã chấp nhận
                              </div>
                            )}
                            
                            {!quote.accepted && request.status === 'QUOTED' && (
                              <div className="flex flex-col gap-3">
                                <Button
                                  onClick={() => handleAcceptQuote(quote.id)}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Chấp nhận báo giá
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => window.open(`tel:${quote.garage.phone}`)}
                                  className="border-purple-300 text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-xl transition-all duration-200"
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Liên hệ garage
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="location" className="p-6 lg:p-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Vị trí sự cố</h3>
                      <p className="text-sm text-gray-600">Tọa độ và bản đồ vị trí xảy ra sự cố</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border border-green-100">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-700">Vĩ độ (Latitude)</p>
                        </div>
                        <p className="text-xl font-mono font-bold text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-200">
                          {request.latitude.toFixed(6)}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-purple-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-700">Kinh độ (Longitude)</p>
                        </div>
                        <p className="text-xl font-mono font-bold text-purple-800 bg-purple-50 p-3 rounded-lg border border-purple-200">
                          {request.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => {
                          const url = `https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`
                          window.open(url, '_blank')
                        }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Xem trên Google Maps
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${request.latitude}, ${request.longitude}`)
                          toast({
                            title: "Đã sao chép",
                            description: "Tọa độ đã được sao chép vào clipboard",
                          })
                        }}
                        className="border-green-300 text-green-700 hover:bg-green-50 px-6 py-3 rounded-xl transition-all duration-200"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Sao chép tọa độ
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {request.status === 'ACCEPTED' && (
                <TabsContent value="route" className="p-6 lg:p-8">
                <div className="space-y-6">
                  {/* Route Information Header */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Route className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Hành trình cứu hộ</h3>
                        <p className="text-sm text-gray-600">Thông tin khoảng cách và thời gian từ garage đến vị trí sự cố</p>
                      </div>
                    </div>
                    
                    {routeInfo.status === 'loading' && (
                      <div className="bg-white rounded-xl p-6 border border-blue-100">
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-lg font-semibold text-gray-700">Đang tính toán hành trình...</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {routeInfo.status === 'loaded' && (
                      <div className="bg-white rounded-xl p-6 border border-blue-100">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Route className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Khoảng cách</p>
                                <p className="text-2xl font-bold text-green-700">{routeInfo.distance}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Timer className="h-5 w-5 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Thời gian dự tính</p>
                                <p className="text-2xl font-bold text-orange-700">{routeInfo.duration}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Animated Route Timeline */}
                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100 mb-6">
                          <div className="flex items-start gap-4">
                            {/* Timeline với animation */}
                            <div className="flex flex-col items-center relative">
                              {/* Garage (Start Point) */}
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                                <Car className="h-6 w-6 text-white" />
                              </div>
                              
                              {/* Progress Line */}
                              <div className="w-1 h-32 bg-gray-200 my-4 relative">
                                <div 
                                  className="w-full bg-gradient-to-b from-blue-500 to-green-500 transition-all duration-300 ease-out"
                                  style={{ height: `${carProgress.progress}%` }}
                                ></div>
                                
                                {/* Animated Car Icon */}
                                <div 
                                  className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-out"
                                  style={{ top: `${Math.max(0, carProgress.progress - 2)}%` }}
                                >
                                  <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-500 ${
                                    carProgress.status === 'traveling' ? 'animate-car-move animate-progress-glow' : 'animate-pulse'
                                  }`}>
                                    <Car className="h-4 w-4 text-blue-600" />
                                  </div>
                                </div>
                              </div>
                              
                              {/* Emergency Location (End Point) */}
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                                carProgress.status === 'arrived' 
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 scale-110 animate-status-pulse' 
                                  : 'bg-gray-300'
                              }`}>
                                <AlertTriangle className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              {/* Start Point Info */}
                              <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  <p className="text-sm font-medium text-gray-700">Điểm xuất phát</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">{request.garage?.name}</p>
                                <p className="text-sm text-gray-600">{request.garage?.address}</p>
                              </div>
                              
                              {/* Progress Info */}
                              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-sm font-medium text-gray-700">Tiến độ di chuyển</p>
                                  <span className="text-sm font-bold text-blue-600">{Math.round(carProgress.progress)}%</span>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden animate-route-flow"
                                    style={{ width: `${carProgress.progress}%` }}
                                  >
                                    <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                                  </div>
                                </div>
                                
                                {/* Status */}
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    carProgress.status === 'preparing' ? 'bg-yellow-500 animate-pulse' :
                                    carProgress.status === 'traveling' ? 'bg-blue-500 animate-pulse' :
                                    'bg-green-500'
                                  }`}></div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {carProgress.status === 'preparing' ? 'Đang chuẩn bị' :
                                     carProgress.status === 'traveling' ? 'Đang di chuyển' :
                                     'Đã đến nơi'}
                                  </span>
                                </div>
                                
                                <p className="text-xs text-gray-500 mt-2">{carProgress.currentLocation}</p>
                                
                                {/* Thông tin di chuyển */}
                                <div className="mt-3 space-y-2">
                                  {/* Thời gian còn lại */}
                                  {carProgress.status !== 'arrived' && carProgress.remainingTime > 0 && (
                                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-blue-700">Thời gian còn lại:</span>
                                        <span className="text-sm font-bold text-blue-800">
                                          {Math.floor(carProgress.remainingTime / 60)}:{(carProgress.remainingTime % 60).toString().padStart(2, '0')}
                                        </span>
                                      </div>
                                      <div className="mt-1 text-xs text-blue-600">
                                        Ước tính {routeInfo.duration} từ garage
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Tốc độ hiện tại */}
                                  {carProgress.status === 'traveling' && carProgress.currentSpeed > 0 && (
                                    <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-green-700">Tốc độ hiện tại:</span>
                                        <span className="text-sm font-bold text-green-800">
                                          {carProgress.currentSpeed} km/h
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Khoảng cách */}
                                  {carProgress.distance > 0 && (
                                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-700">Khoảng cách:</span>
                                        <span className="text-sm font-bold text-gray-800">
                                          {carProgress.distance} km
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {carProgress.status === 'arrived' && (
                                  <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                      <span className="text-sm font-medium text-green-700">Đã đến vị trí sự cố!</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Route Info */}
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">Thông tin hành trình</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Khoảng cách: </span>
                                    <span className="font-semibold text-green-600">{routeInfo.distance}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Thời gian: </span>
                                    <span className="font-semibold text-orange-600">{routeInfo.duration}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* End Point Info */}
                              <div className="mt-6">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    carProgress.status === 'arrived' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                                  }`}></div>
                                  <p className="text-sm font-medium text-gray-700">Điểm đến</p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">Vị trí sự cố</p>
                                <p className="text-sm text-gray-600">
                                  Tọa độ: {request.latitude?.toFixed(6)}, {request.longitude?.toFixed(6)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={openGoogleMapsNavigation}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Mở Google Maps
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => {
                              const text = `Hành trình từ ${request.garage?.name} đến vị trí sự cố: ${routeInfo.distance} - ${routeInfo.duration}`
                              navigator.clipboard.writeText(text)
                              toast({
                                title: "Đã sao chép",
                                description: "Thông tin hành trình đã được sao chép",
                              })
                            }}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl transition-all duration-200"
                          >
                            <Route className="h-4 w-4 mr-2" />
                            Sao chép thông tin
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => {
                              stopAllAnimations()
                              calculateRoute()
                              setTimeout(() => {
                                if ((request?.status as string) === 'ACCEPTED') {
                                  startCarAnimation()
                                }
                              }, 1000)
                            }}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl transition-all duration-200"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Làm mới
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => {
                              stopAllAnimations()
                              startCarAnimation()
                            }}
                            className="border-green-300 text-green-700 hover:bg-green-50 px-6 py-3 rounded-xl transition-all duration-200"
                          >
                            <Car className="h-4 w-4 mr-2" />
                            Xem lại hành trình
                          </Button>
                        </div>
                      </div>
                    )}

                    {routeInfo.status === 'error' && (
                      <div className="bg-white rounded-xl p-6 border border-red-100">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-700 mb-2">Không thể tính toán hành trình</h3>
                          <p className="text-gray-600 mb-4">
                            Có lỗi xảy ra khi tính toán khoảng cách và thời gian.
                          </p>
                          <Button
                            onClick={calculateRoute}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Thử lại
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Navigation */}
                  {request.garage && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <Map className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Điều hướng nhanh</h3>
                          <p className="text-sm text-gray-600">Các tùy chọn điều hướng và liên lạc</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <Button
                          onClick={() => {
                            if (request.garage?.latitude && request.garage?.longitude) {
                              window.open(`https://www.google.com/maps/search/?api=1&query=${request.garage.latitude},${request.garage.longitude}`, '_blank')
                            } else {
                              window.open(`https://www.google.com/maps/search/?api=1&query=${request.garage?.address}`, '_blank')
                            }
                          }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 h-auto flex flex-col items-center gap-2"
                        >
                          <MapPin className="h-6 w-6" />
                          <span className="font-medium">Vị trí Garage</span>
                        </Button>
                        
                        <Button
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`, '_blank')}
                          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 h-auto flex flex-col items-center gap-2"
                        >
                          <AlertTriangle className="h-6 w-6" />
                          <span className="font-medium">Vị trí sự cố</span>
                        </Button>
                        
                        <Button
                          onClick={openGoogleMapsNavigation}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 h-auto flex flex-col items-center gap-2"
                        >
                          <Navigation className="h-6 w-6" />
                          <span className="font-medium">Chỉ dẫn đường</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                </TabsContent>
              )}

              {/* Thông báo khi không hiển thị tab hành trình */}
              {(request.status as string) !== 'ACCEPTED' && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-6 lg:p-8 mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Hành trình sẽ hiển thị khi</h3>
                      <p className="text-sm text-gray-600">Yêu cầu cứu hộ được garage chấp nhận</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border border-yellow-100">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                          request.status === 'PENDING' 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          <Clock className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">PENDING</p>
                        <p className="text-xs text-gray-500">Chờ garage phản hồi</p>
                      </div>
                      
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                          (request.status as string) === 'ACCEPTED' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          <CheckCircle className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">ACCEPTED</p>
                        <p className="text-xs text-gray-500">Garage đã chấp nhận</p>
                      </div>
                      
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                          request.status === 'COMPLETED' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          <Star className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">COMPLETED</p>
                        <p className="text-xs text-gray-500">Hoàn thành cứu hộ</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        {request.status === 'PENDING' && "Hiện tại yêu cầu đang chờ garage phản hồi. Hành trình sẽ hiển thị khi garage chấp nhận yêu cầu."}
                        {request.status === 'COMPLETED' && "Yêu cầu cứu hộ đã hoàn thành. Hành trình đã kết thúc."}
                        {request.status === 'QUOTED' && "Garage đã gửi báo giá. Hành trình sẽ hiển thị khi bạn chấp nhận báo giá."}
                      </p>
                      
                      {request.status === 'PENDING' && (
                        <div className="flex items-center justify-center gap-2 text-yellow-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">Vui lòng chờ garage phản hồi...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
