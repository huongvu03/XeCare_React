"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Star, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import Link from "next/link"

const emergencyGarages = [
  {
    id: 1,
    name: "Garage 24/7 Express",
    logo: "24",
    logoColor: "from-green-600 to-emerald-600",
    distance: 0.8,
    rating: 4.9,
    responseTime: "2 phút",
    phone: "1900 1234",
    status: "online",
  },
  {
    id: 2,
    name: "Garage SOS Auto",
    logo: "SOS",
    logoColor: "from-blue-600 to-cyan-600",
    distance: 1.2,
    rating: 4.8,
    responseTime: "3 phút",
    phone: "1900 5678",
    status: "online",
  },
  {
    id: 3,
    name: "Garage Rescue Pro",
    logo: "RP",
    logoColor: "from-purple-600 to-pink-600",
    distance: 1.5,
    rating: 4.7,
    responseTime: "5 phút",
    phone: "1900 9999",
    status: "online",
  },
]

export function EmergencyRescueSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % emergencyGarages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % emergencyGarages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? emergencyGarages.length - 1 : prev - 1))
  }

  const currentGarage = emergencyGarages[currentSlide]

  return (
    <div className="bg-gradient-to-br from-blue-500 to-green-600 rounded-xl md:rounded-2xl p-2 md:p-3 shadow-md md:shadow-lg border border-blue-200 relative overflow-hidden">
      {/* Background decorations - responsive */}
      <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 md:w-20 md:h-20 bg-white/5 rounded-full blur-lg"></div>

      {/* Emergency header - responsive */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="flex items-center space-x-1 md:space-x-2">
          <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-white animate-pulse" />
          <span className="text-white font-bold text-xs md:text-sm">CỨU HỘ KHẨN CẤP</span>
        </div>
        <div className="flex space-x-1">
          <button onClick={prevSlide} className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors">
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 text-white" />
          </button>
          <button onClick={nextSlide} className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors">
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Garage slide - responsive */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-3 mb-2 md:mb-3">
        <div className="flex items-center space-x-2 md:space-x-3 mb-2">
          <div
            className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r ${currentGarage.logoColor} rounded-lg flex items-center justify-center`}
          >
            <span className="text-white font-bold text-xs md:text-sm">{currentGarage.logo}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-xs md:text-sm truncate">{currentGarage.name}</h3>
            <div className="flex items-center space-x-1 md:space-x-2">
              <MapPin className="h-3 w-3 text-white/80" />
              <span className="text-white/90 text-xs">{currentGarage.distance}km</span>
              <Star className="h-3 w-3 text-yellow-300 fill-current" />
              <span className="text-white/90 text-xs">{currentGarage.rating}</span>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white animate-pulse h-6 md:h-8 px-2 md:px-3 text-xs"
            asChild
          >
            <Link href={`tel:${currentGarage.phone}`}>
              <Phone className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Gọi</span>
            </Link>
          </Button>
        </div>
        <div className="text-white/90 text-xs">
          <span className="hidden sm:inline">Phản hồi trong </span>
          <span className="font-semibold">{currentGarage.responseTime}</span>
        </div>
      </div>

      {/* Indicators - responsive */}
      <div className="flex justify-center space-x-1 mb-2 md:mb-3">
        {emergencyGarages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Emergency hotline - responsive */}
      <div className="border-t border-white/20 pt-2 md:pt-3">
        <Button
          className="w-full bg-white text-red-600 hover:bg-red-50 font-bold text-xs md:text-sm py-2 md:py-3"
          asChild
        >
          <Link href="/emergency">
            <Phone className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Hotline: </span>1900 1234
          </Link>
        </Button>
      </div>
    </div>
  )
}
