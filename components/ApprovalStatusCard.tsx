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
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
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
            <span>Approval Status</span>
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
              <strong>Your garage has been rejected for approval.</strong> 
              Please review the details below and edit the information as requested.
            </AlertDescription>
          </Alert>
        )}

        {approvalDetails.overallStatus === "PENDING" && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Your garage is pending approval.</strong> 
              Admin will review and approve as soon as possible.
            </AlertDescription>
          </Alert>
        )}

        {approvalDetails.overallStatus === "APPROVED" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Your garage has been approved!</strong> 
              You can start business operations.
            </AlertDescription>
          </Alert>
        )}

        {/* Rejected Items */}
        {rejectedItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-700">Rejected Items:</h4>
            <div className="space-y-2">
              {rejectedItems.map(([itemKey, item]) => (
                <div key={itemKey} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{getItemTitle(itemKey)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-red-600 font-medium">
                      Reason: {item.rejectionReason || "No specific reason provided"}
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
            <h4 className="font-medium text-yellow-700">Pending Items:</h4>
            <div className="space-y-2">
              {pendingItems.map(([itemKey, item]) => (
                <div key={itemKey} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{getItemTitle(itemKey)}</span>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Items */}
        {approvedItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-green-700">Approved Items:</h4>
            <div className="space-y-2">
              {approvedItems.map(([itemKey, item]) => (
                <div key={itemKey} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{getItemTitle(itemKey)}</span>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
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
            Edit Information
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
