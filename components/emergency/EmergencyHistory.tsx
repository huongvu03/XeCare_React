"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Clock, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  DollarSign
} from "lucide-react"
import EmergencyApi, { EmergencyRequest, EmergencyQuote } from "@/lib/api/EmergencyApi"
import { useToast } from "@/hooks/use-toast"

interface EmergencyHistoryProps {
  onViewDetails: (request: EmergencyRequest) => void
}

export function EmergencyHistory({ onViewDetails }: EmergencyHistoryProps) {
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [quotes, setQuotes] = useState<EmergencyQuote[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadEmergencyRequests()
  }, [])

  const loadEmergencyRequests = async () => {
    try {
      setLoading(true)
      const response = await EmergencyApi.getMyRequests()
      setRequests(response.data)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch sử cứu hộ",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadQuotes = async (requestId: number) => {
    try {
      const response = await EmergencyApi.getQuotes(requestId)
      setQuotes(response.data)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải báo giá",
        variant: "destructive",
      })
    }
  }

  const handleAcceptQuote = async (quoteId: number) => {
    try {
      await EmergencyApi.acceptQuote(quoteId)
      toast({
        title: "Thành công",
        description: "Đã chấp nhận báo giá",
      })
      loadEmergencyRequests() // Reload để cập nhật status
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể chấp nhận báo giá",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Chờ xử lý</Badge>
      case 'QUOTED':
        return <Badge variant="outline" className="text-blue-600">Có báo giá</Badge>
      case 'ACCEPTED':
        return <Badge variant="default" className="bg-green-600">Đã chấp nhận</Badge>
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-800">Hoàn thành</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2">Đang tải...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có yêu cầu cứu hộ</h3>
          <p className="text-gray-500">Bạn chưa có yêu cầu cứu hộ nào trong lịch sử.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Yêu cầu #{request.id}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formatDate(request.createdAt)}
                  </span>
                </div>
              </div>
              {getStatusBadge(request.status)}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-gray-700">{request.description}</p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}
                </span>
              </div>

              {request.garage && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{request.garage.name} - {request.garage.phone}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedRequest(request)
                  loadQuotes(request.id)
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Xem chi tiết
              </Button>
              
              {request.status === 'QUOTED' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(request)}
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Xem báo giá
                </Button>
              )}
            </div>

            {/* Quotes Section */}
            {selectedRequest?.id === request.id && quotes.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-3">Báo giá từ garage:</h4>
                <div className="space-y-3">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium">{quote.garage.name}</h5>
                          <p className="text-sm text-gray-600">{quote.garage.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {quote.price.toLocaleString('vi-VN')} VNĐ
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(quote.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{quote.message}</p>
                      
                      {!quote.accepted && request.status === 'QUOTED' && (
                        <Button
                          size="sm"
                          onClick={() => handleAcceptQuote(quote.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Chấp nhận
                        </Button>
                      )}
                      
                      {quote.accepted && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Đã chấp nhận
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
