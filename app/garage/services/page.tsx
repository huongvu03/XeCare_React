"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Plus, Edit, Trash2, Search, Wrench, DollarSign, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  isActive: boolean
}

export default function GarageServicesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Thay nhớt xe máy",
      description: "Thay nhớt và lọc nhớt cho xe máy các loại",
      price: 150000,
      duration: 30,
      category: "Bảo dưỡng",
      isActive: true,
    },
    {
      id: "2",
      name: "Sửa phanh xe máy",
      description: "Kiểm tra và sửa chữa hệ thống phanh xe máy",
      price: 200000,
      duration: 45,
      category: "Sửa chữa",
      isActive: true,
    },
    {
      id: "3",
      name: "Thay nhớt ô tô",
      description: "Thay nhớt và bảo dưỡng động cơ ô tô",
      price: 300000,
      duration: 60,
      category: "Bảo dưỡng",
      isActive: true,
    },
    {
      id: "4",
      name: "Cứu hộ khẩn cấp",
      description: "Dịch vụ cứu hộ xe 24/7",
      price: 500000,
      duration: 120,
      category: "Cứu hộ",
      isActive: false,
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "Bảo dưỡng",
    isActive: true,
  })

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.duration) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin!",
        variant: "destructive",
      })
      return
    }

    const serviceData = {
      id: editingService?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: Number.parseInt(formData.price),
      duration: Number.parseInt(formData.duration),
      category: formData.category,
      isActive: formData.isActive,
    }

    if (editingService) {
      setServices((prev) => prev.map((s) => (s.id === editingService.id ? serviceData : s)))
      toast({
        title: "Thành công",
        description: "Dịch vụ đã được cập nhật!",
      })
    } else {
      setServices((prev) => [...prev, serviceData])
      toast({
        title: "Thành công",
        description: "Dịch vụ mới đã được thêm!",
      })
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: "Bảo dưỡng",
      isActive: true,
    })
    setEditingService(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      isActive: service.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id))
    toast({
      title: "Thành công",
      description: "Dịch vụ đã được xóa!",
    })
  }

  const toggleServiceStatus = (id: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)))
  }

  return (
    <DashboardLayout
      allowedRoles={["garage"]}
      title="Quản lý Dịch vụ"
      description="Quản lý các dịch vụ mà garage cung cấp"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm dịch vụ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}</DialogTitle>
              <DialogDescription>
                {editingService ? "Cập nhật thông tin dịch vụ" : "Điền thông tin dịch vụ mới"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Tên dịch vụ</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên dịch vụ"
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết dịch vụ"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Giá (VNĐ)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Thời gian (phút)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bảo dưỡng">Bảo dưỡng</option>
                  <option value="Sửa chữa">Sửa chữa</option>
                  <option value="Cứu hộ">Cứu hộ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Hủy
              </Button>
              <Button onClick={handleSubmit}>{editingService ? "Cập nhật" : "Thêm"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className={`border-blue-100 ${!service.isActive ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <span>{service.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        service.category === "Bảo dưỡng"
                          ? "bg-green-100 text-green-700"
                          : service.category === "Sửa chữa"
                            ? "bg-orange-100 text-orange-700"
                            : service.category === "Cứu hộ"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {service.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        service.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {service.isActive ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">{service.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-green-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">{service.price.toLocaleString()} VNĐ</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration} phút</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(service)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant={service.isActive ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleServiceStatus(service.id)}
                  className={service.isActive ? "" : "bg-green-600 hover:bg-green-700"}
                >
                  {service.isActive ? "Tạm dừng" : "Kích hoạt"}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa dịch vụ "{service.name}"? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(service.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card className="border-blue-100">
          <CardContent className="text-center py-12">
            <Wrench className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Không tìm thấy dịch vụ</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? "Không có dịch vụ nào phù hợp với từ khóa tìm kiếm" : "Chưa có dịch vụ nào được thêm"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                <Plus className="h-4 w-4 mr-2" />
                Thêm dịch vụ đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
