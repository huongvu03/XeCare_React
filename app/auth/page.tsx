"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wrench } from "lucide-react"
import {Button} from "@/components/ui/button"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [forgotMode, setForgotMode] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
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
            {!forgotMode ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <LoginForm onForgotPassword={() => setForgotMode(true)} />
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <RegisterForm onSuccess={() => setActiveTab("login")} />
                </TabsContent>
              </Tabs>
            ) : (
              <ForgotPasswordForm onBack={() => setForgotMode(false)} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
