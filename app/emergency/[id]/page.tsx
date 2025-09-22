"use client"

import { useState, useEffect } from "react"
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
  RefreshCw
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

  useEffect(() => {
    if (params.id) {
      loadRequestDetails(Number(params.id))
    }
  }, [params.id])

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
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
