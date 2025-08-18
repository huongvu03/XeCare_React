"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, Phone, Car, Eye, X, CheckCircle, AlertCircle } from "lucide-react"
import { getUserAppointments, cancelAppointment, type Appointment } from "@/lib/api/AppointmentApi"
import { useAuth } from "@/hooks/use-auth"

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filterStatus, setFilterStatus] = useState<string>("")

  // Load appointments
  const loadAppointments = async () => {
    try {
      setLoading(true)
      const response = await getUserAppointments({
        page: currentPage,
        size: 10,
        status: filterStatus || undefined
      })
      setAppointments(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err: any) {
      setError("Không thể tải danh sách lịch hẹn. Vui lòng thử lại.")
      console.error("Error loading appointments:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [currentPage, filterStatus])

  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) return

    try {
      await cancelAppointment(appointmentId)
      // Reload appointments
      loadAppointments()
    } catch (err: any) {
      setError("Không thể hủy lịch hẹn. Vui lòng thử lại.")
      console.error("Error canceling appointment:", err)
    }
  }

  // Get status color and text
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { color: "bg-yellow-100 text-yellow-700", text: "Chờ xác nhận", icon: AlertCircle }
      case "CONFIRMED":
        return { color: "bg-blue-100 text-blue-700", text: "Đã xác nhận", icon: CheckCircle }
      case "COMPLETED":
        return { color: "bg-green-100 text-green-700", text: "Hoàn thành", icon: CheckCircle }
      case "CANCELLED":
        return { color: "bg-gray-100 text-gray-700", text: "Đã hủy", icon: X }
      case "REJECTED":
        return { color: "bg-red-100 text-red-700", text: "Bị từ chối", icon: X }
      default:
        return { color: "bg-gray-100 text-gray-700", text: status, icon: AlertCircle }
    }
  }

  // Check if appointment can be cancelled (12 hours before)
  const canCancelAppointment = (appointment: Appointment) => {
    if (appointment.status !== "PENDING" && appointment.status !== "CONFIRMED") {
      return false
    }

    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`)
    const now = new Date()
    const hoursDiff = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return hoursDiff > 12
  }

  return (
    <DashboardLayout
      allowedRoles={["user"]}
      title="Lịch hẹn của tôi"
      description="Quản lý các lịch hẹn sửa xe"
    >
      {/* Filter */}
      <Card className="border-blue-100 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("")}
            >
              Tất cả
            </Button>
            <Button
              variant={filterStatus === "PENDING" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("PENDING")}
            >
              Chờ xác nhận
            </Button>
            <Button
              variant={filterStatus === "CONFIRMED" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("CONFIRMED")}
            >
              Đã xác nhận
            </Button>
            <Button
              variant={filterStatus === "COMPLETED" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("COMPLETED")}
            >
              Hoàn thành
            </Button>
            <Button
              variant={filterStatus === "CANCELLED" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("CANCELLED")}
            >
              Đã hủy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert className="border-red-200 bg-red-50 mb-6">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Đang tải lịch hẹn...</p>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <Card className="border-blue-100">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Chưa có lịch hẹn nào
              </h3>
              <p className="text-slate-600 mb-4">
                Bạn chưa có lịch hẹn nào. Hãy tìm garage và đặt lịch hẹn ngay!
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-cyan-600"
                onClick={() => window.location.href = "/search"}
              >
                Tìm garage ngay
              </Button>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => {
            const statusInfo = getStatusInfo(appointment.status)
            const StatusIcon = statusInfo.icon

            return (
              <Card key={appointment.id} className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Appointment Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            Lịch hẹn #{appointment.id}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Car className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {appointment.vehicleType?.name || "Chưa xác định"}
                            </span>
                          </div>
                        </div>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.text}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.garage?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.appointmentDate}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Phone className="h-4 w-4" />
                          <span>{appointment.contactPhone}</span>
                        </div>
                      </div>

                      {appointment.description && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-700 mb-1">Mô tả:</h4>
                          <p className="text-sm text-slate-600">{appointment.description}</p>
                        </div>
                      )}

                      {/* Services */}
                      {appointment.services && appointment.services.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-700 mb-2">Dịch vụ:</h4>
                          <div className="flex flex-wrap gap-2">
                            {appointment.services.map((service) => (
                              <Badge key={service.id} variant="outline" className="text-xs">
                                {service.serviceName} - {service.price.toLocaleString()}đ
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {appointment.rejectionReason && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertDescription className="text-red-700">
                            <strong>Lý do từ chối:</strong> {appointment.rejectionReason}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Notes */}
                      {appointment.notes && (
                        <Alert className="border-blue-200 bg-blue-50">
                          <AlertDescription className="text-blue-700">
                            <strong>Ghi chú:</strong> {appointment.notes}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 md:w-32">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Chi tiết
                      </Button>

                      {canCancelAppointment(appointment) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Hủy lịch
                        </Button>
                      )}

                      {!canCancelAppointment(appointment) && 
                       (appointment.status === "PENDING" || appointment.status === "CONFIRMED") && (
                        <div className="text-xs text-red-600 text-center">
                          Chỉ có thể hủy trước 12h
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Trước
          </Button>
          <span className="text-sm text-slate-600">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Sau
          </Button>
        </div>
      )}
    </DashboardLayout>
  )
}
