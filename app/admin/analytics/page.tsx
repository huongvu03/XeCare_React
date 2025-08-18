"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect, useMemo } from "react"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Star,
  DollarSign,
  Activity,
  Target,
  Download,
  RefreshCw,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

interface MetricCard {
  title: string
  value: string
  change: number
  changeType: "increase" | "decrease"
  icon: React.ReactNode
  color: string
}

interface ChartData {
  name: string
  value: number
  percentage?: number
}

interface RegionalData {
  region: string
  garages: number
  bookings: number
  revenue: string
  revenueValue: number
  growth: number
}

interface TopGarage {
  name: string
  location: string
  bookings: number
  rating: number
  revenue: string
  revenueValue: number
  completion: number
  responseTime: string
  responseTimeValue: number
}

type SortField = "name" | "bookings" | "rating" | "revenue" | "completion" | "responseTime"
type SortDirection = "asc" | "desc"

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [sortField, setSortField] = useState<SortField>("bookings")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const handleExport = (format: "csv" | "pdf" | "excel") => {
    // Export functionality
    const data = filteredTopGarages.map((garage) => ({
      name: garage.name,
      location: garage.location,
      bookings: garage.bookings,
      rating: garage.rating,
      revenue: garage.revenue,
      completion: garage.completion,
      responseTime: garage.responseTime,
    }))

    console.log(`Exporting ${data.length} records as ${format}:`, data)

    if (format === "csv") {
      const csv = [
        "Name,Location,Bookings,Rating,Revenue,Completion,Response Time",
        ...data.map(
          (row) =>
            `${row.name},${row.location},${row.bookings},${row.rating},${row.revenue},${row.completion}%,${row.responseTime}`,
        ),
      ].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Key metrics data with time range filtering
  const getKeyMetrics = (range: string): MetricCard[] => {
    const multiplier = range === "7d" ? 0.25 : range === "30d" ? 1 : range === "90d" ? 3 : 12

    return [
      {
        title: "Tổng doanh thu",
        value: `${(2.4 * multiplier).toFixed(1)}B VNĐ`,
        change: 12.5,
        changeType: "increase",
        icon: <DollarSign className="h-5 w-5" />,
        color: "text-green-600",
      },
      {
        title: "Lượt đặt lịch",
        value: `${Math.floor(15234 * multiplier).toLocaleString()}`,
        change: 8.2,
        changeType: "increase",
        icon: <Calendar className="h-5 w-5" />,
        color: "text-blue-600",
      },
      {
        title: "Người dùng hoạt động",
        value: `${Math.floor(8456 * multiplier).toLocaleString()}`,
        change: 15.3,
        changeType: "increase",
        icon: <Users className="h-5 w-5" />,
        color: "text-purple-600",
      },
      {
        title: "Tỷ lệ hoàn thành",
        value: "94.2%",
        change: 2.1,
        changeType: "increase",
        icon: <Target className="h-5 w-5" />,
        color: "text-orange-600",
      },
      {
        title: "Garage hoạt động",
        value: `${Math.floor(1247 * (multiplier / 4)).toLocaleString()}`,
        change: 5.8,
        changeType: "increase",
        icon: <MapPin className="h-5 w-5" />,
        color: "text-cyan-600",
      },
      {
        title: "Thời gian phản hồi TB",
        value: "2.3 phút",
        change: -12.4,
        changeType: "decrease",
        icon: <Clock className="h-5 w-5" />,
        color: "text-indigo-600",
      },
      {
        title: "Đánh giá trung bình",
        value: "4.7/5",
        change: 3.2,
        changeType: "increase",
        icon: <Star className="h-5 w-5" />,
        color: "text-yellow-600",
      },
      {
        title: "Tỷ lệ chuyển đổi",
        value: "68.4%",
        change: 4.7,
        changeType: "increase",
        icon: <Activity className="h-5 w-5" />,
        color: "text-pink-600",
      },
    ]
  }

  const keyMetrics = getKeyMetrics(timeRange)

  // Revenue data for chart
  const revenueData: ChartData[] = [
    { name: "T1", value: 1200000000 },
    { name: "T2", value: 1800000000 },
    { name: "T3", value: 2100000000 },
    { name: "T4", value: 1950000000 },
    { name: "T5", value: 2400000000 },
    { name: "T6", value: 2650000000 },
    { name: "T7", value: 2800000000 },
    { name: "T8", value: 2950000000 },
    { name: "T9", value: 3100000000 },
    { name: "T10", value: 2850000000 },
    { name: "T11", value: 3200000000 },
    { name: "T12", value: 3450000000 },
  ]

  // Service distribution
  const serviceDistribution: ChartData[] = [
    { name: "Thay nhớt", value: 1250, percentage: 35 },
    { name: "Sửa phanh", value: 890, percentage: 25 },
    { name: "Bảo dưỡng định kỳ", value: 650, percentage: 18 },
    { name: "Sửa động cơ", value: 420, percentage: 12 },
    { name: "Thay lốp", value: 280, percentage: 8 },
    { name: "Khác", value: 110, percentage: 2 },
  ]

  // Regional data with filtering
  const allRegionalData: RegionalData[] = [
    { region: "Hà Nội", garages: 342, bookings: 5420, revenue: "850M", revenueValue: 850000000, growth: 12.3 },
    { region: "TP.HCM", garages: 456, bookings: 7230, revenue: "1.2B", revenueValue: 1200000000, growth: 15.7 },
    { region: "Đà Nẵng", garages: 128, bookings: 1890, revenue: "280M", revenueValue: 280000000, growth: 8.9 },
    { region: "Hải Phòng", garages: 95, bookings: 1340, revenue: "195M", revenueValue: 195000000, growth: 6.4 },
    { region: "Cần Thơ", garages: 87, bookings: 1120, revenue: "165M", revenueValue: 165000000, growth: 9.2 },
  ]

  // Filter regional data
  const filteredRegionalData = useMemo(() => {
    let filtered = allRegionalData

    if (selectedRegion !== "all") {
      const regionMap: { [key: string]: string } = {
        hanoi: "Hà Nội",
        hcm: "TP.HCM",
        danang: "Đà Nẵng",
        haiphong: "Hải Phòng",
        cantho: "Cần Thơ",
      }
      filtered = filtered.filter((item) => item.region === regionMap[selectedRegion])
    }

    return filtered
  }, [selectedRegion])

  // Top performing garages with full data
  const allTopGarages: TopGarage[] = [
    {
      name: "Garage Thành Công",
      location: "Hà Nội",
      bookings: 156,
      rating: 4.8,
      revenue: "25M",
      revenueValue: 25000000,
      completion: 98.5,
      responseTime: "1.2 phút",
      responseTimeValue: 1.2,
    },
    {
      name: "Garage ABC Auto",
      location: "TP.HCM",
      bookings: 142,
      rating: 4.7,
      revenue: "22M",
      revenueValue: 22000000,
      completion: 96.8,
      responseTime: "1.8 phút",
      responseTimeValue: 1.8,
    },
    {
      name: "Garage XYZ Pro",
      location: "Đà Nẵng",
      bookings: 128,
      rating: 4.6,
      revenue: "19M",
      revenueValue: 19000000,
      completion: 94.2,
      responseTime: "2.1 phút",
      responseTimeValue: 2.1,
    },
    {
      name: "Garage 24/7 Service",
      location: "Hải Phòng",
      bookings: 115,
      rating: 4.9,
      revenue: "18M",
      revenueValue: 18000000,
      completion: 99.1,
      responseTime: "0.9 phút",
      responseTimeValue: 0.9,
    },
    {
      name: "Garage Pro Master",
      location: "Cần Thơ",
      bookings: 98,
      rating: 4.5,
      revenue: "15M",
      revenueValue: 15000000,
      completion: 92.7,
      responseTime: "2.5 phút",
      responseTimeValue: 2.5,
    },
    {
      name: "Garage Speed Fix",
      location: "Hà Nội",
      bookings: 89,
      rating: 4.4,
      revenue: "13M",
      revenueValue: 13000000,
      completion: 91.3,
      responseTime: "3.1 phút",
      responseTimeValue: 3.1,
    },
    {
      name: "Garage Elite Care",
      location: "TP.HCM",
      bookings: 76,
      rating: 4.6,
      revenue: "12M",
      revenueValue: 12000000,
      completion: 95.4,
      responseTime: "2.8 phút",
      responseTimeValue: 2.8,
    },
    {
      name: "Garage Quick Service",
      location: "Đà Nẵng",
      bookings: 65,
      rating: 4.3,
      revenue: "10M",
      revenueValue: 10000000,
      completion: 88.9,
      responseTime: "4.2 phút",
      responseTimeValue: 4.2,
    },
  ]

  // Filter and sort top garages
  const filteredTopGarages = useMemo(() => {
    let filtered = allTopGarages

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (garage) =>
          garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          garage.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply region filter
    if (selectedRegion !== "all") {
      const regionMap: { [key: string]: string } = {
        hanoi: "Hà Nội",
        hcm: "TP.HCM",
        danang: "Đà Nẵng",
        haiphong: "Hải Phòng",
        cantho: "Cần Thơ",
      }
      filtered = filtered.filter((garage) => garage.location === regionMap[selectedRegion])
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (sortField) {
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "bookings":
          aValue = a.bookings
          bValue = b.bookings
          break
        case "rating":
          aValue = a.rating
          bValue = b.rating
          break
        case "revenue":
          aValue = a.revenueValue
          bValue = b.revenueValue
          break
        case "completion":
          aValue = a.completion
          bValue = b.completion
          break
        case "responseTime":
          aValue = a.responseTimeValue
          bValue = b.responseTimeValue
          break
        default:
          aValue = a.bookings
          bValue = b.bookings
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })

    return filtered
  }, [searchTerm, selectedRegion, sortField, sortDirection, allTopGarages])

  // Booking status distribution
  const bookingStatus = [
    { status: "Hoàn thành", count: 12450, color: "bg-green-500", percentage: 68.2 },
    { status: "Đang xử lý", count: 3240, color: "bg-blue-500", percentage: 17.8 },
    { status: "Chờ xác nhận", count: 1890, color: "bg-yellow-500", percentage: 10.4 },
    { status: "Đã hủy", count: 650, color: "bg-red-500", percentage: 3.6 },
  ]

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 text-blue-600" />
    ) : (
      <ArrowDown className="h-3 w-3 text-blue-600" />
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["ADMIN"]}
      title="Phân tích & Thống kê"
      description="Báo cáo chi tiết về hoạt động của hệ thống"
    >
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Analytics</h2>
          <Badge variant="outline" className="text-green-600 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Data
          </Badge>
          <span className="text-xs text-slate-500">Cập nhật: {lastUpdated.toLocaleTimeString("vi-VN")}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm garage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm("")}
              >
                ×
              </Button>
            )}
          </div>

          {/* Region Filter */}
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khu vực</SelectItem>
              <SelectItem value="hanoi">Hà Nội</SelectItem>
              <SelectItem value="hcm">TP.HCM</SelectItem>
              <SelectItem value="danang">Đà Nẵng</SelectItem>
              <SelectItem value="haiphong">Hải Phòng</SelectItem>
              <SelectItem value="cantho">Cần Thơ</SelectItem>
            </SelectContent>
          </Select>

          {/* Time Range */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày qua</SelectItem>
              <SelectItem value="30d">30 ngày qua</SelectItem>
              <SelectItem value="90d">3 tháng qua</SelectItem>
              <SelectItem value="1y">1 năm qua</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          {/* Export Dropdown */}
          <Select onValueChange={(value) => handleExport(value as "csv" | "pdf" | "excel")}>
            <SelectTrigger className="w-[120px]">
              <Download className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Xuất" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Results Info */}
      {(searchTerm || selectedRegion !== "all") && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Hiển thị {filteredTopGarages.length} kết quả
                {searchTerm && ` cho "${searchTerm}"`}
                {selectedRegion !== "all" && ` tại ${selectedRegion}`}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setSelectedRegion("all")
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  <div className="flex items-center space-x-1">
                    {metric.changeType === "increase" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        metric.changeType === "increase" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {metric.changeType === "increase" ? "+" : ""}
                      {metric.change}%
                    </span>
                    <span className="text-xs text-slate-500">vs tháng trước</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-slate-50 ${metric.color}`}>{metric.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Tổng quan</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center space-x-2">
            <LineChart className="h-4 w-4" />
            <span>Doanh thu</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center space-x-2">
            <PieChart className="h-4 w-4" />
            <span>Dịch vụ</span>
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Khu vực</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Hiệu suất</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-blue-600" />
                  <span>Xu hướng doanh thu</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-4">
                    <span>Doanh thu theo tháng (VNĐ)</span>
                    <span className="text-green-600 font-medium">+18.5% YoY</span>
                  </div>
                  {revenueData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 w-8">{data.name}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(data.value / Math.max(...revenueData.map((d) => d.value))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-slate-600 w-20 text-right">
                        {(data.value / 1000000000).toFixed(1)}B
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Status Distribution */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  <span>Phân bố trạng thái đặt lịch</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingStatus.map((status, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                          <span className="text-sm font-medium text-slate-700">{status.status}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-slate-900">{status.count.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 ml-2">({status.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`${status.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${status.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span>Thống kê dịch vụ chi tiết</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Service Distribution Chart */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Phân bố dịch vụ</h4>
                  {serviceDistribution.map((service, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">{service.name}</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-slate-900">{service.value}</span>
                          <span className="text-xs text-slate-500 ml-2">({service.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700"
                          style={{ width: `${service.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service Performance Metrics */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Hiệu suất dịch vụ</h4>
                  <div className="space-y-3">
                    {serviceDistribution.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{service.name}</p>
                          <p className="text-sm text-slate-600">{service.value} lượt đặt</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">4.{Math.floor(Math.random() * 9) + 1}</span>
                          </div>
                          <p className="text-xs text-green-600">+{Math.floor(Math.random() * 20) + 5}% tháng này</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Performance Tab */}
        <TabsContent value="regions" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-cyan-600" />
                <span>Hiệu suất theo khu vực</span>
                {selectedRegion !== "all" && (
                  <Badge variant="secondary" className="ml-2">
                    Đã lọc: {selectedRegion}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Khu vực</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Garage</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Đặt lịch</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Doanh thu</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Tăng trưởng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegionalData.map((region, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{index + 1}</span>
                            </div>
                            <span className="font-medium text-slate-900">{region.region}</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4 text-slate-700">{region.garages}</td>
                        <td className="text-center py-4 px-4 text-slate-700">{region.bookings.toLocaleString()}</td>
                        <td className="text-center py-4 px-4 font-semibold text-green-600">{region.revenue}</td>
                        <td className="text-center py-4 px-4">
                          <div className="flex items-center justify-center space-x-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-sm font-medium text-green-600">+{region.growth}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRegionalData.length === 0 && (
                  <div className="text-center py-8 text-slate-500">Không tìm thấy dữ liệu cho khu vực đã chọn</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span>Top garage hiệu suất cao</span>
                  {(searchTerm || selectedRegion !== "all") && (
                    <Badge variant="secondary" className="ml-2">
                      {filteredTopGarages.length} kết quả
                    </Badge>
                  )}
                </CardTitle>

                {/* Sort Controls */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Sắp xếp theo:</span>
                  <div className="flex space-x-1">
                    {[
                      { field: "bookings" as SortField, label: "Đặt lịch" },
                      { field: "rating" as SortField, label: "Đánh giá" },
                      { field: "revenue" as SortField, label: "Doanh thu" },
                      { field: "completion" as SortField, label: "Hoàn thành" },
                    ].map(({ field, label }) => (
                      <Button
                        key={field}
                        variant={sortField === field ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleSort(field)}
                        className="flex items-center space-x-1"
                      >
                        <span>{label}</span>
                        {getSortIcon(field)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTopGarages.map((garage, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{garage.name}</p>
                        <p className="text-sm text-slate-600">{garage.location}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-slate-500">{garage.bookings} lượt đặt</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium">{garage.rating}</span>
                          </div>
                          <span className="text-xs text-slate-500">Phản hồi: {garage.responseTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-green-600 text-lg">{garage.revenue}</p>
                      <p className="text-sm text-slate-500">Doanh thu</p>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">{garage.completion}% hoàn thành</span>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTopGarages.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>Không tìm thấy garage nào phù hợp với tiêu chí tìm kiếm</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedRegion("all")
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Real-time Alerts */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            <span>Cảnh báo & Thông báo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Garage ABC Auto có tỷ lệ hủy lịch cao (15%)</p>
                <p className="text-xs text-slate-600">Cần kiểm tra và hỗ trợ - 5 phút trước</p>
              </div>
              <Button size="sm" variant="outline">
                Xem chi tiết
              </Button>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Doanh thu tháng này đã vượt mục tiêu 12%</p>
                <p className="text-xs text-slate-600">Chúc mừng! - 1 giờ trước</p>
              </div>
              <Button size="sm" variant="outline">
                Chia sẻ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
