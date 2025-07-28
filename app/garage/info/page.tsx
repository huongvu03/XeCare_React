"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { MapPin, Phone, Clock, Star, Save, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GarageInfoPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [garageInfo, setGarageInfo] = useState({
    name: "Garage Minh Tuấn",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    phone: "0901234567",
    email: "garage.minhtuan@email.com",
    description: "Garage chuyên nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực sửa chữa và bảo dưỡng xe máy, ô tô.",
    openTime: "07:00",
    closeTime: "19:00",
    rating: 4.8,
    totalReviews: 156,
    services: ["Thay nhớt", "Sửa phanh", "Bảo dưỡng định kỳ", "Cứu hộ khẩn cấp"],
  })

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: "Thông tin garage đã được cập nhật!",
      })
      setIsEditing(false)
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => {
    setGarageInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <DashboardLayout
      allowedRoles={["garage"]}
      title="Thông tin Garage"
      description="Quản lý thông tin chi tiết garage của bạn"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Thông tin cơ bản</span>
              </CardTitle>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tên garage</Label>
                  <Input
                    id="name"
                    value={garageInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={garageInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={garageInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={garageInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={garageInfo.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="openTime">Giờ mở cửa</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={garageInfo.openTime}
                    onChange={(e) => handleInputChange("openTime", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="closeTime">Giờ đóng cửa</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={garageInfo.closeTime}
                    onChange={(e) => handleInputChange("closeTime", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Quick Info */}
        <div className="space-y-6">
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Đánh giá</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-yellow-600">{garageInfo.rating}</div>
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(garageInfo.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600">{garageInfo.totalReviews} đánh giá</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Giờ hoạt động</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Thứ 2 - Thứ 6:</span>
                  <span className="font-medium">
                    {garageInfo.openTime} - {garageInfo.closeTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Thứ 7 - Chủ nhật:</span>
                  <span className="font-medium">
                    {garageInfo.openTime} - {garageInfo.closeTime}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-green-600" />
                <span>Liên hệ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{garageInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{garageInfo.address}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
