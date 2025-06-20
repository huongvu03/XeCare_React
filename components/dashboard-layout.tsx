"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, User, Settings, LayoutDashboard, Home } from "lucide-react"
import Link from "next/link"

interface DashboardLayoutProps {
  children: ReactNode
  allowedRoles: ("admin" | "user" | "garage")[]
  title: string
  description: string
}

function DashboardHeader() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              XeCare
            </span>
          </Link>

          {/* Navigation & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Home Button */}
            <Button variant="ghost" className="text-slate-600 hover:text-blue-600" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:block">Trang chủ</span>
              </Link>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user.role === "admin" ? "bg-red-500" : user.role === "garage" ? "bg-green-500" : "bg-blue-500"
                        }`}
                      />
                      <span className="text-xs text-slate-500 capitalize">
                        {user.role === "admin" ? "Quản trị viên" : user.role === "garage" ? "Chủ garage" : "Người dùng"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={
                      user.role === "admin"
                        ? "/admin/dashboard"
                        : user.role === "garage"
                          ? "/garage/dashboard"
                          : "/user/dashboard"
                    }
                    className="flex items-center space-x-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Thông tin cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Cài đặt</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center space-x-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export function DashboardLayout({ children, allowedRoles, title, description }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !allowedRoles.includes(user.role))) {
      router.push("/auth")
    }
  }, [user, isLoading, router, allowedRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardHeader />
      <div className="container mx-auto max-w-6xl p-4 space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600">{description}</p>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  )
}
