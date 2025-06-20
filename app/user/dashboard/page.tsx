"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Star, Clock, Car } from "lucide-react"

export default function UserDashboard() {
  return (
    <DashboardLayout
      allowedRoles={["user"]}
      title="Dashboard Người dùng"
      description="Quản lý lịch hẹn và tìm kiếm garage sửa xe"
    >
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
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">Tìm kiếm ngay</Button>
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
            <Button variant="outline" className="w-full border-blue-200 text-blue-600">
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
            <Button variant="destructive" className="w-full">
              Gọi cứu hộ
            </Button>
          </CardContent>
        </Card>
      </div>

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
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Thay nhớt xe máy</p>
                  <p className="text-sm text-slate-600">Garage Thành Công</p>
                  <p className="text-sm text-blue-600">15/12/2024 - 14:00</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Hoàn thành</span>
              </div>
              <div className="text-center py-4">
                <p className="text-slate-500 text-sm">Chưa có lịch hẹn nào khác</p>
              </div>
            </div>
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
    </DashboardLayout>
  )
}
