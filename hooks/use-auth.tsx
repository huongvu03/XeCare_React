"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  email: string
  name: string
  role: "admin" | "user" | "garage"
  phone?: string
  imageUrl?: string
  address?: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  updateUser: (userData: User) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          localStorage.removeItem("user")
        }
      }

      setIsLoading(false) // ✅ Đặt bên trong điều kiện client
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData))
    }
  }
  const updateUser = (userData: User) => {
    setUser(userData)
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      // Chuyển hướng về trang chủ sau khi đăng xuất
      window.location.href = "/"
    }
  }



  return <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
