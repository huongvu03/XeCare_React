"use client";

<<<<<<< Updated upstream
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building, Calendar, Star, TrendingUp, Shield, Settings, BarChart3, AlertTriangle, Eye, RefreshCw, Loader2, Clock3, CheckCircle2, XCircle, AlertCircle, DollarSign, MapPin, Phone, User, MessageSquare, Building as BuildingIcon, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getGarageStats } from "@/lib/api/AdminApi"
import EmergencyApi from "@/lib/api/EmergencyApi"
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
=======
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building,
  Calendar,
  Star,
  TrendingUp,
  Shield,
  Settings,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { getGarageStats } from "@/lib/api/AdminApi";
>>>>>>> Stashed changes

export default function AdminDashboard() {
  const [garageStats, setGarageStats] = useState({
    totalGarages: 0,
    activeGarages: 0,
    pendingGarages: 0,
<<<<<<< Updated upstream
    inactiveGarages: 0
  })
  const [loading, setLoading] = useState(true)
  
  // Emergency Management State
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([])
  const [emergencyLoading, setEmergencyLoading] = useState(true)
  const [emergencyError, setEmergencyError] = useState<string | null>(null)
  const { toast } = useToast()

  // Load emergency requests
  const loadEmergencyRequests = async () => {
    try {
      setEmergencyLoading(true)
      setEmergencyError(null)
      console.log('🚀 [Admin] Loading emergency requests...')
      
      const response = await EmergencyApi.getAllRequests()
      console.log('✅ [Admin] Emergency API Response:', response)
      
      if (response.data) {
        setEmergencyRequests(response.data)
        console.log(`📊 [Admin] Loaded ${response.data.length} emergency requests`)
        
        toast({
          title: "Thành công", 
          description: `Đã tải ${response.data.length} yêu cầu cứu hộ`,
        })
      } else {
        console.log('⚠️ [Admin] No data received from API')
        setEmergencyRequests([])
      }
    } catch (error: any) {
      console.error('❌ [Admin] Error loading emergency requests:', error)
      setEmergencyRequests([])
      setEmergencyError('Không thể tải dữ liệu yêu cầu cứu hộ')
      
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu yêu cầu cứu hộ",
        variant: "destructive",
      })
    } finally {
      setEmergencyLoading(false)
    }
  }
=======
    inactiveGarages: 0,
  });
  const [loading, setLoading] = useState(true);
>>>>>>> Stashed changes

  useEffect(() => {
    const fetchGarageStats = async () => {
      try {
        const response = await getGarageStats();
        setGarageStats(response.data);
      } catch (error) {
        console.error("Error fetching garage stats:", error);
      } finally {
        setLoading(false);
      }
    };

<<<<<<< Updated upstream
    fetchGarageStats()
    loadEmergencyRequests()
  }, [])
=======
    fetchGarageStats();
  }, []);
