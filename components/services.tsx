import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Wrench,
  Droplets,
  Zap,
  Disc,
  Settings,
  Car,
  Paintbrush,
  Sparkles,
  Gauge,
  Wind,
  Hammer,
  Cog,
  Shield,
  Star,
  Clock,
} from "lucide-react"

const services = [
  {
    icon: Droplets,
    title: "Thay nhớt - Bảo dưỡng",
    description: "Thay nhớt định kỳ, lọc gió, bugi, dây curoa. Bảo dưỡng toàn diện",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "80K - 350K",
    duration: "30-60 phút",
    popular: true,
  },
  {
    icon: Settings,
    title: "Sửa chữa động cơ",
    description: "Chẩn đoán lỗi động cơ, sửa chữa hệ thống đánh lửa, làm mát",
    vehicles: ["Xe máy", "Ô tô", "Xe tải"],
    priceRange: "200K - 5M",
    duration: "2-8 giờ",
    popular: false,
  },
  {
    icon: Disc,
    title: "Hệ thống phanh",
    description: "Thay má phanh, dầu phanh, đĩa phanh. Kiểm tra an toàn",
    vehicles: ["Xe máy", "Ô tô", "Xe tải"],
    priceRange: "150K - 2M",
    duration: "1-3 giờ",
    popular: true,
  },
  {
    icon: Zap,
    title: "Hệ thống điện",
    description: "Sửa đèn, còi, bình ắc quy, máy phát điện, hệ thống đánh lửa",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "100K - 1.5M",
    duration: "1-4 giờ",
    popular: false,
  },
  {
    icon: Car,
    title: "Lốp và mâm xe",
    description: "Thay lốp, vá lốp, cân chỉnh mâm, kiểm tra áp suất",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "50K - 8M",
    duration: "30 phút - 2 giờ",
    popular: true,
  },
  {
    icon: Wind,
    title: "Điều hòa ô tô",
    description: "Bảo dưỡng, sửa chữa hệ thống điều hòa, thay gas lạnh",
    vehicles: ["Ô tô"],
    priceRange: "200K - 3M",
    duration: "1-3 giờ",
    popular: false,
  },
  {
    icon: Paintbrush,
    title: "Sơn xe - Đồng sơn",
    description: "Sơn lại toàn bộ hoặc từng phần, xử lý trầy xước, đánh bóng",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "500K - 15M",
    duration: "1-5 ngày",
    popular: false,
  },
  {
    icon: Sparkles,
    title: "Rửa xe - Chăm sóc",
    description: "Rửa xe, đánh bóng, phủ ceramic, bảo dưỡng nội thất",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "30K - 500K",
    duration: "30 phút - 3 giờ",
    popular: true,
  },
  {
    icon: Gauge,
    title: "Kiểm định - Đăng kiểm",
    description: "Hỗ trợ kiểm định an toàn kỹ thuật, đăng kiểm xe",
    vehicles: ["Ô tô", "Xe tải"],
    priceRange: "300K - 800K",
    duration: "2-4 giờ",
    popular: false,
  },
  {
    icon: Hammer,
    title: "Sửa chữa thân vỏ",
    description: "Sửa móp méo, hàn xì, thay thế phụ tùng thân xe",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "200K - 10M",
    duration: "2 giờ - 3 ngày",
    popular: false,
  },
  {
    icon: Cog,
    title: "Hộp số - Ly hợp",
    description: "Sửa chữa hộp số, thay dầu hộp số, sửa ly hợp",
    vehicles: ["Xe máy", "Ô tô"],
    priceRange: "300K - 8M",
    duration: "2-6 giờ",
    popular: false,
  },
  {
    icon: Wrench,
    title: "Cứu hộ khẩn cấp",
    description: "Cứu hộ 24/7, kéo xe, sửa chữa tại chỗ, hỗ trợ khẩn cấp",
    vehicles: ["Xe máy", "Ô tô", "Xe tải"],
    priceRange: "150K - 1M",
    duration: "15-60 phút",
    popular: true,
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Dịch vụ sửa chữa toàn diện</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Từ bảo dưỡng định kỳ đến sửa chữa chuyên sâu, chúng tôi kết nối bạn với các garage chuyên nghiệp cho mọi nhu
            cầu về xe
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`group hover:shadow-xl transition-all duration-300 border-blue-100 hover:border-blue-200 bg-white relative ${
                service.popular ? "ring-2 ring-blue-200" : ""
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1">Phổ biến</Badge>
                </div>
              )}

              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{service.title}</h3>
                    <p className="text-blue-600 font-medium text-sm">{service.priceRange}</p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Thời gian:</span>
                    <span className="font-medium">{service.duration}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {service.vehicles.map((vehicle, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {vehicle}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Tìm garage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service guarantee */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">Cam kết chất lượng dịch vụ</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-900">Bảo hành rõ ràng</h4>
                <p className="text-sm text-slate-600">3-12 tháng tùy dịch vụ</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900">Garage uy tín</h4>
                <p className="text-sm text-slate-600">Đánh giá 4.5+ sao</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-900">Hỗ trợ 24/7</h4>
                <p className="text-sm text-slate-600">Luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
