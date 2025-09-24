"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  MapPin,
  Star,
  Car,
  Building2,
  Clock,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Settings,
  Loader2,
  Heart,
  Bell,
} from "lucide-react"
import { VehicleManagement } from "@/components/vehicle-management";
// import VehicleManagement from "@/components/vehicle-management";

console.log("VehicleManagement:", VehicleManagement);
import { useAuth } from "@/hooks/use-auth"
import { getUserProfile } from "@/lib/api/UserApi"
import { getGaragesByOwner } from "@/lib/api/GarageApi"
import { getUserAppointments, getPendingAppointmentsCount, type Appointment } from "@/lib/api/AppointmentApi"
import { getMyFavorites } from "@/lib/api/FavoriteApi"
import EmergencyApi from "@/lib/api/EmergencyApi"

interface FavoriteGarage {
  id: number
  garageId: number
  garageName: string
  garageAddress: string
  garagePhone: string
  createdAt?: string
}
import Link from "next/link"
import type { User } from "@/lib/api/UserApi"
import type { Garage } from "@/lib/api/GarageApi"

export default function UnifiedDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, updateUser, refreshUser, isUser, isGarageOwner, hasGarages } = useAuth()
  const [activeTab, setActiveTab] = useState("user")
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState("")

  // My Garages Tab
  const [myGarages, setMyGarages] = useState<Garage[]>([])
  const [myGaragesLoading, setMyGaragesLoading] = useState(true)
  const [myGaragesError, setMyGaragesError] = useState("")

  // Recent Appointments
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(true)
  const [garagePendingCounts, setGaragePendingCounts] = useState<Record<number, number>>({})
  const [appointmentsRefreshKey, setAppointmentsRefreshKey] = useState(0)
  
  // Favorite Garages
  const [favoriteGarages, setFavoriteGarages] = useState<FavoriteGarage[]>([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)
  
  // Latest Emergency Request
  const [latestEmergencyRequest, setLatestEmergencyRequest] = useState<any>(null)
  
  // Dashboard Statistics
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0)
  const [totalPendingCount, setTotalPendingCount] = useState(0)

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Set active tab based on URL parameter and force refresh if role is GARAGE
  useEffect(() => {
    if (!isClient) return
    
    const tabParam = searchParams.get('tab')
    if (tabParam === 'garage') {
      setActiveTab('garage')
      // If user role is GARAGE but no garages loaded, force refresh
      if (user && user.role === 'GARAGE' && (!user.garages || user.garages.length === 0)) {
        // Force refresh user profile to get latest garage data
        refreshUser()
      }
    } else if (tabParam === 'user') {
      setActiveTab('user')
      // Force reload appointments when switching to user tab
      if (user) {
        setUserProfile(userProfile)
        setLoading(false)
      
      //if (!user) return

        console.log("🔄 Dashboard: Switching to user tab, force reloading appointments...")
        setAppointmentsRefreshKey(prev => prev + 1)
      }
    } else if (!tabParam) {
      // Default to user tab if no tab specified and redirect with tab parameter
      setActiveTab('user')
      router.push('/dashboard?tab=user')
    }
  }, [isClient, searchParams, user, refreshUser, router])

  // Force reload user data when component mounts with garage tab
  useEffect(() => {
    // Ensure we're on client side to avoid hydration issues
    if (typeof window === 'undefined') return
    
    const tabParam = searchParams.get('tab')
    if (tabParam === 'garage' && user && user.role === 'GARAGE') {
      // Force refresh to ensure we have latest garage data
      const forceRefresh = async () => {
        try {
          const token = localStorage.getItem('token')
          if (token) {
            const response = await fetch('http://localhost:8080/apis/user/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            if (response.ok) {
              const latestUserData = await response.json()
              updateUser(latestUserData)
            }
          }
        } catch (error) {
          console.error('Error force refreshing user data:', error)
        }
      }
      forceRefresh()
    }
  }, [searchParams, user, updateUser]) // Dependencies for proper re-execution

  // Load user profile and appointments when user is available
  useEffect(() => {
    // Ensure we're on client side to avoid hydration issues
    if (typeof window === 'undefined') return
    
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        setAppointmentsLoading(true)
        
        let currentUserProfile = user
        
        // If user not in context, fetch from API
        if (!currentUserProfile) {
          const response = await getUserProfile()
          currentUserProfile = response.data
          updateUser(response.data)
        }
        
        setUserProfile(currentUserProfile)
        setLoading(false)
      } catch (err: any) {
        setError("Cannot load user information")
        setLoading(false)
        setAppointmentsLoading(false)
      }
    }

    loadUserProfile()
  }, [user, updateUser])

  // Separate effect for loading appointments - runs when user is available
  useEffect(() => {
    const loadAppointments = async () => {
      if (!user) {
        console.log("🔄 Dashboard: User not available, skipping appointments load")
        return
      }
      
      console.log("🔄 Dashboard: Loading appointments for user:", user.email)
      
      try {
        setAppointmentsLoading(true)
        const appointmentsResponse = await getUserAppointments({
          page: 0,
          size: 5
        })
        //console.log("✅ Dashboard: Appointments loaded:", appointmentsResponse.data.content.length)
        setRecentAppointments(appointmentsResponse.data.content)
      } catch (appointmentErr) {
        console.error("❌ Dashboard: Error loading appointments:", appointmentErr)
        setRecentAppointments([])
      } finally {
        setAppointmentsLoading(false)
      }
    }

    loadAppointments()
  }, [user, appointmentsRefreshKey]) // Run when user changes or refresh key changes

  // Load favorite garages when user is available
  useEffect(() => {
    const loadFavoriteGarages = async () => {
      if (!user) {
        console.log("🔄 Dashboard: User not available, skipping favorites load")
        return
      }
      
      console.log("🔄 Dashboard: Loading favorite garages for user:", user.email)
      
      try {
        setFavoritesLoading(true)
        const favoritesResponse = await getMyFavorites()
        console.log("✅ Dashboard: Favorite garages loaded:", favoritesResponse.data.length)
        setFavoriteGarages(favoritesResponse.data)
      } catch (favoriteErr) {
        console.error("❌ Dashboard: Error loading favorite garages:", favoriteErr)
        setFavoriteGarages([])
      } finally {
        setFavoritesLoading(false)
      }
    }

    loadFavoriteGarages()
  }, [user]) // Run when user changes

  // Load latest emergency request when user is available
  useEffect(() => {
    const loadLatestEmergencyRequest = async () => {
      if (!user) {
        console.log("🔄 Dashboard: User not available, skipping emergency request load")
        return
      }
      
      console.log("🔄 Dashboard: Loading latest emergency request for user:", user.email)
      
      try {
        const emergencyResponse = await EmergencyApi.getMyRequests()
        console.log("✅ Dashboard: Emergency requests loaded:", emergencyResponse.data?.length || 0)
        
        // Get the latest (most recent) emergency request
        if (emergencyResponse.data && emergencyResponse.data.length > 0) {
          const latest = emergencyResponse.data.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0]
          setLatestEmergencyRequest(latest)
          console.log("✅ Dashboard: Latest emergency request:", latest.id)
        } else {
          setLatestEmergencyRequest(null)
        }
      } catch (emergencyErr) {
        console.error("❌ Dashboard: Error loading emergency requests:", emergencyErr)
        setLatestEmergencyRequest(null)
      }
    }

    loadLatestEmergencyRequest()
  }, [user]) // Run when user changes

  // Load pending appointments count for each garage
  const loadGaragePendingCounts = async (garages: Garage[]) => {
    try {
      const counts: Record<number, number> = {}
      await Promise.all(
        garages.map(async (garage) => {
          try {
            const response = await getPendingAppointmentsCount(garage.id)
            counts[garage.id] = response.data.pendingCount
          } catch (err) {
            console.error(`Error loading pending count for garage ${garage.id}:`, err)
            counts[garage.id] = 0
          }
        })
      )
      setGaragePendingCounts(counts)
      
      // Calculate total pending count for all garages
      const totalPending = Object.values(counts).reduce((sum, count) => sum + count, 0)
      setTotalPendingCount(totalPending)
      
      // For now, set today's appointments to the same as pending (will be updated with real API later)
      setTodayAppointmentsCount(totalPending)
    } catch (error) {
      console.error("Error loading garage pending counts:", error)
    }
  }

  // Load my garages if user has garages - only once when user changes
  useEffect(() => {
    const loadMyGarages = async () => {
      if (user && user.garages && user.garages.length > 0) {
        try {
          setMyGaragesLoading(true)
          setMyGaragesError("")
          const response = await getGaragesByOwner()
          setMyGarages(response.data)
          
          // Load pending counts for each garage
          if (response.data.length > 0) {
            loadGaragePendingCounts(response.data)
          }
        } catch (err: any) {
          console.error("Error loading my garages:", err)
          setMyGaragesError("Cannot load your garage list")
        } finally {
          setMyGaragesLoading(false)
        }
      } else {
        setMyGaragesLoading(false)
      }
    }

    loadMyGarages()
  }, [user?.id]) // Only depend on user ID, not the entire user object

  // Prevent hydration issues - don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE"]}
        title="Dashboard"
        description="Loading..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading information...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE"]}
        title="Dashboard"
        description="An error occurred"
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case "INACTIVE":
        return <Badge className="bg-red-100 text-red-700">Blocked</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
      case "PENDING_UPDATE":
        return <Badge className="bg-orange-100 text-orange-700">Pending Update</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>
    }
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE"]}
      title="Dashboard"
      description="Manage your account and garages"
    >
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value)
        // Update URL when tab changes
        router.push(`/dashboard?tab=${value}`)
      }} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="user" className="flex items-center space-x-2">
            <Car className="h-4 w-4" />
            <span>User</span>
          </TabsTrigger>
          {/* {user && user.garages && user.garages.length > 0 && ( */}

          {user && user.role === 'GARAGE' && (
            <TabsTrigger value="garage" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>My Garage</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* User Tab - Giữ nguyên như cũ */}
        <TabsContent value="user" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Find Garage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">Find car repair garages near you</p>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
                  onClick={() => router.push("/search")}
                >
                  Search Now
                </Button>
              </CardContent>
            </Card>


            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Car className="h-5 w-5 text-blue-600" />
                  <span>Emergency Rescue</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">Call emergency rescue 24/7</p>
                <Button variant="destructive" className="w-full"
                 onClick={() => router.push("/emergency")}>
                  Call Emergency
                </Button>
              </CardContent>
            </Card>

            {/* Register Garage Button - Only show if user doesn't have garages */}
            {(!user || !user.garages || user.garages.length === 0) && (
              <Card className="border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <span>Register Garage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-4">Register your garage to receive appointments</p>
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                    onClick={() => router.push("/garage/register")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Favorites Card */}
            <Card className="border-red-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>Favorite Garages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">Manage your favorite garage list</p>
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600"
                  onClick={() => router.push("/favorites")}
                >
                  View Favorites
                </Button>
              </CardContent>
            </Card>

            {/* Latest Emergency Request Card - Only for USER role */}
            {user && user.role === 'USER' && (
              <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <span>Emergency Request Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-4">View your latest emergency request information</p>
                  <Button 
                    variant="outline" 
                    className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={() => {
                      if (latestEmergencyRequest) {
                        router.push(`/emergency/${latestEmergencyRequest.id}`)
                      } else {
                        router.push("/emergency")
                      }
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Emergency Request Details
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Garage Emergency Management - Only for GARAGE role */}
            {user && user.role === 'GARAGE' && (
              <Card className="border-red-100 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span>Emergency Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-4">Manage emergency rescue requests</p>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => router.push("/garage/emergency")}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Emergency Management
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Notifications Card */}
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm mb-4">View all your notifications</p>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-200 text-blue-600"
                  onClick={() => router.push("/notifications")}
                >
                  View Notifications
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Vehicle Management */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  <span>My Vehicle Management</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleManagement />
            </CardContent>
          </Card>


          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Recent Appointments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : (recentAppointments?.length ?? 0) > 0 ? (
                  <div className="space-y-3">
                    {recentAppointments.slice(0, 3).map((appointment) => {
                      const getStatusBadge = (status: string) => {
                        switch (status) {
                          case "PENDING":
                            return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                          case "CONFIRMED":
                            return <Badge className="bg-blue-100 text-blue-700">Confirmed</Badge>
                          case "IN_PROGRESS":
                            return <Badge className="bg-orange-100 text-orange-700">In Progress</Badge>
                          case "COMPLETED":
                            return <Badge className="bg-green-100 text-green-700">Completed</Badge>
                          case "REJECTED":
                            return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
                          case "CANCELLED":
                            return <Badge className="bg-gray-100 text-gray-700">Cancelled</Badge>
                          default:
                            return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>
                        }
                      }

                      return (
                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{appointment.serviceName}</p>
                            <p className="text-sm text-slate-600">{appointment.garageName}</p>
                            <p className="text-sm text-blue-600">
                              {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')} 
                              {appointment.appointmentTime && ` - ${appointment.appointmentTime}`}
                            </p>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                      )
                    })}
                    {recentAppointments.length > 3 && (
                      <div className="text-center pt-2">
                        <Link href="/user/appointments">
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            View All ({recentAppointments.length})
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm mb-2">No appointments yet</p>
                    <Button 
                      size="sm"
                      onClick={() => router.push("/search/page1")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Book Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span>Favorite Garages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : favoriteGarages.length > 0 ? (
                  <div className="space-y-3">
                    {favoriteGarages.slice(0, 3).map((favorite) => (
                      <div key={favorite.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{favorite.garageName}</p>
                          <p className="text-sm text-slate-600">{favorite.garageAddress}</p>
                          <p className="text-sm text-blue-600">
                            {favorite.garagePhone}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => router.push(`/garage-detail/${favorite.garageId}`)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                    {favoriteGarages.length > 3 && (
                      <div className="text-center pt-2">
                        <Link href="/favorites">
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            View tất cả ({favoriteGarages.length})
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm mb-2">No favorite garages yet</p>
                    <Button 
                      size="sm"
                      onClick={() => router.push("/search")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Find Favorite Garage
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Garage Tab - Chỉ hiển thị nếu user có garage */}
        {user && user.garages && user.garages.length > 0 && (
          <TabsContent value="garage" className="space-y-6">
            {/* My Garages */}
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <span>My Garages</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                    onClick={() => router.push("/garage/register")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Garage
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {myGaragesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    <span className="ml-2 text-slate-600">Loading garages...</span>
                  </div>
                ) : myGaragesError ? (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{myGaragesError}</AlertDescription>
                  </Alert>
                ) : myGarages.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No garages yet</h3>
                    <p className="text-slate-600 mb-4">
                      You haven't registered any garages yet. Register your first garage!
                    </p>
                    {(user?.role === "USER" || user?.role === "GARAGE") && (
                      <Button
                        onClick={() => router.push("/garage/register")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Register Garage
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myGarages.map((garage) => (
                      <Card
                        key={garage.id}
                        className="border-slate-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => router.push(`/garage/${garage.id}?owner=true`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">{garage.name}</h3>
                              {garagePendingCounts[garage.id] > 0 && (
                                <div 
                                  className="flex items-center space-x-1 mt-1 p-2 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/garage/${garage.id}/appointments`)
                                  }}
                                >
                                  <AlertCircle className="h-4 w-4 text-orange-500" />
                                  <span className="text-sm text-orange-600 font-medium">
                                    {garagePendingCounts[garage.id]} appointments need approval
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col space-y-1">
                              {getStatusBadge(garage.status)}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{garage.address}</p>
                          <p className="text-sm text-slate-600 mb-3">{garage.phone}</p>

                          {garage.status === "PENDING" && (
                            <Alert className="border-yellow-200 bg-yellow-50 mb-3">
                              <ClockIcon className="h-4 w-4" />
                              <AlertDescription className="text-yellow-700">
                                Waiting for admin approval
                              </AlertDescription>
                            </Alert>
                          )}

                          {garage.status === "ACTIVE" && (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Approved</span>
                            </div>
                          )}

                          {garage.status === "INACTIVE" && (
                            <Alert className="border-red-200 bg-red-50 mb-3">
                              <XCircle className="h-4 w-4" />
                              <AlertDescription className="text-red-700">
                                Garage is inactive
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-10 w-10 text-green-600" />
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {todayAppointmentsCount}
                      </p>
                      <p className="text-sm text-slate-600">Total appointments today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-100">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-10 w-10 text-orange-600" />
                    <div>
                      <p className="text-3xl font-bold text-slate-900">
                        {totalPendingCount}
                      </p>
                      <p className="text-sm text-slate-600">Total pending appointments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  )
}
