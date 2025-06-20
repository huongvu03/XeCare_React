"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Disc, AlertTriangle, Shield, CheckCircle, Clock, MapPin } from "lucide-react"
import Link from "next/link"

const brakeServices = [
  {
    id: "brake-pad",
    name: "Thay má phanh",
    price: "150,000 - 800,000",
    duration: "45-90 phút",
    vehicles: ["Xe máy", "Ô tô"],
    description: "Thay má phanh mới, kiểm tra đĩa phanh",
    includes: ["Má phanh chính hãng", "Kiểm tra đĩa phanh", "Test phanh", "Bảo hành 6 tháng"],
    warning: "Má phanh mỏng có thể gây nguy hiểm",
  },
  {
    id: "brake-fluid",
    name: "Thay dầu phanh",
    price: "100,000 - 300,000",
    duration: "30-60 phút",
    vehicles: ["Xe máy", "Ô tô"],
    description: "Thay dầu phanh mới, xả hệ thống",
    includes: ["Dầu phanh DOT 3/4", "Xả hệ thống", "Kiểm tra rò rỉ", "Test áp suất"],
    warning: "Dầu phanh cũ làm giảm hiệu quả phanh",
  },
  {
    id: "brake-disc",
    name: "Thay đĩa phanh",
    price: "500,000 - 2,000,000",
    duration: "1-2 giờ",
    vehicles: ["Ô tô", "Xe tải"],
    description: "Thay đĩa phanh mới khi bị cong vênh",
    includes: ["Đĩa phanh chính hãng", "Cân chỉnh", "Test phanh", "Bảo hành 12 tháng"],
    warning: "Đĩa phanh cong có thể gây rung lắc",
  },
  {
    id: "brake-system",
    name: "Bảo dưỡng hệ thống phanh",
    price: "200,000 - 500,000",
    duration: "60-90 phút",
    vehicles: ["Xe máy", "Ô tô"],
    description: "Kiểm tra toàn bộ hệ thống phanh",
    includes: ["Kiểm tra tổng thể", "Vệ sinh", "Điều chỉnh", "Tư vấn"],
    warning: "Nên kiểm tra định kỳ 6 tháng/lần",
  },
]

const warningSignsData = [
  {
    sign: "Tiếng kêu khi phanh",
    severity: "high",
    description: "Má phanh đã mỏng, cần thay ngay",
    action: "Thay má phanh",
  },
  {
    sign: "Phanh không ăn",
    severity: "critical",
    description: "Hệ thống phanh có vấn đề nghiêm trọng",
    action: "Kiểm tra ngay lập tức",
  },
  {
    sign: "Rung lắc khi phanh",
    severity: "medium",
    description: "Đĩa phanh có thể bị cong vênh",
    action: "Kiểm tra đĩa phanh",
  },
  {
    sign: "Phanh mềm, sâu",
    severity: "high",
    description: "Dầu phanh có thể bị rò hoặc cũ",
    action: "Thay dầu phanh",
  },
  {
    sign: "Đèn báo phanh sáng",
    severity: "high",
    description: "Hệ thống phát hiện lỗi",
    action: "Chẩn đoán hệ thống",
  },
  {
    sign: "Xe lệch khi phanh",
    severity: "medium",
    description: "Phanh không đều hai bên",
    action: "Cân chỉnh phanh",
  },
]

const maintenanceSchedule = [
  {
    component: "Má phanh trước",
    interval: "20,000 - 30,000 km",
    signs: "Tiếng kêu, mỏng < 3mm",
    priority: "high",
  },
  {
    component: "Má phanh sau",
    interval: "40,000 - 60,000 km",
    signs: "Mỏng, hiệu quả giảm",
    priority: "medium",
  },
  {
    component: "Dầu phanh",
    interval: "2 năm hoặc 40,000 km",
    signs: "Màu đen, độ nhớt thay đổi",
    priority: "high",
  },
  {
    component: "Đĩa phanh",
    interval: "60,000 - 100,000 km",
    signs: "Rung lắc, có rãnh sâu",
    priority: "medium",
  },
]

