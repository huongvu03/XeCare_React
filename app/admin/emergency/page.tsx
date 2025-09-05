"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  AlertTriangle,
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  TrendingUp,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  Users,
  Building,
  CheckCircle2,
  XCircle,
  Clock3,
  DollarSign
} from 'lucide-react'
import EmergencyApi from '@/lib/api/EmergencyApi'
import { useToast } from '@/hooks/use-toast'

interface EmergencyRequest {
  id: number
  user: {
    id: number
    name: string
    phone: string
  }
  garage?: {
    id: number
    name: string
    phone: string
    address: string
  }
  description: string
  latitude: number
  longitude: number
  status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'CANCELLED' | 'COMPLETED'
  createdAt: string
  images: Array<{
    id: number
    imageUrl: string
  }>
}

export default function AdminEmergencyPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const { toast } = useToast()

  // Load emergency requests
  const loadRequests = async () => {
    try {
      setLoading(true)
      const response = await EmergencyApi.getAllRequests()
      
      if (response.data) {
        setRequests(response.data)
      } else {
        // Mock data for demo
        const mockData: EmergencyRequest[] = [
          {
            id: 1,
            user: { id: 1, name: "Nguyen Van A", phone: "0901234567" },
            garage: { id: 1, name: "Garage Lê Lợi", phone: "0903001001", address: "101 Lê Lợi, Q1" },
            description: "Xe bị hỏng máy, không khởi động được",
            latitude: 10.775,
            longitude: 106.700,
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            images: []
          },
          {
            id: 2,
            user: { id: 2, name: "Tran Thi B", phone: "0901234568" },
            garage: { id: 2, name: "Garage Văn Cừ", phone: "0903001002", address: "55 Nguyễn Văn Cừ, Q5" },
            description: "Lốp xe bị thủng, cần thay lốp mới",
            latitude: 10.755,
            longitude: 106.660,
            status: 'ACCEPTED',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            images: []
          },
          {
            id: 3,
            user: { id: 3, name: "Le Van C", phone: "0901234569" },
            description: "Xe bị chết máy giữa đường",
            latitude: 10.785,
            longitude: 106.688,
            status: 'PENDING',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            images: []
          }
        ]
        setRequests(mockData)
      }
    } catch (error) {
      console.error('Error loading requests:', error)
      toast({
        title: "Thông báo",
        description: "Đang sử dụng dữ liệu demo (backend không khả dụng)",
      })
      
      // Mock data fallback
      const mockData: EmergencyRequest[] = [
        {
          id: 1,
          user: { id: 1, name: "Nguyen Van A", phone: "0901234567" },
          garage: { id: 1, name: "Garage Lê Lợi", phone: "0903001001", address: "101 Lê Lợi, Q1" },
          description: "Xe bị hỏng máy, không khởi động được",
          latitude: 10.775,
          longitude: 106.700,
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          images: []
        },
        {
          id: 2,
          user: { id: 2, name: "Tran Thi B", phone: "0901234568" },
          garage: { id: 2, name: "Garage Văn Cừ", phone: "0903001002", address: "55 Nguyễn Văn Cừ, Q5" },
          description: "Lốp xe bị thủng, cần thay lốp mới",
          latitude: 10.755,
          longitude: 106.660,
          status: 'ACCEPTED',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          images: []
        },
        {
          id: 3,
          user: { id: 3, name: "Le Van C", phone: "0901234569" },
          description: "Xe bị chết máy giữa đường",
          latitude: 10.785,
          longitude: 106.688,
          status: 'PENDING',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          images: []
        }
      ]
      setRequests(mockData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  // Filter requests
  const filteredRequests = requests.filter(request => {
    // Status filter
    if (statusFilter !== 'all' && request.status !== statusFilter) {
      return false
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const requestDate = new Date(request.createdAt)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (dateFilter) {
        case 'today':
          if (diffDays > 0) return false
          break
        case 'week':
          if (diffDays > 7) return false
          break
        case 'month':
          if (diffDays > 30) return false
          break
      }
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        request.description.toLowerCase().includes(searchLower) ||
        request.user.name.toLowerCase().includes(searchLower) ||
        request.user.phone.includes(searchTerm) ||
        (request.garage?.name && request.garage.name.toLowerCase().includes(searchLower))
      )
    }
    
    return true
  })

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    quoted: requests.filter(r => r.status === 'QUOTED').length,
    accepted: requests.filter(r => r.status === 'ACCEPTED').length,
    completed: requests.filter(r => r.status === 'COMPLETED').length,
    cancelled: requests.filter(r => r.status === 'CANCELLED').length,
    responseTime: 25, // Average response time in minutes (mock)
    satisfactionRate: 94, // Customer satisfaction rate (mock)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>
      case 'QUOTED':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Đã báo giá</Badge>
      case 'ACCEPTED':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã chấp nhận</Badge>
      case 'COMPLETED':
        return <Badge variant="default" className="bg-emerald-600 text-white">Hoàn thành</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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

  const exportData = () => {
    const csvContent = [
      ['ID', 'Khách hàng', 'SĐT', 'Garage', 'Trạng thái', 'Ngày tạo', 'Mô tả'],
      ...filteredRequests.map(req => [
        req.id,
        req.user.name,
        req.user.phone,
        req.garage?.name || 'Chưa có',
        req.status,
        formatDate(req.createdAt),
        req.description.replace(/,/g, ';') // Replace commas to avoid CSV issues
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `emergency_requests_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast({
      title: "Thành công",
      description: "Đã xuất dữ liệu ra file CSV",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-full">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Emergency Management
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quản lý và giám sát toàn bộ hệ thống cứu hộ khẩn cấp
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={loadRequests} 
            disabled={loading} 
            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={exportData}
            className="flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Xuất CSV
          </Button>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-blue-100 text-xs">Tổng số</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-yellow-100 text-xs">Chờ xử lý</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.quoted}</div>
              <div className="text-blue-100 text-xs">Đã báo giá</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.accepted}</div>
              <div className="text-green-100 text-xs">Đã chấp nhận</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-emerald-100 text-xs">Hoàn thành</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.cancelled}</div>
              <div className="text-red-100 text-xs">Đã hủy</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-violet-500 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.responseTime}</div>
              <div className="text-purple-100 text-xs">Phút TB</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.satisfactionRate}%</div>
              <div className="text-cyan-100 text-xs">Hài lòng</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, SĐT, mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
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
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Lọc theo thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời gian</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              Danh sách yêu cầu cứu hộ ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có yêu cầu nào</h3>
                <p className="text-gray-500">Thử thay đổi bộ lọc để xem thêm kết quả</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
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
                              <span className="text-sm font-medium">{request.user.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{request.user.phone}</span>
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

                        {/* Garage Info */}
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
