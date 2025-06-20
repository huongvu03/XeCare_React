"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Camera } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    bio: "",
    website: "",
    emergencyContact: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Validation
      if (!formData.name.trim()) {
        setError("Tên không được để trống")
        return
      }

      if (!formData.email.trim()) {
        setError("Email không được để trống")
        return
      }

      setSuccess("Cập nhật thông tin thành công!")
      setIsEditing(false)

      // Here you would update the user context with new data
      // updateUser(formData)
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: "",
      bio: "",
      website: "",
      emergencyContact: "",
    })
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-700">Quản trị viên</Badge>
      case "garage":
        return <Badge className="bg-green-100 text-green-700">Chủ garage</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-700">Người dùng</Badge>
    }
  }

  return (
    <DashboardLayout
      allowedRoles={["admin", "user", "garage"]}
      title="Thông tin cá nhân"
      description="Quản lý thông tin tài khoản và cài đặt cá nhân"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="border-blue-100">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              {/* Avatar */}
              <div className="relative mx-auto w-24 h-24">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{user?.name.charAt(0).toUpperCase()}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <Camera className="h-4 w-4 text-slate-600" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">{user?.name}</h3>
                <p className="text-slate-600">{user?.email}</p>
                {getRoleBadge(user?.role || "")}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {user?.role === "garage" ? "156" : user?.role === "admin" ? "1,234" : "12"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {user?.role === "garage" ? "Khách hàng" : user?.role === "admin" ? "Người dùng" : "Lịch hẹn"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {user?.role === "garage" ? "4.8" : user?.role === "admin" ? "98%" : "5"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {user?.role === "garage" ? "Đánh giá" : user?.role === "admin" ? "Uptime" : "Đánh giá"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Thông tin cá nhân</span>
              </CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="border-blue-200 text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="border-slate-200 text-slate-600"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Lưu
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{user?.role === "garage" ? "Tên garage" : "Họ và tên"}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Liên hệ khẩn cấp</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="Số điện thoại khẩn cấp"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={!isEditing}
                    className="pl-10 min-h-[80px]"
                    placeholder="Nhập địa chỉ đầy đủ"
                  />
                </div>
              </div>

              {user?.role === "garage" && (
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://example.com"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="bio">{user?.role === "garage" ? "Mô tả garage" : "Giới thiệu bản thân"}</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="min-h-[100px]"
                  placeholder={
                    user?.role === "garage"
                      ? "Mô tả về garage, dịch vụ và kinh nghiệm..."
                      : "Viết vài dòng giới thiệu về bản thân..."
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Thông tin tài khoản</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại tài khoản</Label>
                  <div className="flex items-center space-x-2">{getRoleBadge(user?.role || "")}</div>
                </div>

                <div className="space-y-2">
                  <Label>Ngày tạo tài khoản</Label>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>15/12/2024</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Trạng thái tài khoản</Label>
                  <Badge className="bg-green-100 text-green-700">Đã xác thực</Badge>
                </div>

                <div className="space-y-2">
                  <Label>Bảo mật</Label>
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                    Đổi mật khẩu
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          {user?.role !== "admin" && (
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user?.role === "garage" ? (
                    <>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-slate-600">Lịch hẹn mới từ Nguyễn Văn A</span>
                        <span className="text-xs text-blue-600">2 giờ trước</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm text-slate-600">Hoàn thành sửa xe cho Trần Thị B</span>
                        <span className="text-xs text-blue-600">1 ngày trước</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-slate-600">Đặt lịch sửa xe tại Garage Thành Công</span>
                        <span className="text-xs text-blue-600">3 ngày trước</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm text-slate-600">Đánh giá 5 sao cho Garage ABC</span>
                        <span className="text-xs text-blue-600">1 tuần trước</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
