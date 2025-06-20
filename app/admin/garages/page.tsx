"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Search, MoreHorizontal, Eye, Check, X, Star, MapPin, Building } from "lucide-react"

// Mock data
const mockGarages = [
  {
    id: 1,
    name: "Garage Thành Công",
    email: "thanhcong@garage.com",
    phone: "0909123456",
    address: "123 Lê Lợi, Q1, TP.HCM",
    rating: 4.8,
    reviewCount: 120,
    status: "active",
    createdAt: "2024-01-15",
    services: ["Thay nhớt", "Sửa phanh", "Bảo dưỡng"],
  },
  {
    id: 2,
    name: "Garage ABC",
    email: "abc@garage.com",
    phone: "0909234567",
    address: "456 Nguyễn Huệ, Q1, TP.HCM",
    rating: 4.5,
    reviewCount: 85,
    status: "pending",
    createdAt: "2024-12-18",
    services: ["Sửa động cơ", "Thay lốp"],
  },
  {
    id: 3,
    name: "Garage XYZ",
    email: "xyz@garage.com",
    phone: "0909345678",
    address: "789 Trần Hưng Đạo, Q5, TP.HCM",
    rating: 4.2,
    reviewCount: 65,
    status: "locked",
    createdAt: "2024-03-10",
    services: ["Sơn xe", "Rửa xe"],
  },
  {
    id: 4,
    name: "Garage 24/7",
    email: "support@garage247.com",
    phone: "0909456789",
    address: "321 Võ Văn Tần, Q3, TP.HCM",
    rating: 4.9,
    reviewCount: 200,
    status: "active",
    createdAt: "2024-02-20",
    services: ["Cứu hộ", "Sửa chữa tổng quát"],
  },
]

export default function AdminGaragesPage() {
  const [garages, setGarages] = useState(mockGarages)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredGarages = garages.filter((garage) => {
    const matchesSearch =
      garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garage.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || garage.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
      case "locked":
        return <Badge className="bg-red-100 text-red-700">Bị khóa</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ duyệt</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>
    }
  }

  const handleApprove = (garageId: number) => {
    setGarages(garages.map((garage) => (garage.id === garageId ? { ...garage, status: "active" } : garage)))
  }

  const handleReject = (garageId: number) => {
    if (confirm("Bạn có chắc chắn muốn từ chối garage này?")) {
      setGarages(garages.map((garage) => (garage.id === garageId ? { ...garage, status: "locked" } : garage)))
    }
  }

  const stats = {
    total: garages.length,
    active: garages.filter((g) => g.status === "active").length,
    pending: garages.filter((g) => g.status === "pending").length,
    locked: garages.filter((g) => g.status === "locked").length,
  }

  return (
    <DashboardLayout
      allowedRoles={["admin"]}
      title="Quản lý garage"
      description="Duyệt và quản lý các garage trong hệ thống"
    >
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
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
        <Card className="border-red-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.locked}</p>
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
                placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
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
                <SelectItem value="locked">Bị khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Garages Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Garage</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGarages.map((garage) => (
                  <TableRow key={garage.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{garage.name}</p>
                        <p className="text-sm text-slate-500">{garage.email}</p>
                        <p className="text-sm text-slate-500">{garage.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start space-x-1">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{garage.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{garage.rating}</span>
                        <span className="text-sm text-slate-500">({garage.reviewCount})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {garage.services.slice(0, 2).map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {garage.services.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{garage.services.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(garage.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {garage.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(garage.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(garage.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>Chỉnh sửa thông tin</DropdownMenuItem>
                            <DropdownMenuItem>Xem đánh giá</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredGarages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Không tìm thấy garage nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
