"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Edit
} from "lucide-react"
import { ApprovalDetails } from "@/lib/api/AuthApi"

interface ApprovalStatusCardProps {
  approvalDetails: ApprovalDetails
  garageId: number
  onEditClick: () => void
}

export function ApprovalStatusCard({ 
  approvalDetails, 
  garageId, 
  onEditClick
}: ApprovalStatusCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã duyệt</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Bị từ chối</Badge>
      case "PENDING":
        return <Badge variant="secondary">Chờ duyệt</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
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

  const rejectedItems = Object.entries(approvalDetails.approvalDetails)
    .filter(([_, item]) => item.status === "REJECTED")

  const pendingItems = Object.entries(approvalDetails.approvalDetails)
    .filter(([_, item]) => item.status === "PENDING")

  const approvedItems = Object.entries(approvalDetails.approvalDetails)
    .filter(([_, item]) => item.status === "APPROVED")

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <span>Trạng thái phê duyệt</span>
          </div>
          {getStatusBadge(approvalDetails.overallStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status Alert */}
        {approvalDetails.overallStatus === "REJECTED" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Garage của bạn đã bị từ chối phê duyệt.</strong> 
              Vui lòng xem chi tiết bên dưới và chỉnh sửa thông tin theo yêu cầu.
            </AlertDescription>
          </Alert>
        )}

        {approvalDetails.overallStatus === "PENDING" && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Garage của bạn đang chờ phê duyệt.</strong> 
              Admin sẽ xem xét và phê duyệt trong thời gian sớm nhất.
            </AlertDescription>
          </Alert>
        )}

        {approvalDetails.overallStatus === "APPROVED" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Garage của bạn đã được phê duyệt!</strong> 
              Bạn có thể bắt đầu hoạt động kinh doanh.
            </AlertDescription>
          </Alert>
        )}

        {/* Rejected Items */}
        {rejectedItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-700">Các mục bị từ chối:</h4>
            <div className="space-y-2">
              {rejectedItems.map(([itemKey, item]) => (
                <div key={itemKey} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{getItemTitle(itemKey)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-red-600 font-medium">
                      Lý do: {item.rejectionReason || "Không có lý do cụ thể"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.approvedAt && new Date(item.approvedAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-yellow-700">Các mục chờ duyệt:</h4>
            <div className="space-y-2">
              {pendingItems.map(([itemKey, item]) => (
                <div key={itemKey} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{getItemTitle(itemKey)}</span>
                  </div>
                  <Badge variant="secondary">Chờ duyệt</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Items */}
        {approvedItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-green-700">Các mục đã được duyệt:</h4>
            <div className="space-y-2">
              {approvedItems.map(([itemKey, item]) => (
                <div key={itemKey} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{getItemTitle(itemKey)}</span>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">Đã duyệt</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <Button 
            onClick={onEditClick}
            className="w-full"
            variant={rejectedItems.length > 0 ? "default" : "outline"}
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa thông tin
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
