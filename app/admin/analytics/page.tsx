"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { TrendingUp, Users, Calendar, Star, DollarSign, Activity, Target } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return date.toISOString().split("T")[0]
  })
  const [toDate, setToDate] = useState(() => {
    const date = new Date()
    return date.toISOString().split("T")[0]
  })

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

  // Handle time range selection
  useEffect(() => {
    if (timeRange !== "custom") {
      const today = new Date()
      const endDate = today.toISOString().split("T")[0]
      setToDate(endDate)

      const startDate = new Date()
      switch (timeRange) {
        case "7d":
          startDate.setDate(today.getDate() - 7)
          break
        case "30d":
          startDate.setDate(today.getDate() - 30)
          break
        case "90d":
          startDate.setDate(today.getDate() - 90)
          break
        case "1y":
          startDate.setFullYear(today.getFullYear() - 1)
          break
      }
      setFromDate(startDate.toISOString().split("T")[0])
    }
  }, [timeRange])

  return (
    <DashboardLayout
      allowedRoles={["admin"]}
      title="Phân tích & Thống kê"
      description="Báo cáo chi tiết về hoạt động của hệ thống"
    >
      {/* Time Range and Date Filter Selector */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Tổng quan hệ thống</h2>
          <p className="text-sm text-slate-600 mt-1">
            Dữ liệu từ {new Date(fromDate).toLocaleDateString("vi-VN")} đến{" "}
            {new Date(toDate).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Date Range Inputs */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">Từ ngày:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">Đến ngày:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Quick Time Range Selector */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày qua</SelectItem>
              <SelectItem value="30d">30 ngày qua</SelectItem>
              <SelectItem value="90d">3 tháng qua</SelectItem>
              <SelectItem value="1y">1 năm qua</SelectItem>
              <SelectItem value="custom">Tùy chỉnh</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        {/* User & Garage Growth Chart */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Biểu đồ tăng trưởng người dùng & garage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              {/* Chart Container */}
              <div className="relative h-full">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 py-4">
                  <span>6000</span>
                  <span>5000</span>
                  <span>4000</span>
                  <span>3000</span>
                  <span>2000</span>
                  <span>1000</span>
                  <span>0</span>
                </div>

                {/* Chart area */}
                <div className="ml-12 h-full relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="border-t border-slate-200"></div>
                    ))}
                  </div>

                  {/* Data visualization */}
                  <div className="absolute inset-0 flex items-end justify-between px-4">
                    {userGrowthData.map((data, index) => {
                      const userHeight = (data.users / 6000) * 100
                      const garageHeight = (data.garages / 150) * 100

                      return (
                        <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                          {/* Bars */}
                          <div className="flex items-end space-x-1 h-64">
                            {/* User bar */}
                            <div className="relative group">
                              <div
                                className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:from-blue-600 hover:to-blue-500"
                                style={{ height: `${userHeight}%` }}
                              ></div>
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {data.users} users
                              </div>
                            </div>

                            {/* Garage bar */}
                            <div className="relative group">
                              <div
                                className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all hover:from-green-600 hover:to-green-500"
                                style={{ height: `${garageHeight}%` }}
                              ></div>
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {data.garages} garages
                              </div>
                            </div>
                          </div>

                          {/* Month label */}
                          <span className="text-xs font-medium text-slate-600">{data.month}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-0 right-0 flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-slate-600">Người dùng</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-slate-600">Garage</span>
                  </div>
                </div>
              </div>
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
