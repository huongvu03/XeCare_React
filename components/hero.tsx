import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Clock, Star, Phone, Navigation } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-slate-100/50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Tìm garage sửa xe{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">uy tín</span>{" "}
                gần bạn nhất
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Kết nối với hơn 1,000+ garage chất lượng cao trên toàn quốc. Đặt lịch online, theo dõi tiến độ sửa chữa
                và nhận hỗ trợ cứu hộ 24/7.
              </p>
            </div>

            {/* Search bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Nhập địa chỉ: VD: Quận 1, TP.HCM"
                      className="pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-3"
                    asChild
                  >
                    <Link href="/search">
                      <Search className="h-5 w-5 mr-2" />
                      Tìm garage
                    </Link>
                  </Button>
                </div>

                {/* Quick location buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Navigation className="h-3 w-3 mr-1" />
                    Vị trí hiện tại
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                    Quận 1
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                    Quận 3
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                    Bình Thạnh
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                    Tân Bình
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,200+</div>
                <div className="text-sm text-slate-600">Garage đối tác</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">85K+</div>
                <div className="text-sm text-slate-600">Lượt đặt lịch</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.8★</div>
                <div className="text-sm text-slate-600">Đánh giá TB</div>
              </div>
            </div>
          </div>

          {/* Right content - Featured garage cards */}
          <div className="relative">
            <div className="space-y-4">
              {/* Featured garage card 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">TC</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Garage Thành Công</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-600">4.9 (245 đánh giá)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>123 Lê Lợi, Q1, TP.HCM - 1.2km</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>Mở cửa: 7:00 - 19:00 • Đang mở</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>Hotline: 0909 123 456</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Thay nhớt</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Sửa phanh</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Bảo dưỡng</span>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/booking">Đặt lịch ngay</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Xem chi tiết
                  </Button>
                </div>
              </div>

              {/* Featured garage card 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 ml-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">24</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Garage 24/7</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-600">4.7 (189 đánh giá)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>456 Nguyễn Huệ, Q1, TP.HCM - 2.1km</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <Clock className="h-4 w-4" />
                    <span>Mở cửa 24/7 • Cứu hộ khẩn cấp</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Cứu hộ</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Sửa chữa</span>
                </div>

                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/emergency">Gọi cứu hộ ngay</Link>
                </Button>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-bounce">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
              <Clock className="h-6 w-6 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
