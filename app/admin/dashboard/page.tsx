"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Building, Calendar, Star, TrendingUp, Shield, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <DashboardLayout allowedRoles={["ADMIN"]} title="Admin Dashboard" description="Quản lý toàn bộ hệ thống XeCare">
      {/* System Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <p className="text-slate-600 text-sm mb-4">Xem, tìm kiếm và quản lý tài khoản người dùng</p>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600" asChild>
              <Link href="/admin/users">Quản lý Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Building className="h-5 w-5 text-blue-600" />
              <span>Quản lý garage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">Duyệt đăng ký và quản lý garage</p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600" asChild>
              <Link href="/admin/garages">Quản lý Garages</Link>
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
            <p className="text-slate-600 text-sm mb-4">Kiểm duyệt đánh giá và báo cáo</p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600" asChild>
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
            <p className="text-slate-600 text-sm mb-4">Xem báo cáo chi tiết và phân tích</p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600" asChild>
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
            <p className="text-slate-600 text-sm mb-4">Cấu hình và cài đặt hệ thống</p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600">
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
            <p className="text-slate-600 text-sm mb-4">Phân tích xu hướng và hiệu suất</p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600" asChild>
              <Link href="/admin/data-analysis">Phân tích</Link>
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
                  <p className="font-medium text-slate-900">Garage mới đăng ký</p>
                  <p className="text-sm text-slate-600">Garage ABC - TP.HCM</p>
                  <p className="text-sm text-blue-600">5 phút trước</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Chờ duyệt</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Đánh giá mới</p>
                  <p className="text-sm text-slate-600">User đánh giá Garage XYZ</p>
                  <p className="text-sm text-blue-600">10 phút trước</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Đã duyệt</span>
              </div>
            </div>
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
                <p className="text-sm text-yellow-700">5 garage chưa cập nhật thông tin trong 30 ngày</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="font-medium text-red-800">Báo cáo spam</p>
                <p className="text-sm text-red-700">2 báo cáo về đánh giá spam cần xử lý</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
