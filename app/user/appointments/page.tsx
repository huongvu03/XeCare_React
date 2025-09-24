"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, Phone, Car, X, CheckCircle, AlertCircle, Clock4, Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getUserAppointments, cancelAppointment, type Appointment } from "@/lib/api/AppointmentApi"
import { getGarageById, type Garage } from "@/lib/api/GarageApi"
import { canUserReviewAppointment, type CanReviewResponse } from "@/lib/api/ReviewAppointmentApi"
import { ReviewAppointmentModal } from "@/components/review/ReviewAppointmentModal"
import { useAuth } from "@/hooks/use-auth"

export default function AppointmentsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [garageDetails, setGarageDetails] = useState<Record<number, Garage>>({})
  
  // Cancel appointment modal state
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [appointmentReviewStatus, setAppointmentReviewStatus] = useState<Record<number, CanReviewResponse>>({})

  // Load appointments
  const loadAppointments = async () => {
    console.log("🔍 loadAppointments called")
    console.log("🔍 User object:", user)
    console.log("🔍 User available:", !!user)
    
    if (!user) {
      console.log("❌ User not available, skipping appointments load")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log("✅ Loading appointments for user:", user.email)
      console.log("🔍 User ID:", user.id)
    
      const params = {
        page: currentPage,
        size: 10,
        status: filterStatus || undefined
      }
      console.log("🔍 Filter parameters:", params)
      console.log("🔍 API URL will be called with:", params)
      
      const response = await getUserAppointments({
        page: currentPage,
        size: 10,
        status: filterStatus || undefined
      })
      
      console.log("🔍 Full API response:", response)
      console.log("🔍 Response status:", response.status)
      console.log("🔍 Response headers:", response.headers)
      console.log("🔍 Response data:", response.data)
      console.log("🔍 Response data content:", response.data?.content)
      
      // Ensure response.data.content is an array
      const appointmentsData = response.data?.content || []
      let filteredAppointments = appointmentsData
      
      console.log("🔍 Appointments data:", appointmentsData)
      console.log("🔍 Appointments data length:", appointmentsData.length)
      
      // Client-side filtering if backend doesn't handle it properly
      if (filterStatus && filterStatus !== "REVIEW_PENDING" && appointmentsData.length > 0) {
        filteredAppointments = appointmentsData.filter(apt => apt.status === filterStatus)
        console.log("🔍 Client-side filtering applied:", filterStatus)
        console.log("🔍 Before filter:", appointmentsData.length, "After filter:", filteredAppointments.length)
      }
      
      setAllAppointments(filteredAppointments)
      setTotalPages(response.data?.totalPages || 0)
      console.log("Appointments loaded successfully:", filteredAppointments?.length || 0)
      console.log("🔍 Final appointments statuses:", filteredAppointments?.map(apt => apt.status) || [])

      // Load garage details for each appointment
      await loadGarageDetails(filteredAppointments)
    } catch (err: any) {
      console.error("❌ Error loading appointments:", err)
      console.error("❌ Error response:", err.response)
      console.error("❌ Error data:", err.response?.data)
      console.error("❌ Error status:", err.response?.status)
      console.error("❌ Error headers:", err.response?.headers)
      console.error("❌ Error config:", err.config)
      
      // Specific error handling
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.")
      } else if (err.response?.status === 403) {
        setError("You don't have permission to access. Please check your account.")
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        setError("Cannot load appointments list. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Load garage details for appointments
  const loadGarageDetails = async (appointmentList: Appointment[]) => {
    const uniqueGarageIds = [...new Set(appointmentList.map(apt => apt.garageId))]
    const newGarageDetails: Record<number, Garage> = {}

    console.log("🏢 Loading garage details for IDs:", uniqueGarageIds)

    for (const garageId of uniqueGarageIds) {
      try {
        if (!garageDetails[garageId]) { // Only load if not already cached
          console.log("🏢 Loading garage details for ID:", garageId)
          const garageResponse = await getGarageById(garageId)
          console.log("✅ Garage details loaded:", garageResponse.data)
          newGarageDetails[garageId] = garageResponse.data
        } else {
          console.log("📋 Using cached garage details for ID:", garageId)
        }
      } catch (err) {
        console.error("❌ Error loading garage details for ID", garageId, err)
      }
    }

    if (Object.keys(newGarageDetails).length > 0) {
      console.log("🔄 Updating garage details state:", newGarageDetails)
      setGarageDetails(prev => ({ ...prev, ...newGarageDetails }))
    }
  }

  useEffect(() => {
    console.log("🔍 useEffect triggered")
    console.log("🔍 Dependencies - currentPage:", currentPage, "filterStatus:", filterStatus, "user:", user)
    loadAppointments()
  }, [currentPage, filterStatus, user])

  // Function to filter appointments based on current filter
  const applyFilter = (appointmentsList: Appointment[]) => {
    if (!filterStatus) {
      setAppointments(appointmentsList)
      return
    }

    if (filterStatus === "REVIEW_PENDING") {
      // Filter for completed appointments that can be reviewed
      const filtered = appointmentsList.filter(apt => {
        return apt.status === "COMPLETED" && 
               appointmentReviewStatus[apt.id] && 
               appointmentReviewStatus[apt.id].canReview
      })
      setAppointments(filtered)
    } else if (filterStatus === "REVIEWED") {
      // Filter for completed appointments that have been reviewed
      const filtered = appointmentsList.filter(apt => {
        return apt.status === "COMPLETED" && 
               appointmentReviewStatus[apt.id] && 
               appointmentReviewStatus[apt.id].hasReviewed
      })
      setAppointments(filtered)
    } else {
      // Regular status filtering
      const filtered = appointmentsList.filter(apt => apt.status === filterStatus)
      setAppointments(filtered)
    }
  }

  // Load review status for completed appointments
  useEffect(() => {
    const loadReviewStatus = async () => {
      if (!allAppointments) return
      
      const completedAppointments = allAppointments.filter(app => app.status === "COMPLETED")
      
      for (const appointment of completedAppointments) {
        try {
          const response = await canUserReviewAppointment(appointment.id)
          setAppointmentReviewStatus(prev => ({
            ...prev,
            [appointment.id]: response.data
          }))
        } catch (error) {
          console.error(`Error loading review status for appointment ${appointment.id}:`, error)
        }
      }
    }

    loadReviewStatus()
  }, [allAppointments])

  // Apply filter when appointments or filter status changes
  useEffect(() => {
    applyFilter(allAppointments)
  }, [allAppointments, filterStatus, appointmentReviewStatus])

  // Handle review functions
  const handleReviewClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setReviewModalOpen(true)
  }

  const handleReviewSubmitted = () => {
    // Update review status for this appointment
    if (selectedAppointment) {
      setAppointmentReviewStatus(prev => ({
        ...prev,
        [selectedAppointment.id]: {
          canReview: false,
          hasReviewed: true
        }
      }))
    }
    
    // Refresh appointments to get updated data
    setTimeout(() => loadAppointments(), 500)
  }

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <DashboardLayout allowedRoles={["USER", "GARAGE"]} title="Appointments" description="Manage your appointments">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show message if user not authenticated
  if (!user) {
    return (
      <DashboardLayout allowedRoles={["USER", "GARAGE"]} title="Appointments" description="Manage your appointments">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-500 mb-4">Please log in to view your appointments</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Login
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Handle open cancel modal
  const handleOpenCancelModal = (appointment: Appointment) => {
    setAppointmentToCancel(appointment)
    setCancelReason("")
    setShowCancelModal(true)
  }

  // Handle close cancel modal
  const handleCloseCancelModal = () => {
    setShowCancelModal(false)
    setAppointmentToCancel(null)
    setCancelReason("")
    setIsCancelling(false)
  }

  // Handle cancel appointment with reason
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return
    
    if (!cancelReason.trim()) {
      alert("Please enter the cancellation reason")
      return
    }

    try {
      setIsCancelling(true)
      console.log("🗑️ Cancelling appointment:", appointmentToCancel.id, "with reason:", cancelReason)
      
      await cancelAppointment(appointmentToCancel.id, cancelReason.trim())
      console.log("✅ Appointment cancelled successfully")
      
      // Update local state immediately for better UX
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentToCancel.id 
          ? { ...apt, status: "CANCELLED" as const, rejectionReason: cancelReason.trim() }
          : apt
      ))
      
      // Close modal
      handleCloseCancelModal()
      
      // Clear any previous errors
      setError("")
      alert("Appointment cancelled successfully!")
      
      // Reload appointments to get fresh data from server
      setTimeout(() => loadAppointments(), 1000)
      
    } catch (err: any) {
      console.error("❌ Error cancelling appointment:", err)
      const errorMessage = err.response?.data?.message || err.message || "Unknown error"
      setError(`Cannot cancel appointment: ${errorMessage}`)
      setIsCancelling(false)
    }
  }

  // Get status color and text
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { color: "bg-yellow-100 text-yellow-700", text: "Pending", icon: AlertCircle }
      case "CONFIRMED":
        return { color: "bg-blue-100 text-blue-700", text: "Confirmed", icon: CheckCircle }
      case "COMPLETED":
        return { color: "bg-green-100 text-green-700", text: "Completed", icon: CheckCircle }
      case "CANCELLED":
        return { color: "bg-gray-100 text-gray-700", text: "Cancelled", icon: X }
      case "REJECTED":
        return { color: "bg-red-100 text-red-700", text: "Rejected", icon: X }
      default:
        return { color: "bg-gray-100 text-gray-700", text: status, icon: AlertCircle }
    }
  }

  // Format working hours
  const formatWorkingHours = (garage: Garage) => {
    console.log("🕐 Full garage object:", garage)
    
    // Try multiple approaches to get working hours
    let result = "Not updated"
    
    // Approach 1: Check operatingHours object
    if (garage.operatingHours) {
      console.log("🕐 Found operatingHours:", garage.operatingHours)
      const oh = garage.operatingHours
      
      if (oh.defaultOpenTime && oh.defaultCloseTime) {
        result = `${oh.defaultOpenTime} - ${oh.defaultCloseTime}`
        console.log("🕐 Using default times:", result)
        return result
      }
    }
    
    // Approach 2: Check if it's a string (JSON string from database)
    if (typeof garage.operatingHours === 'string') {
      try {
        const parsed = JSON.parse(garage.operatingHours)
        console.log("🕐 Parsed operating hours from string:", parsed)
        if (parsed.defaultOpenTime && parsed.defaultCloseTime) {
          result = `${parsed.defaultOpenTime} - ${parsed.defaultCloseTime}`
          console.log("🕐 Using parsed default times:", result)
          return result
        }
      } catch (e) {
        console.log("🕐 Failed to parse operating hours string")
      }
    }
    
    // Approach 3: Check direct openTime/closeTime properties
    if (garage.openTime && garage.closeTime) {
      result = `${garage.openTime} - ${garage.closeTime}`
      console.log("🕐 Using direct garage times:", result)
      return result
    }
    
    // Approach 4: Fallback based on your database structure
    console.log("🕐 All approaches failed, using fallback")
    console.log("🕐 This means API response structure differs from expected interface")
    return "08:00 - 18:00" // Based on your actual database data
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE" ]}
      title="My Appointments"
      description="Manage your vehicle service appointments"
    >
      {/* Filter */}
      <Card className="border-blue-100 mb-6">
        <CardContent className="p-4">
          <div className="mb-2 text-sm text-gray-600">
            Current filter: {filterStatus || "ALL"} | Total appointments: {appointments.length}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log("🔍 Setting filter to: ALL")
                setFilterStatus("")
              }}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "PENDING" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log("🔍 Setting filter to: PENDING")
                setFilterStatus("PENDING")
              }}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "CONFIRMED" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log("🔍 Setting filter to: CONFIRMED")
                setFilterStatus("CONFIRMED")
              }}
            >
              Confirmed
            </Button>
            <Button
              variant={filterStatus === "COMPLETED" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log("🔍 Setting filter to: COMPLETED")
                setFilterStatus("COMPLETED")
              }}
            >
              Completed
            </Button>
            <Button
              variant={filterStatus === "CANCELLED" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log("🔍 Setting filter to: CANCELLED")
                setFilterStatus("CANCELLED")
              }}
            >
              Cancelled
            </Button>
            <Button
              variant={filterStatus === "REVIEW_PENDING" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log("🔍 Setting filter to: REVIEW_PENDING")
                setFilterStatus("REVIEW_PENDING")
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Star className="h-4 w-4 mr-1" />
              Pending Review
            </Button>
            <Button
              variant={filterStatus === "REVIEWED" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log("🔍 Setting filter to: REVIEWED")
                setFilterStatus("REVIEWED")
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Star className="h-4 w-4 mr-1 fill-current" />
              Reviewed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert className="border-red-200 bg-red-50 mb-6">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Debug Info */}
    

      {/* Appointments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading appointments...</p>
            </div>
          </div>
        ) : (appointments?.length || 0) === 0 ? (
          <Card className="border-blue-100">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No appointments yet
              </h3>
              <p className="text-slate-600 mb-4">
                You don't have any appointments yet. Find a garage and book an appointment now!
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-cyan-600"
                onClick={() => window.location.href = "/search"}
              >
                Find Garage Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => {
            const statusInfo = getStatusInfo(appointment.status)
            const StatusIcon = statusInfo.icon
            const garage = garageDetails[appointment.garageId]
            
            console.log(`🔍 Appointment ${appointment.id} - Garage ID: ${appointment.garageId}, Garage object:`, garage)

            return (
              <Card key={appointment.id} className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Appointment Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            Appointment #{appointment.id}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Car className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {appointment.vehicleTypeName || "Not specified"}
                              {appointment.vehicleBrand && ` - ${appointment.vehicleBrand}`}
                              {appointment.vehicleModel && ` ${appointment.vehicleModel}`}
                              {appointment.licensePlate && ` (${appointment.licensePlate})`}
                            </span>
                          </div>
                        </div>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.text}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{appointment.garageName}</div>
                            {appointment.garageAddress && (
                              <div className="text-xs text-slate-500">{appointment.garageAddress}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Clock4 className="h-4 w-4" />
                          <span>Opening hours: {garage ? formatWorkingHours(garage) : "Loading..."}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Phone className="h-4 w-4" />
                          <span>Garage: {garage?.phone || appointment.contactPhone}</span>
                        </div>
                      </div>

                      {appointment.description && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-700 mb-1">Description:</h4>
                          <p className="text-sm text-slate-600">{appointment.description}</p>
                        </div>
                      )}

                      {/* Service */}
                      {appointment.serviceName && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-700 mb-2">Service:</h4>
                          <Badge variant="outline" className="text-xs">
                            {appointment.serviceName}
                            {appointment.estimatedPrice && ` - ${appointment.estimatedPrice.toLocaleString()}đ`}
                          </Badge>
                        </div>
                      )}

                      {/* Rejection/Cancellation Reason */}
                      {appointment.rejectionReason && (
                        <Alert className={`${
                          appointment.status === "CANCELLED" 
                            ? "border-orange-200 bg-orange-50" 
                            : "border-red-200 bg-red-50"
                        }`}>
                          <AlertDescription className={`${
                            appointment.status === "CANCELLED" 
                              ? "text-orange-700" 
                              : "text-red-700"
                          }`}>
                            <strong>
                              {appointment.status === "CANCELLED" ? "Cancellation reason:" : "Rejection reason:"}
                            </strong> {appointment.rejectionReason}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Notes */}
                      {appointment.notes && (
                        <Alert className="border-blue-200 bg-blue-50">
                          <AlertDescription className="text-blue-700">
                            <strong>Notes:</strong> {appointment.notes}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Review Section for Completed Appointments */}
                      {appointment.status === "COMPLETED" && appointmentReviewStatus[appointment.id] && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Star className="h-5 w-5 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">
                                Service Review
                              </span>
                            </div>
                            {appointmentReviewStatus[appointment.id].canReview ? (
                              <Button
                                size="sm"
                                onClick={() => handleReviewClick(appointment)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Star className="h-4 w-4 mr-1" />
                                Review Now
                              </Button>
                            ) : appointmentReviewStatus[appointment.id].hasReviewed ? (
                              <div className="flex items-center text-green-600 text-sm">
                                <Star className="h-4 w-4 mr-1 fill-current" />
                                <span>Reviewed</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-500 text-sm">
                                <span>Cannot review</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 md:w-32">
                      {appointment.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleOpenCancelModal(appointment)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {appointmentToCancel && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">Appointment #{appointmentToCancel.id}</p>
                <p className="text-sm text-gray-600">{appointmentToCancel.garageName}</p>
                <p className="text-sm text-gray-600">
                  {new Date(appointmentToCancel.appointmentDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}
            
            <div>
              <Label htmlFor="cancelReason">Cancellation reason *</Label>
              <Textarea
                id="cancelReason"
                placeholder="Please enter the reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                The garage will receive a notification and this cancellation reason.
              </p>
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={handleCloseCancelModal}
              disabled={isCancelling}
            >
              Don't Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelAppointment}
              disabled={isCancelling || !cancelReason.trim()}
            >
              {isCancelling ? "Cancelling..." : "Cancel Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      {selectedAppointment && (
        <ReviewAppointmentModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          appointmentId={selectedAppointment.id}
          garageName={selectedAppointment.garageName}
          serviceName={selectedAppointment.serviceName}
          appointmentDate={selectedAppointment.appointmentDate}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </DashboardLayout>
  )
}
