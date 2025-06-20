"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from "lucide-react"

interface RegisterFormProps {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp")
        return
      }

      if (formData.password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự")
        return
      }

      if (!agreeTerms) {
        setError("Vui lòng đồng ý với điều khoản sử dụng")
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if email already exists (demo check)
      const existingEmails = ["admin@demo.com", "user@demo.com", "garage@demo.com"]
      if (existingEmails.includes(formData.email)) {
        setError("Email này đã được sử dụng")
        return
      }

      setSuccess("Đăng ký thành công! Vui lòng đăng nhập.")

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "user",
      })
      setAgreeTerms(false)

      // Switch to login tab after 2 seconds
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">Loại tài khoản</Label>
        <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại tài khoản" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Người dùng</SelectItem>
            <SelectItem value="garage">Chủ garage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{formData.role === "garage" ? "Tên garage" : "Họ và tên"}</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="name"
            type="text"
            placeholder={formData.role === "garage" ? "Nhập tên garage" : "Nhập họ và tên"}
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="pl-10"
            required
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
            placeholder="Nhập email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} />
        <Label htmlFor="terms" className="text-sm text-slate-600">
          Tôi đồng ý với{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700">
            điều khoản sử dụng
          </a>{" "}
          và{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700">
            chính sách bảo mật
          </a>
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Đang đăng ký...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Đăng ký</span>
          </div>
        )}
      </Button>
    </form>
  )
}
