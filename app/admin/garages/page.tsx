"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Eye, Check, X, Star, MapPin, Building, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import { getAllGarages, approveGarage, type GarageInfo, type GarageApprovalData } from "@/lib/api/AdminApi"
import { toast } from "sonner"

export default function AdminGaragesPage() {
  const router = useRouter()
  const [garages, setGarages] = useState<GarageInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [approvingGarage, setApprovingGarage] = useState<number | null>(null)

  // Fetch garages from API
  const fetchGarages = async () => {
    try {
      setLoading(true)
      setError("")
      
      const status = statusFilter === "all" ? undefined : statusFilter.toUpperCase()
      const response = await getAllGarages(status, currentPage, 10)
      console.log("Frontend - API Response:", response.data)
      console.log("Frontend - Garages:", response.data.content)
      
      setGarages(response.data.content)
      setTotalPages(response.data.totalPages)
      setTotalElements(response.data.totalElements)
    } catch (err: any) {
      console.error("Error fetching garages:", err)
      setError("Không thể tải danh sách garage. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch garages when component mounts or filters change
  useEffect(() => {
    fetchGarages()
  }, [currentPage, statusFilter])

  // Filter garages based on search term
  const filteredGarages = garages.filter((garage) => {
    const matchesSearch =
      garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garage.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garage.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

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

  const handleApprove = async (garageId: number) => {
    try {
      setApprovingGarage(garageId)
      
      const approvalData: GarageApprovalData = {
        isApproved: true
      }
      
      await approveGarage(garageId, approvalData)
      
      toast.success("Phê duyệt garage thành công!")
      
      // Refresh the garage list
      fetchGarages()
    } catch (err: any) {
      console.error("Error approving garage:", err)
      toast.error("Có lỗi xảy ra khi phê duyệt garage. Vui lòng thử lại.")
    } finally {
      setApprovingGarage(null)
    }
  }

  const handleReject = async (garageId: number) => {
    const rejectionReason = prompt("Lý do từ chối (tùy chọn):")
    
    if (rejectionReason === null) return // User cancelled
    
    try {
      setApprovingGarage(garageId)
      
      const approvalData: GarageApprovalData = {
        isApproved: false,
        rejectionReason: rejectionReason || undefined
      }
      
      await approveGarage(garageId, approvalData)
      
      toast.success("Từ chối garage thành công!")
      
      // Refresh the garage list
      fetchGarages()
    } catch (err: any) {
      console.error("Error rejecting garage:", err)
      toast.error("Có lỗi xảy ra khi từ chối garage. Vui lòng thử lại.")
    } finally {
      setApprovingGarage(null)
    }
  }

  const stats = {
    total: totalElements,
    active: garages.filter((g) => g.status === "ACTIVE").length,
    pending: garages.filter((g) => g.status === "PENDING").length,
    pendingUpdate: garages.filter((g) => g.status === "PENDING_UPDATE").length,
    inactive: garages.filter((g) => g.status === "INACTIVE").length,
  }

  if (loading && garages.length === 0) {
    return (
      <DashboardLayout
        allowedRoles={["ADMIN"]}
        title="Quản lý garage"
        description="Duyệt và quản lý các garage trong hệ thống"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Đang tải danh sách garage...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      allowedRoles={["ADMIN"]}
      title="Quản lý garage"
      description="Duyệt và quản lý các garage trong hệ thống"
    >
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/dashboard')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-6 mb-6">
        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-slate-600">Tổng garage</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-slate-600">Đang hoạt động</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-slate-600">Chờ duyệt</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.pendingUpdate}</p>
              <p className="text-sm text-slate-600">Chờ cập nhật</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              <p className="text-sm text-slate-600">Bị khóa</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-600" />
            <span>Danh sách garage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo tên, địa chỉ hoặc chủ sở hữu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="pending_update">Chờ cập nhật</SelectItem>
                <SelectItem value="inactive">Bị khóa</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={fetchGarages}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Làm mới"
              )}
            </Button>
          </div>

          {/* Garages Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Garage</TableHead>
                  <TableHead>Chủ sở hữu</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGarages.map((garage) => (
                  <TableRow key={garage.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{garage.name || 'N/A'}</p>
                        <p className="text-sm text-slate-500">{garage.email || 'N/A'}</p>
                        <p className="text-sm text-slate-500">{garage.phone || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{garage.ownerName || 'N/A'}</p>
                        <p className="text-sm text-slate-500">{garage.ownerEmail || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start space-x-1">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{garage.address || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {garage.services?.slice(0, 2).map((service) => (
                          <Badge key={service.id} variant="secondary" className="text-xs">
                            {service.serviceName}
                          </Badge>
                        ))}
                        {garage.services && garage.services.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{garage.services.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(garage.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {new Date(garage.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/garages/${garage.id}/approval`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Phê duyệt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredGarages.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-slate-500">Không tìm thấy garage nào</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-600">
                Hiển thị {garages.length} trong tổng số {totalElements} garage
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Trước
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
