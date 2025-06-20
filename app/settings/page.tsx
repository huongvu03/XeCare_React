"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { Settings, Bell, Shield, Palette, Globe, Smartphone, Mail, MessageSquare } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      showPhone: false,
      showEmail: false,
    },
    preferences: {
      language: "vi",
      theme: "light",
      timezone: "Asia/Ho_Chi_Minh",
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const handleSwitchChange = (category: string, setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }))
  }

  const handleSelectChange = (category: string, setting: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSuccess("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Cài đặt đã được lưu thành công!")
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout
      allowedRoles={["admin", "user", "garage"]}
      title="Cài đặt"
      description="Tùy chỉnh trải nghiệm và cài đặt tài khoản của bạn"
    >
      <div className="space-y-6">
        {/* Success Message */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* Notification Settings */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <span>Cài đặt thông báo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Thông báo email</Label>
                  <p className="text-sm text-slate-500">Nhận thông báo qua email về lịch hẹn và cập nhật</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(value) => handleSwitchChange("notifications", "email", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Thông báo đẩy</Label>
                  <p className="text-sm text-slate-500">Nhận thông báo đẩy trên thiết bị di động</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(value) => handleSwitchChange("notifications", "push", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Thông báo SMS</Label>
                  <p className="text-sm text-slate-500">Nhận tin nhắn SMS cho các thông báo quan trọng</p>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={(value) => handleSwitchChange("notifications", "sms", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Email marketing</Label>
                  <p className="text-sm text-slate-500">Nhận email về khuyến mãi và tin tức mới</p>
                </div>
                <Switch
                  checked={settings.notifications.marketing}
                  onCheckedChange={(value) => handleSwitchChange("notifications", "marketing", value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Cài đặt riêng tư</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Hiển thị hồ sơ công khai</Label>
                  <p className="text-sm text-slate-500">Cho phép người khác xem hồ sơ của bạn</p>
                </div>
                <Switch
                  checked={settings.privacy.profileVisible}
                  onCheckedChange={(value) => handleSwitchChange("privacy", "profileVisible", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Hiển thị số điện thoại</Label>
                  <p className="text-sm text-slate-500">Cho phép garage xem số điện thoại của bạn</p>
                </div>
                <Switch
                  checked={settings.privacy.showPhone}
                  onCheckedChange={(value) => handleSwitchChange("privacy", "showPhone", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Hiển thị email</Label>
                  <p className="text-sm text-slate-500">Cho phép garage xem email của bạn</p>
                </div>
                <Switch
                  checked={settings.privacy.showEmail}
                  onCheckedChange={(value) => handleSwitchChange("privacy", "showEmail", value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-blue-600" />
              <span>Tùy chọn giao diện</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Ngôn ngữ</span>
                </Label>
                <Select
                  value={settings.preferences.language}
                  onValueChange={(value) => handleSelectChange("preferences", "language", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span>Giao diện</span>
                </Label>
                <Select
                  value={settings.preferences.theme}
                  onValueChange={(value) => handleSelectChange("preferences", "theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Sáng</SelectItem>
                    <SelectItem value="dark">Tối</SelectItem>
                    <SelectItem value="auto">Tự động</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Múi giờ</Label>
                <Select
                  value={settings.preferences.timezone}
                  onValueChange={(value) => handleSelectChange("preferences", "timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</SelectItem>
                    <SelectItem value="Asia/Bangkok">Bangkok (GMT+7)</SelectItem>
                    <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <span>Quản lý tài khoản</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="border-blue-200 text-blue-600">
                <Shield className="h-4 w-4 mr-2" />
                Đổi mật khẩu
              </Button>

              <Button variant="outline" className="border-blue-200 text-blue-600">
                <Mail className="h-4 w-4 mr-2" />
                Xác thực email
              </Button>

              <Button variant="outline" className="border-blue-200 text-blue-600">
                <Smartphone className="h-4 w-4 mr-2" />
                Xác thực 2 lớp
              </Button>

              <Button variant="outline" className="border-blue-200 text-blue-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                Xuất dữ liệu
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button variant="destructive" className="w-full md:w-auto">
                Xóa tài khoản
              </Button>
              <p className="text-sm text-slate-500 mt-2">
                Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
