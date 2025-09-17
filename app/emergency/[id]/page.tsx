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
            onClick={() => router.back()}
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
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => loadRequestDetails(request.id)}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Làm mới</span>
          </Button>
        </div>

        {/* Status Tracker */}
        <EmergencyStatusTracker 
          request={request}
          onRefresh={() => loadRequestDetails(request.id)}
        />

        {/* Tabs for different sections */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Chi tiết</TabsTrigger>
            <TabsTrigger value="quotes">
              Báo giá ({quotes.length})
            </TabsTrigger>
            <TabsTrigger value="location">Vị trí</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Request Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span>Thông tin yêu cầu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Khách hàng</p>
                        <p className="text-sm text-gray-600">{request.user?.name || 'Chưa có thông tin'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Số điện thoại</p>
                        <p className="text-sm text-gray-600">{request.user?.phone || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Thời gian tạo</p>
                        <p className="text-sm text-gray-600">{formatDate(request.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Problem Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <span>Mô tả sự cố</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    {request.description || 'Không có mô tả'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Garage Info if assigned */}
            {request.garage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-purple-600" />
                    <span>Garage phụ trách</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tên garage</p>
                      <p className="text-lg font-semibold">{request.garage.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                      <p className="text-lg font-semibold">{request.garage.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Địa chỉ</p>
                      <p className="text-lg font-semibold">{request.garage.address}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <Button
                      onClick={() => window.open(`tel:${request.garage?.phone}`)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Gọi garage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="quotes" className="space-y-6">
            {quotes.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có báo giá</h3>
                  <p className="text-gray-500">
                    Các garage sẽ gửi báo giá sớm nhất có thể.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <Card key={quote.id} className={`${quote.accepted ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{quote.garage.name}</h3>
                          <p className="text-sm text-gray-600">{quote.garage.address}</p>
                          <p className="text-sm text-gray-600">{quote.garage.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {formatPrice(quote.price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(quote.createdAt)}
                          </p>
                          {quote.accepted && (
                            <Badge className="mt-2 bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Đã chấp nhận
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Mô tả dịch vụ:</p>
                        <p className="text-gray-600">{quote.message}</p>
                      </div>
                      
                      {!quote.accepted && request.status === 'QUOTED' && (
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => handleAcceptQuote(quote.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Chấp nhận báo giá
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => window.open(`tel:${quote.garage.phone}`)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Liên hệ garage
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>Vị trí sự cố</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Latitude</p>
                    <p className="text-lg font-mono bg-gray-100 p-2 rounded">
                      {request.latitude.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Longitude</p>
                    <p className="text-lg font-mono bg-gray-100 p-2 rounded">
                      {request.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`
                    window.open(url, '_blank')
                  }}
                  className="w-full"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Xem trên Google Maps
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
