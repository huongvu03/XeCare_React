"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  MapPin, 
  Phone, 
  Calendar, 
  User, 
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
  MoreVertical,
  Download
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

export default function AdminEmergencyPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const { toast } = useToast()

  // Load emergency requests
  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🚀 [Admin] Loading ALL emergency requests from database...')
      
      const response = await EmergencyApi.getAllRequests()
      console.log('✅ [Admin] API Response:', response)
      
      if (response.data) {
        setRequests(response.data)
        console.log(`📊 [Admin] Loaded ${response.data.length} emergency requests from database`)
        
        toast({
          title: "Thành công", 
          description: response.data.length > 0 
            ? `Đã tải ${response.data.length} yêu cầu cứu hộ từ database`
            : "Đã kết nối database - chưa có yêu cầu nào",
        })
      } else {
        console.log('⚠️ [Admin] No data received from API')
        setRequests([])
      }
    } catch (error: any) {
      console.error('❌ [Admin] Error loading emergency requests:', error)
      setRequests([])
      setError('Không thể tải dữ liệu yêu cầu cứu hộ')
      
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu yêu cầu cứu hộ",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  // Get status badge
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
      console.log(`🚀 [Admin] Updating request ${requestId} to status: ${newStatus}`)
      
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
      
      const response = await EmergencyApi.updateRequestStatus(requestId, newStatus)
      console.log('✅ [Admin] Status update response:', response)
      
      if (response.data && response.data.success) {
        console.log('🎉 [Admin] Backend API call successful - database updated!')
        
        // Update local state
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: newStatus as any }
            : req
        ))
        
        // Show success message
        await Swal.fire({
          title: 'Thành công!',
          text: `Yêu cầu cứu hộ #${requestId} đã được cập nhật thành "${newStatus}"`,
          icon: 'success',
          confirmButtonColor: '#059669',
          confirmButtonText: 'OK'
        })
        
        toast({
          title: "Cập nhật thành công",
          description: `Trạng thái yêu cầu #${requestId} đã được cập nhật`,
        })
      } else {
        throw new Error(response.data?.message || 'API call failed')
      }
      
    } catch (error: any) {
      console.error('❌ [Admin] Error updating status:', error)
      
      await Swal.fire({
        title: 'Lỗi!',
        text: `Không thể cập nhật trạng thái: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK'
      })
      
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || error.message || 'Không thể cập nhật trạng thái',
        variant: "destructive",
      })
    }
  }

  // Handle complete request
  const handleCompleteRequest = async (requestId: number) => {
    try {
      console.log('✅ Completing request:', requestId)
      
      // Show SweetAlert confirmation dialog
      const result = await Swal.fire({
        title: 'Xác nhận hoàn thành',
        text: `Bạn có chắc chắn muốn "Hoàn thành" yêu cầu cứu hộ #${requestId}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Hoàn thành',
        cancelButtonText: 'Hủy',
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
        title: 'Đang hoàn thành...',
        text: 'Vui lòng đợi',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      const response = await EmergencyApi.completeRequest(requestId)
      console.log('✅ Request completed successfully:', response.data)
      
      if (response.data && response.data.success) {
        console.log('🎉 Request completion successful - database updated!')
        
        // Update local state
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'COMPLETED' }
            : req
        ))
        
        // Show success message
        await Swal.fire({
          title: 'Hoàn thành thành công!',
          text: `Yêu cầu cứu hộ #${requestId} đã được hoàn thành thành công`,
          icon: 'success',
          confirmButtonColor: '#059669',
          confirmButtonText: 'OK'
        })
        
        toast({
          title: "Hoàn thành thành công",
          description: "Yêu cầu đã được đánh dấu hoàn thành!",
        })
      } else {
        throw new Error('Complete response indicates failure')
      }
      
    } catch (error: any) {
      console.error('❌ Error completing request:', error)
      
      await Swal.fire({
        title: 'Lỗi!',
        text: `Không thể hoàn thành yêu cầu: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK'
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
      
      const response = await EmergencyApi.deleteRequest(requestId)
      console.log('✅ Request deleted successfully:', response.data)
      
      if (response.data && (response.data.message || response.data.id)) {
        console.log('🎉 Request deletion successful - database updated!')
        
        // Update local state - remove from list
        setRequests(prev => prev.filter(req => req.id !== requestId))
        
        // Show success message
        await Swal.fire({
          title: 'Đã hủy thành công!',
          text: `Yêu cầu cứu hộ #${requestId} đã được hủy thành công`,
          icon: 'success',
          confirmButtonColor: '#059669',
          confirmButtonText: 'OK'
        })
        
        toast({
          title: "Hủy thành công",
          description: "Yêu cầu đã được hủy và xóa khỏi hệ thống!",
        })
      } else {
        throw new Error('Delete response indicates failure')
      }
      
    } catch (error: any) {
      console.error('❌ Error cancelling request:', error)
      
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
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    quoted: requests.filter(r => r.status === 'QUOTED').length,
    accepted: requests.filter(r => r.status === 'ACCEPTED').length,
    completed: requests.filter(r => r.status === 'COMPLETED').length,
    cancelled: requests.filter(r => r.status === 'CANCELLED').length,
    responseTime: 15, // Mock data
    satisfactionRate: 95 // Mock data
  }

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchTerm || 
      request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.phone?.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true
      const requestDate = new Date(request.createdAt)
      const now = new Date()
      
      switch (dateFilter) {
        case 'today':
          return requestDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return requestDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return requestDate >= monthAgo
      default:
          return true
      }
    })()
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Export data to CSV
  const exportData = () => {
    const csvContent = [
      ['ID', 'Khách hàng', 'SĐT', 'Mô tả', 'Trạng thái', 'Thời gian tạo', 'Garage'].join(','),
      ...filteredRequests.map(request => [
        request.id,
        request.user?.name || 'N/A',
        request.user?.phone || 'N/A',
        `"${request.description?.replace(/"/g, '""') || ''}"`,
        request.status,
        formatDate(request.createdAt),
        request.garage?.name || 'Chưa có'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `emergency_requests_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Thành công",
      description: "Đã xuất dữ liệu ra file CSV",
    })
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
                    <h1 className="text-4xl font-bold tracking-tight">Emergency Management</h1>
                    <p className="text-blue-100 text-lg mt-2">Quản lý và giám sát toàn bộ hệ thống cứu hộ khẩn cấp</p>
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
                    <div className="text-2xl font-bold">{stats.completed}</div>
                    <div className="text-blue-100 text-sm">Hoàn thành</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
              <div className="flex flex-col items-end gap-4">
          <Button 
            onClick={loadRequests} 
            disabled={loading} 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
                  <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={exportData}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
                  <Download className="h-5 w-5 mr-2" />
            Xuất CSV
          </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-slate-600 text-xs">Tổng số</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-slate-600 text-xs">Chờ xử lý</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.quoted}</div>
              <div className="text-slate-600 text-xs">Đã báo giá</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
              <div className="text-slate-600 text-xs">Đã chấp nhận</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
              <div className="text-slate-600 text-xs">Hoàn thành</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="text-slate-600 text-xs">Đã hủy</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.responseTime}</div>
              <div className="text-slate-600 text-xs">Phút TB</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-600">{stats.satisfactionRate}%</div>
              <div className="text-slate-600 text-xs">Hài lòng</div>
            </CardContent>
          </Card>
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
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full lg:w-56 pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl text-base transition-all duration-300">
                  <SelectValue placeholder="Lọc theo thời gian" />
                </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 shadow-xl">
                    <SelectItem value="all" className="rounded-lg">Tất cả thời gian</SelectItem>
                    <SelectItem value="today" className="rounded-lg">📅 Hôm nay</SelectItem>
                    <SelectItem value="week" className="rounded-lg">📆 7 ngày qua</SelectItem>
                    <SelectItem value="month" className="rounded-lg">🗓️ 30 ngày qua</SelectItem>
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
                    <RefreshCw className="h-10 w-10 animate-spin text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-gray-800">Đang tải dữ liệu...</h3>
                  <p className="text-gray-600 text-lg">Vui lòng đợi trong giây lát</p>
                </div>
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
                {filteredRequests.map((request) => (
                    <div 
                      key={request.id} 
                      className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
                      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        {/* Request Info */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-blue-600">#{request.id}</span>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium">{request.user?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-green-600" />
                                <span className="text-sm">{request.user?.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-600" />
                              <span className="text-sm">{formatDate(request.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="xl:col-span-2 space-y-3">
                          <h4 className="font-medium text-gray-700">Mô tả sự cố:</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-orange-500">
                            {request.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}</span>
                          </div>
                        </div>

                          {/* Garage Info & Actions */}
                        <div className="space-y-3">
                          {request.garage ? (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Garage phụ trách:</h4>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{request.garage.name}</p>
                                <p className="text-sm text-gray-600">{request.garage.phone}</p>
                                <p className="text-xs text-gray-500">{request.garage.address}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <Building className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Chưa có garage</p>
                            </div>
                          )}
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`/emergency/${request.id}`, '_blank')}
                                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="w-full border-gray-300 hover:bg-gray-50 text-gray-700"
                                  >
                                    <MoreVertical className="h-4 w-4 mr-2" />
                                    Hành động
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
                                  
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      // Copy request info to clipboard
                                      const requestInfo = `
ID: ${request.id}
Khách hàng: ${request.user?.name || 'N/A'}
SĐT: ${request.user?.phone || 'N/A'}
Mô tả: ${request.description}
Trạng thái: ${request.status}
Thời gian: ${formatDate(request.createdAt)}
                                      `.trim()
                                      navigator.clipboard.writeText(requestInfo)
                                      toast({
                                        title: "Đã sao chép",
                                        description: "Thông tin yêu cầu đã được sao chép vào clipboard",
                                      })
                                    }}
                                    className="text-green-700 hover:bg-green-50 cursor-pointer"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Sao chép thông tin
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
