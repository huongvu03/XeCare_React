"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Users, Star, TrendingUp, Settings, Wrench } from "lucide-react"

export default function GarageDashboard() {
  return (
    <DashboardLayout allowedRoles={["garage"]} title="Dashboard Garage" description="Quản lý garage và dịch vụ của bạn">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Lịch hẹn hôm nay</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Khách hàng</p>
                <p className="text-2xl font-bold text-green-600">156</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Đánh giá TB</p>
                <p className="text-2xl font-bold text-yellow-600">4.8</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Doanh thu tháng</p>
                <p className="text-2xl font-bold text-purple-600">25M</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Quản lý lịch hẹn</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">Xem và xử lý lịch hẹn từ khách hàng</p>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
              <Link href="/garage/appointments">Xem lịch hẹn</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Settings className="h-5 w-5 text-blue-600" />
              <span>Thông tin garage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">Cập nhật thông tin và cài đặt garage</p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600 bg-transparent" asChild>
              <Link href="/garage/info">Quản lý thông tin</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span>Quản lý dịch vụ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">Thêm, sửa, xóa các dịch vụ</p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600 bg-transparent" asChild>
              <Link href="/garage/services">Quản lý dịch vụ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle>Lịch hẹn hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Nguyễn Văn A</p>
                  <p className="text-sm text-slate-600">Thay nhớt xe máy</p>
                  <p className="text-sm text-blue-600">09:00 - 09:30</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Chờ xác nhận</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Trần Thị B</p>
                  <p className="text-sm text-slate-600">Sửa phanh ô tô</p>
                  <p className="text-sm text-blue-600">14:00 - 16:00</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Đã xác nhận</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle>Đánh giá gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">Lê Văn C</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">5.0</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">"Dịch vụ tuyệt vời, nhân viên thân thiện và chuyên nghiệp!"</p>
              </div>
              <div className="text-center py-4">
                <p className="text-slate-500 text-sm">Chưa có đánh giá nào khác</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
