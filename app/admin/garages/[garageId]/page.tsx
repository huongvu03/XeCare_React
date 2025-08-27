"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  Building, 
  Wrench, 
  Car, 
  Check, 
  X, 
  AlertCircle, 
  Loader2,
  ArrowLeft
} from "lucide-react"
import { getGarageById, approveGarage, type GarageInfo, type GarageApprovalData } from "@/lib/api/AdminApi"
import { toast } from "sonner"

export default function AdminGarageDetailPage() {
  const router = useRouter()
  const params = useParams()
  const garageId = Number(params.garageId)
  
  const [garage, setGarage] = useState<GarageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    if (garageId) {
      fetchGarageDetails()
    }
  }, [garageId])

  const fetchGarageDetails = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await getGarageById(garageId)
      setGarage(response.data)
    } catch (err: any) {
      console.error("Error fetching garage details:", err)
      setError("Không thể tải thông tin garage. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!garage) return
    
    try {
      setApproving(true)
      const approvalData: GarageApprovalData = {
        isApproved: true
      }
      
      await approveGarage(garage.id, approvalData)
      toast.success("Phê duyệt garage thành công!")
      
      // Refresh garage details
      fetchGarageDetails()
    } catch (err: any) {
      console.error("Error approving garage:", err)
      toast.error("Có lỗi xảy ra khi phê duyệt garage. Vui lòng thử lại.")
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async () => {
    if (!garage) return
    
    const rejectionReason = prompt("Lý do từ chối (tùy chọn):")
    if (rejectionReason === null) return // User cancelled
    
    try {
      setApproving(true)
      const approvalData: GarageApprovalData = {
        isApproved: false,
        rejectionReason: rejectionReason || undefined
      }
      
      await approveGarage(garage.id, approvalData)
      toast.success("Từ chối garage thành công!")
      
      // Refresh garage details
      fetchGarageDetails()
    } catch (err: any) {
      console.error("Error rejecting garage:", err)
      toast.error("Có lỗi xảy ra khi từ chối garage. Vui lòng thử lại.")
    } finally {
      setApproving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
      case "INACTIVE":
        return <Badge className="bg-red-100 text-red-700">Bị khóa</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ duyệt</Badge>
      case "PENDING_UPDATE":
        return <Badge className="bg-orange-100 text-orange-700">Chờ cập nhật</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["ADMIN"]}
        title="Chi tiết garage"
        description="Xem và phê duyệt thông tin garage"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Đang tải thông tin garage...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !garage) {
    return (
      <DashboardLayout
        allowedRoles={["ADMIN"]}
        title="Chi tiết garage"
        description="Xem và phê duyệt thông tin garage"
      >
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error || "Không tìm thấy thông tin garage"}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["ADMIN"]}
      title="Chi tiết garage"
      description="Xem và phê duyệt thông tin garage"
    >
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/garages")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Garage Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">{garage.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{garage.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{garage.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{garage.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">
                      {garage.openTime} - {garage.closeTime}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-600">Trạng thái:</span>
                  {getStatusBadge(garage.status)}
                </div>
                {garage.description && (
                  <div>
                    <span className="text-sm font-medium text-slate-600">Mô tả:</span>
                    <p className="text-slate-600 mt-1">{garage.description}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Thông tin chủ sở hữu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">{garage.ownerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">{garage.ownerEmail}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              Dịch vụ ({garage.services?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {garage.services && garage.services.length > 0 ? (
              <div className="grid gap-4">
                {garage.services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{service.serviceName}</h4>
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </div>
                    {service.serviceDescription && (
                      <p className="text-sm text-slate-600 mb-2">{service.serviceDescription}</p>
                    )}
                    <div className="flex gap-4 text-sm text-slate-600">
                      {service.basePrice && (
                        <span>Giá: {service.basePrice.toLocaleString()} VNĐ</span>
                      )}
                      {service.estimatedTimeMinutes && (
                        <span>Thời gian: {service.estimatedTimeMinutes} phút</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Chưa có dịch vụ nào</p>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              Loại xe ({garage.vehicleTypes?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {garage.vehicleTypes && garage.vehicleTypes.length > 0 ? (
              <div className="grid gap-4">
                {garage.vehicleTypes.map((vehicleType) => (
                  <div key={vehicleType.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{vehicleType.vehicleTypeName}</h4>
                      <Badge variant={vehicleType.isActive ? "default" : "secondary"}>
                        {vehicleType.isActive ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </div>
                    {vehicleType.vehicleTypeDescription && (
                      <p className="text-sm text-slate-600">{vehicleType.vehicleTypeDescription}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Chưa có loại xe nào</p>
            )}
          </CardContent>
        </Card>

        {/* Approval Actions */}
        {garage.status === "PENDING" && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                Phê duyệt garage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                Garage này đang chờ phê duyệt. Vui lòng xem xét thông tin và đưa ra quyết định.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={handleApprove}
                  disabled={approving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {approving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Phê duyệt
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={approving}
                >
                  {approving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Từ chối
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejection Reason */}
        {garage.rejectionReason && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <X className="h-5 w-5" />
                Lý do từ chối
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{garage.rejectionReason}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
