"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Phone, Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { apiWrapper } from "@/services/apiWrapper"
import type { PublicGarageResponseDto } from "@/services/api"

// Interface for enhanced garage data
interface EnhancedGarage extends PublicGarageResponseDto {
  slug: string;
  logo: string;
  logoColor: string;
  distance?: number;
  isFavorite: boolean;
  isPopular: boolean;
  services: Array<{ name: string; color: string }>;
}

// Hàm tính khoảng cách Haversine (km)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  return Math.round(distance * 100) / 100 // Làm tròn 2 số thập phân
}

// Helper function to convert backend data to enhanced format
const convertToEnhancedGarage = (garage: PublicGarageResponseDto, userLat?: number, userLon?: number): EnhancedGarage => {
  // Generate slug from name
  const slug = garage.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  // Generate logo from name (first 2 characters)
  const logo = garage.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Generate logo color based on garage ID
  const colors = [
    "from-blue-600 to-cyan-600",
    "from-green-600 to-emerald-600", 
    "from-purple-600 to-pink-600",
    "from-red-600 to-orange-600",
    "from-yellow-500 to-amber-600",
    "from-indigo-600 to-purple-600",
    "from-pink-600 to-rose-600",
    "from-teal-600 to-cyan-600"
  ];
  const logoColor = colors[garage.id % colors.length];

  // Convert services to enhanced format
  const serviceColors = ["blue", "green", "purple", "red", "orange", "yellow", "indigo", "pink"];
  const services = garage.serviceNames.map((service, index) => ({
    name: service,
    color: serviceColors[index % serviceColors.length]
  }));

  // Tính khoảng cách thực tế nếu có tọa độ user
  let distance = Math.random() * 5 + 0.5; // Fallback distance
  if (userLat && userLon && garage.latitude && garage.longitude) {
    distance = calculateDistance(userLat, userLon, garage.latitude, garage.longitude)
  }


  // Mock favorite status (in real app, this would come from user's favorites)
  const isFavorite = Math.random() > 0.7; // 30% chance of being favorite

  // Determine if popular based on rating and review count
  const isPopular = garage.averageRating >= 4.5 && garage.totalReviews >= 50;

  return {
    ...garage,
    slug,
    logo,
    logoColor,
    distance,
    isFavorite,
    isPopular,
    services
  };
};

export function FeaturedGarageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [garages, setGarages] = useState<EnhancedGarage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { user } = useAuth()
  const isAuthenticated = !!user
  const router = useRouter()

  // Get the 3 garages to display
  const displayGarages = garages.slice(0, 3)

  // Function to get user location
  const getUserLocation = async (): Promise<{lat: number, lon: number} | null> => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser')
      return null
    }

    try {
      setIsGettingLocation(true)
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        })
      })
      
      const location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }
      
      console.log('📍 User location obtained:', location)
      setUserLocation(location)
      return location
    } catch (error: any) {
      console.warn('⚠️ Geolocation failed:', error.message)
      return null
    } finally {
      setIsGettingLocation(false)
    }
  }

  // Function to reload garages with new location
  const reloadGaragesWithLocation = async (location: {lat: number, lon: number}) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get active garages from backend
      const response = await apiWrapper.searchGaragesAdvanced({
        status: 'ACTIVE',
        isVerified: true
      })
      
      console.log('✅ Featured garages reloaded with new location:', response.length)
      
      // Convert to enhanced format with new user coordinates
      const enhancedGarages = response.map(garage => convertToEnhancedGarage(garage, location.lat, location.lon))
      
      // Sort garages: ưu tiên gần nhất, tiếp theo là yêu thích
      const sortedGarages = enhancedGarages.sort((a, b) => {
        // Ưu tiên garage yêu thích trước
        if (a.isFavorite && !b.isFavorite) return -1
        if (!a.isFavorite && b.isFavorite) return 1
        
        // Nếu cùng trạng thái yêu thích, sắp xếp theo khoảng cách
        return (a.distance || 0) - (b.distance || 0)
      })
      
      setGarages(sortedGarages)
    } catch (err) {
      console.error('❌ Error reloading garages:', err)
      setError('Cannot reload garage list')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle location button click
  const handleLocationClick = async () => {
    const location = await getUserLocation()
    if (location) {
      await reloadGaragesWithLocation(location)
    }
  }

  // Load garages from backend
  useEffect(() => {
    const loadGarages = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('🔄 Loading featured garages from backend...')
        
        // Sử dụng vị trí đã lưu hoặc lấy mới
        let userLat: number | undefined, userLon: number | undefined
        
        if (userLocation) {
          userLat = userLocation.lat
          userLon = userLocation.lon
        } else if (isAuthenticated) {
          // Use default coordinates (Ho Chi Minh City) for initial load
          userLat = 10.8231
          userLon = 106.6297
        }
        
        // Get active garages from backend
        const response = await apiWrapper.searchGaragesAdvanced({
          status: 'ACTIVE',
          isVerified: true
        })
        
        console.log('✅ Featured garages loaded:', response.length)
        
        // Convert to enhanced format with user coordinates
        const enhancedGarages = response.map(garage => convertToEnhancedGarage(garage, userLat, userLon))
        
        // Sort garages: ưu tiên gần nhất, tiếp theo là yêu thích
        const sortedGarages = enhancedGarages.sort((a, b) => {
          // Ưu tiên garage yêu thích trước
          if (a.isFavorite && !b.isFavorite) return -1
          if (!a.isFavorite && b.isFavorite) return 1
          
          // Nếu cùng trạng thái yêu thích, sắp xếp theo khoảng cách
          return (a.distance || 0) - (b.distance || 0)
        })
        
        setGarages(sortedGarages)
      } catch (err) {
        console.error('❌ Error loading featured garages:', err)
        setError('Cannot load garage list')
        
        // Fallback to empty array
        setGarages([])
      } finally {
        setIsLoading(false)
      }
    }

    loadGarages()
  }, [isAuthenticated, userLocation])

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

  const goToSlide = (index: number) => {
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl shadow-xl border border-blue-100">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-slate-600">Loading garage list...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl shadow-xl border border-red-100">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">An error occurred</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show empty state
  if (displayGarages.length === 0) {
    return (
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl shadow-xl border border-blue-100">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">🏪</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No garages available</h3>
                <p className="text-gray-600">Currently no garages are displayed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
                          {garage.averageRating ? garage.averageRating.toFixed(1) : 'No rating'} ({garage.totalReviews || 0} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex ml-auto space-x-1">
                      {garage.isFavorite && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Favorite
                        </span>
                      )}
                      {garage.isPopular && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Popular</span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {garage.address} {isAuthenticated && `- ${garage.distance?.toFixed(2)}km`}
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
                    <Link href={`/booking/${garage.id}`}>{isAuthenticated ? "Book Now" : "Book"}</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`/garage-detail/${garage.id}`}>View Details</Link>
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
          {displayGarages.map((_, index: number) => (
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

      {/* Location button */}
      <div className="absolute -top-4 -right-4">
        <button
          onClick={handleLocationClick}
          disabled={isGettingLocation}
          className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Get current location"
        >
          {isGettingLocation ? (
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          ) : (
            <MapPin className="h-6 w-6 text-blue-600" />
          )}
        </button>
      </div>
      <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
        <Clock className="h-6 w-6 text-cyan-600" />
      </div>
    </div>
  )
}
