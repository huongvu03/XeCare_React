"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Plus,
  Eye,
  Settings,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Calendar,
  Star,
  DollarSign
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getGaragesByOwner } from "@/lib/api/GarageApi"
import type { Garage } from "@/lib/api/GarageApi"

export default function GarageDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [myGarages, setMyGarages] = useState<Garage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadMyGarages = async () => {
      try {
        setLoading(true)
        const response = await getGaragesByOwner()
        setMyGarages(response.data)
        setLoading(false)
      } catch (err: any) {
        console.error("Error loading garages:", err)
        setError("Không thể tải danh sách garage")
        setLoading(false)
      }
    }

    if (user) {
      loadMyGarages()
    }
  }, [user])

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE", "ADMIN"]}
        title="Quản lý Garage"
        description="Đang tải..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Đang tải danh sách garage...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE", "ADMIN"]}
        title="Quản lý Garage"
        description="Có lỗi xảy ra"
      >
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE", "ADMIN"]}
      title="Quản lý Garage"
      description="Danh sách garage của bạn"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý Garage</h1>
            <p className="text-slate-600">Quản lý tất cả garage của bạn</p>
          </div>
          <Button
            onClick={() => router.push("/garage/register")}
            className="bg-gradient-to-r from-green-600 to-emerald-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Đăng ký Garage mới
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{myGarages.length}</p>
                  <p className="text-sm text-slate-600">Tổng số garage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {myGarages.filter(g => g.status === "ACTIVE").length}
                  </p>
                  <p className="text-sm text-slate-600">Đang hoạt động</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {myGarages.filter(g => g.status === "PENDING").length}
                  </p>
                  <p className="text-sm text-slate-600">Chờ phê duyệt</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-red-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {myGarages.filter(g => g.status === "INACTIVE").length}
                  </p>
                  <p className="text-sm text-slate-600">Không hoạt động</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Garage List */}
        {myGarages.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-300">
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Chưa có garage nào</h3>
              <p className="text-slate-600 mb-4">Bắt đầu bằng cách đăng ký garage đầu tiên của bạn</p>
              <Button
                onClick={() => router.push("/garage/register")}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Đăng ký Garage
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGarages.map((garage) => (
              <Card key={garage.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate">{garage.name}</CardTitle>
                    <StatusBadge status={garage.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{garage.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{garage.phone}</span>
                  </div>
                  
                  {garage.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {garage.description}
                    </p>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/garage/${garage.id}?owner=true`)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/garage/${garage.id}/edit`)}
                      className="flex-1"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Chỉnh sửa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { label: "Hoạt động", className: "bg-green-100 text-green-700" }
      case "PENDING":
        return { label: "Chờ phê duyệt", className: "bg-yellow-100 text-yellow-700" }
      case "INACTIVE":
        return { label: "Không hoạt động", className: "bg-red-100 text-red-700" }
      case "PENDING_UPDATE":
        return { label: "Chờ cập nhật", className: "bg-blue-100 text-blue-700" }
      default:
        return { label: "Không xác định", className: "bg-gray-100 text-gray-700" }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  )
}
