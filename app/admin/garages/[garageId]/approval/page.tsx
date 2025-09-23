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
      setError("Không thể tải thông tin. Vui lòng thử lại.")
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
      
      // Hiển thị thông báo thành công chi tiết
      toast.success(`Đã phê duyệt thành công nội dung "${getItemTitle(itemKey)}"!`)
      
      // Cập nhật UI ngay lập tức thay vì fetch lại toàn bộ data
      if (approvalDetails) {
        const updatedApprovalDetails = { ...approvalDetails }
        if (updatedApprovalDetails.approvalDetails[itemKey]) {
          updatedApprovalDetails.approvalDetails[itemKey] = {
            ...updatedApprovalDetails.approvalDetails[itemKey],
            status: "APPROVED",
            rejectionReason: undefined,
            approvedBy: "admin", // Tạm thời, sẽ được cập nhật từ response
            approvedAt: new Date().toISOString()
          }
          
          // Cập nhật overall status
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
      
      // Kiểm tra nếu tất cả danh mục đã được phê duyệt
      setTimeout(() => {
        const updatedDetails = approvalDetails ? { ...approvalDetails } : null
        if (updatedDetails) {
          updatedDetails.approvalDetails[itemKey] = {
            ...updatedDetails.approvalDetails[itemKey],
            status: "APPROVED"
          }
          
          // Kiểm tra tất cả danh mục đã được phê duyệt
          const allApproved = Object.values(updatedDetails.approvalDetails).every(item => item.status === "APPROVED")
          
          if (allApproved) {
            // Hiển thị SweetAlert khi phê duyệt hoàn tất
            Swal.fire({
              title: '🎉 Phê duyệt hoàn tất!',
              html: `
                <div class="text-center">
                  <p class="text-lg mb-4">Tất cả danh mục của garage <strong>"${garageInfo?.name || 'N/A'}"</strong> đã được phê duyệt thành công!</p>
                  <p class="text-sm text-gray-600 mb-4">Garage sẽ chuyển về trạng thái <strong>"Hoạt động"</strong> và có thể nhận lịch hẹn từ khách hàng.</p>
                  <div class="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                    <p class="text-sm text-green-700">
                      <strong>Thông báo:</strong> Bạn sẽ được chuyển về trang quản lý garage trong giây lát...
                    </p>
                  </div>
                </div>
              `,
              icon: 'success',
              confirmButtonText: 'Tuyệt vời!',
              confirmButtonColor: '#10b981',
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: true,
              timer: 4000,
              timerProgressBar: true,
              didOpen: () => {
                // Auto redirect sau 4 giây
                setTimeout(() => {
                  router.push('/admin/garages')
                }, 4000)
              }
            }).then(() => {
              // Redirect ngay lập tức nếu user click button
              router.push('/admin/garages')
            })
          } else {
            toast.info("Đã phê duyệt thành công! Tiếp tục phê duyệt các danh mục còn lại.")
          }
        }
      }, 1000)
    } catch (err: any) {
      console.error("=== APPROVE ERROR DEBUG ===")
      console.error("Error approving item:", err)
      console.error("Error message:", err.message)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi phê duyệt. Vui lòng thử lại.")
    } finally {
      setApprovingItem(null)
      console.log("=== APPROVE PROCESS COMPLETED ===")
    }
  }

  const handleRejectItem = async (itemKey: string) => {
    const reason = rejectionReasons[itemKey]

    
    if (!reason || reason.trim() === "") {
      toast.error("Vui lòng nhập lý do từ chối")
      return
    }
    
    if (reason.trim().length < 5) {
      toast.error("Lý do từ chối phải có ít nhất 5 ký tự")
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
      
      // Hiển thị thông báo thành công chi tiết
      toast.success(`Đã từ chối thành công nội dung "${getItemTitle(itemKey)}"!`)
      
      // Cập nhật UI ngay lập tức thay vì fetch lại toàn bộ data
      if (approvalDetails) {
        const updatedApprovalDetails = { ...approvalDetails }
        if (updatedApprovalDetails.approvalDetails[itemKey]) {
          updatedApprovalDetails.approvalDetails[itemKey] = {
            ...updatedApprovalDetails.approvalDetails[itemKey],
            status: "REJECTED",
            rejectionReason: reason,
            approvedBy: "admin", // Tạm thời, sẽ được cập nhật từ response
            approvedAt: new Date().toISOString()
          }
          
          // Cập nhật overall status
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
      
      // Hiển thị thông báo trạng thái tổng thể
      setTimeout(() => {
        const updatedDetails = approvalDetails ? { ...approvalDetails } : null
        if (updatedDetails) {
          updatedDetails.approvalDetails[itemKey] = {
            ...updatedDetails.approvalDetails[itemKey],
            status: "REJECTED"
          }
          
          // Kiểm tra nếu có danh mục bị từ chối
          const hasRejected = Object.values(updatedDetails.approvalDetails).some(item => item.status === "REJECTED")
          
          if (hasRejected) {
            // Hiển thị SweetAlert thông báo từ chối
            Swal.fire({
              title: '⚠️ Đã từ chối danh mục',
              html: `
                <div class="text-center">
                  <p class="text-lg mb-4">Danh mục <strong>"${getItemTitle(itemKey)}"</strong> đã bị từ chối.</p>
                  <p class="text-sm text-gray-600 mb-4">Garage sẽ chuyển về trạng thái <strong>"Bị từ chối"</strong>.</p>
                  <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                    <p class="text-sm text-amber-700">
                      <strong>Lưu ý:</strong> Bạn có thể tiếp tục phê duyệt các danh mục khác hoặc quay lại danh sách garage.
                    </p>
                  </div>
                </div>
              `,
              icon: 'warning',
              confirmButtonText: 'Hiểu rồi',
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
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi từ chối. Vui lòng thử lại.")
    } finally {
      setApprovingItem(null)

    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-700">Đã phê duyệt</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-700">Bị từ chối</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ duyệt</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>
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
        return "Thông tin cơ bản"
      case "businessInfo":
        return "Thông tin kinh doanh"
      case "services":
        return "Dịch vụ"
      case "vehicleTypes":
        return "Loại xe"
      default:
        return itemKey
    }
  }

  if (loading) {
    return (
      <DashboardLayout 
        allowedRoles={["ADMIN"]}
        title="Phê duyệt garage"
        description="Xem xét và phê duyệt từng nội dung đăng ký"
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
        title="Phê duyệt garage"
        description="Xem xét và phê duyệt từng nội dung đăng ký"
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
        title="Phê duyệt garage"
        description="Xem xét và phê duyệt từng nội dung đăng ký"
      >
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không tìm thấy thông tin phê duyệt</AlertDescription>
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
            <span>Quay lại</span>
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
              <span>Tóm tắt trạng thái</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Trạng thái tổng thể:</span>
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
                <span>Thông tin tổng quan</span>
                {garageInfo.status === "PENDING_UPDATE" && (
                  <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                    Đã cập nhật
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Tên garage:</strong> {garageInfo.name}</p>
                  <p><strong>Địa chỉ:</strong> {garageInfo.address}</p>
                  <p><strong>Số điện thoại:</strong> {garageInfo.phone}</p>
                  <p><strong>Email:</strong> {garageInfo.email}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Chủ sở hữu:</strong> {garageInfo.ownerName}</p>
                  <p><strong>Email chủ sở hữu:</strong> {garageInfo.ownerEmail}</p>
                  <p><strong>Ngày đăng ký:</strong> {new Date(garageInfo.createdAt).toLocaleDateString("vi-VN")}</p>
                  <p><strong>Trạng thái:</strong> {garageInfo.status}</p>
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
              <strong>Thông báo:</strong> Garage này đã được cập nhật sau khi bị từ chối. 
              Chỉ những nội dung đã được chỉnh sửa mới hiển thị nút phê duyệt/từ chối.
              Những nội dung chưa được thay đổi sẽ tự động được giữ nguyên trạng thái phê duyệt trước đó.
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
                    <h4 className="font-medium">Nội dung đăng ký:</h4>
                    <div className="flex items-center space-x-2">
                      {item.isModified && (
                        <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                          Đã được chỉnh sửa
                        </Badge>
                      )}
                      {item.status === "REJECTED" && garageInfo?.status === "PENDING_UPDATE" && (
                        <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
                          Đã được cập nhật
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Show modification details if content was modified */}
                  {item.isModified && item.originalContent && item.modifiedContent && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="font-medium text-yellow-800 mb-2">Chi tiết thay đổi:</h5>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-yellow-700 mb-1">Nội dung cũ:</p>
                          <p className="text-yellow-600 bg-white p-2 rounded border">{item.originalContent}</p>
                        </div>
                        <div>
                          <p className="font-medium text-yellow-700 mb-1">Nội dung mới:</p>
                          <p className="text-yellow-600 bg-white p-2 rounded border">{item.modifiedContent}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-slate-600 space-y-1">
                    {itemKey === "basicInfo" && garageInfo && (
                      <>
                        <p>• <strong>Tên garage:</strong> {garageInfo.name || "Chưa cập nhật"}</p>
                        <p>• <strong>Địa chỉ:</strong> {garageInfo.address || "Chưa cập nhật"}</p>
                        <p>• <strong>Số điện thoại:</strong> {garageInfo.phone || "Chưa cập nhật"}</p>
                        <p>• <strong>Email:</strong> {garageInfo.email || "Chưa cập nhật"}</p>
                        <p>• <strong>Mô tả:</strong> {garageInfo.description || "Chưa có mô tả"}</p>
                      </>
                    )}
                    {itemKey === "businessInfo" && garageInfo && (
                      <>
                        <p>• <strong>Giờ mở cửa:</strong> {garageInfo.openTime || "Chưa cập nhật"}</p>
                        <p>• <strong>Giờ đóng cửa:</strong> {garageInfo.closeTime || "Chưa cập nhật"}</p>
                        <p>• <strong>Hình ảnh:</strong> {garageInfo.imageUrl ? "Đã tải lên" : "Chưa có"}</p>
                        {garageInfo.imageUrl && (
                          <div className="mt-3">
                            <p className="font-medium mb-2">Xem trước hình ảnh:</p>
                            <div className="relative inline-block">
                              <img 
                                src={garageInfo.imageUrl.startsWith('/uploads/') 
                                  ? `http://localhost:8080${garageInfo.imageUrl}` 
                                  : garageInfo.imageUrl} 
                                alt="Hình ảnh garage" 
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
                                Không thể tải hình ảnh
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              <p>Click vào ảnh để xem kích thước đầy đủ</p>
                              <p>URL: {garageInfo.imageUrl}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {itemKey === "services" && garageInfo && (
                      <>
                        <p>• <strong>Dịch vụ cung cấp:</strong></p>
                        {garageInfo.services && garageInfo.services.length > 0 ? (
                          <ul className="ml-4 space-y-1">
                            {garageInfo.services.map((service, index) => (
                              <li key={index}>- {service.serviceName || `Dịch vụ ${index + 1}`}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-4 text-red-500">Chưa có dịch vụ nào được đăng ký</p>
                        )}
                      </>
                    )}
                    {itemKey === "vehicleTypes" && garageInfo && (
                      <>
                        <p>• <strong>Loại xe phục vụ:</strong></p>
                        {garageInfo.vehicleTypes && garageInfo.vehicleTypes.length > 0 ? (
                          <ul className="ml-4 space-y-1">
                            {garageInfo.vehicleTypes.map((vehicleType, index) => (
                              <li key={index}>- {vehicleType.vehicleTypeName || `Loại xe ${index + 1}`}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-4 text-red-500">Chưa có loại xe nào được đăng ký</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Approval History */}
                {item.approvedBy && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-900">Lịch sử phê duyệt:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Người phê duyệt: {item.approvedBy}</p>
                      <p>• Thời gian: {item.approvedAt ? new Date(item.approvedAt).toLocaleString("vi-VN") : "N/A"}</p>
                      {item.rejectionReason && (
                        <p>• Lý do từ chối: {item.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons - Hiển thị cho nội dung đang chờ phê duyệt hoặc đã được chỉnh sửa */}
                {((item.status === "PENDING") || 
                  (item.status === "REJECTED" && garageInfo?.status === "PENDING_UPDATE")) && (
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">
                        {item.status === "REJECTED" ? "Lý do từ chối mới:" : "Lý do từ chối (nếu có):"}
                      </label>
                      <Textarea
                        placeholder={item.status === "REJECTED" ? "Nhập lý do từ chối mới..." : "Nhập lý do từ chối..."}
                        value={rejectionReasons[itemKey] || ""}
                        onChange={(e) => setRejectionReasons(prev => ({ 
                          ...prev, 
                          [itemKey]: e.target.value 
                        }))}
                        className="min-h-[80px]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Lý do từ chối phải có ít nhất 5 ký tự
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
                            <span className="ml-2">Đang xử lý...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span className="ml-2">
                              {item.status === "REJECTED" ? "Phê duyệt lại" : "Phê duyệt"}
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
                            <span className="ml-2">Đang xử lý...</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span className="ml-2">
                              {item.status === "REJECTED" ? "Từ chối lại" : "Từ chối"}
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
                    <span className="text-sm">Đã được phê duyệt</span>
                  </div>
                )}

                {item.status === "REJECTED" && garageInfo?.status !== "PENDING_UPDATE" && (
                  <div className="flex items-center space-x-2 text-red-700">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">Đã bị từ chối</span>
                  </div>
                )}

                {item.status === "REJECTED" && garageInfo?.status === "PENDING_UPDATE" && (
                  <div className="flex items-center space-x-2 text-amber-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Đã bị từ chối trước đó - Có thể phê duyệt lại</span>
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
                      <span>Dịch vụ</span>
                      <Badge variant="secondary">Chờ duyệt</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Nội dung đăng ký:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• <strong>Dịch vụ cung cấp:</strong></p>
                        {garageInfo.services && garageInfo.services.length > 0 ? (
                          <ul className="ml-4 space-y-1">
                            {garageInfo.services.map((service, index) => (
                              <li key={index}>- {service.serviceName || `Dịch vụ ${index + 1}`}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-4 text-red-500">Chưa có dịch vụ nào được đăng ký</p>
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
                      <span>Loại xe</span>
                      <Badge variant="secondary">Chờ duyệt</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Nội dung đăng ký:</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>• <strong>Loại xe phục vụ:</strong></p>
                        {garageInfo.vehicleTypes && garageInfo.vehicleTypes.length > 0 ? (
                          <ul className="ml-4 space-y-1">
                            {garageInfo.vehicleTypes.map((vehicleType, index) => (
                              <li key={index}>- {vehicleType.vehicleTypeName || `Loại xe ${index + 1}`}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="ml-4 text-red-500">Chưa có loại xe nào được đăng ký</p>
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
