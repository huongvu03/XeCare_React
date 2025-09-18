"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface GarageInfo {
  id: number
  name: string
  address: string
  phone: string
  email: string
  description: string
  imageUrl: string
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "PENDING_UPDATE"
  isVerified: boolean
  createdAt: string
  rejectionReason?: string
  rejectedAt?: string
  approvedAt?: string
}

interface User {
  id: number
  email: string
  name: string
  role: "ADMIN" | "USER" | "GARAGE"
  phone?: string
  imageUrl?: string
  address?: string
  createdAt?: string
  garages?: GarageInfo[]
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  updateUser: (userData: User) => void
  refreshUser: () => Promise<void>
  isLoading: boolean
  // Helper methods for unified account
  isUser: () => boolean
  isGarageOwner: () => boolean
  isAdmin: () => boolean
  hasGarages: () => boolean
  hasActiveGarages: () => boolean
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
      // Clear all authentication data
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      // Chuyển hướng về trang chủ sau khi đăng xuất
      window.location.href = "/"
    }
  }

  // Helper methods for unified account
  const isUser = () => {
    return user?.role === "USER" || user?.role === "GARAGE" || false
  }

  const isGarageOwner = () => {
    return user?.role === "GARAGE" || false
  }

  const isAdmin = () => {
    return user?.role === "ADMIN" || false
  }

  const hasGarages = () => {
    return (user?.garages && user.garages.length > 0) || false
  }

  const hasActiveGarages = () => {
    return (user?.garages && user.garages.some(garage => garage.status === "ACTIVE")) || false
  }

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        // No token, clear user data
        setUser(null)
        localStorage.removeItem("user")
        return
      }

      // Call API to get updated user data
      const response = await fetch("http://localhost:8080/apis/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData))
        }
      } else if (response.status === 401 || response.status === 403) {
        // Token is invalid or expired, clear user data
        setUser(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/auth"
        }
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
      // Fallback to localStorage
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser))
          } catch (error) {
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            setUser(null)
          }
        }
      }
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        updateUser, 
        refreshUser,
        isLoading,
        isUser,
        isGarageOwner,
        isAdmin,
        hasGarages,
        hasActiveGarages
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
