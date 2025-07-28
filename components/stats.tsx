import { Card, CardContent } from "@/components/ui/card"
import { Users, MapPin, Clock, Star, TrendingUp, Shield, Award, Heart } from "lucide-react"

const stats = [
  {
    icon: Users,
    number: "125,000+",
    label: "Khách hàng tin tưởng",
    description: "Trên toàn quốc",
    growth: "+25% năm nay",
  },
  {
    icon: MapPin,
    number: "1,200+",
    label: "Garage đối tác",
    description: "63 tỉnh thành",
    growth: "+180 garage mới",
  },
  {
    icon: Clock,
    number: "24/7",
    label: "Hỗ trợ cứu hộ",
    description: "Không ngừng nghỉ",
    growth: "15 phút phản hồi",
  },
  {
    icon: Star,
    number: "4.8/5",
    label: "Đánh giá trung bình",
    description: "Từ 50K+ reviews",
    growth: "98% hài lòng",
  },
  {
    icon: TrendingUp,
    number: "350K+",
    label: "Lượt đặt lịch",
    description: "Thành công",
    growth: "+40% tháng này",
  },
  {
    icon: Shield,
    number: "99.2%",
    label: "Tỷ lệ hoàn thành",
    description: "Đúng hẹn",
    growth: "Cam kết chất lượng",
  },
  {
    icon: Award,
    number: "12 tháng",
    label: "Bảo hành tối đa",
    description: "Cho dịch vụ",
    growth: "An tâm sử dụng",
  },
  {
    icon: Heart,
    number: "2.5M+",
    label: "Lượt tải app",
    description: "iOS & Android",
    growth: "Top 10 Lifestyle",
  },
]

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Những con số ấn tượng</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Sự tin tưởng và hài lòng của khách hàng là động lực để chúng tôi không ngừng phát triển và hoàn thiện dịch
            vụ
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-lg font-semibold text-blue-100">{stat.label}</div>
                  <div className="text-sm text-blue-200">{stat.description}</div>
                  <div className="text-xs text-cyan-200 font-medium bg-white/10 rounded-full px-3 py-1 inline-block">
                    {stat.growth}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional achievements */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">Top 3</div>
            <div className="text-blue-100">Ứng dụng sửa xe hàng đầu Việt Nam</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">ISO 27001</div>
            <div className="text-blue-100">Chứng nhận bảo mật thông tin quốc tế</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">5 năm</div>
            <div className="text-blue-100">Kinh nghiệm phục vụ thị trường</div>
          </div>
        </div>

        {/* Customer testimonial preview */}
        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl text-white italic">
              "XeCare đã thay đổi cách tôi chăm sóc xe. Tìm garage uy tín dễ dàng, đặt lịch nhanh chóng, và luôn
              được hỗ trợ tận tình."
            </blockquote>
            <div className="text-blue-200">
              <div className="font-semibold">Anh Minh Tuấn</div>
              <div className="text-sm">Khách hàng thân thiết từ 2022</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
