"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Droplets, Clock, Shield, CheckCircle, AlertTriangle, MapPin } from "lucide-react"
import Link from "next/link"

const oilChangePackages = [
  {
    id: "basic",
    name: "Gói Cơ Bản",
    price: "80,000 - 120,000",
    duration: "30 phút",
    suitable: ["Xe máy số", "Xe ga cũ"],
    includes: ["Thay nhớt khoáng chất", "Kiểm tra mức dầu", "Vệ sinh cơ bản", "Tư vấn bảo dưỡng"],
    popular: false,
  },
  {
    id: "standard",
    name: "Gói Tiêu Chuẩn",
    price: "150,000 - 250,000",
    duration: "45 phút",
    suitable: ["Xe máy mới", "Ô tô cũ"],
    includes: ["Thay nhớt bán tổng hợp", "Thay lọc nhớt", "Kiểm tra bugi", "Vệ sinh lọc gió", "Kiểm tra dây curoa"],
    popular: true,
  },
  {
    id: "premium",
    name: "Gói Cao Cấp",
    price: "300,000 - 500,000",
    duration: "60 phút",
    suitable: ["Ô tô mới", "Xe cao cấp"],
    includes: [
      "Thay nhớt tổng hợp 100%",
      "Thay lọc nhớt cao cấp",
      "Thay bugi (nếu cần)",
      "Vệ sinh toàn bộ",
      "Kiểm tra hệ thống",
      "Bảo hành 6 tháng",
    ],
    popular: false,
  },
]

const oilTypes = [
  {
    type: "Nhớt khoáng",
    price: "50,000 - 80,000",
    lifespan: "2,000 - 3,000 km",
    suitable: "Xe cũ, sử dụng ít",
    pros: ["Giá rẻ", "Phù hợp xe cũ"],
    cons: ["Tuổi thọ ngắn", "Bảo vệ kém"],
  },
  {
    type: "Nhớt bán tổng hợp",
    price: "80,000 - 150,000",
    lifespan: "3,000 - 5,000 km",
    suitable: "Xe trung bình, sử dụng thường xuyên",
    pros: ["Cân bằng giá/chất lượng", "Bảo vệ tốt"],
    cons: ["Giá cao hơn nhớt khoáng"],
  },
  {
    type: "Nhớt tổng hợp",
    price: "150,000 - 300,000",
    lifespan: "5,000 - 10,000 km",
    suitable: "Xe mới, xe cao cấp",
    pros: ["Bảo vệ tối ưu", "Tuổi thọ cao", "Tiết kiệm nhiên liệu"],
    cons: ["Giá cao"],
  },
]

const maintenanceSchedule = [
  { km: "1,000", months: 1, service: "Kiểm tra đầu tiên", priority: "high" },
  { km: "3,000", months: 3, service: "Thay nhớt lần 1", priority: "high" },
  { km: "6,000", months: 6, service: "Thay nhớt + lọc gió", priority: "medium" },
  { km: "10,000", months: 12, service: "Bảo dưỡng tổng quát", priority: "high" },
  { km: "15,000", months: 18, service: "Thay nhớt + bugi", priority: "medium" },
  { km: "20,000", months: 24, service: "Bảo dưỡng lớn", priority: "high" },
]