export default function BrakeRepairPage() {
  return (
    <DashboardLayout
      allowedRoles={["user", "admin", "garage"]}
      title="Dịch vụ sửa chữa phanh xe"
      description="Bảo dưỡng và sửa chữa hệ thống phanh an toàn, chuyên nghiệp"
    >
      <div className="space-y-8">
        {/* Service Overview */}
        <Card className="border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Disc className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sửa chữa hệ thống phanh</h1>
                    <p className="text-red-600 font-medium">An toàn tuyệt đối cho mọi hành trình</p>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  Hệ thống phanh là bộ phận quan trọng nhất đảm bảo an toàn. Chúng tôi cung cấp dịch vụ kiểm tra, bảo
                  dưỡng và sửa chữa phanh chuyên nghiệp.
                </p>

                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    <strong>Cảnh báo:</strong> Không bao giờ lái xe khi phanh có vấn đề. Hãy kiểm tra ngay lập tức để
                    đảm bảo an toàn.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-600">45-90</div>
                    <div className="text-sm text-slate-600">Phút</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">6-12</div>
                    <div className="text-sm text-slate-600">Tháng BH</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">800+</div>
                    <div className="text-sm text-slate-600">Garage</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button className="flex-1 bg-gradient-to-r from-red-600 to-orange-600" asChild>
                    <Link href="/search?service=he-thong-phanh">
                      <MapPin className="h-4 w-4 mr-2" />
                      Tìm garage gần tôi
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-200 text-red-600" asChild>
                    <Link href="/emergency">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Cứu hộ khẩn cấp
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brake Services */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Dịch vụ sửa chữa phanh</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {brakeServices.map((service) => (
              <Card key={service.id} className="border-red-100">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="text-xl font-bold text-red-600">{service.price} VNĐ</div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">{service.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {service.vehicles.map((vehicle, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {vehicle}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm">Dịch vụ bao gồm:</h4>
                    <ul className="space-y-1">
                      {service.includes.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-700 text-sm">{service.warning}</AlertDescription>
                  </Alert>

                  <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600" asChild>
                    <Link href={`/booking?service=${service.id}`}>Đặt lịch ngay</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Warning Signs */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Dấu hiệu cần sửa phanh</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warningSignsData.map((warning, index) => (
              <Card
                key={index}
                className={`border-2 ${
                  warning.severity === "critical"
                    ? "border-red-300 bg-red-50"
                    : warning.severity === "high"
                      ? "border-orange-300 bg-orange-50"
                      : "border-yellow-300 bg-yellow-50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${
                        warning.severity === "critical"
                          ? "bg-red-600"
                          : warning.severity === "high"
                            ? "bg-orange-600"
                            : "bg-yellow-600"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{warning.sign}</h4>
                      <p className="text-xs text-slate-600 mt-1">{warning.description}</p>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-2 ${
                          warning.severity === "critical"
                            ? "border-red-600 text-red-600"
                            : warning.severity === "high"
                              ? "border-orange-600 text-orange-600"
                              : "border-yellow-600 text-yellow-600"
                        }`}
                      >
                        {warning.action}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Maintenance Schedule */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Lịch bảo dưỡng phanh định kỳ</h2>

          <Card className="border-red-100">
            <CardContent className="p-6">
              <div className="space-y-4">
                {maintenanceSchedule.map((schedule, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          schedule.priority === "high" ? "bg-red-500" : "bg-orange-500"
                        }`}
                      >
                        <Disc className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium">{schedule.component}</h4>
                      <p className="text-sm text-slate-600">Thay: {schedule.interval}</p>
                      <p className="text-xs text-slate-500">Dấu hiệu: {schedule.signs}</p>
                    </div>

                    <Badge variant={schedule.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                      {schedule.priority === "high" ? "Quan trọng" : "Bình thường"}
                    </Badge>
                  </div>
                ))}
              </div>

              <Alert className="mt-6 border-red-200 bg-red-50">
                <Shield className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  <strong>Lưu ý an toàn:</strong> Kiểm tra phanh định kỳ mỗi 6 tháng. Nếu phát hiện bất kỳ dấu hiệu bất
                  thường nào, hãy kiểm tra ngay lập tức.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Safety Tips */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Mẹo an toàn khi sử dụng phanh</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Nên làm</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Phanh từ từ, tránh phanh gấp",
                    "Kiểm tra phanh trước khi khởi hành",
                    "Thay má phanh khi còn 3mm",
                    "Sử dụng phanh tay khi đỗ xe dốc",
                    "Kiểm tra dầu phanh định kỳ",
                  ].map((tip, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="text-lg text-red-700">Không nên làm</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Phanh gấp khi không cần thiết",
                    "Bỏ qua tiếng kêu khi phanh",
                    "Để má phanh mòn hết",
                    "Lái xe khi phanh có vấn đề",
                    "Tự sửa phanh khi không có kinh nghiệm",
                  ].map((tip, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Section */}
        <Card className="border-red-100 bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <AlertTriangle className="h-8 w-8" />
              <h3 className="text-2xl font-bold">Phanh có vấn đề?</h3>
            </div>
            <p className="text-red-100 mb-6">
              Đừng chần chừ! An toàn của bạn là ưu tiên hàng đầu. Tìm garage gần nhất hoặc gọi cứu hộ ngay lập tức.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50" asChild>
                <Link href="/search?service=he-thong-phanh&urgent=true">Tìm garage ngay</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600"
                asChild
              >
                <Link href="/emergency">Gọi cứu hộ 24/7</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
