"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await axios.post("/apis/v1/auth/forgot-password", { email })
      setMessage(res.data)
    } catch (err: any) {
      setMessage(err.response?.data || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Nhập email đã đăng ký"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
      </Button>

      {message && <p className="text-sm text-center text-gray-600">{message}</p>}
      <p
        onClick={onBack}
        className="text-blue-600 text-sm text-center cursor-pointer hover:underline"
      >
        Quay lại đăng nhập
      </p>
    </form>
  )
}
