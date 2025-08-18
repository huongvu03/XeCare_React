"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar, 
  Clock,
  User,
  Phone,
  Car,
  MapPin,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Loader2,
  Plus,
  Filter,
  Search
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getMyGarageById } from "@/lib/api/UserApi"
import type { GarageInfo } from "@/hooks/use-auth"

// Mock appointment data
interface Appointment {
  id: number
  customerName: string
  customerPhone: string
  customerEmail: string
  vehicleInfo: string
  serviceName: string
  appointmentDate: string
  appointmentTime: string
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  notes?: string
  totalPrice?: number
  createdAt: string
}

const mockAppointments: Appointment[] = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    customerPhone: "0123456789",
    customerEmail: "nguyenvana@gmail.com",
    vehicleInfo: "Honda Wave Alpha - 51G-12345",
    serviceName: "Thay nhớt xe máy",
    appointmentDate: "2024-12-20",
    appointmentTime: "14:00",
    status: "CONFIRMED",
    notes: "Khách hàng yêu cầu thay nhớt 4T",
    totalPrice: 150000,
    createdAt: "2024-12-18T10:30:00Z"
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    customerPhone: "0987654321",
    customerEmail: "tranthib@gmail.com",
    vehicleInfo: "Yamaha Exciter - 51F-67890",
    serviceName: "Sửa phanh xe máy",
    appointmentDate: "2024-12-20",
    appointmentTime: "15:30",
    status: "PENDING",
    notes: "Phanh trước bị mềm",
    totalPrice: 300000,
    createdAt: "2024-12-18T11:15:00Z"
  },
  {
    id: 3,
    customerName: "Lê Văn C",
    customerPhone: "0369852147",
    customerEmail: "levanc@gmail.com",
    vehicleInfo: "Suzuki GSX-R150 - 51H-11111",
    serviceName: "Bảo dưỡng định kỳ",
    appointmentDate: "2024-12-21",
    appointmentTime: "09:00",
    status: "COMPLETED",
    notes: "Đã hoàn thành bảo dưỡng",
    totalPrice: 500000,
    createdAt: "2024-12-17T14:20:00Z"
  }
]

export default function AppointmentsPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const garageId = Number(params.garageId)
  
  const [garage, setGarage] = useState<GarageInfo | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        // Kiểm tra quyền sở hữu
        const isOwner = user && user.garages && user.garages.some(g => g.id === garageId)
        if (!isOwner) {
          setError("Bạn không có quyền quản lý garage này")
          setLoading(false)
          return
        }

        // Load garage info
        const response = await getMyGarageById(garageId)
        setGarage(response.data)
        
        // Load appointments (mock data for now)
        setAppointments(mockAppointments)
        
        setLoading(false)
      } catch (err: any) {
        console.error("Error loading data:", err)
        setError("Không thể tải dữ liệu")
        setLoading(false)
      }
    }

    if (garageId) {
      loadData()
    }
  }, [garageId, user])

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
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = selectedStatus === "ALL" || appointment.status === selectedStatus
    const matchesSearch = appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.customerPhone.includes(searchTerm) ||
                         appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusCount = (status: string) => {
    return appointments.filter(a => a.status === status).length
  }

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "USER_AND_GARAGE", "GARAGE", "ADMIN"]}
        title="Quản lý lịch hẹn"
        description="Đang tải..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error && !garage) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "USER_AND_GARAGE", "GARAGE", "ADMIN"]}
        title="Lỗi"
        description="Không thể tải dữ liệu"
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
      allowedRoles={["USER", "USER_AND_GARAGE", "GARAGE", "ADMIN"]}
      title={`Quản lý lịch hẹn - ${garage?.name}`}
      description="Quản lý lịch hẹn của garage"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push(`/garage/${garageId}?owner=true`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo lịch hẹn mới
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card className="border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{appointments.length}</p>
                  <p className="text-sm text-slate-600">Tổng lịch hẹn</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{getStatusCount("PENDING")}</p>
                  <p className="text-sm text-slate-600">Chờ xác nhận</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{getStatusCount("CONFIRMED")}</p>
                  <p className="text-sm text-slate-600">Đã xác nhận</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{getStatusCount("IN_PROGRESS")}</p>
                  <p className="text-sm text-slate-600">Đang thực hiện</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{getStatusCount("COMPLETED")}</p>
                  <p className="text-sm text-slate-600">Hoàn thành</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-gray-100">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, số điện thoại, dịch vụ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="IN_PROGRESS">Đang thực hiện</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Danh sách lịch hẹn ({filteredAppointments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Chưa có lịch hẹn nào</h3>
                <p className="text-slate-600">Hãy tạo lịch hẹn đầu tiên cho garage của bạn!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-slate-900">{appointment.customerName}</h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-600">{appointment.customerPhone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Car className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-600">{appointment.vehicleInfo}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-600">
                                {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')} - {appointment.appointmentTime}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-slate-900">Dịch vụ:</span>
                              <span className="text-slate-600">{appointment.serviceName}</span>
                            </div>
                            {appointment.totalPrice && (
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-slate-900">Giá:</span>
                                <span className="text-green-600 font-semibold">
                                  {appointment.totalPrice.toLocaleString('vi-VN')} VNĐ
                                </span>
                              </div>
                            )}
                            {appointment.notes && (
                              <div className="flex items-start space-x-2">
                                <span className="font-medium text-slate-900">Ghi chú:</span>
                                <span className="text-slate-600 text-sm">{appointment.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          Xem chi tiết
                        </Button>
                        {appointment.status === "PENDING" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Xác nhận
                            </Button>
                            <Button size="sm" variant="destructive">
                              Từ chối
                            </Button>
                          </>
                        )}
                        {appointment.status === "CONFIRMED" && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Bắt đầu
                          </Button>
                        )}
                        {appointment.status === "IN_PROGRESS" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Hoàn thành
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
