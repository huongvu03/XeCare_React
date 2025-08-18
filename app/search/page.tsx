"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InteractiveMap } from "@/components/interactive-map"
import {
  MapPin,
  Search,
  Star,
  Clock,
  Phone,
  Navigation,
  Filter,
  SlidersHorizontal,
  Car,
  Bike,
  Truck,
  Loader2,
  AlertCircle,
  Target,
  Map,
  List,
  Grid3X3,
  X,
  RefreshCw,
  Calendar,
  CheckCircle2,
  Copy,
  MessageSquare,
  Info,
  Settings,
  ExternalLink,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"

// Mock data for garages with GPS coordinates
const mockGarages = [
  {
    id: 1,
    name: "Garage Thành Công",
    address: "123 Lê Lợi, Q1, TP.HCM",
    lat: 10.7769,
    lng: 106.7009,
    rating: 4.8,
    reviewCount: 245,
    phone: "0909123456",
    isOpen: true,
    openTime: "7:00 - 19:00",
    services: ["Thay nhớt", "Sửa phanh", "Bảo dưỡng"],
    vehicleTypes: ["Xe máy", "Ô tô"],
    priceRange: "$$",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Garage Thành Công là một trong những garage uy tín nhất tại Quận 1, TP.HCM với hơn 10 năm kinh nghiệm. Chúng tôi cung cấp các dịch vụ bảo dưỡng, sửa chữa xe máy và ô tô với đội ngũ kỹ thuật viên lành nghề và trang thiết bị hiện đại.",
    fullServices: [
      { name: "Thay nhớt", price: "150.000đ - 800.000đ", time: "30 phút" },
      { name: "Sửa phanh", price: "200.000đ - 1.500.000đ", time: "1-2 giờ" },
      { name: "Bảo dưỡng định kỳ", price: "500.000đ - 3.000.000đ", time: "2-4 giờ" },
      { name: "Kiểm tra tổng quát", price: "Miễn phí", time: "15 phút" },
      { name: "Thay lốp xe", price: "300.000đ - 2.000.000đ", time: "30-60 phút" },
    ],
    reviews: [
      { user: "Nguyễn Văn A", rating: 5, comment: "Dịch vụ rất tốt, nhân viên thân thiện", date: "15/05/2023" },
      { user: "Trần Thị B", rating: 4, comment: "Sửa xe nhanh, giá hợp lý", date: "02/06/2023" },
      { user: "Lê Văn C", rating: "5", comment: "Rất hài lòng với dịch vụ", date: "20/06/2023" },
    ],
    images: [
      "/placeholder.svg?height=200&width=300&text=Garage+Thành+Công+1",
      "/placeholder.svg?height=200&width=300&text=Garage+Thành+Công+2",
      "/placeholder.svg?height=200&width=300&text=Garage+Thành+Công+3",
    ],
  },
  {
    id: 2,
    name: "Garage 24/7",
    address: "456 Nguyễn Huệ, Q1, TP.HCM",
    lat: 10.7743,
    lng: 106.7038,
    rating: 4.7,
    reviewCount: 189,
    phone: "0909234567",
    isOpen: true,
    openTime: "24/7",
    services: ["Cứu hộ", "Sửa chữa khẩn cấp"],
    vehicleTypes: ["Xe máy", "Ô tô", "Xe tải"],
    priceRange: "$$$",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Garage 24/7 chuyên cung cấp dịch vụ cứu hộ và sửa chữa khẩn cấp 24 giờ mỗi ngày. Với đội ngũ kỹ thuật viên luôn sẵn sàng, chúng tôi cam kết có mặt trong vòng 30 phút kể từ khi nhận cuộc gọi trong khu vực nội thành.",
    fullServices: [
      { name: "Cứu hộ xe máy", price: "300.000đ - 500.000đ", time: "30 phút" },
      { name: "Cứu hộ ô tô", price: "500.000đ - 1.000.000đ", time: "30-45 phút" },
      { name: "Sửa chữa khẩn cấp tại chỗ", price: "200.000đ - 1.500.000đ", time: "30-90 phút" },
      { name: "Kéo xe về garage", price: "500.000đ - 2.000.000đ", time: "Tùy khoảng cách" },
      { name: "Thay ắc quy", price: "800.000đ - 3.000.000đ", time: "30 phút" },
    ],
    reviews: [
      { user: "Phạm Văn D", rating: 5, comment: "Cứu hộ nhanh chóng, rất chuyên nghiệp", date: "10/06/2023" },
      { user: "Hoàng Thị E", rating: 4, comment: "Giá hơi cao nhưng dịch vụ tốt", date: "05/07/2023" },
      { user: "Vũ Văn F", rating: 5, comment: "Đến rất nhanh khi xe tôi bị hỏng giữa đường", date: "12/07/2023" },
    ],
    images: [
      "/placeholder.svg?height=200&width=300&text=Garage+24/7+1",
      "/placeholder.svg?height=200&width=300&text=Garage+24/7+2",
      "/placeholder.svg?height=200&width=300&text=Garage+24/7+3",
    ],
  },
  {
    id: 3,
    name: "Garage ABC",
    address: "789 Trần Hưng Đạo, Q5, TP.HCM",
    lat: 10.7546,
    lng: 106.6787,
    rating: 4.5,
    reviewCount: 156,
    phone: "0909345678",
    isOpen: false,
    openTime: "8:00 - 18:00",
    services: ["Sơn xe", "Rửa xe", "Đồng sơn"],
    vehicleTypes: ["Ô tô"],
    priceRange: "$$$$",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Garage ABC chuyên về dịch vụ sơn xe, đồng sơn và làm đẹp xe ô tô. Với công nghệ sơn tiên tiến và đội ngũ thợ lành nghề, chúng tôi cam kết mang đến cho xe của bạn diện mạo hoàn hảo nhất.",
    fullServices: [
      { name: "Sơn xe ô tô", price: "5.000.000đ - 20.000.000đ", time: "3-7 ngày" },
      { name: "Đồng sơn", price: "2.000.000đ - 15.000.000đ", time: "2-5 ngày" },
      { name: "Rửa xe cao cấp", price: "200.000đ - 500.000đ", time: "1-2 giờ" },
      { name: "Phủ ceramic", price: "5.000.000đ - 30.000.000đ", time: "1-2 ngày" },
      { name: "Dán phim cách nhiệt", price: "3.000.000đ - 15.000.000đ", time: "1 ngày" },
    ],
    reviews: [
      { user: "Nguyễn Thị G", rating: 5, comment: "Sơn xe rất đẹp, như xe mới", date: "20/05/2023" },
      { user: "Trần Văn H", rating: 4, comment: "Dịch vụ tốt nhưng hơi đắt", date: "15/06/2023" },
      { user: "Lê Thị I", rating: 4, comment: "Thợ làm việc tỉ mỉ, xe đẹp như mới", date: "01/07/2023" },
    ],
    images: [
      "/placeholder.svg?height=200&width=300&text=Garage+ABC+1",
      "/placeholder.svg?height=200&width=300&text=Garage+ABC+2",
      "/placeholder.svg?height=200&width=300&text=Garage+ABC+3",
    ],
  },
  {
    id: 4,
    name: "Garage Pro",
    address: "321 Võ Văn Tần, Q3, TP.HCM",
    lat: 10.7829,
    lng: 106.6934,
    rating: 4.9,
    reviewCount: 312,
    phone: "0909456789",
    isOpen: true,
    openTime: "6:00 - 20:00",
    services: ["Thay nhớt", "Sửa động cơ", "Kiểm định"],
    vehicleTypes: ["Xe máy", "Ô tô"],
    priceRange: "$$$",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Garage Pro là garage chuyên nghiệp hàng đầu tại Quận 3, chuyên về sửa chữa động cơ và các hệ thống phức tạp của xe. Với đội ngũ kỹ sư được đào tạo bài bản và thiết bị chẩn đoán hiện đại, chúng tôi có thể giải quyết mọi vấn đề của xe bạn.",
    fullServices: [
      { name: "Thay nhớt", price: "150.000đ - 1.000.000đ", time: "30 phút" },
      { name: "Sửa động cơ", price: "1.000.000đ - 20.000.000đ", time: "1-5 ngày" },
      { name: "Kiểm định xe", price: "300.000đ - 500.000đ", time: "1 giờ" },
      { name: "Bảo dưỡng toàn diện", price: "1.000.000đ - 5.000.000đ", time: "1 ngày" },
      { name: "Sửa hệ thống điện", price: "500.000đ - 3.000.000đ", time: "2-8 giờ" },
    ],
    reviews: [
      { user: "Phạm Văn J", rating: 5, comment: "Sửa xe rất chuyên nghiệp, giá hợp lý", date: "05/06/2023" },
      { user: "Hoàng Thị K", rating: 5, comment: "Đội ngũ kỹ thuật viên giỏi, tư vấn tận tình", date: "20/06/2023" },
      { user: "Vũ Văn L", rating: 5, comment: "Sửa động cơ xe tôi rất tốt, không còn tiếng kêu", date: "10/07/2023" },
    ],
    images: [
      "/placeholder.svg?height=200&width=300&text=Garage+Pro+1",
      "/placeholder.svg?height=200&width=300&text=Garage+Pro+2",
      "/placeholder.svg?height=200&width=300&text=Garage+Pro+3",
    ],
  },
  {
    id: 5,
    name: "Garage Express",
    address: "555 Cách Mạng Tháng 8, Q10, TP.HCM",
    lat: 10.7722,
    lng: 106.6602,
    rating: 4.6,
    reviewCount: 98,
    phone: "0909567890",
    isOpen: true,
    openTime: "8:00 - 17:00",
    services: ["Thay nhớt", "Bảo dưỡng", "Rửa xe"],
    vehicleTypes: ["Xe máy"],
    priceRange: "$",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Garage Express chuyên phục vụ xe máy với dịch vụ nhanh chóng, tiện lợi. Chúng tôi cam kết hoàn thành các dịch vụ cơ bản như thay nhớt, bảo dưỡng nhỏ trong vòng 30 phút để bạn không phải chờ đợi lâu.",
    fullServices: [
      { name: "Thay nhớt xe máy", price: "70.000đ - 300.000đ", time: "15 phút" },
      { name: "Bảo dưỡng xe máy", price: "150.000đ - 500.000đ", time: "30-60 phút" },
      { name: "Rửa xe máy", price: "30.000đ - 50.000đ", time: "15 phút" },
      { name: "Thay phụ tùng", price: "100.000đ - 1.000.000đ", time: "30-60 phút" },
      { name: "Vá săm, thay lốp", price: "50.000đ - 300.000đ", time: "15-30 phút" },
    ],
    reviews: [
      { user: "Nguyễn Văn M", rating: 5, comment: "Dịch vụ nhanh, giá rẻ", date: "01/06/2023" },
      { user: "Trần Thị N", rating: 4, comment: "Thay nhớt nhanh, nhân viên vui vẻ", date: "15/06/2023" },
      { user: "Lê Văn O", rating: 5, comment: "Rửa xe sạch sẽ, giá hợp lý", date: "05/07/2023" },
    ],
    images: [
      "/placeholder.svg?height=200&width=300&text=Garage+Express+1",
      "/placeholder.svg?height=200&width=300&text=Garage+Express+2",
      "/placeholder.svg?height=200&width=300&text=Garage+Express+3",
    ],
  },
  {
    id: 6,
    name: "Garage Premium",
    address: "888 Lý Thường Kiệt, Q11, TP.HCM",
    lat: 10.764,
    lng: 106.65,
    rating: 4.4,
    reviewCount: 67,
    phone: "0909678901",
    isOpen: true,
    openTime: "9:00 - 18:00",
    services: ["Sửa phanh", "Sửa động cơ", "Kiểm định"],
    vehicleTypes: ["Ô tô", "Xe tải"],
    priceRange: "$$$$",
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Garage Premium là garage cao cấp chuyên phục vụ các dòng xe ô tô và xe tải. Chúng tôi đặc biệt chuyên sâu về hệ thống phanh và động cơ, với các thiết bị chẩn đoán nhập khẩu và đội ngũ kỹ thuật viên được đào tạo tại nước ngoài.",
    fullServices: [
      { name: "Sửa hệ thống phanh", price: "1.000.000đ - 10.000.000đ", time: "2-8 giờ" },
      { name: "Sửa động cơ ô tô", price: "2.000.000đ - 50.000.000đ", time: "1-7 ngày" },
      { name: "Kiểm định xe ô tô", price: "500.000đ - 1.000.000đ", time: "2 giờ" },
      { name: "Sửa hệ thống treo", price: "2.000.000đ - 15.000.000đ", time: "1-3 ngày" },
      { name: "Bảo dưỡng xe tải", price: "2.000.000đ - 10.000.000đ", time: "1-2 ngày" },
    ],
    reviews: [
      { user: "Phạm Văn P", rating: 4, comment: "Dịch vụ chuyên nghiệp, giá hơi cao", date: "10/05/2023" },
      { user: "Hoàng Thị Q", rating: 5, comment: "Sửa phanh xe tải rất tốt", date: "25/06/2023" },
      { user: "Vũ Văn R", rating: 4, comment: "Kỹ thuật viên giỏi, tư vấn chi tiết", date: "15/07/2023" },
    ],
    images: [
      "/placeholder.svg?height=200&width=300&text=Garage+Premium+1",
      "/placeholder.svg?height=200&width=300&text=Garage+Premium+2",
      "/placeholder.svg?height=200&width=300&text=Garage+Premium+3",
    ],
  },
]

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Available time slots for booking
const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [filteredGarages, setFilteredGarages] = useState(mockGarages)
  const [showFilters, setShowFilters] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("distance")
  const [viewMode, setViewMode] = useState<"list" | "map" | "grid">("list")
  const [selectedGarage, setSelectedGarage] = useState<any>(null)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  const [isFiltered, setIsFiltered] = useState(false)

  // Google Maps API status
  const [hasGoogleMapsAPI, setHasGoogleMapsAPI] = useState<boolean | null>(null)
  const [showAPISetup, setShowAPISetup] = useState(false)

  // Booking modal states
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined)
  const [bookingName, setBookingName] = useState("")
  const [bookingPhone, setBookingPhone] = useState("")
  const [bookingNote, setBookingNote] = useState("")
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false)

  // Details modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Call modal states
  const [callModalOpen, setCallModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Filter states
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [maxDistance, setMaxDistance] = useState([20])
  const [minRating, setMinRating] = useState([0])
  const [priceRange, setPriceRange] = useState("all")
  const [openNow, setOpenNow] = useState(false)

  // Check Google Maps API availability
  useEffect(() => {
    const checkAPI = () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || localStorage.getItem("google_maps_api_key")
      setHasGoogleMapsAPI(!!apiKey)
    }
    checkAPI()
  }, [])

  // Get user location
  const getCurrentLocation = () => {
    setLocationLoading(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Trình duyệt không hỗ trợ định vị")
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(newLocation)
        setLocation("Vị trí hiện tại")
        setLocationLoading(false)
        setSortBy("distance")
      },
      (error) => {
        let errorMessage = "Không thể lấy vị trí hiện tại"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Bạn đã từ chối quyền truy cập vị trí"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Thông tin vị trí không khả dụng"
            break
          case error.TIMEOUT:
            errorMessage = "Yêu cầu vị trí đã hết thời gian"
            break
        }
        setLocationError(errorMessage)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  // Calculate distances and sort garages
  const processGarages = (garages: typeof mockGarages) => {
    let processed = garages.map((garage) => ({
      ...garage,
      distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, garage.lat, garage.lng) : 0,
    }))

    switch (sortBy) {
      case "distance":
        processed = processed.sort((a, b) => a.distance - b.distance)
        break
      case "rating":
        processed = processed.sort((a, b) => b.rating - a.rating)
        break
      case "reviews":
        processed = processed.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case "price-low":
        processed = processed.sort((a, b) => a.priceRange.length - b.priceRange.length)
        break
      case "price-high":
        processed = processed.sort((a, b) => b.priceRange.length - a.priceRange.length)
        break
    }

    return processed
  }

  // Check if any filters are active
  useEffect(() => {
    const hasActiveFilters =
      searchTerm !== "" ||
      (location !== "" && location !== "Vị trí hiện tại") ||
      selectedServices.length > 0 ||
      selectedVehicles.length > 0 ||
      (userLocation && maxDistance[0] < 20) ||
      minRating[0] > 0 ||
      priceRange !== "all" ||
      openNow

    setIsFiltered(hasActiveFilters)
  }, [
    searchTerm,
    location,
    selectedServices,
    selectedVehicles,
    maxDistance,
    minRating,
    priceRange,
    openNow,
    userLocation,
  ])

  // Filter garages based on criteria
  useEffect(() => {
    // If no filters are active and we have user location, just sort all garages
    if (!isFiltered && userLocation) {
      setFilteredGarages(processGarages(mockGarages))
      return
    }

    const filtered = mockGarages.filter((garage) => {
      const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, garage.lat, garage.lng) : 0

      const matchesSearch =
        searchTerm === "" ||
        garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garage.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garage.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesLocation = location === "" || garage.address.toLowerCase().includes(location.toLowerCase())
      const matchesServices =
        selectedServices.length === 0 || selectedServices.some((service) => garage.services.includes(service))
      const matchesVehicles =
        selectedVehicles.length === 0 || selectedVehicles.some((vehicle) => garage.vehicleTypes.includes(vehicle))
      const matchesDistance = !userLocation || distance <= maxDistance[0]
      const matchesRating = garage.rating >= minRating[0]
      const matchesPrice = priceRange === "all" || garage.priceRange === priceRange
      const matchesOpenNow = !openNow || garage.isOpen

      return (
        matchesSearch &&
        matchesLocation &&
        matchesServices &&
        matchesVehicles &&
        matchesDistance &&
        matchesRating &&
        matchesPrice &&
        matchesOpenNow
      )
    })

    setFilteredGarages(processGarages(filtered))
  }, [
    searchTerm,
    location,
    selectedServices,
    selectedVehicles,
    maxDistance,
    minRating,
    priceRange,
    openNow,
    userLocation,
    sortBy,
    isFiltered,
  ])

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  const handleVehicleToggle = (vehicle: string) => {
    setSelectedVehicles((prev) => (prev.includes(vehicle) ? prev.filter((v) => v !== vehicle) : [...prev, vehicle]))
  }

  const clearFilters = () => {
    setSelectedServices([])
    setSelectedVehicles([])
    setMaxDistance([20])
    setMinRating([0])
    setPriceRange("all")
    setOpenNow(false)
    setSearchTerm("")
    if (location !== "Vị trí hiện tại") {
      setLocation("")
    }
    // Force update to show all garages
    setFilteredGarages(processGarages(mockGarages))
  }

  const findNearestGarages = () => {
    getCurrentLocation()
  }

  const handleBookNow = (garage: any) => {
    setSelectedGarage(garage)
    setBookingModalOpen(true)
    // Reset booking form
    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setSelectedService(undefined)
    setBookingName("")
    setBookingPhone("")
    setBookingNote("")
  }

  const handleViewDetails = (garage: any) => {
    setSelectedGarage(garage)
    setDetailsModalOpen(true)
    setActiveImageIndex(0)
  }

  const handleCallNow = (garage: any) => {
    setSelectedGarage(garage)
    setCallModalOpen(true)
    setIsCopied(false)
  }

  const handleCopyPhone = () => {
    if (selectedGarage) {
      navigator.clipboard.writeText(selectedGarage.phone)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleBookingSubmit = () => {
    if (!selectedDate || !selectedTime || !selectedService || !bookingName || !bookingPhone) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin đặt lịch",
        variant: "destructive",
      })
      return
    }

    setIsBookingSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsBookingSubmitting(false)
      setBookingModalOpen(false)
      toast({
        title: "Đặt lịch thành công!",
        description: `Bạn đã đặt lịch tại ${selectedGarage?.name} vào ngày ${format(selectedDate, "dd/MM/yyyy")} lúc ${selectedTime}`,
        variant: "default",
      })
    }, 1500)
  }

  const allServices = ["Thay nhớt", "Sửa phanh", "Bảo dưỡng", "Sửa động cơ", "Cứu hộ", "Sơn xe", "Rửa xe", "Kiểm định"]
  const allVehicles = ["Xe máy", "Ô tô", "Xe tải"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Tìm garage gần bạn</h1>

          {locationError && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{locationError}</AlertDescription>
            </Alert>
          )}

          {/* Google Maps API Status */}
          {hasGoogleMapsAPI === false && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <Settings className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                <div className="flex items-center justify-between">
                  <span>Google Maps API chưa được cấu hình. Đang sử dụng chế độ mô phỏng.</span>
                  <Button size="sm" variant="outline" onClick={() => setShowAPISetup(true)} className="ml-2">
                    <Settings className="h-3 w-3 mr-1" />
                    Cài đặt
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Tìm theo tên garage, dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Nhập địa chỉ hoặc quận..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 pr-10"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={findNearestGarages}
                disabled={locationLoading}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
              >
                {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              onClick={findNearestGarages}
              disabled={locationLoading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {locationLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Target className="h-4 w-4 mr-2" />
              )}
              Tìm gần nhất
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-blue-200 text-blue-600 flex-1"
              >
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc{" "}
                {selectedServices.length + selectedVehicles.length > 0 &&
                  `(${selectedServices.length + selectedVehicles.length})`}
              </Button>

              {isFiltered && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {isFiltered && (
            <div className="flex flex-wrap gap-2 mt-3 mb-4">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <Search className="h-3 w-3" />
                  <span>{searchTerm}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {location && location !== "Vị trí hiện tại" && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <MapPin className="h-3 w-3" />
                  <span>{location}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation("")}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {userLocation && maxDistance[0] < 20 && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <Navigation className="h-3 w-3" />
                  <span>≤ {maxDistance[0]}km</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMaxDistance([20])}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {selectedServices.map((service) => (
                <Badge key={service} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <span>{service}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleServiceToggle(service)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {selectedVehicles.map((vehicle) => (
                <Badge key={vehicle} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <span>{vehicle}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVehicleToggle(vehicle)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {minRating[0] > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>≥ {minRating[0]}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMinRating([0])}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {priceRange !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <span>Giá: {priceRange}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPriceRange("all")}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {openNow && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <Clock className="h-3 w-3" />
                  <span>Đang mở</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpenNow(false)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {isFiltered && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  Xóa tất cả bộ lọc
                </Button>
              )}
            </div>
          )}

          {userLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 text-green-700">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Đã xác định vị trí: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </span>
              </div>
            </div>
          )}

          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-fit grid-cols-3">
                <TabsTrigger value="list" className="flex items-center space-x-2">
                  <List className="h-4 w-4" />
                  <span>Danh sách</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center space-x-2">
                  <Map className="h-4 w-4" />
                  <span>Bản đồ</span>
                </TabsTrigger>
                <TabsTrigger value="grid" className="flex items-center space-x-2">
                  <Grid3X3 className="h-4 w-4" />
                  <span>Lưới</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance" disabled={!userLocation}>
                      Gần nhất {!userLocation && "(Cần vị trí)"}
                    </SelectItem>
                    <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                    <SelectItem value="reviews">Nhiều đánh giá nhất</SelectItem>
                    <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <TabsContent value="list" className="mt-0">
                <div className="grid lg:grid-cols-4 gap-8">
                  {/* Filters Sidebar */}
                  {showFilters && (
                    <div className="lg:col-span-1">
                      <Card className="border-blue-100 sticky top-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                            <span>Bộ lọc</span>
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                          >
                            Xóa tất cả
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Distance Filter */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium flex items-center justify-between">
                              <span>Khoảng cách từ vị trí hiện tại</span>
                              {!userLocation && (
                                <Badge variant="outline" className="text-xs">
                                  Cần GPS
                                </Badge>
                              )}
                            </label>

                            {/* Preset Distance Buttons */}
                            {userLocation && (
                              <div className="grid grid-cols-3 gap-2 mb-3">
                                {[1, 2, 5, 10, 15, 20].map((distance) => {
                                  const garagesInRange = mockGarages.filter((garage) => {
                                    const dist = calculateDistance(
                                      userLocation.lat,
                                      userLocation.lng,
                                      garage.lat,
                                      garage.lng,
                                    )
                                    return dist <= distance
                                  }).length

                                  return (
                                    <Button
                                      key={distance}
                                      variant={maxDistance[0] === distance ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setMaxDistance([distance])}
                                      className="text-xs p-2 h-auto flex flex-col"
                                    >
                                      <span>{distance}km</span>
                                      <span className="text-xs opacity-70">({garagesInRange})</span>
                                    </Button>
                                  )
                                })}
                              </div>
                            )}

                            <Slider
                              value={maxDistance}
                              onValueChange={setMaxDistance}
                              max={20}
                              min={1}
                              step={0.5}
                              className="w-full"
                              disabled={!userLocation}
                            />

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Trong vòng {maxDistance[0]} km</span>
                              {userLocation && (
                                <span className="text-blue-600 font-medium">
                                  {
                                    mockGarages.filter((garage) => {
                                      const dist = calculateDistance(
                                        userLocation.lat,
                                        userLocation.lng,
                                        garage.lat,
                                        garage.lng,
                                      )
                                      return dist <= maxDistance[0]
                                    }).length
                                  }{" "}
                                  garage
                                </span>
                              )}
                            </div>

                            {!userLocation && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <div className="flex items-start space-x-2">
                                  <Target className="h-4 w-4 text-amber-600 mt-0.5" />
                                  <div className="text-xs text-amber-700">
                                    <p className="font-medium">Cần vị trí GPS để lọc theo khoảng cách</p>
                                    <p>Bấm "Tìm gần nhất" để bật định vị</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Rating Filter */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Đánh giá tối thiểu</label>
                            <Slider
                              value={minRating}
                              onValueChange={setMinRating}
                              max={5}
                              min={0}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="text-xs text-slate-500">Từ {minRating[0]} sao trở lên</div>
                          </div>

                          {/* Price Range */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Mức giá</label>
                            <Select value={priceRange} onValueChange={setPriceRange}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="$">$ - Rẻ</SelectItem>
                                <SelectItem value="$$">$$ - Trung bình</SelectItem>
                                <SelectItem value="$$$">$$$ - Cao</SelectItem>
                                <SelectItem value="$$$$">$$$$ - Cao cấp</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Vehicle Types */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Loại xe</label>
                            <div className="space-y-2">
                              {allVehicles.map((vehicle) => (
                                <div key={vehicle} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={vehicle}
                                    checked={selectedVehicles.includes(vehicle)}
                                    onCheckedChange={() => handleVehicleToggle(vehicle)}
                                  />
                                  <label htmlFor={vehicle} className="text-sm">
                                    {vehicle}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Services */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Dịch vụ</label>
                            <div className="space-y-2">
                              {allServices.map((service) => (
                                <div key={service} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={service}
                                    checked={selectedServices.includes(service)}
                                    onCheckedChange={() => handleServiceToggle(service)}
                                  />
                                  <label htmlFor={service} className="text-sm">
                                    {service}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Open Now */}
                          <div className="flex items-center space-x-2">
                            <Checkbox id="openNow" checked={openNow} onCheckedChange={setOpenNow} />
                            <label htmlFor="openNow" className="text-sm">
                              Chỉ hiển thị garage đang mở
                            </label>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Results */}
                  <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {!isFiltered ? (
                            <>Tất cả garage ({filteredGarages.length})</>
                          ) : (
                            <>Tìm thấy {filteredGarages.length} garage</>
                          )}
                          {userLocation && sortBy === "distance" && " (sắp xếp theo khoảng cách)"}
                          {sortBy === "rating" && " (sắp xếp theo đánh giá)"}
                          {sortBy === "reviews" && " (sắp xếp theo lượt đánh giá)"}
                          {sortBy === "price-low" && " (sắp xếp theo giá: thấp đến cao)"}
                          {sortBy === "price-high" && " (sắp xếp theo giá: cao đến thấp)"}
                        </h2>
                        {userLocation && (
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Target className="h-3 w-3" />
                              <span>Trong vòng {maxDistance[0]}km</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>Từ vị trí hiện tại</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {filteredGarages.map((garage, index) => (
                        <Card key={garage.id} className="border-blue-100 hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="grid md:grid-cols-4 gap-6">
                              {/* Image */}
                              <div className="md:col-span-1 relative">
                                <img
                                  src={garage.image || "/placeholder.svg"}
                                  alt={garage.name}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                {userLocation && (
                                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-blue-600 border border-blue-200">
                                    {garage.distance.toFixed(1)}km
                                  </div>
                                )}
                                {userLocation && sortBy === "distance" && index < 3 && (
                                  <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                                    #{index + 1} Gần nhất
                                  </Badge>
                                )}
                              </div>

                              <div className="md:col-span-2 space-y-3">
                                <div>
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-900">{garage.name}</h3>
                                    {userLocation && (
                                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                        <Navigation className="h-3 w-3 mr-1" />
                                        {garage.distance.toFixed(1)}km
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span>{garage.rating}</span>
                                      <span>({garage.reviewCount} đánh giá)</span>
                                    </div>
                                    <span className="text-green-600 font-medium">{garage.priceRange}</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>{garage.address}</span>
                                    {userLocation && (
                                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                                        {garage.distance.toFixed(1)}km
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Clock className="h-4 w-4" />
                                    <span className={garage.isOpen ? "text-green-600" : "text-red-600"}>
                                      {garage.openTime} • {garage.isOpen ? "Đang mở" : "Đã đóng"}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <Phone className="h-4 w-4" />
                                    <span>{garage.phone}</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {garage.services.slice(0, 3).map((service) => (
                                    <Badge key={service} variant="secondary" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                  {garage.services.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{garage.services.length - 3}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  {garage.vehicleTypes.includes("Xe máy") && <Bike className="h-4 w-4 text-blue-600" />}
                                  {garage.vehicleTypes.includes("Ô tô") && <Car className="h-4 w-4 text-blue-600" />}
                                  {garage.vehicleTypes.includes("Xe tải") && (
                                    <Truck className="h-4 w-4 text-blue-600" />
                                  )}
                                </div>
                              </div>

                              <div className="md:col-span-1 flex flex-col space-y-2">
                                <Button
                                  className="bg-gradient-to-r from-blue-600 to-cyan-600"
                                  onClick={() => handleBookNow(garage)}
                                  disabled={!garage.isOpen}
                                >
                                  {garage.isOpen ? "Đặt lịch ngay" : "Garage đã đóng cửa"}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-blue-200 text-blue-600 bg-transparent"
                                  onClick={() => handleViewDetails(garage)}
                                >
                                  <Info className="h-4 w-4 mr-2" />
                                  Xem chi tiết
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600"
                                  onClick={() => handleCallNow(garage)}
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Gọi ngay
                                </Button>
                                {userLocation && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600"
                                    onClick={() => {
                                      // Open Google Maps directions in a new tab
                                      window.open(
                                        `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${garage.lat},${garage.lng}`,
                                        "_blank",
                                      )
                                    }}
                                  >
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Chỉ đường
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredGarages.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-slate-400 mb-4">
                          <Search className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Không tìm thấy garage nào</h3>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                          <div className="text-amber-700 text-sm space-y-2">
                            <p className="font-medium">Gợi ý:</p>
                            <ul className="list-disc list-inside space-y-1 text-left">
                              <li>Thử tăng khoảng cách tìm kiếm</li>
                              <li>Giảm bớt các bộ lọc</li>
                              <li>Kiểm tra lại từ khóa tìm kiếm</li>
                              <li>Thử tìm kiếm theo địa chỉ khác</li>
                            </ul>
                          </div>
                        </div>

                        <Button onClick={clearFilters} className="mt-4">
                          Xóa tất cả bộ lọc
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="map" className="mt-0">
                <div className="h-[600px] rounded-lg overflow-hidden border border-blue-100">
                  <InteractiveMap
                    garages={filteredGarages}
                    userLocation={userLocation}
                    onGarageSelect={setSelectedGarage}
                    selectedGarage={selectedGarage}
                    isFullscreen={isMapFullscreen}
                    onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="grid" className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGarages.map((garage, index) => (
                    <Card key={garage.id} className="border-blue-100 hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={garage.image || "/placeholder.svg"}
                          alt={garage.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {userLocation && (
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-blue-600 border border-blue-200">
                            {garage.distance.toFixed(1)}km
                          </div>
                        )}
                        {userLocation && sortBy === "distance" && index < 3 && (
                          <Badge className="absolute top-2 left-2 bg-green-100 text-green-800 border-green-200">
                            #{index + 1} Gần nhất
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">{garage.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{garage.rating}</span>
                              <span>({garage.reviewCount})</span>
                              <span className="text-green-600 font-medium">{garage.priceRange}</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-sm text-slate-600">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{garage.address}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3" />
                              <span className={garage.isOpen ? "text-green-600" : "text-red-600"}>
                                {garage.openTime} • {garage.isOpen ? "Đang mở" : "Đã đóng"}
                              </span>
                            </div>
                            {userLocation && (
                              <div className="flex items-center space-x-2">
                                <Navigation className="h-3 w-3" />
                                <span>{garage.distance.toFixed(1)}km từ vị trí hiện tại</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {garage.services.slice(0, 2).map((service) => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {garage.services.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{garage.services.length - 2}
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-cyan-600"
                              onClick={() => handleBookNow(garage)}
                              disabled={!garage.isOpen}
                            >
                              {garage.isOpen ? "Đặt lịch ngay" : "Garage đã đóng cửa"}
                            </Button>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-blue-200 text-blue-600 bg-transparent"
                                onClick={() => handleViewDetails(garage)}
                              >
                                Chi tiết
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600"
                                onClick={() => handleCallNow(garage)}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredGarages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-slate-400 mb-4">
                      <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Không tìm thấy garage nào</h3>
                    <p className="text-slate-600 mb-4">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                    <Button onClick={clearFilters}>Xóa tất cả bộ lọc</Button>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Google Maps API Setup Modal */}
      <Dialog open={showAPISetup} onOpenChange={setShowAPISetup}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <span>Cài đặt Google Maps API</span>
            </DialogTitle>
            <DialogDescription>
              Để sử dụng Google Maps đầy đủ tính năng, bạn cần cung cấp API key hợp lệ.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Hiện tại đang sử dụng:</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    Chế độ mô phỏng
                  </Badge>
                  <span>- Hiển thị vị trí garage cơ bản</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border text-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Hướng dẫn lấy API key</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    const instructions = `
1. Truy cập Google Cloud Console: https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google Maps JavaScript API
4. Tạo API key với các hạn chế phù hợp
5. Thêm API key vào biến môi trường NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
`
                    navigator.clipboard.writeText(instructions)
                    toast({
                      title: "Đã sao chép!",
                      description: "Hướng dẫn đã được sao chép vào clipboard",
                    })
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-700">
                <li>Truy cập Google Cloud Console</li>
                <li>Tạo project mới hoặc chọn project hiện có</li>
                <li>Bật Google Maps JavaScript API</li>
                <li>Tạo API key với các hạn chế phù hợp</li>
                <li>
                  Thêm vào biến môi trường{" "}
                  <code className="bg-slate-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
                </li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-800">
                <p className="font-medium mb-2">Với Google Maps API, bạn sẽ có:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Bản đồ thực tế với đầy đủ tính năng</li>
                  <li>Chỉ đường GPS chính xác</li>
                  <li>Thông tin giao thông real-time</li>
                  <li>Tìm kiếm địa điểm nâng cao</li>
                  <li>Nhiều chế độ xem bản đồ</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAPISetup(false)}>
              Đóng
            </Button>
            <Button
              onClick={() => window.open("https://console.cloud.google.com/", "_blank")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Mở Google Cloud Console
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Đặt lịch tại {selectedGarage?.name}</span>
            </DialogTitle>
            <DialogDescription>Vui lòng chọn ngày, giờ và dịch vụ bạn muốn đặt lịch</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn ngày</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn giờ</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giờ" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn dịch vụ</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dịch vụ" />
                </SelectTrigger>
                <SelectContent>
                  {selectedGarage?.fullServices?.map((service: any) => (
                    <SelectItem key={service.name} value={service.name}>
                      <div className="flex flex-col">
                        <span>{service.name}</span>
                        <span className="text-xs text-slate-500">
                          {service.price} • {service.time}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Customer Information */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên</label>
              <Input
                placeholder="Nhập họ và tên"
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                placeholder="Nhập số điện thoại"
                value={bookingPhone}
                onChange={(e) => setBookingPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
              <Textarea
                placeholder="Ghi chú thêm về xe hoặc yêu cầu đặc biệt..."
                value={bookingNote}
                onChange={(e) => setBookingNote(e.target.value)}
                rows={3}
              />
            </div>

            {/* Booking Summary */}
            {selectedDate && selectedTime && selectedService && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Thông tin đặt lịch</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>
                    <strong>Garage:</strong> {selectedGarage?.name}
                  </p>
                  <p>
                    <strong>Ngày:</strong> {format(selectedDate, "dd/MM/yyyy", { locale: vi })}
                  </p>
                  <p>
                    <strong>Giờ:</strong> {selectedTime}
                  </p>
                  <p>
                    <strong>Dịch vụ:</strong> {selectedService}
                  </p>
                  {selectedGarage?.fullServices?.find((s: any) => s.name === selectedService) && (
                    <p>
                      <strong>Giá dự kiến:</strong>{" "}
                      {selectedGarage.fullServices.find((s: any) => s.name === selectedService).price}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleBookingSubmit}
              disabled={
                isBookingSubmitting ||
                !selectedDate ||
                !selectedTime ||
                !selectedService ||
                !bookingName ||
                !bookingPhone
              }
            >
              {isBookingSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang đặt lịch...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Xác nhận đặt lịch
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedGarage?.name}</span>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{selectedGarage?.rating}</span>
                <span className="text-sm text-slate-500">({selectedGarage?.reviewCount} đánh giá)</span>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedGarage && (
            <div className="space-y-6">
              {/* Images */}
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={selectedGarage.images?.[activeImageIndex] || selectedGarage.image}
                    alt={selectedGarage.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {selectedGarage.images && selectedGarage.images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {selectedGarage.images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${index === activeImageIndex ? "bg-white" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {selectedGarage.images && selectedGarage.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {selectedGarage.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          index === activeImageIndex ? "border-blue-500" : "border-transparent"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${selectedGarage.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span>{selectedGarage.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span>{selectedGarage.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className={selectedGarage.isOpen ? "text-green-600" : "text-red-600"}>
                        {selectedGarage.openTime} • {selectedGarage.isOpen ? "Đang mở" : "Đã đóng"}
                      </span>
                    </div>
                    {userLocation && (
                      <div className="flex items-center space-x-2">
                        <Navigation className="h-4 w-4 text-slate-500" />
                        <span>{selectedGarage.distance?.toFixed(1)}km từ vị trí hiện tại</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Loại xe phục vụ</h3>
                  <div className="flex items-center space-x-4">
                    {selectedGarage.vehicleTypes.includes("Xe máy") && (
                      <div className="flex items-center space-x-2">
                        <Bike className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Xe máy</span>
                      </div>
                    )}
                    {selectedGarage.vehicleTypes.includes("Ô tô") && (
                      <div className="flex items-center space-x-2">
                        <Car className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Ô tô</span>
                      </div>
                    )}
                    {selectedGarage.vehicleTypes.includes("Xe tải") && (
                      <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Xe tải</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Mô tả</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedGarage.description}</p>
              </div>

              {/* Services */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Dịch vụ và giá cả</h3>
                <div className="grid gap-3">
                  {selectedGarage.fullServices?.map((service: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-slate-500">Thời gian: {service.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-blue-600">{service.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Đánh giá gần đây</h3>
                <div className="space-y-3">
                  {selectedGarage.reviews?.map((review: any, index: number) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{review.user}</div>
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-slate-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-slate-500">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600"
                  onClick={() => {
                    setDetailsModalOpen(false)
                    handleBookNow(selectedGarage)
                  }}
                  disabled={!selectedGarage.isOpen}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedGarage.isOpen ? "Đặt lịch ngay" : "Garage đã đóng cửa"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDetailsModalOpen(false)
                    handleCallNow(selectedGarage)
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Gọi ngay
                </Button>
                {userLocation && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedGarage.lat},${selectedGarage.lng}`,
                        "_blank",
                      )
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Chỉ đường
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Call Modal */}
      <Dialog open={callModalOpen} onOpenChange={setCallModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-green-600" />
              <span>Liên hệ {selectedGarage?.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-2">{selectedGarage?.phone}</div>
              <div className="text-sm text-slate-600">{selectedGarage?.address}</div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  window.location.href = `tel:${selectedGarage?.phone}`
                }}
              >
                <Phone className="h-4 w-4 mr-2" />
                Gọi ngay
              </Button>

              <Button
                variant="outline"
                onClick={handleCopyPhone}
                className={isCopied ? "border-green-500 text-green-600" : ""}
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Đã sao chép!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Sao chép số điện thoại
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  window.open(`sms:${selectedGarage?.phone}`, "_blank")
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Gửi tin nhắn
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Giờ hoạt động:</p>
                <p className={selectedGarage?.isOpen ? "text-green-600" : "text-red-600"}>
                  {selectedGarage?.openTime} • {selectedGarage?.isOpen ? "Đang mở" : "Đã đóng"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCallModalOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
