"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Search, Star, Eye, Check, X, Flag, MessageSquare } from "lucide-react"

// Mock data
const mockReviews = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    garage: "Garage Thành Công",
    rating: 5,
    comment: "Dịch vụ tuyệt vời, nhân viên thân thiện và chuyên nghiệp. Xe được sửa chữa rất tốt.",
    date: "2024-12-20",
    status: "approved",
    images: ["image1.jpg"],
  },
  {
    id: 2,
    user: "Trần Thị B",
    garage: "Garage ABC",
    rating: 1,
    comment: "Dịch vụ tệ, thái độ không tốt. Không khuyến khích sử dụng.",
    date: "2024-12-19",
    status: "pending",
    images: [],
    reported: true,
  },
  {
    id: 3,
    user: "Lê Văn C",
    garage: "Garage XYZ",
    rating: 4,
    comment: "Garage ổn, giá cả hợp lý. Tuy nhiên thời gian chờ hơi lâu.",
    date: "2024-12-18",
    status: "approved",
    images: [],
  },
  {
    id: 4,
    user: "Phạm Thị D",
    garage: "Garage 24/7",
    rating: 5,
    comment: "Cứu hộ nhanh chóng, kỹ thuật viên giỏi. Rất hài lòng với dịch vụ.",
    date: "2024-12-17",
    status: "approved",
    images: ["image2.jpg", "image3.jpg"],
  },
  {
    id: 5,
    user: "Hoàng Văn E",
    garage: "Garage Pro",
    rating: 2,
    comment: "Chất lượng không như mong đợi, giá hơi cao so với chất lượng.",
    date: "2024-12-16",
    status: "rejected",
    images: [],
  },
]

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<any>(null)

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.garage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter

    return matchesSearch && matchesStatus && matchesRating
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Đã duyệt</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Từ chối</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Không xác định</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const handleApprove = (reviewId: number) => {
    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, status: "approved" } : review)))
  }

  const handleReject = (reviewId: number) => {
    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, status: "rejected" } : review)))
  }

  const stats = {
    total: reviews.length,
    approved: reviews.filter((r) => r.status === "approved").length,
    pending: reviews.filter((r) => r.status === "pending").length,
    reported: reviews.filter((r) => r.reported).length,
  }

  return (
    <DashboardLayout
      allowedRoles={["ADMIN"]}
      title="Quản lý đánh giá"
      description="Kiểm duyệt và quản lý đánh giá từ người dùng"
    >
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card className="border-blue-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-slate-600">Tổng đánh giá</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-sm text-slate-600">Đã duyệt</p>
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
              <p className="text-2xl font-bold text-red-600">{stats.reported}</p>
              <p className="text-sm text-slate-600">Bị báo cáo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Danh sách đánh giá</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo người dùng, garage hoặc nội dung..."
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
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>

            {/* Rating Filter */}
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Lọc theo sao" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đánh giá</SelectItem>
                <SelectItem value="5">5 sao</SelectItem>
                <SelectItem value="4">4 sao</SelectItem>
                <SelectItem value="3">3 sao</SelectItem>
                <SelectItem value="2">2 sao</SelectItem>
                <SelectItem value="1">1 sao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reviews Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người đánh giá</TableHead>
                  <TableHead>Garage</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{review.user}</p>
                        <p className="text-sm text-slate-500">{review.date}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-slate-700">{review.garage}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-slate-600 truncate">{review.comment}</p>
                        {review.images.length > 0 && (
                          <p className="text-xs text-blue-600 mt-1">{review.images.length} hình ảnh</p>
                        )}
                        {review.reported && (
                          <Badge className="bg-red-100 text-red-700 mt-1">
                            <Flag className="h-3 w-3 mr-1" />
                            Bị báo cáo
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedReview(review)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Chi tiết đánh giá</DialogTitle>
                            </DialogHeader>
                            {selectedReview && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-slate-700">Người đánh giá:</p>
                                    <p className="text-slate-900">{selectedReview.user}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-700">Garage:</p>
                                    <p className="text-slate-900">{selectedReview.garage}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-700">Đánh giá:</p>
                                    <div className="flex items-center space-x-1">
                                      {renderStars(selectedReview.rating)}
                                      <span className="ml-2">{selectedReview.rating}/5</span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-700">Ngày:</p>
                                    <p className="text-slate-900">{selectedReview.date}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700 mb-2">Nội dung:</p>
                                  <Textarea value={selectedReview.comment} readOnly className="min-h-[100px]" />
                                </div>
                                {selectedReview.images.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">Hình ảnh:</p>
                                    <div className="grid grid-cols-3 gap-2">
                                      {selectedReview.images.map((image: string, index: number) => (
                                        <div
                                          key={index}
                                          className="w-full h-24 bg-slate-200 rounded-lg flex items-center justify-center"
                                        >
                                          <span className="text-slate-500 text-sm">{image}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {review.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(review.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(review.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Không tìm thấy đánh giá nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