export default function OilChangePage() {
  return (
    <DashboardLayout
      allowedRoles={["user", "admin", "garage"]}
      title="Dịch vụ thay nhớt xe"
      description="Thay nhớt định kỳ, bảo dưỡng động cơ chuyên nghiệp"
    >
      <div className="space-y-8">
        {/* Service Overview */}
        <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                    <Droplets className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Thay nhớt động cơ</h1>
                    <p className="text-blue-600 font-medium">Bảo vệ động cơ, kéo dài tuổi thọ xe</p>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  Dịch vụ thay nhớt chuyên nghiệp với đội ngũ kỹ thuật viên giàu kinh nghiệm. Sử dụng nhớt chính hãng,
                  quy trình chuẩn, bảo hành rõ ràng.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">30-60</div>
                    <div className="text-sm text-slate-600">Phút</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">3-6</div>
                    <div className="text-sm text-slate-600">Tháng BH</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">500+</div>
                    <div className="text-sm text-slate-600">Garage</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Lưu ý:</strong> Thay nhớt định kỳ giúp động cơ hoạt động êm ái, tiết kiệm nhiên liệu và kéo
                    dài tuổi thọ xe.
                  </AlertDescription>
                </Alert>

                <div className="flex space-x-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600" asChild>
                    <Link href="/search?service=thay-nhot">
                      <MapPin className="h-4 w-4 mr-2" />
                      Tìm garage gần tôi
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 border-blue-200 text-blue-600" asChild>
                    <Link href="/booking">
                      <Clock className="h-4 w-4 mr-2" />
                      Đặt lịch ngay
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Packages */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Gói dịch vụ thay nhớt</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {oilChangePackages.map((pkg) => (
              <Card key={pkg.id} className={`border-blue-100 relative ${pkg.popular ? "ring-2 ring-blue-200" : ""}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">Phổ biến nhất</Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <div className="text-2xl font-bold text-blue-600">{pkg.price} VNĐ</div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>{pkg.duration}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Phù hợp với:</h4>
                    <div className="flex flex-wrap gap-1">
                      {pkg.suitable.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Dịch vụ bao gồm:</h4>
                    <ul className="space-y-1">
                      {pkg.includes.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className={`w-full ${pkg.popular ? "bg-gradient-to-r from-blue-600 to-cyan-600" : ""}`}
                    variant={pkg.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href={`/booking?package=${pkg.id}`}>Chọn gói này</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Oil Types Comparison */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">So sánh loại nhớt</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {oilTypes.map((oil, index) => (
              <Card key={index} className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg">{oil.type}</CardTitle>
                  <div className="text-xl font-bold text-blue-600">{oil.price} VNĐ</div>
                  <div className="text-sm text-slate-600">Tuổi thọ: {oil.lifespan}</div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Phù hợp:</h4>
                    <p className="text-sm text-slate-600">{oil.suitable}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 text-green-600">Ưu điểm:</h4>
                    <ul className="space-y-1">
                      {oil.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 text-orange-600">Nhược điểm:</h4>
                    <ul className="space-y-1">
                      {oil.cons.map((con, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Maintenance Schedule */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Lịch bảo dưỡng định kỳ</h2>

          <Card className="border-blue-100">
            <CardContent className="p-6">
              <div className="space-y-4">
                {maintenanceSchedule.map((schedule, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          schedule.priority === "high"
                            ? "bg-red-500"
                            : schedule.priority === "medium"
                              ? "bg-orange-500"
                              : "bg-green-500"
                        }`}
                      >
                        {schedule.km.replace(",", "")}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium">{schedule.service}</h4>
                      <p className="text-sm text-slate-600">
                        {schedule.km} km hoặc {schedule.months} tháng
                      </p>
                    </div>

                    <Badge variant={schedule.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                      {schedule.priority === "high" ? "Quan trọng" : "Bình thường"}
                    </Badge>
                  </div>
                ))}
              </div>

              <Alert className="mt-6">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Khuyến nghị:</strong> Thay nhớt định kỳ theo km hoặc thời gian, tùy theo điều kiện nào đến
                  trước. Xe chạy trong thành phố nên thay sớm hơn.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Quy trình thay nhớt chuẩn</h2>

          <Card className="border-blue-100">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { step: 1, title: "Kiểm tra xe", desc: "Đánh giá tình trạng động cơ" },
                  { step: 2, title: "Làm nóng máy", desc: "Khởi động 5-10 phút" },
                  { step: 3, title: "Xả nhớt cũ", desc: "Tháo nút xả, để ráo hoàn toàn" },
                  { step: 4, title: "Thay lọc nhớt", desc: "Lắp lọc mới, kiểm tra đệm" },
                  { step: 5, title: "Đổ nhớt mới", desc: "Kiểm tra mức, chạy thử" },
                ].map((process) => (
                  <div key={process.step} className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold mx-auto">
                      {process.step}
                    </div>
                    <h4 className="font-medium text-sm">{process.title}</h4>
                    <p className="text-xs text-slate-600">{process.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-blue-100 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Sẵn sàng thay nhớt cho xe?</h3>
            <p className="text-blue-100 mb-6">Tìm garage uy tín gần bạn và đặt lịch thay nhớt ngay hôm nay</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                <Link href="/search?service=thay-nhot">Tìm garage ngay</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/emergency">Cứu hộ khẩn cấp</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
