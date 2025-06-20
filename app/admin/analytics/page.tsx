"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { TrendingUp, Users, Calendar, Star, DollarSign, Activity, Target } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  // Mock data for charts
  const userGrowthData = [
    { month: "T1", users: 1200, garages: 45 },
    { month: "T2", users: 1800, garages: 62 },
    { month: "T3", users: 2400, garages: 78 },
    { month: "T4", users: 3200, garages: 95 },
    { month: "T5", users: 4100, garages: 112 },
    { month: "T6", users: 5200, garages: 128 },
  ]

  const topGarages = [
    { name: "Garage Thành Công", bookings: 156, rating: 4.8, revenue: "25M" },
    { name: "Garage ABC", bookings: 142, rating: 4.7, revenue: "22M" },
    { name: "Garage XYZ", bookings: 128, rating: 4.6, revenue: "19M" },
    { name: "Garage 24/7", bookings: 115, rating: 4.9, revenue: "18M" },
    { name: "Garage Pro", bookings: 98, rating: 4.5, revenue: "15M" },
  ]

  const serviceStats = [
    { service: "Thay nhớt", count: 1250, percentage: 35 },
    { service: "Sửa phanh", count: 890, percentage: 25 },
    { service: "Bảo dưỡng", count: 650, percentage: 18 },
    { service: "Sửa động cơ", count: 420, percentage: 12 },
    { service: "Khác", count: 360, percentage: 10 },
  ]

  return (
    <DashboardLayout
      allowedRoles={["admin"]}
      title="Phân tích & Thống kê"
      description="Báo cáo chi tiết về hoạt động của hệ thống"
    >
      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Tổng quan hệ thống</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 ngày qua</SelectItem>
            <SelectItem value="30d">30 ngày qua</SelectItem>
            <SelectItem value="90d">3 tháng qua</SelectItem>
            <SelectItem value="1y">1 năm qua</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-blue-600">2.4B VNĐ</p>
                <p className="text-xs text-green-600">+12% so với tháng trước</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Lượt đặt lịch</p>
                <p className="text-2xl font-bold text-green-600">15,234</p>
                <p className="text-xs text-green-600">+8% so với tháng trước</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Người dùng mới</p>
                <p className="text-2xl font-bold text-purple-600">1,856</p>
                <p className="text-xs text-green-600">+15% so với tháng trước</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-bold text-orange-600">94.2%</p>
                <p className="text-xs text-green-600">+2% so với tháng trước</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Tăng trưởng người dùng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userGrowthData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">{data.users} users</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">{data.garages} garages</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Statistics */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Thống kê dịch vụ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceStats.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">{service.service}</span>
                    <span className="text-sm text-slate-600">{service.count} lượt</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${service.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Garages */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-blue-600" />
            <span>Top garage hiệu suất cao</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topGarages.map((garage, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{garage.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span>{garage.bookings} lượt đặt</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{garage.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{garage.revenue}</p>
                  <p className="text-sm text-slate-500">Doanh thu</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
