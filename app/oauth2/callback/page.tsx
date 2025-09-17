"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function OAuth2Callback() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const token = params.get("token")
    const email = params.get("email")

    if (token) {
      // lưu token vào localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("email", email ?? "")

      // chuyển về dashboard hoặc home
      router.push("/dashboard")
    } else {
      router.push("/auth") // fallback nếu fail
    }
  }, [params, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Đang xử lý đăng nhập...</p>
    </div>
  )
}
