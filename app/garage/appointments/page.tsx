"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Phone, Car, Search, Filter, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    service: "Thay nhớt xe máy",
    vehicleInfo: "Honda Wave 110cc - 29A1-12345",
    date: "2024-01-15",
    time: "09:00",
    duration: "30 phút",
    status: "pending",
    notes: "Khách hàng yêu cầu sử dụng nhớt cao cấp",
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    customerPhone: "0912345678",
    service: "Sửa phanh ô tô",
    vehicleInfo: "Toyota Vios 2020 - 51A-98765",
    date: "2024-01-15",
    time: "14:00",
    duration: "2 giờ",
    status: "confirmed",
    notes: "Thay má phanh trước và sau",
  },
  {
    id: 3,
    customerName: "Lê Văn C",
    customerPhone: "0923456789",
    service: "Bảo dưỡng định kỳ",
    vehicleInfo: "Yamaha Exciter 150 - 43B-11111",
    date: "2024-01-15",
    time: "16:30",
    duration: "1 giờ",
    status: "completed",
    notes: "Bảo dưỡng 5000km",
  },
  {
    id: 4,
    customerName: "Phạm Thị D",
    customerPhone: "0934567890",
    service: "Sửa chữa động cơ",
    vehicleInfo: "Honda City 2019 - 50F-22222",
    date: "2024-01-16",
    time: "08:00",
    duration: "4 giờ",
    status: "pending",
    notes: "Động cơ bị giật, cần kiểm tra hệ thống đánh lửa",
  },
  {
    id: 5,
    customerName: "Hoàng Văn E",
    customerPhone: "0945678901",
    service: "Thay lốp xe",
    vehicleInfo: "Suzuki Raider 150 - 47C-33333",
    date: "2024-01-16",
    time: "10:00",
    duration: "45 phút",
    status: "cancelled",
    notes: "Khách hàng hủy do bận việc đột xuất",
  },
]

const statusConfig = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: newStatus } : apt)))
  }

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.customerPhone.includes(searchTerm) ||
      apt.service.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || apt.status === statusFilter

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && apt.date === "2024-01-15") ||
      (dateFilter === "tomorrow" && apt.date === "2024-01-16")

    return matchesSearch && matchesStatus && matchesDate
  })

  const todayAppointments = appointments.filter((apt) => apt.date === "2024-01-15")
  const pendingCount = appointments.filter((apt) => apt.status === "pending").length
  const confirmedCount = appointments.filter((apt) => apt.status === "confirmed").length
  const completedCount = appointments.filter((apt) => apt.status === "completed").length

  return (
    <DashboardLayout
      allowedRoles={["garage"]}
      title="Quản lý lịch hẹn"
      description="Xem và xử lý lịch hẹn từ khách hàng"
    >
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Hôm nay</p>
                <p className="text-2xl font-bold text-blue-600">{todayAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Đã xác nhận</p>
                <p className="text-2xl font-bold text-blue-600">{confirmedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo tên, SĐT, dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ngày</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="tomorrow">Ngày mai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle>Danh sách lịch hẹn ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Không có lịch hẹn nào phù hợp</p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => {
                const StatusIcon = statusConfig[appointment.status as keyof typeof statusConfig].icon
                return (
                  <div
                    key={appointment.id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      {/* Left side - Main info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold text-slate-900">{appointment.customerName}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{appointment.customerPhone}</span>
                            </div>
                          </div>
                          <Badge className={statusConfig[appointment.status as keyof typeof statusConfig].color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[appointment.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{appointment.service}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Car className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{appointment.vehicleInfo}</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{appointment.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">
                                {appointment.time} ({appointment.duration})
                              </span>
                            </div>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="bg-slate-50 p-3 rounded-md">
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Ghi chú:</span> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        {appointment.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, "confirmed")}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Xác nhận
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(appointment.id, "cancelled")}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Từ chối
                            </Button>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, "completed")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Hoàn thành
                          </Button>
                        )}
                        {appointment.status === "completed" && (
                          <Badge className="bg-green-100 text-green-700 justify-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Đã hoàn thành
                          </Badge>
                        )}
                        {appointment.status === "cancelled" && (
                          <Badge className="bg-red-100 text-red-700 justify-center">
                            <XCircle className="h-3 w-3 mr-1" />
                            Đã hủy
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
