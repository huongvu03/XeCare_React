"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, Camera } from "lucide-react"

import { updateUserInfoApi, updateUserImageApi, getUserProfile } from "@/lib/api/UserApi"
import { getImageUrl } from "@/utils/getImageUrl"
import { getMyNotifications } from "@/lib/api/NotificationApi"


export default function ProfilePage() {
  const { user, isLoading: authLoading, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  
  // Real data states
  const [recentActivity, setRecentActivity] = useState<any[]>([])


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null as File | null,
    createdAt: "",
    address: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        image: null as File | null,
        createdAt: user.createdAt || "",
        address: user.address || "",
      })
      
      // Fetch real data for garage owners
      if (user.role === "GARAGE") {
        fetchRecentActivity()
      }
    }
  }, [user])


  // Fetch recent activity (notifications)
  const fetchRecentActivity = async () => {
    if (!user) return
    
    try {
      const notificationsResponse = await getMyNotifications()
      const notifications = notificationsResponse.data
      
      // Get recent notifications (last 5)
      const recentNotifications = notifications
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
      
      setRecentActivity(recentNotifications)
    } catch (error) {
      console.error("Error fetching recent activity:", error)
      setRecentActivity([])
    }
  }


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setError("Name cannot be empty")
        setIsLoading(false)
        return
      }
      if (!formData.email.trim()) {
        setError("Email cannot be empty")
        setIsLoading(false)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Invalid email format")
        setIsLoading(false)
        return
      }

      // Validate phone format (if provided)
      if (formData.phone && formData.phone.trim()) {
        const phoneRegex = /^[0-9+\-\s()]+$/
        if (!phoneRegex.test(formData.phone)) {
          setError("Invalid phone number format")
          setIsLoading(false)
          return
        }
      }

      // Call API to update information
      await updateUserInfoApi(user!.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || "",
        address: formData.address?.trim() || "",
        imageUrl: user?.imageUrl, // keep current imageUrl
      })

      // If there is a new image → upload separately
      if (formData.image) {
        await updateUserImageApi(user!.id, formData.image)
      }

      // Get updated information from server
      const { data: updatedUser } = await getUserProfile()
      updateUser(updatedUser)

      setSuccess("Profile updated successfully!")
      setIsEditing(false)
    } catch (err: any) {
      console.error("Error updating profile:", err)
      
      // Handle 401 error - token expired
      if (err.response?.status === 401) {
        setError("Login session has expired. Please login again.")
        // Do not auto redirect, let user decide
        setTimeout(() => {
          window.location.href = "/auth"
        }, 2000)
        return
      }
      
      // Handle 403 error - no permission
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.")
        return
      }
      
      // Handle other errors
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.data) {
        setError(err.response.data)
      } else {
        setError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        image: null as File | null,
        address: user.address || "",
        createdAt: user.createdAt || "",
      })
    }
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-red-100 text-red-700">Administrator</Badge>
      case "GARAGE":
        return <Badge className="bg-green-100 text-green-700">Garage Owner</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-700">User</Badge>
    }
  }
  if (authLoading) {
    return (
      <DashboardLayout
        allowedRoles={["ADMIN", "USER", "GARAGE"]}
        title="Personal Information"
        description="Manage account information and personal settings"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-600">Loading information...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout
        allowedRoles={["ADMIN", "USER", "GARAGE"]}
        title="Personal Information"
        description="Manage account information and personal settings"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Not logged in</h3>
            <p className="text-slate-600">Please login to view personal information</p>
            <Button 
              onClick={() => window.location.href = "/auth"}
              className="bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              Login
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  return (

    <DashboardLayout
      allowedRoles={["ADMIN", "USER", "GARAGE"]}
      title="Thông tin cá nhân"
      description="Quản lý thông tin tài khoản và cài đặt cá nhân"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="border-blue-100">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              {/* Avatar */}
              {/* <div className="relative mx-auto w-24 h-24">
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <Camera className="h-4 w-4 text-slate-600" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData((prev) => ({ ...prev, image: file }))
                      }
                    }}
                  />
                </label>
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="avatar"
                    className="w-24 h-24 object-cover rounded-full"
                  />
                ) : user?.imageUrl ? (
                  <img
                    src={getImageUrl(user?.imageUrl)}
                    alt="avatar"
                    className="w-24 h-24 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div> */}
              <div className="relative mx-auto w-24 h-24">
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <Camera className="h-4 w-4 text-slate-600" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData((prev) => ({ ...prev, image: file }))
                      }
                    }}
                  />
                </label>
                {formData.image ? (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="avatar"
                    className="w-24 h-24 object-cover rounded-full"
                  />
                ) : user?.imageUrl ? (
                  <img
                    src={getImageUrl(user.imageUrl)}
                    alt="avatar"
                    className="w-24 h-24 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>


              {/* Basic Info */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">{user?.name || 'User'}</h3>
                <p className="text-slate-600">{user?.email || 'No email'}</p>
                {getRoleBadge(user?.role || "")}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <Card className="border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Personal Information</span>
              </CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="border-blue-200 text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="border-slate-200 text-slate-600"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{user?.role === "GARAGE" ? "Garage Name" : "Full Name"}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={!isEditing}
                    className="pl-10 min-h-[80px]"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="flex items-center space-x-2">{getRoleBadge(user?.role || "")}</div>
                </div>

                <div className="space-y-2">
                  <Label>Account Created</Label>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formData.createdAt}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                </div>

                <div className="space-y-2">
                  <Label>Security</Label>
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          {user?.role !== "ADMIN" && (
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-slate-600">{activity.message || activity.title}</span>
                        <span className="text-xs text-blue-600">
                          {new Date(activity.createdAt).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-slate-500">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
