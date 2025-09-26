"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Clock,
  User,
  Phone,
  Mail,
  Car,
  MapPin,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Clock as ClockIcon,
  Loader2
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getAppointmentDetail, updateAppointmentStatus, startAppointment, completeAppointment, cancelAppointmentByGarage, type Appointment } from "@/lib/api/AppointmentApi"

export default function AppointmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const garageId = Number(params.garageId)
  const appointmentId = Number(params.appointmentId)
  
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionForm, setShowRejectionForm] = useState(false)

  useEffect(() => {
    const loadAppointmentDetail = async () => {
      try {
        const response = await getAppointmentDetail(appointmentId)
        console.log("🔍 Garage: Loaded appointment detail:", response.data)
        console.log("🔍 Garage: Appointment status:", response.data.status)
        console.log("🔍 Garage: Appointment notes:", response.data.notes)
        setAppointment(response.data)
        setLoading(false)
      } catch (err: any) {
        console.error("Error loading appointment detail:", err)
        setError("Cannot load appointment details")
        setLoading(false)
      }
    }

    if (appointmentId) {
      loadAppointmentDetail()
    }
  }, [appointmentId])

  const handleStatusUpdate = async (status: "CONFIRMED" | "REJECTED") => {
    if (!appointment) return

    if (status === "REJECTED" && !rejectionReason.trim()) {
      setError("Please enter rejection reason")
      return
    }

    setUpdating(true)
    setError("")

    try {
      const updateData = {
        status,
        ...(status === "REJECTED" && { rejectionReason })
      }

      const response = await updateAppointmentStatus(appointmentId, updateData)
      setAppointment(response.data)
      setSuccess(status === "CONFIRMED" ? "Appointment confirmed successfully!" : "Appointment cancelled!")
      setShowRejectionForm(false)
      setRejectionReason("")
    } catch (err: any) {
      console.error("Error updating appointment status:", err)
      setError("Cannot update appointment status")
    } finally {
      setUpdating(false)
    }
  }

  const handleStartAppointment = async () => {
    if (!appointment) return

    console.log("Starting appointment with ID:", appointmentId)
    console.log("Current appointment status:", appointment.status)
    console.log("Current user:", user)
    console.log("User role:", user?.role)
    
    setUpdating(true)
    setError("")

    try {
      const response = await startAppointment(appointmentId)
      console.log("Start appointment response:", response.data)
      setAppointment(response.data)
      setSuccess("Appointment started successfully!")
    } catch (err: any) {
      console.error("Error starting appointment:", err)
      console.error("Error details:", err.response?.data)
      setError(`Cannot start appointment: ${err.response?.data?.message || err.message}`)
    } finally {
      setUpdating(false)
    }
  }

  const handleCompleteAppointment = async () => {
    if (!appointment) return

    setUpdating(true)
    setError("")

    try {
      const response = await completeAppointment(appointmentId)
      setAppointment(response.data)
      setSuccess("Appointment completed successfully!")
    } catch (err: any) {
      console.error("Error completing appointment:", err)
      setError("Cannot complete appointment")
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelAppointment = async () => {
    if (!appointment) return

    console.log("Cancelling appointment with ID:", appointmentId)
    console.log("Current appointment status:", appointment.status)
    
    setUpdating(true)
    setError("")

    try {
      const response = await cancelAppointmentByGarage(appointmentId)
      console.log("Cancel appointment response:", response.data)
      setAppointment(response.data)
      setSuccess("Appointment cancelled - marked as incomplete!")
    } catch (err: any) {
      console.error("Error cancelling appointment:", err)
      console.error("Error details:", err.response?.data)
      setError(`Cannot cancel appointment: ${err.response?.data?.message || err.message}`)
    } finally {
      setUpdating(false)
    }
  }

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

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE", "ADMIN"]}
        title="Appointment Details"
        description="Loading..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600">Loading appointment details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error && !appointment) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE", "ADMIN"]}
        title="Error"
        description="Cannot load data"
      >
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  if (!appointment) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE", "ADMIN"]}
        title="Not Found"
        description="Appointment does not exist"
      >
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>This appointment was not found.</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE", "ADMIN"]}
      title={`Appointment Details #${appointment.id}`}
      description="Detailed information and appointment management"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push(`/garage/${garageId}/appointments`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to List</span>
          </Button>
          
          {getStatusBadge(appointment.status)}
        </div>

        {/* Status Messages */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Appointment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Customer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Full Name</label>
                    <p className="text-slate-900 font-medium">{appointment.userName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <p className="text-slate-900">{appointment.userEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Phone Number</label>
                    <p className="text-slate-900">{appointment.userPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Appointment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Appointment Date</label>
                    <p className="text-slate-900 font-medium">
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Time</label>
                    <p className="text-slate-900">{appointment.appointmentTime || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Service</label>
                    <p className="text-slate-900 font-medium">{appointment.serviceName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Vehicle Type</label>
                    <p className="text-slate-900">{appointment.vehicleTypeName}</p>
                  </div>
                </div>
                
                {/* Vehicle Info */}
                {(appointment.vehicleBrand || appointment.vehicleModel || appointment.licensePlate) && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">Vehicle Information</label>
                    <p className="text-slate-900">
                      {[appointment.vehicleBrand, appointment.vehicleModel, appointment.licensePlate]
                        .filter(Boolean)
                        .join(" - ")}
                      {appointment.vehicleYear && ` (${appointment.vehicleYear})`}
                    </p>
                  </div>
                )}

                {/* Description */}
                {appointment.notes && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">Request Description</label>
                    <p className="text-slate-900 bg-slate-50 p-3 rounded-md">{appointment.notes}</p>
                  </div>
                )}

                {/* Cancellation Reason */}
                {appointment.rejectionReason && (
                  <div>
                    <label className="text-sm font-medium text-orange-600">
                      Cancellation Reason
                    </label>
                    <p className="p-3 rounded-md border text-orange-700 bg-orange-50 border-orange-200">
                      {appointment.rejectionReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                  <span>Status & Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Current Status</label>
                  <div className="mt-1">
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>

                {/* Actions for PENDING appointments */}
                {appointment.status === "PENDING" && (
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={updating}
                      onClick={() => handleStatusUpdate("CONFIRMED")}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Confirm Appointment
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      className="w-full"
                      disabled={updating}
                      onClick={() => setShowRejectionForm(true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Appointment
                    </Button>
                  </div>
                )}

                {/* Actions for CONFIRMED appointments */}
                {appointment.status === "CONFIRMED" && (
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={updating}
                      onClick={handleStartAppointment}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Clock className="h-4 w-4 mr-2" />
                      )}
                      Start Service
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      className="w-full"
                      disabled={updating}
                      onClick={handleCancelAppointment}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Cancel Appointment
                    </Button>
                  </div>
                )}

                {/* Actions for IN_PROGRESS appointments */}
                {(appointment.status as string) === "IN_PROGRESS" && (
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={updating}
                      onClick={handleCompleteAppointment}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Complete
                    </Button>
                  </div>
                )}

                {/* Read-only for COMPLETED, CANCELLED */}
                {(appointment.status === "COMPLETED" || appointment.status === "CANCELLED") && (
                  <div className="text-center py-4">
                    <p className="text-slate-500 text-sm">
                      {appointment.status === "COMPLETED" && "Appointment completed"}
                      {appointment.status === "CANCELLED" && "Appointment cancelled"}
                    </p>
                  </div>
                )}

                {/* Rejection Form */}
                {showRejectionForm && (
                  <div className="space-y-3 p-4 border border-red-200 rounded-md bg-red-50">
                    <label className="text-sm font-medium text-red-700">
                      Cancellation Reason <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please enter the reason for cancelling the appointment..."
                      className="border-red-300 focus:border-red-500"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <Button 
                        variant="destructive"
                        size="sm"
                        disabled={updating || !rejectionReason.trim()}
                        onClick={() => handleStatusUpdate("REJECTED")}
                      >
                        {updating ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Confirm Cancellation
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowRejectionForm(false)
                          setRejectionReason("")
                          setError("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing Info */}
            {(appointment.estimatedPrice || appointment.finalPrice) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span>Pricing Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {appointment.estimatedPrice && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Estimated Price:</span>
                      <span className="font-medium">
                        {appointment.estimatedPrice.toLocaleString('en-US')} VND
                      </span>
                    </div>
                  )}
                  {appointment.finalPrice && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Final Price:</span>
                      <span className="font-semibold text-green-600">
                        {appointment.finalPrice.toLocaleString('en-US')} VND
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>History</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Created:</span>
                    <span>{new Date(appointment.createdAt).toLocaleString('en-US')}</span>
                  </div>
                  {appointment.updatedAt && appointment.updatedAt !== appointment.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Updated:</span>
                      <span>{new Date(appointment.updatedAt).toLocaleString('en-US')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
