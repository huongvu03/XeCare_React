"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wrench, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại trang chủ</span>
          </Link>

          <div className="flex items-center justify-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              XeCare
            </span>
          </div>
        </div>

        {/* Auth Forms */}
        <Card className="border-blue-100 shadow-xl">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <LoginForm />
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <RegisterForm onSuccess={() => setActiveTab("login")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="border-blue-100 bg-blue-50/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Tài khoản demo:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Admin:</span>
                <span className="font-mono text-blue-600">admin@demo.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">User:</span>
                <span className="font-mono text-blue-600">user@demo.com / user123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Garage:</span>
                <span className="font-mono text-blue-600">garage@demo.com / garage123</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
