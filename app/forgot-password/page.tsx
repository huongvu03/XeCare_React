// app/forgot-password/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async () => {
    if (!email) {
      setMessage("Vui lòng nhập email")
      return
    }
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:8080/apis/v1/auth/forgot-password", { email })
      setMessage("Vui lòng kiểm tra email để đặt lại mật khẩu")
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-blue-100">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-xl font-bold text-center">Quên mật khẩu</h1>
            <p className="text-sm text-gray-500 text-center">
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu
            </p>

            <Input
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button onClick={handleSubmit} className="w-full" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
            </Button>

            {message && <p className="text-center text-sm text-red-500">{message}</p>}

            <div className="text-center mt-4">
              <Link href="/auth" className="flex items-center justify-center text-blue-600 hover:underline">
                <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
