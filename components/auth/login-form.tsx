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

// Demo accounts
const DEMO_ACCOUNTS = [
  {
    email: "admin@demo.com",
    password: "admin123",
    role: "admin",
    name: "Admin System",
    phone: "0909000001",
  },
  {
    email: "user@demo.com",
    password: "user123",
    role: "user",
    name: "Nguyễn Văn A",
    phone: "0909000002",
  },
  {
    email: "garage@demo.com",
    password: "garage123",
    role: "garage",
    name: "Garage Thành Công",
    phone: "0909000003",
  },
]

export function LoginForm() {
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

    login({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase() as "admin" | "user" | "garage",
      phone: user.phone,
      imageUrl: user.imageUrl,
      address: user.address,
      createdAt: user.createdAt,
    })

    // Chuyển hướng
    switch (user.role.toLowerCase()) {
      case "admin":
        router.push("/admin/dashboard")
        break
      case "garage":
        router.push("/garage/dashboard")
        break
      default:
        router.push("/user/dashboard")
    }
  } catch (err: any) {
    if (err.response?.status === 403) {
      setError("Email hoặc mật khẩu không đúng.")
    } else {
      setError("Lỗi máy chủ. Vui lòng thử lại.")
    }
  } finally {
    setIsLoading(false)
  }
}

  const handleDemoLogin = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
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

      {/* Quick login buttons */}
      <div className="space-y-2">
        <p className="text-sm text-slate-600 text-center">Đăng nhập nhanh:</p>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <Button
              key={account.email}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin(account)}
              className="text-xs"
            >
              {account.role === "admin" ? "Admin" : account.role === "garage" ? "Garage" : "User"}
            </Button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
          Quên mật khẩu?
        </a>
      </div>
    </form>
  )
}
