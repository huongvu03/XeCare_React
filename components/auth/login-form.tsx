"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

import { loginApi } from "@/lib/api/AuthApi"

interface LoginFormProps {
  onForgotPassword?: () => void // 👈 thêm prop này
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await loginApi({ email, password })
      const user = response.data

      console.log("Debug - Login response:", user)
      console.log("Debug - User token:", user.token)

      // Lưu token vào localStorage
      if (user.token) {
        localStorage.setItem("token", user.token);
        console.log("Debug - Token saved to localStorage")
      } else {
        console.error("Debug - No token in response")
      }

      login({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as "ADMIN" | "USER" | "GARAGE", // Removed .toLowerCase()
        phone: user.phone,
        imageUrl: user.imageUrl,
        address: user.address,
        createdAt: user.createdAt,
        garages: user.garages, // Added garages
      })

      console.log("Debug - User logged in successfully")
      console.log("Debug - User role:", user.role)
      console.log("Debug - About to redirect...")

      // Chuyển hướng
      switch (user.role) { // Used user.role directly
        case "ADMIN":
          console.log("Debug - Redirecting to admin dashboard")
          await router.push("/admin/dashboard")
          break
        case "GARAGE":
        case "USER_AND_GARAGE":
        case "USER":
        default:
          console.log("Debug - Redirecting to user dashboard")
          await router.push("/dashboard") // Redirect to unified dashboard
      }

      console.log("Debug - Redirect completed")
    } catch (err: any) {
      console.error("Debug - Login error:", err)
      if (err.response?.status === 403) {
        setError("Email hoặc mật khẩu không đúng.")
      } else {
        setError("Lỗi máy chủ. Vui lòng thử lại.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Social Login Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors bg-transparent"
          disabled={isLoading}
        >
                  <a href="http://localhost:8080/oauth2/authorization/google">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Đăng nhập với Google</span>
          </div>
          </a>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent"
          disabled={isLoading}
        >
          <a href="http://localhost:8080/oauth2/authorization/facebook">
            <div className="flex items-center space-x-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            <span>Đăng nhập với Facebook</span>
          </div>
          </a>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500">Hoặc</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
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
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang đăng nhập...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <LogIn className="h-4 w-4" />
              <span>Đăng nhập</span>
            </div>
          )}
        </Button>


        <div className="text-center">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
            Quên mật khẩu?
          </a>
        </div>
      </form>
    </>
  )
}
