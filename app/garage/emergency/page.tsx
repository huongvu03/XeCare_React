"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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
  Building,
  MoreVertical
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
  const { user, isGarageOwner } = useAuth()
  const router = useRouter()
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
      console.log('🚀 Loading garage-specific emergency requests from database...')
      
      // Check if user has token
      const token = localStorage.getItem('token')
      console.log('🔑 Token in localStorage:', token ? 'EXISTS' : 'NOT FOUND')
      console.log('🔑 Token value:', token ? token.substring(0, 20) + '...' : 'null')
      
      // Try to get garage-specific data from backend first
      const response = await EmergencyApi.getGarageRequests()
      console.log('✅ API Response:', response)
      console.log('🔍 Response data type:', typeof response.data)
      console.log('🔍 Response data is array:', Array.isArray(response.data))
      console.log('🔍 Response data value:', response.data)
      
      if (response.data) {
        // Handle both array and string responses (temporary fix until backend is restarted)
        let dataArray = []
        
        if (Array.isArray(response.data)) {
          // If it's already an array, use it directly
          dataArray = response.data
          console.log('✅ Response is already an array')
        } else if (typeof response.data === 'string') {
          // If it's a string, try to parse it as JSON
          try {
            const parsedData = JSON.parse(response.data)
            dataArray = Array.isArray(parsedData) ? parsedData : []
            console.log('✅ Successfully parsed JSON string to array')
          } catch (parseError) {
            console.error('❌ Failed to parse JSON string:', parseError)
            dataArray = []
          }
        } else {
          // For other types, default to empty array
          dataArray = []
        }
        
        setRequests(dataArray)
        console.log(`📊 Loaded ${dataArray.length} garage-specific emergency requests from database`)
        console.log('📋 Garage emergency requests data:', dataArray)
        
        toast({
          title: "Thành công", 
          description: dataArray.length > 0 
            ? `Đã tải ${dataArray.length} yêu cầu cứu hộ của garage từ database`
            : "Đã kết nối database - chưa có yêu cầu cứu hộ nào cho garage này",
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

  // Check access permission on mount
  useEffect(() => {
    setMounted(true)
    
    // Check if user is logged in and has GARAGE role
    if (!user) {
      router.push('/auth')
      return
    }
    
    if (!isGarageOwner()) {
      // User doesn't have GARAGE role, show access denied
      toast({
        title: "Không có quyền truy cập",
        description: "Chỉ garage mới có thể truy cập trang này",
        variant: "destructive",
      })
      router.push('/dashboard')
      return
    }
    
    // User has GARAGE role, load data
    loadRequests()
  }, [user, isGarageOwner, router])

  // Filter requests based on active tab and filters
  const filteredRequests = Array.isArray(requests) ? requests.filter(request => {
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
  }) : []

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200 shadow-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
            <Clock3 className="w-3 h-3 mr-1" />
            Chờ xử lý
          </div>
        )
      case 'QUOTED':
        return (
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <DollarSign className="w-3 h-3 mr-1" />
            Đã báo giá
          </div>
        )
      case 'ACCEPTED':
        return (
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Đã chấp nhận
          </div>
        )
      case 'COMPLETED':
        return (
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Hoàn thành
          </div>
        )
      case 'CANCELLED':
        return (
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 shadow-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <XCircle className="w-3 h-3 mr-1" />
            Đã hủy
          </div>
        )
      default:
        return (
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200 shadow-sm">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </div>
        )
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
      console.log(`🚀 [FRONTEND] Updating request ${requestId} to status: ${newStatus}`)
      
      // Show loading for accept action
      if (newStatus === 'ACCEPTED') {
        Swal.fire({
          title: 'Đang chấp nhận...',
          text: 'Vui lòng đợi trong giây lát',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          }
        })
      }
      
      console.log(`📡 [FRONTEND] Calling EmergencyApi.updateRequestStatus(${requestId}, '${newStatus}')`)
      
      try {
        const response = await EmergencyApi.updateRequestStatus(requestId, newStatus)
        console.log('✅ [FRONTEND] Status update response:', response)
        console.log('📊 [FRONTEND] Response data:', response.data)
        
        // Check if API call was successful
        if (response.data && response.data.success) {
          console.log('🎉 [FRONTEND] Backend API call successful - database updated!')
          console.log('📊 [FRONTEND] New status:', response.data.status)
          console.log('📅 [FRONTEND] Updated at:', response.data.updatedAt || response.data.acceptedAt)
        } else {
          console.log('⚠️ [FRONTEND] API response indicates failure:', response.data)
          throw new Error(response.data?.message || 'API call failed')
        }
        
      } catch (apiError: any) {
        console.log('❌ [FRONTEND] API call failed:', apiError.message)
        console.log('❌ [FRONTEND] Error details:', {
          status: apiError.response?.status,
          data: apiError.response?.data
        })
        
        // Re-throw the error to be handled by outer catch block
        throw apiError
      }
      
      // Update local state (this always works)
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: newStatus as any }
          : req
      ))
      
      // Show success message based on action
      if (newStatus === 'ACCEPTED') {
        await Swal.fire({
          title: 'Thành công!',
          text: `Yêu cầu cứu hộ #${requestId} đã được chấp nhận thành công`,
          icon: 'success',
          confirmButtonColor: '#059669',
          confirmButtonText: 'OK'
        })
        
        // Show additional info for successful database update
        setTimeout(() => {
          toast({
            title: "Database Updated",
            description: "Trạng thái đã được cập nhật thành công trong database!",
            variant: "default",
          })
        }, 2000)
        
      } else {
        toast({
          title: "Thành công",
          description: `Đã cập nhật trạng thái yêu cầu #${requestId}`,
        })
      }
      
    } catch (error: any) {
      console.error('❌ [FRONTEND] Error updating status:', error)
      console.error('❌ [FRONTEND] Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      })
      
      // Show error message
      if (newStatus === 'ACCEPTED') {
        const errorMessage = error.response?.data?.message || error.message || 'Không thể chấp nhận yêu cầu'
        await Swal.fire({
          title: 'Lỗi!',
          text: `Không thể chấp nhận yêu cầu #${requestId}: ${errorMessage}`,
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
      
      // Check if API call was successful
      if (response.data && response.data.success) {
        console.log('🎉 Complete request successful - database updated!')
        
        // Update local state
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'COMPLETED' }
            : req
        ))
        
        toast({
          title: "Thành công",
          description: "Yêu cầu cứu hộ đã hoàn thành thành công",
        })
      } else {
        throw new Error(response.data?.message || 'API call failed')
      }
    } catch (error: any) {
      console.error('❌ Error completing request:', error)
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      })
      
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || error.message || 'Không thể hoàn thành yêu cầu',
        variant: "destructive",
      })
    }
  }

  // Handle delete request (Cancel/Hủy)
  const handleDeleteRequest = async (requestId: number) => {
    try {
      console.log('🗑️ Cancelling request:', requestId)
      
      // Show SweetAlert confirmation dialog
      const result = await Swal.fire({
        title: 'Xác nhận hủy',
        text: `Bạn có chắc chắn muốn "Hủy" yêu cầu cứu hộ #${requestId}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Hủy yêu cầu',
        cancelButtonText: 'Không',
        backdrop: true,
        allowOutsideClick: false,
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title'
        }
      })
      
      if (!result.isConfirmed) {
        return
      }
      
      // Show loading
      Swal.fire({
        title: 'Đang hủy...',
        text: 'Vui lòng đợi',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      // Use delete endpoint to actually remove from database
      const response = await EmergencyApi.deleteRequest(requestId)
      console.log('✅ Request deleted successfully:', response.data)
      
      // Check if deletion was successful
      if (response.data && (response.data.message || response.data.id)) {
        console.log('🎉 Request deletion successful - database updated!')
        
        // Update local state - remove from list instead of marking as cancelled
        setRequests(prev => prev.filter(req => req.id !== requestId))
        
        // Show success message
        await Swal.fire({
          title: 'Đã hủy thành công!',
          text: `Yêu cầu cứu hộ #${requestId} đã được hủy thành công`,
          icon: 'success',
          confirmButtonColor: '#059669',
          confirmButtonText: 'OK'
        })
        
        // Show additional info for successful cancellation
        setTimeout(() => {
          toast({
            title: "Hủy thành công",
            description: "Yêu cầu đã được hủy và xóa khỏi hệ thống!",
            variant: "default",
          })
        }, 2000)
      } else {
        throw new Error('Delete response indicates failure')
      }
      
    } catch (error: any) {
      console.error('❌ Error cancelling request:', error)
      
      // Show error message
      await Swal.fire({
        title: 'Lỗi!',
        text: `Không thể hủy yêu cầu: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK'
      })
    }
  }

  // Calculate stats
  const stats = {
    total: Array.isArray(requests) ? requests.length : 0,
    pending: Array.isArray(requests) ? requests.filter(r => r.status === 'PENDING').length : 0,
    quoted: Array.isArray(requests) ? requests.filter(r => r.status === 'QUOTED').length : 0,
    accepted: Array.isArray(requests) ? requests.filter(r => r.status === 'ACCEPTED').length : 0,
    completed: Array.isArray(requests) ? requests.filter(r => r.status === 'COMPLETED').length : 0,
    cancelled: Array.isArray(requests) ? requests.filter(r => r.status === 'CANCELLED').length : 0,
  }

  // Show loading while checking permissions
  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 text-lg">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  // Show access denied if user doesn't have GARAGE role
  if (!isGarageOwner()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6 p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Không có quyền truy cập</h1>
            <p className="text-gray-600">
              Chỉ tài khoản garage mới có thể truy cập trang quản lý cứu hộ khẩn cấp.
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Quay về Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/garage/register')}
              className="w-full"
            >
              Đăng ký Garage
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Professional Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative p-8 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <AlertTriangle className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">Quản lý Cứu hộ Khẩn cấp</h1>
                    <p className="text-blue-100 text-lg mt-2">Hệ thống quản lý yêu cầu cứu hộ chuyên nghiệp</p>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="flex gap-6 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[140px] border border-white/20">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-blue-100 text-sm">Tổng yêu cầu</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[140px] border border-white/20">
                    <div className="text-2xl font-bold">{stats.pending}</div>
                    <div className="text-blue-100 text-sm">Chờ xử lý</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[140px] border border-white/20">
                    <div className="text-2xl font-bold">{stats.accepted}</div>
                    <div className="text-blue-100 text-sm">Đã chấp nhận</div>
                  </div>
                </div>
              </div>
              
              {/* Refresh Button */}
              <div className="flex flex-col items-end gap-4">
                <Button
                  onClick={loadRequests}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
                </Button>
              </div>
            </div>
          </div>
        </div>


        {/* Advanced Filters */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Filter className="h-5 w-5 text-blue-600" />
        </div>
              Bộ lọc và Tìm kiếm
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Tìm kiếm theo mô tả, tên khách hàng, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl text-base transition-all duration-300"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-56 pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl text-base transition-all duration-300">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 shadow-xl">
                    <SelectItem value="all" className="rounded-lg">Tất cả trạng thái</SelectItem>
                    <SelectItem value="PENDING" className="rounded-lg">🟡 Chờ xử lý</SelectItem>
                    <SelectItem value="QUOTED" className="rounded-lg">🔵 Đã báo giá</SelectItem>
                    <SelectItem value="ACCEPTED" className="rounded-lg">🟢 Đã chấp nhận</SelectItem>
                    <SelectItem value="COMPLETED" className="rounded-lg">✅ Hoàn thành</SelectItem>
                    <SelectItem value="CANCELLED" className="rounded-lg">❌ Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Filter Results Summary */}
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <TrendingUp className="h-4 w-4" />
                <span>Hiển thị <strong>{filteredRequests.length}</strong> trong tổng số <strong>{requests.length}</strong> yêu cầu</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-b border-indigo-100">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                  <AlertTriangle className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Danh sách Yêu cầu Cứu hộ</h2>
                  <p className="text-gray-600 text-sm mt-1">Quản lý và xử lý các yêu cầu khẩn cấp từ khách hàng</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-blue-100 rounded-xl">
                  <span className="text-blue-700 font-semibold">{filteredRequests.length} yêu cầu</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-gray-800">Đang tải dữ liệu...</h3>
                  <p className="text-gray-600 text-lg">Vui lòng đợi trong giây lát</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-8">
                <Alert variant="destructive" className="border-2 border-red-200 bg-red-50 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <AlertDescription className="text-red-800 font-medium text-lg">{error}</AlertDescription>
              </Alert>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-20 space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full opacity-20"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-xl">
                    <AlertTriangle className="h-12 w-12 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-700">Không có yêu cầu cứu hộ nào</h3>
                  <p className="text-gray-600 text-lg">Hãy kiểm tra lại bộ lọc hoặc thử làm mới dữ liệu</p>
                  <Button
                    onClick={loadRequests}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Làm mới dữ liệu
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Enhanced List Header */}
                <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 p-4 lg:p-6 border-b border-indigo-100">
                  <div className="hidden lg:flex items-center gap-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    <div className="w-12 text-center">ID</div>
                    <div className="flex-1 grid grid-cols-4 gap-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Khách hàng
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                        Mô tả sự cố
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-orange-600" />
                        Garage
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-yellow-600" />
                        Trạng thái & Thời gian
                      </div>
                    </div>
                    <div className="w-10 text-center">Hành động</div>
                  </div>
                </div>

                {/* Enhanced List Items */}
                <div className="divide-y divide-gray-100">
                  {filteredRequests.map((request, index) => (
                    <div 
                      key={request.id} 
                      className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
                        {/* Mobile Layout - Compact & Beautiful */}
                        <div className="lg:hidden">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
                                #{request.id}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{request.user?.name || 'N/A'}</p>
                                <p className="text-xs text-gray-500">{request.user?.phone || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(request.status)}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="w-8 h-8 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  {request.status === 'PENDING' && (
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusUpdate(request.id, 'ACCEPTED')}
                                      className="text-green-700 hover:bg-green-50 cursor-pointer"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Chấp nhận
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {request.status === 'ACCEPTED' && (
                                    <DropdownMenuItem 
                                      onClick={() => handleCompleteRequest(request.id)}
                                      className="text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Hoàn thành
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem 
                                    onClick={() => {
                                      console.log('View emergency request:', request)
                                      window.open(`/emergency/${request.id}`, '_blank')
                                    }}
                                    className="text-blue-700 hover:bg-blue-50 cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                  </DropdownMenuItem>
                                  
                                  {['PENDING', 'ACCEPTED'].includes(request.status) && (
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteRequest(request.id)}
                                      className="text-red-700 hover:bg-red-50 cursor-pointer"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Hủy yêu cầu
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                            {/* Problem Description */}
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-semibold text-gray-700">Mô tả sự cố</span>
                              </div>
                              <p className="text-sm text-gray-800">{request.description || 'Không có mô tả'}</p>
                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                <MapPin className="h-3 w-3 text-blue-500" />
                                <span className="bg-blue-50 px-2 py-1 rounded font-mono">{request.latitude?.toFixed(4)}, {request.longitude?.toFixed(4)}</span>
                              </div>
                        </div>

                            {/* Garage Info */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Building className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-semibold text-gray-700">Garage cứu hộ</span>
                              </div>
                              {request.garage ? (
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
                                  <p className="text-sm font-bold text-orange-800 mb-1">{request.garage.name}</p>
                                  <p className="text-xs text-orange-600 mb-2">{request.garage.address}</p>
                                  <div className="flex items-center gap-1 text-xs text-orange-500">
                                    <Phone className="h-3 w-3" />
                                    <span>{request.garage.phone}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-gray-50 rounded-lg p-3 border text-center">
                                  <Building className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs text-gray-500">Chưa chọn garage</p>
                                </div>
                              )}
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-indigo-600" />
                              <span>{formatDate(request.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout - Compact & Beautiful */}
                        <div className="hidden lg:flex items-center gap-4 p-4">
                          {/* ID Badge */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
                              #{request.id}
                            </div>
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 grid grid-cols-4 gap-6">
                            {/* Customer & Contact */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">{request.user?.name || 'N/A'}</p>
                                  <p className="text-xs text-gray-500">ID: {request.user?.id || 'N/A'}</p>
                          </div>
                        </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4 text-green-600" />
                                <span className="font-medium">{request.user?.phone || 'N/A'}</span>
                          </div>
                        </div>

                            {/* Problem Description */}
                            <div className="space-y-2">
                              <div className="bg-gray-50 rounded-lg p-3 border">
                                <p className="text-sm text-gray-800 font-medium mb-1">{request.description || 'Không có mô tả'}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin className="h-3 w-3 text-blue-500" />
                                  <span>{request.latitude?.toFixed(4)}, {request.longitude?.toFixed(4)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Garage Info */}
                            <div className="space-y-2">
                              {request.garage ? (
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Building className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm font-semibold text-orange-800">Garage</span>
                                  </div>
                                  <p className="text-xs text-orange-700 font-medium mb-1">{request.garage.name}</p>
                                  <p className="text-xs text-orange-600 mb-1">{request.garage.address}</p>
                                  <div className="flex items-center gap-1 text-xs text-orange-500">
                                    <Phone className="h-3 w-3" />
                                    <span>{request.garage.phone}</span>
                              </div>
                            </div>
                          ) : (
                                <div className="bg-gray-50 rounded-lg p-3 border text-center">
                                  <Building className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs text-gray-500">Chưa chọn garage</p>
                                </div>
                              )}
                        </div>

                            {/* Status & Time */}
                            <div className="space-y-2">
                              <div className="flex justify-center">
                          {getStatusBadge(request.status)}
                        </div>
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">{formatDate(request.createdAt).split(' ')[0]}</p>
                              <p className="text-xs text-gray-500">{formatDate(request.createdAt).split(' ')[1]}</p>
                              </div>
                          </div>
                        </div>

                          {/* Actions */}
                          <div className="flex-shrink-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                              <Button 
                                  variant="outline" 
                                size="sm" 
                                  className="w-10 h-10 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                {request.status === 'PENDING' && (
                                  <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(request.id, 'ACCEPTED')}
                                    className="text-green-700 hover:bg-green-50 cursor-pointer"
                              >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                Chấp nhận
                                  </DropdownMenuItem>
                            )}
                            
                            {request.status === 'ACCEPTED' && (
                                  <DropdownMenuItem 
                                onClick={() => handleCompleteRequest(request.id)}
                                    className="text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                              >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                Hoàn thành
                                  </DropdownMenuItem>
                            )}

                                <DropdownMenuItem 
                              onClick={() => {
                                console.log('View emergency request:', request)
                                window.open(`/emergency/${request.id}`, '_blank')
                              }}
                                  className="text-blue-700 hover:bg-blue-50 cursor-pointer"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                            
                            {['PENDING', 'ACCEPTED'].includes(request.status) && (
                                  <DropdownMenuItem 
                                onClick={() => handleDeleteRequest(request.id)}
                                    className="text-red-700 hover:bg-red-50 cursor-pointer"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Hủy yêu cầu
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
