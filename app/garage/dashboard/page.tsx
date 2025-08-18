"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Calendar, MapPin, Phone, Clock, Edit, Plus, Users, TrendingUp } from "lucide-react"
import { getGarageById, type Garage } from "@/lib/api/GarageApi"
import { useAuth } from "@/hooks/use-auth"

export default function GarageDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [garage, setGarage] = useState<Garage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Load garage info
  useEffect(() => {
    const loadGarage = async () => {
      try {
        // TODO: Get garage by owner ID from user
        // For now, we'll show a placeholder
        setLoading(false)
      } catch (err: any) {
        setError("Không thể tải thông tin garage. Vui lòng thử lại.")
        setLoading(false)
      }
    }

    if (user) {
      loadGarage()
    }
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700"
      case "INACTIVE":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động"
      case "PENDING":
        return "Chờ phê duyệt"
      case "INACTIVE":
        return "Không hoạt động"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["garage"]}
        title="Dashboard Garage"
        description="Đang tải thông tin..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Đang tải thông tin garage...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // If no garage registered yet
  if (!garage) {
    return (
      <DashboardLayout
        allowedRoles={["garage"]}
        title="Dashboard Garage"
        description="Chào mừng bạn đến với XeCare"
      >
        <div className="max-w-2xl mx-auto">
          <Card className="border-blue-100">
            <CardContent className="p-8 text-center">
              <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Chào mừng bạn đến với XeCare!
              </h2>
              <p className="text-slate-600 mb-6">
                Bạn chưa đăng ký garage. Hãy đăng ký ngay để bắt đầu nhận lịch hẹn từ khách hàng.
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-cyan-600"
                onClick={() => router.push("/garage/register")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Đăng ký Garage
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["garage"]}
      title="Dashboard Garage"
      description={`Quản lý ${garage.name}`}
    >
      {/* Garage Status */}
      <Card className="border-blue-100 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{garage.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{garage.address}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(garage.status)}>
                {getStatusText(garage.status)}
              </Badge>
              {garage.isVerified && (
                <Badge className="bg-blue-100 text-blue-700">Đã xác thực</Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/garage/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Alert */}
      {garage.status === "PENDING" && (
        <Alert className="border-yellow-200 bg-yellow-50 mb-6">
          <AlertDescription className="text-yellow-700">
            <strong>Thông báo:</strong> Garage của bạn đang chờ phê duyệt từ admin. 
            Bạn sẽ có thể nhận lịch hẹn sau khi được phê duyệt.
          </AlertDescription>
        </Alert>
      )}

      {garage.status === "INACTIVE" && (
        <Alert className="border-red-200 bg-red-50 mb-6">
          <AlertDescription className="text-red-700">
            <strong>Thông báo:</strong> Garage của bạn hiện không hoạt động. 
            Vui lòng liên hệ admin để được kích hoạt lại.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card className="border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Lịch hẹn hôm nay</p>
                <p className="text-xl font-semibold text-slate-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Khách hàng mới</p>
                <p className="text-xl font-semibold text-slate-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Doanh thu tháng</p>
                <p className="text-xl font-semibold text-slate-900">0đ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Đánh giá trung bình</p>
                <p className="text-xl font-semibold text-slate-900">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Quản lý lịch hẹn</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Xem và quản lý các lịch hẹn từ khách hàng
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
              onClick={() => router.push("/garage/appointments")}
            >
              Xem lịch hẹn
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-blue-600" />
              <span>Cập nhật thông tin</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Cập nhật thông tin garage và dịch vụ
            </p>
            <Button 
              variant="outline" 
              className="w-full border-blue-200 text-blue-600"
              onClick={() => router.push("/garage/edit")}
            >
              Chỉnh sửa
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Garage Information */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Thông tin cơ bản</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">Số điện thoại:</span>
              <span className="font-medium">{garage.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">Giờ làm việc:</span>
              <span className="font-medium">{garage.openTime} - {garage.closeTime}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">Địa chỉ:</span>
              <span className="font-medium">{garage.address}</span>
            </div>
            {garage.description && (
              <div className="pt-2 border-t">
                <p className="text-sm text-slate-600">{garage.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Dịch vụ & Loại xe</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Dịch vụ cung cấp:</h4>
              <div className="flex flex-wrap gap-2">
                {garage.services?.map(service => (
                  <Badge key={service.id} variant="outline" className="text-xs">
                    {service.serviceName}
                  </Badge>
                )) || (
                  <span className="text-sm text-slate-500">Chưa có dịch vụ</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Loại xe phục vụ:</h4>
              <div className="flex flex-wrap gap-2">
                {garage.vehicleTypes?.map(vehicleType => (
                  <Badge key={vehicleType.id} variant="outline" className="text-xs">
                    {vehicleType.vehicleTypeName}
                  </Badge>
                )) || (
                  <span className="text-sm text-slate-500">Chưa có loại xe</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
