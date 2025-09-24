"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  Star,
  Users,
  DollarSign,
  ArrowLeft,
  Settings,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getPublicGarageById, getMyGarageById, type PublicGarageInfo } from "@/lib/api/UserApi"
import type { GarageInfo } from "@/hooks/use-auth"
import { ApprovalStatusCard } from "@/components/ApprovalStatusCard"

export default function GarageDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const garageId = Number(params.garageId)
  const isOwnerView = searchParams.get('owner') === 'true'
  
  const [garage, setGarage] = useState<GarageInfo | PublicGarageInfo | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadGarage = async () => {
      try {
        // Check if user is the owner of this garage
        const userIsOwner = user && user.garages && user.garages.some(g => g.id === garageId)
        setIsOwner(userIsOwner || isOwnerView)
        
        let response
        if (userIsOwner || isOwnerView) {
          // If owner or has parameter owner=true, get detailed information
          response = await getMyGarageById(garageId)
        } else {
          // If not owner, get public information
          response = await getPublicGarageById(garageId)
        }
        
        setGarage(response.data)
        setLoading(false)
      } catch (err: any) {
        console.error("Error loading garage:", err)
        if (err.response?.status === 403) {
          setError("You do not have permission to view detailed garage information")
        } else {
          setError("Cannot load garage information")
        }
        setLoading(false)
      }
    }

    if (garageId) {
      loadGarage()
    }
  }, [garageId, user, isOwnerView])

  if (loading) {
    return (
              <DashboardLayout
          allowedRoles={["USER", "GARAGE", "ADMIN"]}
          title="Garage Details"
          description="Loading..."
        >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading garage information...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !garage) {
    return (
      <DashboardLayout
        allowedRoles={["USER", "GARAGE", "ADMIN"]}
        title="Error"
        description="Garage not found"
      >
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">
            {error || "Garage not found"}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["USER", "GARAGE", "ADMIN"]}
      title={`Garage: ${garage.name}`}
      description="Detailed garage information"
    >
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard?tab=garage")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Garages</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <StatusBadge status={garage.status} rejectionReason={(garage as any).rejectionReason} />
          </div>
        </div>

        {/* Garage Information */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">{garage.name}</p>
                      <p className="text-sm text-slate-600">Garage Name</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">{garage.address}</p>
                      <p className="text-sm text-slate-600">Address</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">{garage.phone}</p>
                      <p className="text-sm text-slate-600">Phone Number</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">{garage.email}</p>
                      <p className="text-sm text-slate-600">Email</p>
                    </div>
                  </div>
                </div>
                
                {garage.description && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                    <p className="text-slate-600">{garage.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

                         {/* Status Information - Only for owner */}
             {isOwner && (
               <>
                 {/* Approval Status Card - Show detailed approval information */}
                 {'approvalDetails' in garage && 
                  garage.approvalDetails && 
                  typeof garage.approvalDetails === 'object' && 
                  garage.approvalDetails !== null && (
                   <ApprovalStatusCard
                     approvalDetails={garage.approvalDetails as any}
                     garageId={garageId}
                     onEditClick={() => router.push(`/garage/${garageId}/edit`)}
                   />
                 )}
                 
                 {/* Fallback status alerts for backward compatibility */}
                 {(!('approvalDetails' in garage) || !garage.approvalDetails) && (
                   <>
                     {garage.status === "PENDING" && (
                       <Alert className="border-yellow-200 bg-yellow-50">
                         <ClockIcon className="h-4 w-4" />
                         <AlertDescription className="text-yellow-700">
                           <strong>Pending Approval:</strong> Your garage is being reviewed by admin. 
                           You will receive a notification when there is a result.
                         </AlertDescription>
                       </Alert>
                     )}
                     
                     {garage.status === "INACTIVE" && 'rejectionReason' in garage && garage.rejectionReason && (
                       <Alert className="border-red-200 bg-red-50">
                         <XCircle className="h-4 w-4" />
                         <AlertDescription className="text-red-700">
                           <strong>Rejected:</strong> {garage.rejectionReason}
                         </AlertDescription>
                       </Alert>
                     )}
                     
                     {garage.status === "ACTIVE" && (
                       <Alert className="border-green-200 bg-green-50">
                         <CheckCircle className="h-4 w-4" />
                         <AlertDescription className="text-green-700">
                           <strong>Approved:</strong> Your garage is now active and can receive appointments from customers.
                         </AlertDescription>
                       </Alert>
                     )}
                   </>
                 )}
               </>
             )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
                         {/* Quick Actions - Only for owner */}
             {isOwner && (
               <Card className="border-blue-100">
                 <CardHeader>
                   <CardTitle className="text-lg">Quick Actions</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   <Button 
                     className="w-full justify-start" 
                     variant="outline"
                     onClick={() => router.push(`/garage/${garageId}/appointments`)}
                   >
                     <Calendar className="h-4 w-4 mr-2" />
                     Manage Appointments
                   </Button>
                   
                   <Button 
                     className="w-full justify-start" 
                     variant="outline"
                     onClick={() => router.push(`/garage/${garageId}/edit`)}
                   >
                     <Settings className="h-4 w-4 mr-2" />
                     Edit Information
                   </Button>
                   
                   <Button 
                     className="w-full justify-start" 
                     variant="outline"
                     onClick={() => router.push(`/garage/${garageId}/services`)}
                   >
                     <Building2 className="h-4 w-4 mr-2" />
                     Manage Services
                   </Button>
                 </CardContent>
               </Card>
             )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Status Badge Component
function StatusBadge({ status, rejectionReason }: { status: string, rejectionReason?: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { label: "Active", className: "bg-green-100 text-green-700" }
      case "PENDING":
        return { label: "Pending Approval", className: "bg-yellow-100 text-yellow-700" }
      case "INACTIVE":
        return { label: "Inactive", className: "bg-red-100 text-red-700" }
      case "PENDING_UPDATE":
        return { label: "Pending Update", className: "bg-blue-100 text-blue-700" }
      default:
        return { label: "Unknown", className: "bg-gray-100 text-gray-700" }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div className="flex flex-col space-y-2">
      <Badge className={config.className}>
        {config.label}
      </Badge>
      {status === "INACTIVE" && rejectionReason && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
          <div className="font-medium">Suspension Reason:</div>
          <div className="mt-1">{rejectionReason}</div>
        </div>
      )}
    </div>
  )
}
