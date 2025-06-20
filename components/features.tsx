import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Search,
  Calendar,
  Phone,
  Star,
  Clock,
  Shield,
  Smartphone,
  CreditCard,
  MessageCircle,
  Camera,
  Bell,
} from "lucide-react"

const features = [
  {
    icon: MapPin,
    title: "Tìm kiếm thông minh",
    description: "GPS tự động định vị, tìm garage gần nhất trong bán kính 5km với đánh giá cao",
  },
  {
    icon: Search,
    title: "Bộ lọc chi tiết",
    description: "Lọc theo loại xe, dịch vụ, giá cả, giờ mở cửa, đánh giá và khoảng cách",
  },
  {
    icon: Calendar,
    title: "Đặt lịch online",
    description: "Chọn thời gian phù hợp, mô tả vấn đề, upload ảnh và nhận xác nhận tức thì",
  },
  {
    icon: Phone,
    title: "Cứu hộ 24/7",
    description: "Mạng lưới cứu hộ toàn quốc, thời gian phản hồi trung bình 15-30 phút",
  },
  {
    icon: Star,
    title: "Đánh giá minh bạch",
    description: "Hệ thống review được kiểm duyệt, ảnh thật từ khách hàng, không fake",
  },
  {
    icon: Clock,
    title: "Theo dõi realtime",
    description: "Cập nhật tiến độ sửa xe qua SMS/app, biết chính xác khi nào xe hoàn thành",
  },
  {
    icon: Shield,
    title: "Bảo hành rõ ràng",
    description: "Cam kết bảo hành 3-12 tháng tùy dịch vụ, hỗ trợ khiếu nại 24/7",
  },
  {
    icon: CreditCard,
    title: "Thanh toán đa dạng",
    description: "Tiền mặt, chuyển khoản, ví điện tử, thẻ tín dụng. Hóa đơn VAT đầy đủ",
  },
  {
    icon: MessageCircle,
    title: "Chat trực tiếp",
    description: "Trao đổi với garage qua chat, gọi video để tư vấn và báo giá chi tiết",
  },
  {
    icon: Camera,
    title: "Chẩn đoán qua ảnh",
    description: "Upload ảnh/video lỗi xe để garage tư vấn sơ bộ trước khi đến",
  },
  {
    icon: Bell,
    title: "Thông báo thông minh",
    description: "Nhắc lịch bảo dưỡng định kỳ, khuyến mãi từ garage yêu thích",
  },
  {
    icon: Smartphone,
    title: "App thân thiện",
    description: "Giao diện đơn giản, tốc độ nhanh, hoạt động offline, hỗ trợ giọng nói",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Tại sao chọn GarageFinder?</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Nền tảng công nghệ hàng đầu Việt Nam kết nối bạn với mạng lưới garage uy tín, mang đến trải nghiệm sửa xe
            hiện đại và tiện lợi nhất
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-blue-100 hover:border-blue-200 hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 mb-8">Được tin tưởng bởi</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-slate-400">Honda</div>
            <div className="text-2xl font-bold text-slate-400">Yamaha</div>
            <div className="text-2xl font-bold text-slate-400">Toyota</div>
            <div className="text-2xl font-bold text-slate-400">Hyundai</div>
            <div className="text-2xl font-bold text-slate-400">Suzuki</div>
          </div>
        </div>
      </div>
    </section>
  )
}