>>>>>>> Stashed changes

  // Số đơn chờ duyệt (PENDING)
  const totalPendingRequests = garageStats.pendingGarages;

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

  // Calculate emergency stats
  const emergencyStats = {
    total: emergencyRequests.length,
    pending: emergencyRequests.filter(r => r.status === 'PENDING').length,
    quoted: emergencyRequests.filter(r => r.status === 'QUOTED').length,
    accepted: emergencyRequests.filter(r => r.status === 'ACCEPTED').length,
    completed: emergencyRequests.filter(r => r.status === 'COMPLETED').length,
    cancelled: emergencyRequests.filter(r => r.status === 'CANCELLED').length,
  }

  return (
    <DashboardLayout
      allowedRoles={["ADMIN"]}
      title="Admin Dashboard"
      description="Quản lý toàn bộ hệ thống XeCare"
    >
      {/* System Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-blue-600">50,234</p>
                <p className="text-xs text-green-600">+12% tháng này</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Garage hoạt động</p>
                <p className="text-2xl font-bold text-green-600">1,045</p>
                <p className="text-xs text-green-600">+8% tháng này</p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Lịch hẹn hôm nay</p>
                <p className="text-2xl font-bold text-purple-600">2,156</p>
                <p className="text-xs text-green-600">+5% hôm qua</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Đánh giá TB</p>
                <p className="text-2xl font-bold text-yellow-600">4.7</p>
                <p className="text-xs text-green-600">+0.1 tháng này</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Stats */}
        <Card className="border-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Yêu cầu cứu hộ</p>
                <p className="text-2xl font-bold text-red-600">{emergencyStats.total}</p>
                <p className="text-xs text-orange-600">{emergencyStats.pending} chờ xử lý</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Quản lý người dùng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Xem, tìm kiếm và quản lý tài khoản user
            </p>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
              asChild
            >
              <Link href="/admin/users">Quản lý Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-blue-600" />
                <span>Quản lý garage</span>
              </div>
              {totalPendingRequests > 0 && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">
                    {totalPendingRequests} đơn chờ
                  </span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Duyệt đăng ký và quản lý garage
            </p>
            <Button
              variant={totalPendingRequests > 0 ? "default" : "outline"}
              className={`w-full ${
                totalPendingRequests > 0
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "border-blue-200 text-blue-600"
              }`}
              asChild
            >
              <Link href="/admin/garages">
                {totalPendingRequests > 0
                  ? `Xử lý ${totalPendingRequests} đơn`
                  : "Quản lý Garages"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Duyệt nội dung</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Kiểm duyệt đánh giá và báo cáo
            </p>
            <Button
              variant="outline"
              className="w-full border-blue-200 text-blue-600"
              asChild
            >
              <Link href="/admin/reviews">Kiểm duyệt</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Thống kê & Báo cáo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Xem báo cáo chi tiết và phân tích
            </p>
            <Button
              variant="outline"
              className="w-full border-blue-200 text-blue-600"
              asChild
            >
              <Link href="/admin/analytics">Xem báo cáo</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Settings className="h-5 w-5 text-blue-600" />
              <span>Cài đặt hệ thống</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Cấu hình và cài đặt hệ thống
            </p>
            <Button
              variant="outline"
              className="w-full border-blue-200 text-blue-600"
            >
              Cài đặt
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Phân tích dữ liệu</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Phân tích xu hướng và hiệu suất
            </p>
            <Button
              variant="outline"
              className="w-full border-blue-200 text-blue-600"
              asChild
            >
              <Link href="/admin/data-analysis">Phân tích</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Management Card */}
        <Card className="border-red-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Quản lý Cứu hộ</span>
              </div>
              {emergencyStats.pending > 0 && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">
                    {emergencyStats.pending} chờ xử lý
                  </span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Quản lý yêu cầu cứu hộ khẩn cấp
              {emergencyStats.pending > 0 && (
                <span className="text-orange-600 font-medium">
                  {" "}- {emergencyStats.pending} yêu cầu chờ xử lý
                </span>
              )}
            </p>
            <Button 
              variant={emergencyStats.pending > 0 ? "default" : "outline"} 
              className={`w-full ${emergencyStats.pending > 0 ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-600"}`} 
              asChild
            >
              <Link href="/admin/emergency">
                {emergencyStats.pending > 0 ? `Xử lý ${emergencyStats.pending} yêu cầu` : "Quản lý Cứu hộ"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">
                    Garage mới đăng ký
                  </p>
                  <p className="text-sm text-slate-600">Garage ABC - TP.HCM</p>
                  <p className="text-sm text-blue-600">5 phút trước</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                  Chờ duyệt
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Đánh giá mới</p>
                  <p className="text-sm text-slate-600">
                    User đánh giá Garage XYZ
                  </p>
                  <p className="text-sm text-blue-600">10 phút trước</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  Đã duyệt
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Emergency Requests */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Yêu cầu cứu hộ gần đây</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={loadEmergencyRequests}
                disabled={emergencyLoading}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${emergencyLoading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emergencyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                <span className="ml-2 text-slate-600">Đang tải...</span>
              </div>
            ) : emergencyError ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 text-sm">{emergencyError}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadEmergencyRequests}
                  className="mt-2 border-red-200 text-red-600"
                >
                  Thử lại
                </Button>
              </div>
            ) : emergencyRequests.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 text-sm">Chưa có yêu cầu cứu hộ nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {emergencyRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900">#{request.id}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-slate-600 mb-1">
                        {request.user?.name || 'N/A'} - {request.description?.substring(0, 50)}...
                      </p>
                      <p className="text-xs text-red-600">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-8 h-8 border-red-300 hover:bg-red-100 text-red-700 rounded-lg p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
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
                            window.open('/admin/emergency', '_blank')
                          }}
                          className="text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Quản lý
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
                {emergencyRequests.length > 3 && (
                  <div className="text-center pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('/admin/emergency', '_blank')}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Xem tất cả ({emergencyRequests.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle>Cảnh báo hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="font-medium text-yellow-800">Cần kiểm tra</p>
                <p className="text-sm text-yellow-700">
                  5 garage chưa cập nhật thông tin trong 30 ngày
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="font-medium text-red-800">Báo cáo spam</p>
                <p className="text-sm text-red-700">
                  2 báo cáo về đánh giá spam cần xử lý
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
