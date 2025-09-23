"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // validate
    if (password.length < 8) {
      setMessage("Mật khẩu phải có ít nhất 8 ký tự")
      return
    }
    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp")
      return
    }

    setMessage("")
    setLoading(true)

    try {
      // Thử endpoint reset-password trước
      let res = await fetch("http://localhost:8080/apis/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })
      
      // Nếu reset-password thất bại, thử set-password cho OAuth users
      if (!res.ok) {
        res = await fetch("http://localhost:8080/apis/v1/auth/set-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: password }),
        })
      }
      
      if (res.ok) {
        setMessage("Đặt mật khẩu thành công! Đang chuyển hướng...")
        // chuyển về trang auth sau 1s
        setTimeout(() => router.push("/auth"), 1000)
      } else {
        const text = await res.text()
        setMessage(text || "Token không hợp lệ hoặc đã hết hạn.")
      }
    } catch {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Đặt lại mật khẩu</h1>
        <Input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
        {message && (
          <p
            className={`text-sm text-center ${
              message.includes("thành công") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
