"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useSearchParams, useRouter } from "next/navigation"

export function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setMessage("Mật khẩu xác nhận không khớp")
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      // Thử endpoint reset-password trước
      let res = await axios.post("/apis/v1/auth/reset-password", {
        token,
        newPassword: password,
      })
      setMessage("Đặt lại mật khẩu thành công. Vui lòng đăng nhập.")
      setTimeout(() => router.push("/auth"), 2000)
    } catch (err: any) {
      // Nếu reset-password thất bại, thử set-password cho OAuth users
      try {
        await axios.post("/apis/v1/auth/set-password", {
          token,
          newPassword: password,
        })
        setMessage("Thiết lập mật khẩu thành công. Vui lòng đăng nhập.")
        setTimeout(() => router.push("/auth"), 2000)
      } catch (setPasswordErr: any) {
        setMessage(setPasswordErr.response?.data || err.response?.data || "Có lỗi xảy ra")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return <p className="text-red-500">Token không hợp lệ hoặc đã hết hạn</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
      </Button>
      {message && <p className="text-sm text-center text-gray-600">{message}</p>}
    </form>
  )
}
