"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  Car, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Eye,
  MessageSquare,
  DollarSign,
  Search,
  Filter,
  TrendingUp,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Building
} from 'lucide-react'
import EmergencyApi from '@/lib/api/EmergencyApi'
import { useToast } from '@/hooks/use-toast'
import Swal from 'sweetalert2'

interface EmergencyRequest {
  id: number
  user: {
    id: number
    name: string
    phone: string
  } | null
  garage?: {
    id: number
    name: string
    phone: string
    address: string
  } | null
  description: string
  latitude: number
  longitude: number
  status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'CANCELLED' | 'COMPLETED'
  createdAt: string
  images: number | Array<{
    id: number
    imageUrl: string
  }>
}

export default function GarageEmergencyPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // Load emergency requests
  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🚀 Loading ALL emergency requests from database...')
      
      // Try to get real data from backend first
      const response = await EmergencyApi.getAllRequests()
      console.log('✅ API Response:', response)
      
      if (response.data) {
        // Always use real data from API, even if empty
        setRequests(response.data)
        console.log(`📊 Loaded ${response.data.length} emergency requests from database`)
        console.log('📋 Emergency requests data:', response.data)
        
        toast({
          title: "Thành công", 
          description: response.data.length > 0 
            ? `Đã tải ${response.data.length} yêu cầu cứu hộ từ database`
            : "Đã kết nối database - chưa có yêu cầu nào",
        })
        
        // Successfully connected to API, exit function (even if no data)
        return
      } else {
        console.log('⚠️ No data received from API')
        setRequests([])
        return
      }
    } catch (error: any) {
      console.error('❌ Error loading requests:', error)
      
      // Set empty data when API fails
      setRequests([])
      
      let errorMessage = 'Không thể tải dữ liệu từ database'
      let errorTitle = 'Lỗi kết nối'
      
      if (error.response?.status === 500) {
        errorTitle = 'Lỗi server'
        errorMessage = 'Server đang gặp sự cố, vui lòng thử lại sau'
      } else if (error.code === 'ERR_NETWORK') {
        errorTitle = 'Không kết nối được'
        errorMessage = 'Không thể kết nối tới server backend'
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    setMounted(true)
    loadRequests()
  }, [])

  // Filter requests based on active tab and filters
  const filteredRequests = requests.filter(request => {
    // Status filter
    if (statusFilter !== 'all' && request.status !== statusFilter) {
      return false
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        (request.description && request.description.toLowerCase().includes(searchLower)) ||
        (request.user?.name && request.user.name.toLowerCase().includes(searchLower)) ||
        (request.user?.phone && request.user.phone.includes(searchTerm)) ||
        (request.garage?.name && request.garage.name.toLowerCase().includes(searchLower))
      )
    }
    
    return true
  })

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Chờ xử lý</Badge>
      case 'QUOTED':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">💰 Đã báo giá</Badge>
      case 'ACCEPTED':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">✅ Đã chấp nhận</Badge>
      case 'COMPLETED':
        return <Badge variant="default" className="bg-emerald-600 text-white">🎉 Hoàn thành</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">❌ Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock3 className="h-4 w-4 text-yellow-600" />
      case 'QUOTED': return <DollarSign className="h-4 w-4 text-blue-600" />
      case 'ACCEPTED': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      case 'CANCELLED': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }

  // Handle status update
  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    try {
      console.log(`🔄 Updating request ${requestId} to status: ${newStatus}`)
      
      // Show loading for accept action
      if (newStatus === 'ACCEPTED') {
        Swal.fire({
          title: 'Đang chấp nhận...',
          text: 'Vui lòng đợi',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        })
      }
      
      const response = await EmergencyApi.updateRequestStatus(requestId, newStatus)
      console.log('✅ Status update response:', response)
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: newStatus as any }
          : req
      ))
      
      // Show success message based on action
      if (newStatus === 'ACCEPTED') {
        await Swal.fire({
          title: 'Đã chấp nhận!',
          text: `Yêu cầu cứu hộ #${requestId} đã được chấp nhận`,
          icon: 'success',
          confirmButtonColor: '#059669',
          confirmButtonText: 'OK'
        })
      } else {
        toast({
          title: "Thành công",
          description: `Đã cập nhật trạng thái yêu cầu #${requestId}`,
        })
      }
      
    } catch (error: any) {
      console.error('❌ Error updating status:', error)
      
      // Show error message
      if (newStatus === 'ACCEPTED') {
        await Swal.fire({
          title: 'Lỗi!',
          text: `Không thể chấp nhận yêu cầu: ${error.message}`,
          icon: 'error',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'OK'
        })
      } else {
        toast({
          title: "Lỗi",
          description: error.response?.data?.message || error.message || 'Không thể cập nhật trạng thái',
          variant: "destructive",
        })
      }
    }
  }

  // Handle complete request
  const handleCompleteRequest = async (requestId: number) => {
    try {
      console.log(`✅ Completing request ${requestId}`)
      
      const response = await EmergencyApi.completeRequest(requestId)
      console.log('✅ Complete request response:', response)
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'COMPLETED' }
          : req
      ))
      
      toast({
        title: "Thành công",
        description: "Yêu cầu cứu hộ đã hoàn thành",
      })
    } catch (error: any) {
      console.error('❌ Error completing request:', error)
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || error.message || 'Không thể hoàn thành yêu cầu',
        variant: "destructive",
      })
    }
  }

  // Handle delete request
  const handleDeleteRequest = async (requestId: number) => {
    try {
      console.log('🗑️ Deleting request:', requestId)
      
      // Show SweetAlert confirmation dialog
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: `Bạn có chắc chắn muốn "Huỷ" yêu cầu cứu hộ #${requestId}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        backdrop: true,
        allowOutsideClick: false,
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title',
          content: 'swal-content'
        }
      })
      
      if (!result.isConfirmed) {
        return
      }
      
      // Show loading
      Swal.fire({
        title: 'Đang xóa...',
        text: 'Vui lòng đợi',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      const response = await EmergencyApi.deleteRequest(requestId)
      console.log('✅ Request deleted successfully:', response.data)
      
      // Remove from local state
      setRequests(prev => prev.filter(req => req.id !== requestId))
      
      // Show success message
      await Swal.fire({
        title: 'Thành công!',
        text: `Đã xóa yêu cầu cứu hộ #${requestId}`,
        icon: 'success',
        confirmButtonColor: '#059669',
        confirmButtonText: 'OK'
      })
      
    } catch (error: any) {
      console.error('❌ Error deleting request:', error)
      
      // Show error message
      await Swal.fire({
        title: 'Lỗi!',
        text: `Không thể xóa yêu cầu: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK'
      })
    }
  }

  // Calculate stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    quoted: requests.filter(r => r.status === 'QUOTED').length,
    accepted: requests.filter(r => r.status === 'ACCEPTED').length,
    completed: requests.filter(r => r.status === 'COMPLETED').length,
    cancelled: requests.filter(r => r.status === 'CANCELLED').length,
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Garage Emergency Management
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quản lý yêu cầu cứu hộ khẩn cấp - Danh sách tất cả các yêu cầu từ khách hàng
          </p>
        </div>

        {/* Action Buttons */}
       
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-blue-100 text-sm">Tổng cộng</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{stats.pending}</div>
              <div className="text-yellow-100 text-sm">Chờ xử lý</div>
            </CardContent>
          </Card>
          {/* <Card className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{stats.quoted}</div>
              <div className="text-blue-100 text-sm">Đã báo giá</div>
            </CardContent>
          </Card> */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{stats.accepted}</div>
              <div className="text-green-100 text-sm">Đã chấp nhận</div>
            </CardContent>
          </Card>
          {/* <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{stats.completed}</div>
              <div className="text-emerald-100 text-sm">Hoàn thành</div>
            </CardContent>
          </Card> */}
          {/* <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{stats.cancelled}</div>
              <div className="text-red-100 text-sm">Đã hủy</div>
            </CardContent>
          </Card> */}
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo mô tả, tên, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48 pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                    <SelectItem value="QUOTED">Đã báo giá</SelectItem>
                    <SelectItem value="ACCEPTED">Đã chấp nhận</SelectItem>
                    <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-3 text-2xl text-blue-800">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              Emergency Requests ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                <div className="text-center space-y-2">
                  <p className="text-xl font-semibold text-gray-700">Đang tải dữ liệu...</p>
                  <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
                </div>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="border-2 border-red-200 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
              </Alert>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-600">Không có yêu cầu cứu hộ nào</h3>
                  <p className="text-gray-500">Hãy kiểm tra lại bộ lọc hoặc thử làm mới dữ liệu</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* List Header */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-2">Khách hàng</div>
                    <div className="col-span-1">SĐT</div>
                    <div className="col-span-3">Mô tả sự cố</div>
                    <div className="col-span-2">Garage</div>
                    <div className="col-span-1">Trạng thái</div>
                    <div className="col-span-1">Thời gian</div>
                    <div className="col-span-1">Hành động</div>
                  </div>
                </div>

                {/* List Items */}
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="border shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* ID */}
                        <div className="col-span-1 text-center">
                          <span className="text-lg font-bold text-blue-600">#{request.id}</span>
                        </div>

                        {/* Khách hàng */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{request.user?.name || 'Chưa có thông tin'}</p>
                              <p className="text-xs text-gray-500">ID: {request.user?.id || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Số điện thoại */}
                        <div className="col-span-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-900">{request.user?.phone || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Mô tả sự cố */}
                        <div className="col-span-3">
                          <p className="text-sm text-gray-700 line-clamp-2" title={request.description}>
                            {request.description || 'Không có mô tả'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{request.latitude?.toFixed(4)}, {request.longitude?.toFixed(4)}</span>
                          </div>
                        </div>

                        {/* Garage */}
                        <div className="col-span-2">
                          {request.garage ? (
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-purple-600 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{request.garage.name}</p>
                                <p className="text-xs text-gray-500">{request.garage.phone}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500">Chưa có garage</span>
                            </div>
                          )}
                        </div>

                        {/* Trạng thái */}
                        <div className="col-span-1 text-center">
                          {getStatusBadge(request.status)}
                        </div>

                        {/* Thời gian */}
                        <div className="col-span-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="text-xs text-gray-900">{formatDate(request.createdAt).split(' ')[0]}</p>
                              <p className="text-xs text-gray-500">{formatDate(request.createdAt).split(' ')[1]}</p>
                            </div>
                          </div>
                        </div>

                        {/* Hành động */}
                        <div className="col-span-1">
                          <div className="flex flex-col gap-1">
                            {request.status === 'PENDING' && (
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-7"
                                onClick={() => handleStatusUpdate(request.id, 'ACCEPTED')}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Chấp nhận
                              </Button>
                            )}
                            
                            {request.status === 'ACCEPTED' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs px-2 py-1 h-7"
                                onClick={() => handleCompleteRequest(request.id)}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Hoàn thành
                              </Button>
                            )}

                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-blue-600 hover:bg-blue-50 text-xs px-2 py-1 h-7"
                              onClick={() => {
                                console.log('View emergency request:', request)
                                window.open(`/emergency/${request.id}`, '_blank')
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Xem
                            </Button>
                            
                            {['PENDING', 'ACCEPTED'].includes(request.status) && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-red-200 hover:bg-red-50 text-red-700 text-xs px-2 py-1 h-7"
                                onClick={() => handleDeleteRequest(request.id)}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Hủy
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
