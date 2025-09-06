"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar, 
  MapPin, 
  Star, 
  Car, 
  Building2, 
  Clock,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Settings,
  Loader2,
  Heart,
  Bell,
  Gift
} from "lucide-react"
import { VehicleManagement } from "@/components/vehicle-management"
import { useAuth } from "@/hooks/use-auth"
import { getUserProfile } from "@/lib/api/UserApi"
import { getGaragesByOwner } from "@/lib/api/GarageApi"
import { getUserAppointments, getPendingAppointmentsCount, type Appointment } from "@/lib/api/AppointmentApi"
import type { User } from "@/lib/api/UserApi"
import type { Garage } from "@/lib/api/GarageApi"

export default function UnifiedDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, updateUser, refreshUser, isUser, isGarageOwner, hasGarages } = useAuth()
  const [activeTab, setActiveTab] = useState("user")
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState("")
  
  // My Garages Tab
  const [myGarages, setMyGarages] = useState<Garage[]>([])
  const [myGaragesLoading, setMyGaragesLoading] = useState(true)
  const [myGaragesError, setMyGaragesError] = useState("")

  // Recent Appointments
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(true)
  const [garagePendingCounts, setGaragePendingCounts] = useState<Record<number, number>>({})
  
  // Dashboard Statistics
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0)
  const [totalPendingCount, setTotalPendingCount] = useState(0)

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Set active tab based on URL parameter and force refresh if role is GARAGE
  useEffect(() => {
    if (!isClient) return
    
    const tabParam = searchParams.get('tab')
    if (tabParam === 'garage') {
      setActiveTab('garage')
      // If user role is GARAGE but no garages loaded, force refresh
      if (user && user.role === 'GARAGE' && (!user.garages || user.garages.length === 0)) {
        // Force refresh user profile to get latest garage data
        refreshUser()
      }
    } else if (tabParam === 'user') {
      setActiveTab('user')
    } else if (!tabParam) {
      // Default to user tab if no tab specified and redirect with tab parameter
      setActiveTab('user')
      router.push('/dashboard?tab=user')
    }
  }, [isClient, searchParams, user, refreshUser, router])

  // Force reload user data when component mounts with garage tab
  useEffect(() => {
    // Ensure we're on client side to avoid hydration issues
    if (typeof window === 'undefined') return
    
    const tabParam = searchParams.get('tab')
    if (tabParam === 'garage' && user && user.role === 'GARAGE') {
      // Force refresh to ensure we have latest garage data
      const forceRefresh = async () => {
        try {
          const token = localStorage.getItem('token')
          if (token) {
            const response = await fetch('http://localhost:8080/apis/user/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            if (response.ok) {
              const latestUserData = await response.json()
              updateUser(latestUserData)
            }
          }
        } catch (error) {
          console.error('Error force refreshing user data:', error)
        }
      }
      forceRefresh()
    }
  }, [searchParams, user, updateUser]) // Dependencies for proper re-execution

  // Load user profile with garage information - only once when component mounts  
  useEffect(() => {
    // Ensure we're on client side to avoid hydration issues
    if (typeof window === 'undefined') return
    
    const loadUserProfile = async () => {
      if (user) {
        setUserProfile(user)
        setLoading(false)
        return
      }
      //if (!user) return
      
      try {
        const response = await getUserProfile()
        setUserProfile(response.data)
        updateUser(response.data)
        
        // Load recent appointments
        try {
          const appointmentsResponse = await getUserAppointments({
            page: 0,
            size: 5
          })
          setRecentAppointments(appointmentsResponse.data.content)
        } catch (appointmentErr) {
          console.error("Error loading appointments:", appointmentErr)
          // Don't fail the whole loading if appointments fail
        }
        
        setLoading(false)
        setAppointmentsLoading(false)
      } catch (err: any) {
        setError("Không thể tải thông tin người dùng")
        setLoading(false)
        setAppointmentsLoading(false)
      }
    }

    loadUserProfile()
  }, [user?.id]) // Empty dependency array - only run once

  // Load pending appointments count for each garage
  const loadGaragePendingCounts = async (garages: Garage[]) => {
    try {
      const counts: Record<number, number> = {}
      await Promise.all(
        garages.map(async (garage) => {
          try {
            const response = await getPendingAppointmentsCount(garage.id)
            counts[garage.id] = response.data.pendingCount
          } catch (err) {
            console.error(`Error loading pending count for garage ${garage.id}:`, err)
            counts[garage.id] = 0
          }
        })
      )
      setGaragePendingCounts(counts)
      
      // Calculate total pending count for all garages
      const totalPending = Object.values(counts).reduce((sum, count) => sum + count, 0)
      setTotalPendingCount(totalPending)
      
      // For now, set today's appointments to the same as pending (will be updated with real API later)
      setTodayAppointmentsCount(totalPending)
    } catch (error) {
      console.error("Error loading garage pending counts:", error)
    }
  }

  // Load my garages if user has garages - only once when user changes
  useEffect(() => {
    const loadMyGarages = async () => {
      if (user && user.garages && user.garages.length > 0) {
        try {
          setMyGaragesLoading(true)
          setMyGaragesError("")
          const response = await getGaragesByOwner()
          setMyGarages(response.data)
          
          // Load pending counts for each garage
          if (response.data.length > 0) {
            loadGaragePendingCounts(response.data)
          }
        } catch (err: any) {
          console.error("Error loading my garages:", err)
          setMyGaragesError("Không thể tải danh sách garage của bạn")
        } finally {
          setMyGaragesLoading(false)
        }
      } else {
        setMyGaragesLoading(false)
      }
    }

    loadMyGarages()
  }, [user?.id]) // Only depend on user ID, not the entire user object

  // Prevent hydration issues - don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE"]}
        title="Dashboard"
        description="Đang tải..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Đang tải thông tin...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE"]}
        title="Dashboard"
        description="Có lỗi xảy ra"
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
      case "INACTIVE":
        return <Badge className="bg-red-100 text-red-700">Bị khóa</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ duyệt</Badge>
      case "PENDING_UPDATE":
        return <Badge className="bg-orange-100 text-orange-700">Chờ cập nhật</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>
    }
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE"]}
      title="Dashboard"
      description="Quản lý tài khoản và garage của bạn"
    >
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value)
        // Update URL when tab changes
        router.push(`/dashboard?tab=${value}`)
      }} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="user" className="flex items-center space-x-2">
            <Car className="h-4 w-4" />
            <span>Người dùng</span>
          </TabsTrigger>
          {user && user.role === 'GARAGE' && (
            <TabsTrigger value="garage" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>My Garage</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* User Tab - Giữ nguyên như cũ */}
        <TabsContent value="user" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Tìm garage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">Tìm garage sửa xe gần bạn</p>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
                  onClick={() => router.push("/search/page1")}
                >
                  Tìm kiếm ngay
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Đặt lịch</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">Đặt lịch sửa xe trực tuyến</p>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 text-blue-600"
                  onClick={() => router.push("/search/page1")}
                >
                  Đặt lịch mới
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Car className="h-5 w-5 text-blue-600" />
                  <span>Cứu hộ</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">Gọi cứu hộ khẩn cấp 24/7</p>
                <Button variant="destructive" className="w-full"
                 onClick={() => router.push("/emergency")}>
                  Gọi cứu hộ
                </Button>
              </CardContent>
            </Card>

                         {/* Register Garage Button - Only show if user doesn't have garages */}
             {(!user || !user.garages || user.garages.length === 0) && (
              <Card className="border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <span>Đăng ký Garage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-4">Đăng ký garage của bạn để nhận lịch hẹn</p>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                    onClick={() => router.push("/garage/register")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Đăng ký ngay
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Favorites Card */}
            <Card className="border-red-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>Garage Yêu Thích</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">Quản lý danh sách garage yêu thích</p>
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600"
                  onClick={() => router.push("/favorites")}
                >
                  Xem yêu thích
                </Button>
              </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Thông Báo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">Xem tất cả thông báo của bạn</p>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 text-blue-600"
                  onClick={() => router.push("/notifications")}
                >
                  Xem thông báo
                </Button>
              </CardContent>
            </Card>

            {/* Reward Points Card */}
            <Card className="border-yellow-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Gift className="h-5 w-5 text-yellow-600" />
                  <span>Điểm Thưởng</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">Theo dõi điểm thưởng và lịch sử giao dịch</p>
                <Button 
                  variant="outline" 
                  className="w-full border-yellow-200 text-yellow-600"
                  onClick={() => router.push("/reward-points")}
                >
                  Xem điểm thưởng
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Management */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  <span>Quản lý xe của tôi</span>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600"
                  onClick={() => {/* TODO: Add vehicle modal */}}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm xe mới
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleManagement />
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Lịch hẹn gần đây</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : recentAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {recentAppointments.slice(0, 3).map((appointment) => {
                      const getStatusBadge = (status: string) => {
                        switch (status) {
                          case "PENDING":
                            return <Badge className="bg-yellow-100 text-yellow-700">Chờ xác nhận</Badge>
                          case "CONFIRMED":
                            return <Badge className="bg-blue-100 text-blue-700">Đã xác nhận</Badge>
                          case "IN_PROGRESS":
                            return <Badge className="bg-orange-100 text-orange-700">Đang thực hiện</Badge>
                          case "COMPLETED":
                            return <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>
                          case "REJECTED":
                            return <Badge className="bg-red-100 text-red-700">Đã từ chối</Badge>
                          case "CANCELLED":
                            return <Badge className="bg-gray-100 text-gray-700">Đã hủy</Badge>
                          default:
                            return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>
                        }
                      }

                      return (
                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{appointment.serviceName}</p>
                            <p className="text-sm text-slate-600">{appointment.garageName}</p>
                            <p className="text-sm text-blue-600">
                              {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')} 
                              {appointment.appointmentTime && ` - ${appointment.appointmentTime}`}
                            </p>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                      )
                    })}
                    {recentAppointments.length > 3 && (
                      <div className="text-center pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push("/user/appointments")}
                        >
                          Xem tất cả ({recentAppointments.length})
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm mb-2">Chưa có lịch hẹn nào</p>
                    <Button 
                      size="sm"
                      onClick={() => router.push("/search/page1")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Đặt lịch ngay
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span>Garage yêu thích</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Garage Thành Công</p>
                      <p className="text-sm text-slate-600">123 Lê Lợi, Q1, TP.HCM</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600">4.8 (120 đánh giá)</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Xem
                    </Button>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-slate-500 text-sm">Chưa có garage yêu thích nào khác</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

                 {/* My Garage Tab - Chỉ hiển thị nếu user có garage */}
         {user && user.garages && user.garages.length > 0 && (
          <TabsContent value="garage" className="space-y-6">
            {/* My Garages */}
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <span>Garage của tôi</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                    onClick={() => router.push("/garage/register")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm garage
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myGaragesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    <span className="ml-2 text-slate-600">Đang tải garage...</span>
                  </div>
                ) : myGaragesError ? (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{myGaragesError}</AlertDescription>
                  </Alert>
                ) : myGarages.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Chưa có garage nào</h3>
                    <p className="text-slate-600 mb-4">
                      Bạn chưa đăng ký garage nào. Hãy đăng ký garage đầu tiên của bạn!
                    </p>
                    {(user?.role === "USER" || user?.role === "GARAGE") && (
                      <Button
                        onClick={() => router.push("/garage/register")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Đăng ký Garage
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myGarages.map((garage) => (
                      <Card 
                        key={garage.id} 
                        className="border-slate-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                                                        onClick={() => router.push(`/garage/${garage.id}?owner=true`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">{garage.name}</h3>
                              {garagePendingCounts[garage.id] > 0 && (
                                <div 
                                  className="flex items-center space-x-1 mt-1 p-2 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/garage/${garage.id}/appointments`)
                                  }}
                                >
                                  <AlertCircle className="h-4 w-4 text-orange-500" />
                                  <span className="text-sm text-orange-600 font-medium">
                                    {garagePendingCounts[garage.id]} lịch hẹn cần duyệt
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col space-y-1">
                              {getStatusBadge(garage.status)}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{garage.address}</p>
                          <p className="text-sm text-slate-600 mb-3">{garage.phone}</p>
                          
                          {garage.status === "PENDING" && (
                            <Alert className="border-yellow-200 bg-yellow-50 mb-3">
                              <ClockIcon className="h-4 w-4" />
                              <AlertDescription className="text-yellow-700">
                                Đang chờ admin phê duyệt
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {garage.status === "ACTIVE" && (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Đã được phê duyệt</span>
                            </div>
                          )}
                          
                          {garage.status === "INACTIVE" && (
                            <Alert className="border-red-200 bg-red-50 mb-3">
                              <XCircle className="h-4 w-4" />
                              <AlertDescription className="text-red-700">
                                Garage không hoạt động
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-10 w-10 text-green-600" />
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {todayAppointmentsCount}
                      </p>
                      <p className="text-sm text-slate-600">Tổng lịch hẹn hôm nay</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-100">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-10 w-10 text-orange-600" />
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {totalPendingCount}
                      </p>
                      <p className="text-sm text-slate-600">Tổng lịch hẹn chờ xử lý</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  )
}
