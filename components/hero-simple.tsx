"use client"

import { Button } from "@/components/ui/button"
import { Search, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function HeroSimple() {
  const router = useRouter()

  const handleSearchClick = () => {
    console.log("🔍 Search button clicked")
    router.push("/search")
  }

  const handleEmergencyClick = () => {
    console.log("🚨 Emergency button clicked")
    router.push("/emergency")
  }

  const handleBookingClick = () => {
    console.log("📅 Booking button clicked")
    router.push("/search")
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-8 md:py-16 lg:py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5"></div>
      <div className="absolute top-10 left-10 w-20 h-20 md:w-32 md:h-32 bg-blue-200 rounded-full blur-xl opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 md:w-40 md:h-40 bg-cyan-200 rounded-full blur-xl opacity-30"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight">
                Tìm kiếm{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Garage</span>{" "}
                gần bạn
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
                Kết nối với hàng nghìn garage uy tín, đặt lịch sửa chữa xe nhanh chóng và tiện lợi. Dịch vụ chất lượng,
                giá cả hợp lý.
              </p>
            </div>

            {/* Search bar - responsive */}
            <div className="relative max-w-md md:max-w-lg mx-auto lg:mx-0">
              <div className="relative">
                <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 md:h-5 md:w-5" />
                <input
                  type="text"
                  placeholder="Tìm garage theo địa điểm..."
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm md:text-base"
                />
              </div>
              <Button
                className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base"
                onClick={handleSearchClick}
              >
                Tìm kiếm
              </Button>
            </div>

            {/* Quick actions - responsive */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md md:max-w-lg mx-auto lg:mx-0">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-sm md:text-base py-3 md:py-4"
                onClick={handleBookingClick}
              >
                <MapPin className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Đặt lịch ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 text-sm md:text-base py-3 md:py-4 bg-transparent"
                onClick={handleEmergencyClick}
              >
                <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Cứu hộ 24/7
              </Button>
            </div>

            {/* Stats - responsive */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">500+</div>
                <div className="text-xs md:text-sm text-slate-600">Garage</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-600">10K+</div>
                <div className="text-xs md:text-sm text-slate-600">Khách hàng</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600">4.8★</div>
                <div className="text-xs md:text-sm text-slate-600">Đánh giá</div>
              </div>
            </div>
          </div>

          {/* Right content - responsive */}
          <div className="relative space-y-4 md:space-y-6">
            {/* Emergency Rescue Slider */}
            <div className="bg-gradient-to-br from-blue-500 to-green-600 rounded-xl md:rounded-2xl p-2 md:p-3 shadow-md md:shadow-lg border border-blue-200 relative overflow-hidden">
              <div className="text-center py-8">
                <h3 className="text-white font-bold text-sm md:text-base mb-2">🚨 CỨU HỘ KHẨN CẤP</h3>
                <p className="text-white/90 text-xs md:text-sm mb-4">Garage cứu hộ 24/7</p>
                <Button 
                  size="sm"
                  className="bg-white text-red-600 hover:bg-red-50"
                  onClick={handleEmergencyClick}
                >
                  <Phone className="mr-2 h-3 w-3" />
                  Gọi ngay
                </Button>
              </div>
            </div>

            {/* Featured garage placeholder */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md border">
              <h3 className="font-semibold text-slate-900 mb-4">Garage nổi bật</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">G1</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Garage ABC</p>
                    <p className="text-xs text-slate-600">4.8★ • 0.5km</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">G2</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Garage XYZ</p>
                    <p className="text-xs text-slate-600">4.9★ • 1.2km</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
