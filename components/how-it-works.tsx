import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Calendar, CheckCircle, MessageCircle, CreditCard } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Tìm kiếm garage",
    description: "Nhập địa chỉ hoặc bật GPS để tìm garage gần nhất. Sử dụng bộ lọc để tìm garage phù hợp với nhu cầu.",
    details: ["Tìm theo vị trí GPS", "Lọc theo dịch vụ", "So sánh giá cả", "Xem đánh giá"],
  },
  {
    icon: MapPin,
    title: "Chọn garage ưng ý",
    description: "Xem thông tin chi tiết garage, đánh giá từ khách hàng, bảng giá dịch vụ và thời gian hoạt động.",
    details: ["Xem ảnh garage", "Đọc review", "So sánh giá", "Kiểm tra khoảng cách"],
  },
  {
    icon: MessageCircle,
    title: "Tư vấn & báo giá",
    description: "Chat trực tiếp với garage, mô tả vấn đề, gửi ảnh/video để được tư vấn và báo giá chính xác.",
    details: ["Chat realtime", "Gửi ảnh/video", "Nhận báo giá", "Tư vấn chuyên môn"],
  },
  {
    icon: Calendar,
    title: "Đặt lịch hẹn",
    description: "Chọn thời gian phù hợp, xác nhận dịch vụ và nhận thông báo xác nhận từ garage.",
    details: ["Chọn thời gian", "Xác nhận dịch vụ", "Nhận xác nhận", "Nhắc lịch hẹn"],
  },
  {
    icon: CheckCircle,
    title: "Sửa xe & theo dõi",
    description: "Theo dõi tiến độ sửa xe realtime, nhận thông báo khi hoàn thành và kiểm tra xe trước khi nhận.",
    details: ["Theo dõi tiến độ", "Nhận thông báo", "Kiểm tra xe", "Xác nhận hoàn thành"],
  },
  {
    icon: CreditCard,
    title: "Thanh toán & đánh giá",
    description: "Thanh toán bằng nhiều hình thức, nhận hóa đơn VAT và đánh giá chất lượng dịch vụ.",
    details: ["Thanh toán đa dạng", "Hóa đơn VAT", "Đánh giá dịch vụ", "Nhận bảo hành"],
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Quy trình đặt lịch sửa xe</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Chỉ với 6 bước đơn giản, bạn có thể tìm được garage uy tín và đặt lịch sửa xe một cách nhanh chóng, tiện lợi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="group hover:shadow-xl transition-all duration-300 border-blue-100 hover:border-blue-200 h-full">
                <CardContent className="p-6 text-center space-y-4 h-full flex flex-col">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="pt-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>

                  <p className="text-slate-600 text-sm leading-relaxed flex-grow">{step.description}</p>

                  {/* Step details */}
                  <div className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && index % 3 !== 2 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-blue-600 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Sẵn sàng bắt đầu?</h3>
            <p className="text-blue-100 mb-6">
              Tìm garage gần bạn ngay bây giờ và trải nghiệm dịch vụ sửa xe hiện đại nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <a href="/search">Tìm garage ngay</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-600 hover:bg-white hover:text-blue-600"
              >
                Tải ứng dụng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
