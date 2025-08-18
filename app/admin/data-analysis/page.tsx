"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  RefreshCw,
  LineChart,
  Activity,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react"
import { useState, useMemo } from "react"

// Sample data for analysis
const performanceData = [
  { metric: "Tỷ lệ chuyển đổi", current: 12.5, previous: 10.8, trend: "up", category: "conversion" },
  { metric: "Thời gian phản hồi TB", current: 2.3, previous: 3.1, trend: "down", category: "performance" },
  { metric: "Tỷ lệ hài lòng khách hàng", current: 94.2, previous: 91.7, trend: "up", category: "satisfaction" },
  { metric: "Tỷ lệ hoàn thành đúng hạn", current: 87.6, previous: 85.2, trend: "up", category: "completion" },
  { metric: "Chi phí thu hút khách hàng", current: 45.2, previous: 52.8, trend: "down", category: "cost" },
  { metric: "Giá trị đơn hàng TB", current: 850000, previous: 780000, trend: "up", category: "revenue" },
]

const trendAnalysis = [
  {
    period: "Tuần này",
    users: { value: 2847, change: 12.5, trend: "up" },
    bookings: { value: 1234, change: 8.3, trend: "up" },
    revenue: { value: 45600000, change: -2.1, trend: "down" },
    satisfaction: { value: 4.7, change: 0.2, trend: "up" },
  },
  {
    period: "Tháng này",
    users: { value: 12450, change: 15.7, trend: "up" },
    bookings: { value: 5678, change: 11.2, trend: "up" },
    revenue: { value: 198500000, change: 7.8, trend: "up" },
    satisfaction: { value: 4.6, change: 0.1, trend: "up" },
  },
  {
    period: "Quý này",
    users: { value: 38920, change: 22.3, trend: "up" },
    bookings: { value: 18456, change: 18.9, trend: "up" },
    revenue: { value: 567800000, change: 14.5, trend: "up" },
    satisfaction: { value: 4.5, change: 0.3, trend: "up" },
  },
]

const predictiveInsights = [
  {
    title: "Dự báo doanh thu tháng tới",
    prediction: "Tăng 15-20%",
    confidence: 87,
    factors: ["Tăng trưởng người dùng", "Mùa cao điểm", "Cải thiện dịch vụ"],
    impact: "positive",
  },
  {
    title: "Xu hướng đặt lịch",
    prediction: "Tăng mạnh cuối tuần",
    confidence: 92,
    factors: ["Thói quen khách hàng", "Khuyến mãi cuối tuần", "Thời tiết thuận lợi"],
    impact: "positive",
  },
  {
    title: "Cảnh báo hiệu suất",
    prediction: "Có thể quá tải vào 15-20h",
    confidence: 78,
    factors: ["Lượng truy cập cao", "Thiếu garage khả dụng", "Thời gian rush hour"],
    impact: "warning",
  },
]

export default function DataAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [timeRange, setTimeRange] = useState("week")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredData = useMemo(() => {
    return performanceData.filter((item) => {
      const matchesSearch = item.metric.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Current,Previous,Trend,Category\n" +
      filteredData.map((row) => `${row.metric},${row.current},${row.previous},${row.trend},${row.category}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `data-analysis-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardLayout
      allowedRoles={["ADMIN"]}
      title="Phân tích dữ liệu"
      description="Phân tích xu hướng và hiệu suất chi tiết"
    >
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm chỉ số..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md text-sm"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="conversion">Chuyển đổi</option>
            <option value="performance">Hiệu suất</option>
            <option value="satisfaction">Hài lòng</option>
            <option value="completion">Hoàn thành</option>
            <option value="cost">Chi phí</option>
            <option value="revenue">Doanh thu</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md text-sm"
          >
            <option value="week">7 ngày</option>
            <option value="month">30 ngày</option>
            <option value="quarter">3 tháng</option>
            <option value="year">1 năm</option>
          </select>

          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredData.map((item, index) => (
          <Card key={index} className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">{item.metric}</h3>
                {item.trend === "up" ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {item.category === "cost" || item.category === "revenue"
                      ? `${item.current.toLocaleString()}${item.category === "revenue" ? "đ" : "k"}`
                      : `${item.current}${item.category === "performance" ? "s" : "%"}`}
                  </span>
                  <Badge variant={item.trend === "up" ? "default" : "destructive"} className="text-xs">
                    {item.trend === "up" ? "+" : ""}
                    {(((item.current - item.previous) / item.previous) * 100).toFixed(1)}%
                  </Badge>
                </div>

                <p className="text-sm text-slate-600">
                  So với kỳ trước:{" "}
                  {item.category === "cost" || item.category === "revenue"
                    ? `${item.previous.toLocaleString()}${item.category === "revenue" ? "đ" : "k"}`
                    : `${item.previous}${item.category === "performance" ? "s" : "%"}`}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Analysis */}
      <Card className="border-blue-100 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-600" />
            Phân tích xu hướng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {trendAnalysis.map((period, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-4">{period.period}</h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Người dùng</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{period.users.value.toLocaleString()}</span>
                      <Badge variant={period.users.trend === "up" ? "default" : "destructive"} className="text-xs">
                        {period.users.change > 0 ? "+" : ""}
                        {period.users.change}%
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Đặt lịch</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{period.bookings.value.toLocaleString()}</span>
                      <Badge variant={period.bookings.trend === "up" ? "default" : "destructive"} className="text-xs">
                        {period.bookings.change > 0 ? "+" : ""}
                        {period.bookings.change}%
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Doanh thu</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{(period.revenue.value / 1000000).toFixed(1)}M</span>
                      <Badge variant={period.revenue.trend === "up" ? "default" : "destructive"} className="text-xs">
                        {period.revenue.change > 0 ? "+" : ""}
                        {period.revenue.change}%
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Đánh giá</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{period.satisfaction.value}/5</span>
                      <Badge
                        variant={period.satisfaction.trend === "up" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {period.satisfaction.change > 0 ? "+" : ""}
                        {period.satisfaction.change}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Dự báo và Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {predictiveInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.impact === "positive"
                    ? "border-green-500 bg-green-50"
                    : insight.impact === "warning"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-red-500 bg-red-50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{insight.title}</h3>
                  {insight.impact === "positive" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : insight.impact === "warning" ? (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <Activity className="h-5 w-5 text-red-600" />
                  )}
                </div>

                <p className="font-medium text-slate-900 mb-2">{insight.prediction}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-slate-600">Độ tin cậy:</span>
                  <Badge variant="outline">{insight.confidence}%</Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700">Yếu tố ảnh hưởng:</p>
                  {insight.factors.map((factor, idx) => (
                    <p key={idx} className="text-sm text-slate-600">
                      • {factor}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
