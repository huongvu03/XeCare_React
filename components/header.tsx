"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Wrench } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, User, Settings, LayoutDashboard } from "lucide-react"

function AuthButtons() {
  const { user, logout } = useAuth()

  if (user) {
    return (
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
                <span className="text-xs text-slate-500 capitalize">{user.role}</span>
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
    )
  }

  return (
    <>
      <Button variant="ghost" className="text-blue-600 hover:text-blue-700" asChild>
        <Link href="/auth">Đăng nhập</Link>
      </Button>
      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" asChild>
        <Link href="/auth">Đăng ký</Link>
      </Button>
    </>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              XeCare
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
              Tính năng
            </a>
            <a href="#services" className="text-slate-600 hover:text-blue-600 transition-colors">
              Dịch vụ
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">
              Cách hoạt động
            </a>
            <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">
              Liên hệ
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
                Tính năng
              </a>
              <a href="#services" className="text-slate-600 hover:text-blue-600 transition-colors">
                Dịch vụ
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">
                Cách hoạt động
              </a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">
                Liên hệ
              </a>
              <div className="pt-4">
                <AuthButtons />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
