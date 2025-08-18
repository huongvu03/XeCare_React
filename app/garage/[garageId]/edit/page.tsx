"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  ArrowLeft,
  Save,
  Loader2,
  XCircle,
  CheckCircle,
  Search
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getMyGarageById, updateGarage } from "@/lib/api/UserApi"
import type { GarageInfo } from "@/hooks/use-auth"

export default function EditGaragePage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const garageId = Number(params.garageId)
  
  const [garage, setGarage] = useState<GarageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    openTime: "",
    closeTime: "",
    imageUrl: "",
    latitude: "",
    longitude: ""
  })

  // Streetmap integration
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const loadGarage = async () => {
      try {
        // Kiểm tra quyền sở hữu
        const isOwner = user && user.garages && user.garages.some(g => g.id === garageId)
        if (!isOwner) {
          setError("Bạn không có quyền chỉnh sửa garage này")
          setLoading(false)
          return
        }

        const response = await getMyGarageById(garageId)
        const garageData = response.data
        setGarage(garageData)
        
        // Populate form data
        setFormData({
          name: garageData.name || "",
          description: garageData.description || "",
          address: garageData.address || "",
          phone: garageData.phone || "",
          email: garageData.email || "",
          openTime: garageData.openTime || "",
          closeTime: garageData.closeTime || "",
          imageUrl: garageData.imageUrl || "",
          latitude: garageData.latitude?.toString() || "",
          longitude: garageData.longitude?.toString() || ""
        })
        
        // Set search query for address field
        setSearchQuery(garageData.address || "")
        
        setLoading(false)
      } catch (err: any) {
        console.error("Error loading garage:", err)
        setError("Không thể tải thông tin garage")
        setLoading(false)
      }
    }

    if (garageId) {
      loadGarage()
    }
  }, [garageId, user])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Streetmap search functions
  const searchAddress = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=5`
      )
      const data = await response.json()
      setSearchResults(data)
      setShowSearchResults(true)
    } catch (error) {
      console.error("Error searching address:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value)
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(value)
    }, 500)
  }

  const handleAddressSelect = (result: any) => {
    setFormData(prev => ({
      ...prev,
      address: result.display_name,
      latitude: result.lat,
      longitude: result.lon
    }))
    setSearchQuery(result.display_name)
    setShowSearchResults(false)
    
    // Show success message
    setSuccess("Đã cập nhật địa chỉ và tọa độ!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      setShowSearchResults(false)
    }, 200)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await updateGarage(garageId, formData)
      
      setSuccess("Cập nhật thông tin garage thành công!")
      
      // Redirect back to garage detail page after 2 seconds
      setTimeout(() => {
        router.push(`/garage/${garageId}?owner=true`)
      }, 2000)
      
    } catch (err: any) {
      console.error("Error updating garage:", err)
      setError("Không thể cập nhật thông tin garage")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "USER_AND_GARAGE", "GARAGE", "ADMIN"]}
        title="Chỉnh sửa Garage"
        description="Đang tải..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Đang tải thông tin garage...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error && !garage) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "USER_AND_GARAGE", "GARAGE", "ADMIN"]}
        title="Lỗi"
        description="Không thể tải thông tin"
      >
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "USER_AND_GARAGE", "GARAGE", "ADMIN"]}
      title={`Chỉnh sửa: ${garage?.name}`}
      description="Cập nhật thông tin garage"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push(`/garage/${garageId}?owner=true`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Edit Form */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Thông tin cơ bản</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tên garage */}
                <div className="space-y-2">
                  <Label htmlFor="name">Tên garage *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập tên garage"
                    required
                  />
                </div>

                {/* Địa chỉ với Streetmap Search */}
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <p className="text-xs text-slate-500 mb-2">
                    Nhập địa chỉ để tìm kiếm và tự động điền tọa độ
                  </p>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="address"
                        value={searchQuery}
                        onChange={(e) => handleSearchInputChange(e.target.value)}
                        onBlur={handleSearchBlur}
                        placeholder="Tìm kiếm địa chỉ..."
                        className="pl-10"
                        required
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                            onClick={() => handleAddressSelect(result)}
                          >
                            <div className="flex items-start space-x-3">
                              <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                  {result.display_name.split(',')[0]}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                  {result.display_name}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Nhập email"
                    required
                  />
                </div>

                {/* Giờ mở cửa */}
                <div className="space-y-2">
                  <Label htmlFor="openTime">Giờ mở cửa</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={formData.openTime}
                    onChange={(e) => handleInputChange("openTime", e.target.value)}
                  />
                </div>

                {/* Giờ đóng cửa */}
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Giờ đóng cửa</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={formData.closeTime}
                    onChange={(e) => handleInputChange("closeTime", e.target.value)}
                  />
                </div>

                {/* Tọa độ */}
                <div className="space-y-2">
                  <Label htmlFor="latitude">Vĩ độ</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    placeholder="10.762622"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Kinh độ</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    placeholder="106.660172"
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Mô tả về garage của bạn..."
                  rows={4}
                />
              </div>

              {/* URL hình ảnh */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL hình ảnh</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/garage/${garageId}?owner=true`)}
                  disabled={saving}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
