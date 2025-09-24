"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import dynamic from "next/dynamic"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Wrench,
  Car,
  FileText,
  Settings
} from "lucide-react"
import { 
  getGarageApprovalDetails, 
  approveGarageItem,
  getGarageById,
  type ApprovalDetails,
  type ApprovalItem,
  type GarageInfo
} from "@/lib/api/AdminApi"
import { toast } from "sonner"
import { ImageModal } from "@/components/ImageModal"
import Swal from 'sweetalert2'

export default function GarageApprovalPage() {
  const router = useRouter()
  const params = useParams()
  const garageId = Number(params.garageId)
  
  const [approvalDetails, setApprovalDetails] = useState<ApprovalDetails | null>(null)
  const [garageInfo, setGarageInfo] = useState<GarageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [approvingItem, setApprovingItem] = useState<string | null>(null)
  const [rejectionReasons, setRejectionReasons] = useState<{[key: string]: string}>({})
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [isClient, setIsClient] = useState(false)

  // Fix hydration error
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch approval details and garage info
  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")
      
      // console.log("Fetching data for garage ID:", garageId)
      
      // Fetch both approval details and garage info
      const [approvalResponse, garageResponse] = await Promise.all([
        getGarageApprovalDetails(garageId),
        getGarageById(garageId)
      ])
      
      // console.log("Approval details:", approvalResponse.data)
      // console.log("Garage info:", garageResponse.data)
      
      setApprovalDetails(approvalResponse.data)
      setGarageInfo(garageResponse.data)
    } catch (err: any) {
      console.error("Error fetching data:", err)
      setError("Cannot load information. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (garageId) {
      fetchData()
    }
  }, [garageId])

  const handleApproveItem = async (itemKey: string) => {
    try {
      setApprovingItem(itemKey)

      
      const requestData = {
        itemKey,
        action: "APPROVE" as const
      }
      console.log("Request data:", requestData)
      
      const response = await approveGarageItem(garageId, requestData)
      
      console.log("Approve response:", response)
      console.log("Response data:", response.data)
      
      // Show detailed success notification
      toast.success(`Successfully approved "${getItemTitle(itemKey)}"!`)
      
      // Update UI immediately instead of refetching all data
      if (approvalDetails) {
        const updatedApprovalDetails = { ...approvalDetails }
        if (updatedApprovalDetails.approvalDetails[itemKey]) {
          updatedApprovalDetails.approvalDetails[itemKey] = {
            ...updatedApprovalDetails.approvalDetails[itemKey],
            status: "APPROVED",
            rejectionReason: undefined,
            approvedBy: "admin", // Temporary, will be updated from response
            approvedAt: new Date().toISOString()
          }
          
          // Update overall status
          const items = updatedApprovalDetails.approvalDetails
          const allApproved = Object.values(items).every(item => item.status === "APPROVED")
          const anyRejected = Object.values(items).some(item => item.status === "REJECTED")
          
          if (anyRejected) {
            updatedApprovalDetails.overallStatus = "REJECTED"
          } else if (allApproved) {
            updatedApprovalDetails.overallStatus = "APPROVED"
          } else {
            updatedApprovalDetails.overallStatus = "PENDING"
          }
          
          setApprovalDetails(updatedApprovalDetails)
        }
      }
      
      // Check if all categories have been approved
      setTimeout(() => {
        const updatedDetails = approvalDetails ? { ...approvalDetails } : null
        if (updatedDetails) {
          updatedDetails.approvalDetails[itemKey] = {
            ...updatedDetails.approvalDetails[itemKey],
            status: "APPROVED"
          }
          
          // Check if all categories have been approved
          const allApproved = Object.values(updatedDetails.approvalDetails).every(item => item.status === "APPROVED")
          
          if (allApproved) {
            // Show SweetAlert when approval is complete
            Swal.fire({
              title: '🎉 Approval Complete!',
              html: `
                <div class="text-center">
                  <p class="text-lg mb-4">All categories of garage <strong>"${garageInfo?.name || 'N/A'}"</strong> have been successfully approved!</p>
                  <p class="text-sm text-gray-600 mb-4">The garage will change to <strong>"Active"</strong> status and can receive appointments from customers.</p>
                  <div class="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                    <p class="text-sm text-green-700">
                      <strong>Notification:</strong> You will be redirected to the garage management page in a moment...
                    </p>
                  </div>
                </div>
              `,
              icon: 'success',
              confirmButtonText: 'Excellent!',
              confirmButtonColor: '#10b981',
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: true,
              timer: 4000,
              timerProgressBar: true,
              didOpen: () => {
                // Auto redirect after 4 seconds
                setTimeout(() => {
                  router.push('/admin/garages')
                }, 4000)
              }
            }).then(() => {
              // Redirect immediately if user clicks button
              router.push('/admin/garages')
            })
          } else {
            toast.info("Successfully approved! Continue approving remaining categories.")
          }
        }
      }, 1000)
    } catch (err: any) {
      console.error("=== APPROVE ERROR DEBUG ===")
      console.error("Error approving item:", err)
      console.error("Error message:", err.message)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)
      toast.error(err.response?.data?.message || "An error occurred while approving. Please try again.")
    } finally {
      setApprovingItem(null)
      console.log("=== APPROVE PROCESS COMPLETED ===")
    }
  }

  const handleRejectItem = async (itemKey: string) => {
    const reason = rejectionReasons[itemKey]

    
    if (!reason || reason.trim() === "") {
      toast.error("Please enter rejection reason")
      return
    }
    
    if (reason.trim().length < 5) {
      toast.error("Rejection reason must be at least 5 characters")
      return
    }

    try {
      setApprovingItem(itemKey)

      
      const requestData = {
        itemKey,
        action: "REJECT" as const,
        rejectionReason: reason
      }
      const response = await approveGarageItem(garageId, requestData)
      
      // Show detailed success notification
      toast.success(`Successfully rejected "${getItemTitle(itemKey)}"!`)
      
      // Update UI immediately instead of refetching all data
      if (approvalDetails) {
        const updatedApprovalDetails = { ...approvalDetails }
        if (updatedApprovalDetails.approvalDetails[itemKey]) {
          updatedApprovalDetails.approvalDetails[itemKey] = {
            ...updatedApprovalDetails.approvalDetails[itemKey],
            status: "REJECTED",
            rejectionReason: reason,
            approvedBy: "admin", // Temporary, will be updated from response
            approvedAt: new Date().toISOString()
          }
          
          // Update overall status
          const items = updatedApprovalDetails.approvalDetails
          const allApproved = Object.values(items).every(item => item.status === "APPROVED")
          const anyRejected = Object.values(items).some(item => item.status === "REJECTED")
          
          if (anyRejected) {
            updatedApprovalDetails.overallStatus = "REJECTED"
          } else if (allApproved) {
            updatedApprovalDetails.overallStatus = "APPROVED"
          } else {
            updatedApprovalDetails.overallStatus = "PENDING"
          }
          
          setApprovalDetails(updatedApprovalDetails)
        }
      }
      
      // Clear rejection reason
      setRejectionReasons(prev => ({ ...prev, [itemKey]: "" }))
      
      // Show overall status notification
      setTimeout(() => {
        const updatedDetails = approvalDetails ? { ...approvalDetails } : null
        if (updatedDetails) {
          updatedDetails.approvalDetails[itemKey] = {
            ...updatedDetails.approvalDetails[itemKey],
            status: "REJECTED"
          }
          
          // Check if any category has been rejected
          const hasRejected = Object.values(updatedDetails.approvalDetails).some(item => item.status === "REJECTED")
          
          if (hasRejected) {
            // Show SweetAlert rejection notification
            Swal.fire({
              title: '⚠️ Category Rejected',
              html: `
                <div class="text-center">
                  <p class="text-lg mb-4">Category <strong>"${getItemTitle(itemKey)}"</strong> has been rejected.</p>
                  <p class="text-sm text-gray-600 mb-4">The garage will change to <strong>"Rejected"</strong> status.</p>
                  <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                    <p class="text-sm text-amber-700">
                      <strong>Note:</strong> You can continue approving other categories or return to the garage list.
                    </p>
                  </div>
                </div>
              `,
              icon: 'warning',
              confirmButtonText: 'Understood',
              confirmButtonColor: '#f59e0b',
              allowOutsideClick: true,
              allowEscapeKey: true,
              showConfirmButton: true
            })
          }
        }
      }, 1000)
    } catch (err: any) {
      console.error("Error rejecting item:", err)
      toast.error(err.response?.data?.message || "An error occurred while rejecting. Please try again.")
    } finally {
      setApprovingItem(null)

    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>
    }
  }

  const getItemIcon = (itemKey: string) => {
    switch (itemKey) {
      case "basicInfo":
        return <Building className="h-4 w-4" />
      case "businessInfo":
        return <Settings className="h-4 w-4" />
      case "services":
        return <Wrench className="h-4 w-4" />
      case "vehicleTypes":
        return <Car className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getItemTitle = (itemKey: string) => {
    switch (itemKey) {
      case "basicInfo":
        return "Basic Information"
      case "businessInfo":
        return "Business Information"
      case "services":
        return "Services"
      case "vehicleTypes":
        return "Vehicle Types"
      default:
        return itemKey
    }
  }

  if (loading) {
    return (
      <DashboardLayout 
        allowedRoles={["ADMIN"]}
        title="Approve Garage"
        description="Review and approve each registration content"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout 
        allowedRoles={["ADMIN"]}
        title="Approve Garage"
        description="Review and approve each registration content"
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  if (!approvalDetails) {
    return (
      <DashboardLayout 
        allowedRoles={["ADMIN"]}
        title="Approve Garage"
        description="Review and approve each registration content"
      >
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Approval information not found</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      allowedRoles={["ADMIN"]}
      title="Phê duyệt garage"
      description="Xem xét và phê duyệt từng nội dung đăng ký"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/garages')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          {/* Garage Info Header */}
          {garageInfo && (
            <div className="text-right">
              <h2 className="text-lg font-semibold text-slate-900">{garageInfo.name}</h2>
              <p className="text-sm text-slate-600">ID: {garageInfo.id}</p>
            </div>
          )}
        </div>

        {/* Overall Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Status Summary</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Overall Status:</span>
                {getStatusBadge(approvalDetails.overallStatus)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(approvalDetails.approvalDetails).map(([itemKey, item]) => (
                <div key={itemKey} className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-sm font-medium text-slate-600">{getItemTitle(itemKey)}</div>
                  <div className="mt-1">{getStatusBadge(item.status)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Garage Overview */}
        {garageInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Overview Information</span>
                {garageInfo.status === "PENDING_UPDATE" && (
                  <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                    Updated
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Garage Name:</strong> {garageInfo.name}</p>
                  <p><strong>Address:</strong> {garageInfo.address}</p>
                  <p><strong>Phone Number:</strong> {garageInfo.phone}</p>
                  <p><strong>Email:</strong> {garageInfo.email}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Owner:</strong> {garageInfo.ownerName}</p>
                  <p><strong>Owner Email:</strong> {garageInfo.ownerEmail}</p>
                  <p><strong>Registration Date:</strong> {new Date(garageInfo.createdAt).toLocaleDateString("en-US")}</p>
                  <p><strong>Status:</strong> {garageInfo.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Update Notification */}
        {garageInfo?.status === "PENDING_UPDATE" && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Notification:</strong> This garage has been updated after being rejected. 
              Only modified content will show approve/reject buttons.
              Unchanged content will automatically maintain its previous approval status.
            </AlertDescription>
          </Alert>
        )}



        {/* Approval Items */}
        <div className="grid gap-6">
          {Object.entries(approvalDetails.approvalDetails || {}).map(([itemKey, item]) => (
            <Card key={itemKey}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getItemIcon(itemKey)}
                  <span>{getItemTitle(itemKey)}</span>
                  {getStatusBadge(item.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Item Details */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Registration Content:</h4>
                    <div className="flex items-center space-x-2">
                      {item.isModified && (
                        <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                          Modified
                        </Badge>
                      )}
                      {item.status === "REJECTED" && garageInfo?.status === "PENDING_UPDATE" && (
                        <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
                          Updated
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Show modification details if content was modified */}
                  {item.isModified && item.originalContent && item.modifiedContent && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="font-medium text-yellow-800 mb-2">Change Details:</h5>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-yellow-700 mb-1">Old Content:</p>
                          <p className="text-yellow-600 bg-white p-2 rounded border">{item.originalContent}</p>
                        </div>
                        <div>
                          <p className="font-medium text-yellow-700 mb-1">New Content:</p>
                          <p className="text-yellow-600 bg-white p-2 rounded border">{item.modifiedContent}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-slate-600 space-y-1">
                    {itemKey === "basicInfo" && garageInfo && (
                      <>
                        <p>• <strong>Garage Name:</strong> {garageInfo.name || "Not updated"}</p>
                        <p>• <strong>Address:</strong> {garageInfo.address || "Not updated"}</p>
                        <p>• <strong>Phone Number:</strong> {garageInfo.phone || "Not updated"}</p>
                        <p>• <strong>Email:</strong> {garageInfo.email || "Chưa cập nhật"}</p>
                        <p>• <strong>Description:</strong> {garageInfo.description || "No description"}</p>
                      </>
                    )}
                    {itemKey === "businessInfo" && garageInfo && (
                      <>
                        <p>• <strong>Opening Time:</strong> {garageInfo.openTime || "Not updated"}</p>
                        <p>• <strong>Closing Time:</strong> {garageInfo.closeTime || "Not updated"}</p>
                        <p>• <strong>Image:</strong> {garageInfo.imageUrl ? "Uploaded" : "Not available"}</p>
                        {garageInfo.imageUrl && (
                          <div className="mt-3">
                            <p className="font-medium mb-2">Image Preview:</p>
                            <div className="relative inline-block">
                              <img 
                                src={garageInfo.imageUrl.startsWith('/uploads/') 
                                  ? `http://localhost:8080${garageInfo.imageUrl}` 
                                  : garageInfo.imageUrl} 
                                alt="Garage image" 
                                className="max-w-xs max-h-48 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  if (isClient && garageInfo.imageUrl) {
                                    setSelectedImage(garageInfo.imageUrl.startsWith('/uploads/') 
                                      ? `http://localhost:8080${garageInfo.imageUrl}` 
                                      : garageInfo.imageUrl)
                                    setShowImageModal(true)
                                  }
                                }}
                                onError={(e) => {
                                  console.log('Image load error:', garageInfo.imageUrl);
                                  e.currentTarget.style.display = 'none';
                                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (nextElement) {
                                    nextElement.style.display = 'block';
                                  }
                                }}
                                onLoad={(e) => {
                                  console.log('Image loaded successfully:', garageInfo.imageUrl);
                                  const img = e.currentTarget;
                                  const infoDiv = img.nextElementSibling as HTMLElement;
                                  if (infoDiv) {
                                    infoDiv.innerHTML = `
                                      <div class="text-xs text-gray-600 mt-1">
                                        <p>Kích thước: ${img.naturalWidth} x ${img.naturalHeight}px</p>
                                        <p>Format: ${garageInfo.imageUrl?.split('.').pop()?.toUpperCase() || 'Unknown'}</p>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                              <div 
                                className="hidden max-w-xs max-h-48 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-500 text-sm cursor-pointer"
                                style={{ width: '320px', height: '192px' }}
                                                                 onClick={() => {
                                   if (isClient && garageInfo.imageUrl) {
                                     setSelectedImage(garageInfo.imageUrl.startsWith('/uploads/') 
                                       ? `http://localhost:8080${garageInfo.imageUrl}` 
                                       : garageInfo.imageUrl)
                                     setShowImageModal(true)
                                   }
                                 }}
                              >
                                Cannot load image
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              <p>Click on image to view full size</p>
                              <p>URL: {garageInfo.imageUrl}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {itemKey === "services" && garageInfo && (
                      <>
                        <p>• <strong>Services Provided:</strong></p>
                        {garageInfo.services && garageInfo.services.length > 0 ? (
                          <ul className="ml-4 space-y-1">
                            {garageInfo.services.map((service, index) => (
                              <li key={index}>- {service.serviceName || `Service ${index + 1}`}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-4 text-red-500">No services registered</p>
                        )}
                      </>
                    )}
                    {itemKey === "vehicleTypes" && garageInfo && (
                      <>
                        <p>• <strong>Vehicle Types Served:</strong></p>
                        {garageInfo.vehicleTypes && garageInfo.vehicleTypes.length > 0 ? (
                          <ul className="ml-4 space-y-1">
                            {garageInfo.vehicleTypes.map((vehicleType, index) => (
                              <li key={index}>- {vehicleType.vehicleTypeName || `Vehicle Type ${index + 1}`}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-4 text-red-500">No vehicle types registered</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Approval History */}
                {item.approvedBy && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-900">Approval History:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Approved By: {item.approvedBy}</p>
                      <p>• Time: {item.approvedAt ? new Date(item.approvedAt).toLocaleString("en-US") : "N/A"}</p>
                      {item.rejectionReason && (
                        <p>• Rejection Reason: {item.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons - Show for content pending approval or modified */}
                {((item.status === "PENDING") || 
                  (item.status === "REJECTED" && garageInfo?.status === "PENDING_UPDATE")) && (
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">
                        {item.status === "REJECTED" ? "New Rejection Reason:" : "Rejection Reason (if any):"}
                      </label>
                      <Textarea
                        placeholder={item.status === "REJECTED" ? "Enter new rejection reason..." : "Enter rejection reason..."}
                        value={rejectionReasons[itemKey] || ""}
                        onChange={(e) => setRejectionReasons(prev => ({ 
                          ...prev, 
                          [itemKey]: e.target.value 
                        }))}
                        className="min-h-[80px]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Rejection reason must be at least 5 characters
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApproveItem(itemKey)}
                        disabled={approvingItem === itemKey}
                        className="bg-green-600 hover:bg-green-700 min-w-[120px]"
                      >
                        {approvingItem === itemKey ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">Processing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span className="ml-2">
                              {item.status === "REJECTED" ? "Re-approve" : "Approve"}
                            </span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleRejectItem(itemKey)}
                        disabled={approvingItem === itemKey}
                        className="min-w-[120px]"
                      >
                        {approvingItem === itemKey ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">Processing...</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span className="ml-2">
                              {item.status === "REJECTED" ? "Reject Again" : "Reject"}
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {item.status === "APPROVED" && (
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Has been approved</span>
                  </div>
                )}

                {item.status === "REJECTED" && garageInfo?.status !== "PENDING_UPDATE" && (
                  <div className="flex items-center space-x-2 text-red-700">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">Has been rejected</span>
                  </div>
                )}

                {item.status === "REJECTED" && garageInfo?.status === "PENDING_UPDATE" && (
                  <div className="flex items-center space-x-2 text-amber-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Previously rejected - Can be re-approved</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {/* Fallback: Show missing sections if they're not in approvalDetails */}
          {garageInfo && approvalDetails && approvalDetails.approvalDetails && (
            <>
              {/* Check if services section is missing */}
              {!approvalDetails.approvalDetails.services && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Wrench className="h-5 w-5" />
                      <span>Services</span>
                      <Badge variant="secondary">Pending</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Nội dung đăng ký:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• <strong>Services Provided:</strong></p>
                        {garageInfo.services && garageInfo.services.length > 0 ? (
                          <ul className="ml-4 space-y-1">
                            {garageInfo.services.map((service, index) => (
                              <li key={index}>- {service.serviceName || `Service ${index + 1}`}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-4 text-red-500">No services registered</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Check if vehicleTypes section is missing */}
              {!approvalDetails.approvalDetails.vehicleTypes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Car className="h-5 w-5" />
                      <span>Vehicle Types</span>
                      <Badge variant="secondary">Pending</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Nội dung đăng ký:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• <strong>Vehicle Types Served:</strong></p>
                        {garageInfo.vehicleTypes && garageInfo.vehicleTypes.length > 0 ? (
                          <ul className="ml-4 space-y-1">
                            {garageInfo.vehicleTypes.map((vehicleType, index) => (
                              <li key={index}>- {vehicleType.vehicleTypeName || `Vehicle Type ${index + 1}`}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-4 text-red-500">No vehicle types registered</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isClient && (
        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageUrl={selectedImage}
        />
      )}
    </DashboardLayout>
  )
}
