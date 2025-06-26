import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Navigation } from "lucide-react"
import Link from "next/link"
import { FeaturedGarageCarousel } from "@/components/featured-garage-carousel"

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

          {/* Right content - Featured garage carousel */}
          <FeaturedGarageCarousel />
        </div>
      </div>
    </section>
  )
}
