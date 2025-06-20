"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  Car,
  Wrench,
  MessageCircle,
  Star,
  FileText,
} from "lucide-react"

// Mock tracking data
const mockBookings = [
  {
    id: "BK001",
    garage: {
      name: "Garage Thành Công",
      address: "123 Lê Lợi, Q1, TP.HCM",
      phone: "0909123456",
    },
    service: "Thay nhớt xe máy",
    vehicle: "Honda Wave 2020",
    scheduledDate: "2024-12-22",
    scheduledTime: "09:00",
    status: "in-progress",
    progress: 60,
    estimatedCompletion: "10:30",
    updates: [
      {
        time: "08:45",
        status: "started",
        message: "Xe đã được tiếp nhận, bắt đầu kiểm tra",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        time: "09:15",
        status: "diagnosis",
        message: "Đã kiểm tra xong, cần thay nhớt và lọc gió",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        time: "09:45",
        status: "working",
        message: "Đang thực hiện thay nhớt và bảo dưỡng",
        image: null,
      },
    ],
    totalCost: "120,000 VNĐ",
  },
  {
    id: "BK002",
    garage: {
      name: "Garage ABC",
      address: "456 Nguyễn Huệ, Q1, TP.HCM",
      phone: "0909234567",
    },
    service: "Sửa phanh ô tô",
    vehicle: "Toyota Vios 2019",
    scheduledDate: "2024-12-21",
    scheduledTime: "14:00",
    status: "completed",
    progress: 100,
    completedTime: "16:30",
    updates: [
      {
        time: "14:00",
        status: "started",
        message: "Xe đã được tiếp nhận",
        image: null,
      },
      {
        time: "14:30",
        status: "diagnosis",
        message: "Kiểm tra hệ thống phanh, cần thay má phanh trước",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        time: "15:00",
        status: "working",
        message: "Đang thay má phanh và kiểm tra dầu phanh",
        image: "/placeholder.svg?height=100&width=150",
      },
      {
        time: "16:30",
        status: "completed",
        message: "Hoàn thành sửa chữa, xe đã được test thử",
        image: "/placeholder.svg?height=100&width=150",
      },
    ],
    totalCost: "850,000 VNĐ",
    rating: 5,
    review: "Dịch vụ tuyệt vời, nhân viên chuyên nghiệp!",
  },
]

export default function TrackingPage() {
  const [selectedBooking, setSelectedBooking] = useState(mockBookings[0])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "confirmed":
        return "bg-blue-100 text-blue-700"
      case "in-progress":
        return "bg-orange-100 text-orange-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận"
      case "confirmed":
        return "Đã xác nhận"
      case "in-progress":
        return "Đang sửa chữa"
      case "completed":
        return "Hoàn thành"
      case "cancelled":
        return "Đã hủy"
      default:
        return "Không xác định"
    }
  }

  const getUpdateIcon = (status: string) => {
    switch (status) {
      case "started":
        return <Car className="h-4 w-4 text-blue-600" />
      case "diagnosis":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "working":
        return <Wrench className="h-4 w-4 text-purple-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <DashboardLayout
      allowedRoles={["user", "admin", "garage"]}
      title="Theo dõi tiến độ sửa xe"
      description="Cập nhật realtime về tình trạng xe của bạn"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Booking List */}
        <div className="lg:col-span-1">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle>Lịch hẹn của bạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedBooking.id === booking.id
                      ? "border-blue-200 bg-blue-50"
                      : "border-slate-200 hover:border-blue-200"
                  }`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{booking.garage.name}</h4>
                      <p className="text-xs text-slate-600">{booking.service}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {booking.scheduledDate} • {booking.scheduledTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="h-3 w-3" />
                      <span>{booking.vehicle}</span>
                    </div>
                  </div>

                  {booking.status === "in-progress" && (
                    <div className="mt-2">
                      <Progress value={booking.progress} className="h-2" />
                      <p className="text-xs text-slate-600 mt-1">{booking.progress}% hoàn thành</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tracking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Status */}
          <Card className="border-blue-100">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Mã đơn: {selectedBooking.id}</span>
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {getStatusText(selectedBooking.status)}
                    </Badge>
                  </CardTitle>
                  <p className="text-slate-600">{selectedBooking.service}</p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <p>Cập nhật lúc</p>
                  <p className="font-medium">{currentTime.toLocaleTimeString("vi-VN")}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Thông tin garage</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{selectedBooking.garage.name}</p>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedBooking.garage.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Phone className="h-3 w-3" />
                      <span>{selectedBooking.garage.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Thông tin xe</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{selectedBooking.vehicle}</p>
                    <p className="text-slate-600">Dịch vụ: {selectedBooking.service}</p>
                    <p className="text-slate-600">
                      Lịch hẹn: {selectedBooking.scheduledDate} lúc {selectedBooking.scheduledTime}
                    </p>
                  </div>
                </div>
              </div>

              {selectedBooking.status === "in-progress" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Tiến độ thực hiện</h4>
                    <span className="text-sm text-slate-600">
                      Dự kiến hoàn thành: {selectedBooking.estimatedCompletion}
                    </span>
                  </div>
                  <Progress value={selectedBooking.progress} className="h-3" />
                  <p className="text-sm text-slate-600">{selectedBooking.progress}% hoàn thành</p>
                </div>
              )}

              {selectedBooking.status === "completed" && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Xe đã được sửa chữa hoàn thành lúc {selectedBooking.completedTime}. Tổng chi phí:{" "}
                    <strong>{selectedBooking.totalCost}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Progress Timeline */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Lịch sử cập nhật</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedBooking.updates.map((update, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {getUpdateIcon(update.status)}
                      </div>
                      {index < selectedBooking.updates.length - 1 && (
                        <div className="w-0.5 h-12 bg-slate-200 mt-2"></div>
                      )}
                    </div>

                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{update.message}</h4>
                        <span className="text-xs text-slate-500">{update.time}</span>
                      </div>

                      {update.image && (
                        <div className="mt-2">
                          <img
                            src={update.image || "/placeholder.svg"}
                            alt="Cập nhật tiến độ"
                            className="w-32 h-20 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle>Thao tác</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-600"
                  onClick={() => window.open(`tel:${selectedBooking.garage.phone}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Gọi garage
                </Button>

                <Button variant="outline" className="border-blue-200 text-blue-600">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat với garage
                </Button>

                {selectedBooking.status === "completed" && !selectedBooking.rating && (
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Star className="h-4 w-4 mr-2" />
                    Đánh giá dịch vụ
                  </Button>
                )}

                {selectedBooking.status === "completed" && (
                  <Button variant="outline" className="border-blue-200 text-blue-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Tải hóa đơn
                  </Button>
                )}
              </div>

              {selectedBooking.status === "completed" && selectedBooking.rating && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Đánh giá của bạn</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < selectedBooking.rating! ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-green-700">{selectedBooking.rating}/5 sao</span>
                  </div>
                  <p className="text-sm text-green-700">"{selectedBooking.review}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
