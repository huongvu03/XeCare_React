"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Phone, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

// Mock data for garages
const mockGarages = [
  {
    id: 1,
    slug: "thanh-cong",
    name: "Garage Thành Công",
    logo: "TC",
    logoColor: "from-blue-600 to-cyan-600",
    rating: 4.9,
    reviewCount: 245,
    address: "123 Lê Lợi, Q1, TP.HCM",
    distance: 1.2,
    openHours: "7:00 - 19:00",
    isOpen: true,
    phone: "0909 123 456",
    services: [
      { name: "Thay nhớt", color: "blue" },
      { name: "Sửa phanh", color: "green" },
      { name: "Bảo dưỡng", color: "purple" },
    ],
    isFavorite: true,
    isPopular: true,
  },
  {
    id: 2,
    slug: "garage-24-7",
    name: "Garage 24/7",
    logo: "24",
    logoColor: "from-green-600 to-emerald-600",
    rating: 4.7,
    reviewCount: 189,
    address: "456 Nguyễn Huệ, Q1, TP.HCM",
    distance: 2.1,
    openHours: "24/7",
    isOpen: true,
    phone: "0908 247 247",
    services: [
      { name: "Cứu hộ", color: "red" },
      { name: "Sửa chữa", color: "orange" },
    ],
    isFavorite: false,
    isPopular: true,
  },
  {
    id: 3,
    slug: "auto-care",
    name: "Auto Care Center",
    logo: "AC",
    logoColor: "from-purple-600 to-pink-600",
    rating: 4.8,
    reviewCount: 172,
    address: "789 Cách Mạng Tháng 8, Q3, TP.HCM",
    distance: 0.8,
    openHours: "8:00 - 20:00",
    isOpen: true,
    phone: "0907 888 999",
    services: [
      { name: "Điện", color: "yellow" },
      { name: "Điều hòa", color: "blue" },
      { name: "Đồng sơn", color: "red" },
    ],
    isFavorite: true,
    isPopular: false,
  },
  {
    id: 4,
    slug: "saigon-auto",
    name: "Sài Gòn Auto",
    logo: "SG",
    logoColor: "from-red-600 to-orange-600",
    rating: 4.6,
    reviewCount: 156,
    address: "101 Nguyễn Văn Linh, Q7, TP.HCM",
    distance: 3.5,
    openHours: "7:30 - 18:30",
    isOpen: true,
    phone: "0903 777 888",
    services: [
      { name: "Gầm", color: "gray" },
      { name: "Động cơ", color: "green" },
    ],
    isFavorite: false,
    isPopular: false,
  },
  {
    id: 5,
    slug: "viet-nhat",
    name: "Việt Nhật Auto",
    logo: "VN",
    logoColor: "from-yellow-500 to-amber-600",
    rating: 4.5,
    reviewCount: 132,
    address: "202 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    distance: 1.5,
    openHours: "8:00 - 17:30",
    isOpen: false,
    phone: "0904 555 666",
    services: [
      { name: "Xe Nhật", color: "blue" },
      { name: "Phụ tùng", color: "purple" },
    ],
    isFavorite: false,
    isPopular: true,
  },
]

export function FeaturedGarageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [garages, setGarages] = useState(mockGarages)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Get the 3 garages to display
  const displayGarages = garages.slice(0, 3)

  useEffect(() => {
    // Sort garages based on user authentication status
    if (isAuthenticated) {
      // If user is logged in, prioritize nearest garages
      // If distance is similar (within 0.5km), prioritize favorites
      const sortedGarages = [...mockGarages].sort((a, b) => {
        const distanceDiff = Math.abs(a.distance - b.distance)

        if (distanceDiff <= 0.5) {
          // If distance is similar, prioritize favorites
          if (a.isFavorite && !b.isFavorite) return -1
          if (!a.isFavorite && b.isFavorite) return 1
        }

        // Otherwise sort by distance
        return a.distance - b.distance
      })

      setGarages(sortedGarages)
    } else {
      // If user is not logged in, prioritize favorites, then popular, then rating
      const sortedGarages = [...mockGarages].sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1
        if (!a.isFavorite && b.isFavorite) return 1

        if (a.isPopular && !b.isPopular) return -1
        if (!a.isPopular && b.isPopular) return 1

        return b.rating - a.rating
      })

      setGarages(sortedGarages)
    }
  }, [isAuthenticated])

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayGarages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [displayGarages.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayGarages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? displayGarages.length - 1 : prevIndex - 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const handleCardClick = (garageSlug: string, event: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or interactive elements
    const target = event.target as HTMLElement
    if (target.closest("button") || target.closest("a")) {
      return
    }
    router.push(`/garage/${garageSlug}`)
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl shadow-xl border border-blue-100">
        {/* Carousel slides */}
        <div
          className="transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="flex">
            {displayGarages.map((garage, index) => (
              <div
                key={garage.id}
                className="min-w-full bg-white p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200"
                onClick={(e) => handleCardClick(garage.slug, e)}
              >
                {/* Clickable header */}
                <Link href={`/garage/${garage.slug}`} className="block">
                  <div className="flex items-center space-x-3 mb-4 hover:bg-blue-50 rounded-lg p-2 -m-2 transition-colors">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${garage.logoColor} rounded-lg flex items-center justify-center`}
                    >
                      <span className="text-white font-bold">{garage.logo}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                        {garage.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600">
                          {garage.rating} ({garage.reviewCount} đánh giá)
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex ml-auto space-x-1">
                      {garage.isFavorite && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Yêu thích
                        </span>
                      )}
                      {garage.isPopular && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Phổ biến</span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {garage.address} {isAuthenticated && `- ${garage.distance}km`}
                    </span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 text-sm ${garage.isOpen ? "text-green-600" : "text-red-600"}`}
                  >
                    <Clock className="h-4 w-4" />
                    <span>
                      Mở cửa: {garage.openHours} • {garage.isOpen ? "Đang mở" : "Đã đóng"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>Hotline: {garage.phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {garage.services.map((service, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 bg-${service.color}-100 text-${service.color}-700 rounded-full text-xs`}
                    >
                      {service.name}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/booking">{isAuthenticated ? "Đặt lịch ngay" : "Đặt lịch"}</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`/garage/${garage.slug}`}>Xem chi tiết</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
        >
          <ChevronRight className="h-5 w-5 text-slate-700" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
          {displayGarages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-blue-600" : "bg-slate-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center mt-4 space-x-2">
        {displayGarages.map((garage, index) => (
          <button
            key={garage.id}
            onClick={() => goToSlide(index)}
            className={`w-16 h-12 rounded-lg border-2 overflow-hidden flex items-center justify-center ${
              index === currentIndex ? "border-blue-600" : "border-transparent"
            }`}
          >
            <div className={`w-8 h-8 bg-gradient-to-r ${garage.logoColor} rounded flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">{garage.logo}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Floating elements */}
      <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-bounce">
        <MapPin className="h-6 w-6 text-blue-600" />
      </div>
      <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
        <Clock className="h-6 w-6 text-cyan-600" />
      </div>
    </div>
  )
}
