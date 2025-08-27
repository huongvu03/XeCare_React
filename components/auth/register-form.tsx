"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus, ShieldCheck } from "lucide-react"
import { registerApi, verifyOtpApi, resendOtpApi } from "@/lib/api/AuthApi"

interface RegisterFormProps {
  onSuccess: () => void // gọi khi verify OTP thành công => sang login
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [step, setStep] = useState<"register" | "otp">("register")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user",
  })
  const [otp, setOtp] = useState("")
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
      if (step === "register") {
        // Validate
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

        // Gọi API đăng ký
        await registerApi({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        })

        setSuccess("Đăng ký thành công! Vui lòng nhập OTP được gửi về email.")
        setStep("otp") // chuyển sang bước nhập OTP
      } else if (step === "otp") {
        // Gọi API verify OTP
        await verifyOtpApi({
          email: formData.email,
          otp: otp,
        })
        setSuccess("Xác thực OTP thành công! Bạn có thể đăng nhập.")
        setTimeout(() => onSuccess(), 1500)
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setIsLoading(true)
      setError("")
      await resendOtpApi({ email: formData.email })
      setSuccess("OTP mới đã được gửi đến email của bạn.")
    } catch (err: any) {
      setError("Không thể gửi lại OTP. Vui lòng thử lại.")
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

      {step === "register" ? (
        <>
          {/* Họ tên */}
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="name"
                type="text"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Phone */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

          {/* Terms */}
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
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="otp">Nhập mã OTP</Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="otp"
                type="text"
                placeholder="Nhập OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={handleResendOtp} disabled={isLoading}>
            Gửi lại mã OTP
          </Button>
        </>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        disabled={isLoading}
      >
        {isLoading ? "Đang xử lý..." : step === "register" ? "Đăng ký" : "Xác thực OTP"}
      </Button>
    </form>
  )
}
