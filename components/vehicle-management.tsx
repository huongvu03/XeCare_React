"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Edit, Trash2, Plus, Fuel, Settings, FolderPlus, Folder, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  description?: string
  color: string
  icon: string
}

interface Vehicle {
  id: string
  name: string
  type: "car" | "motorcycle" | "truck"
  brand: string
  model: string
  year: number
  licensePlate: string
  color: string
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid"
  categoryId?: string
  lastMaintenance?: string
}

const defaultCategories: Category[] = [
  {
    id: "personal",
    name: "Xe cá nhân",
    description: "Xe sử dụng hàng ngày",
    color: "bg-blue-100 text-blue-800",
    icon: "🚗",
  },
  {
    id: "work",
    name: "Xe công việc",
    description: "Xe phục vụ công việc",
    color: "bg-green-100 text-green-800",
    icon: "🚛",
  },
  {
    id: "family",
    name: "Xe gia đình",
    description: "Xe dùng chung gia đình",
    color: "bg-purple-100 text-purple-800",
    icon: "👨‍👩‍👧‍👦",
  },
]

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Xe máy Honda",
    type: "motorcycle",
    brand: "Honda",
    model: "Wave Alpha",
    year: 2020,
    licensePlate: "59H1-12345",
    color: "Đỏ",
    fuelType: "gasoline",
    categoryId: "personal",
    lastMaintenance: "2024-11-15",
  },
  {
    id: "2",
    name: "Ô tô Toyota",
    type: "car",
    brand: "Toyota",
    model: "Vios",
    year: 2019,
    licensePlate: "51A-98765",
    color: "Trắng",
    fuelType: "gasoline",
    categoryId: "family",
    lastMaintenance: "2024-10-20",
  },
  {
    id: "3",
    name: "Xe tải Hyundai",
    type: "truck",
    brand: "Hyundai",
    model: "Porter",
    year: 2021,
    licensePlate: "51C-11111",
    color: "Xanh",
    fuelType: "diesel",
    categoryId: "work",
    lastMaintenance: "2024-12-01",
  },
]

const vehicleTypes = [
  { value: "car", label: "Ô tô" },
  { value: "motorcycle", label: "Xe máy" },
  { value: "truck", label: "Xe tải" },
]

const fuelTypes = [
  { value: "gasoline", label: "Xăng" },
  { value: "diesel", label: "Dầu diesel" },
  { value: "electric", label: "Điện" },
  { value: "hybrid", label: "Hybrid" },
]

const categoryColors = [
  { value: "bg-blue-100 text-blue-800", label: "Xanh dương" },
  { value: "bg-green-100 text-green-800", label: "Xanh lá" },
  { value: "bg-purple-100 text-purple-800", label: "Tím" },
  { value: "bg-orange-100 text-orange-800", label: "Cam" },
  { value: "bg-red-100 text-red-800", label: "Đỏ" },
  { value: "bg-yellow-100 text-yellow-800", label: "Vàng" },
  { value: "bg-pink-100 text-pink-800", label: "Hồng" },
  { value: "bg-gray-100 text-gray-800", label: "Xám" },
]

const getVehicleTypeIcon = (type: string) => {
  switch (type) {
    case "car":
      return "🚗"
    case "motorcycle":
      return "🏍️"
    case "truck":
      return "🚛"
    default:
      return "🚗"
  }
}

const getVehicleTypeLabel = (type: string) => {
  return vehicleTypes.find((t) => t.value === type)?.label || type
}

const getFuelTypeLabel = (type: string) => {
  return fuelTypes.find((t) => t.value === type)?.label || type
}

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    color: "",
    fuelType: "",
    categoryId: "",
  })
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    color: "bg-blue-100 text-blue-800",
    icon: "🚗",
  })
  const { toast } = useToast()

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      color: "",
      fuelType: "",
      categoryId: "",
    })
  }

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
      color: "bg-blue-100 text-blue-800",
      icon: "🚗",
    })
  }

  const handleAddCategory = () => {
    if (!categoryFormData.name) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên danh mục",
        variant: "destructive",
      })
      return
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryFormData.name,
      description: categoryFormData.description,
      color: categoryFormData.color,
      icon: categoryFormData.icon,
    }

    setCategories([...categories, newCategory])
    setIsCategoryDialogOpen(false)
    resetCategoryForm()
    toast({
      title: "Thành công",
      description: "Đã thêm danh mục mới thành công",
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    // Move vehicles from deleted category to uncategorized
    setVehicles(vehicles.map((v) => (v.categoryId === categoryId ? { ...v, categoryId: undefined } : v)))
    setCategories(categories.filter((c) => c.id !== categoryId))
    if (activeCategory === categoryId) {
      setActiveCategory("all")
    }
    toast({
      title: "Thành công",
      description: "Đã xóa danh mục thành công",
    })
  }

  const handleAdd = () => {
    if (!formData.name || !formData.type || !formData.brand || !formData.licensePlate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type as Vehicle["type"],
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      licensePlate: formData.licensePlate,
      color: formData.color,
      fuelType: formData.fuelType as Vehicle["fuelType"],
      categoryId: formData.categoryId || undefined,
    }

    setVehicles([...vehicles, newVehicle])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Thành công",
      description: "Đã thêm xe mới thành công",
    })
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      color: vehicle.color,
      fuelType: vehicle.fuelType,
      categoryId: vehicle.categoryId || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!formData.name || !formData.type || !formData.brand || !formData.licensePlate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

    if (!editingVehicle) return

    const updatedVehicle: Vehicle = {
      ...editingVehicle,
      name: formData.name,
      type: formData.type as Vehicle["type"],
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      licensePlate: formData.licensePlate,
      color: formData.color,
      fuelType: formData.fuelType as Vehicle["fuelType"],
      categoryId: formData.categoryId || undefined,
    }

    setVehicles(vehicles.map((v) => (v.id === editingVehicle.id ? updatedVehicle : v)))
    setIsEditDialogOpen(false)
    setEditingVehicle(null)
    resetForm()
    toast({
      title: "Thành công",
      description: "Đã cập nhật thông tin xe thành công",
    })
  }

  const handleDelete = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id))
    toast({
      title: "Thành công",
      description: "Đã xóa xe thành công",
    })
  }

  const getFilteredVehicles = () => {
    if (activeCategory === "all") return vehicles
    if (activeCategory === "uncategorized") return vehicles.filter((v) => !v.categoryId)
    return vehicles.filter((v) => v.categoryId === activeCategory)
  }

  const getVehiclesByCategory = (categoryId: string) => {
    return vehicles.filter((v) => v.categoryId === categoryId)
  }

  const getUncategorizedVehicles = () => {
    return vehicles.filter((v) => !v.categoryId)
  }

  const VehicleForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên xe *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Xe máy Honda của tôi"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Danh mục</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uncategorized">Không phân loại</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Loại xe *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại xe" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Hãng xe *</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="VD: Honda, Toyota"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">Dòng xe</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="VD: Wave Alpha, Vios"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Năm sản xuất</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: Number.parseInt(e.target.value) || new Date().getFullYear() })
            }
            min="1990"
            max={new Date().getFullYear() + 1}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="licensePlate">Biển số xe *</Label>
          <Input
            id="licensePlate"
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
            placeholder="VD: 59H1-12345"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Màu sắc</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="VD: Đỏ, Trắng, Xanh"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fuelType">Loại nhiên liệu</Label>
        <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại nhiên liệu" />
          </SelectTrigger>
          <SelectContent>
            {fuelTypes.map((fuel) => (
              <SelectItem key={fuel.value} value={fuel.value}>
                {fuel.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false)
              setEditingVehicle(null)
            } else {
              setIsAddDialogOpen(false)
            }
            resetForm()
          }}
        >
          Hủy
        </Button>
        <Button onClick={isEdit ? handleUpdate : handleAdd}>{isEdit ? "Cập nhật" : "Thêm xe"}</Button>
      </div>
    </div>
  )

  const CategoryForm = () => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="categoryName">Tên danh mục *</Label>
        <Input
          id="categoryName"
          value={categoryFormData.name}
          onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
          placeholder="VD: Xe cá nhân, Xe công việc"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryDescription">Mô tả</Label>
        <Input
          id="categoryDescription"
          value={categoryFormData.description}
          onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
          placeholder="Mô tả ngắn về danh mục"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryColor">Màu sắc</Label>
          <Select
            value={categoryFormData.color}
            onValueChange={(value) => setCategoryFormData({ ...categoryFormData, color: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn màu" />
            </SelectTrigger>
            <SelectContent>
              {categoryColors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${color.value}`} />
                    <span>{color.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryIcon">Icon</Label>
          <Input
            id="categoryIcon"
            value={categoryFormData.icon}
            onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
            placeholder="🚗"
            maxLength={2}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsCategoryDialogOpen(false)
            resetCategoryForm()
          }}
        >
          Hủy
        </Button>
        <Button onClick={handleAddCategory}>Thêm danh mục</Button>
      </div>
    </div>
  )

  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
    const category = categories.find((c) => c.id === vehicle.categoryId)

    return (
      <Card className="border-slate-200 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{getVehicleTypeIcon(vehicle.type)}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-slate-900">{vehicle.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {getVehicleTypeLabel(vehicle.type)}
                  </Badge>
                  {category && (
                    <Badge className={`text-xs ${category.color}`}>
                      <span className="mr-1">{category.icon}</span>
                      {category.name}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                  <div>
                    <p className="font-medium">Hãng xe</p>
                    <p>
                      {vehicle.brand} {vehicle.model}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Biển số</p>
                    <p className="font-mono">{vehicle.licensePlate}</p>
                  </div>
                  <div>
                    <p className="font-medium">Năm SX</p>
                    <p>{vehicle.year}</p>
                  </div>
                  <div>
                    <p className="font-medium">Màu sắc</p>
                    <p>{vehicle.color || "Chưa cập nhật"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <Fuel className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{getFuelTypeLabel(vehicle.fuelType)}</span>
                  </div>
                  {vehicle.lastMaintenance && (
                    <div className="flex items-center space-x-1">
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        Bảo dưỡng: {new Date(vehicle.lastMaintenance).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(vehicle)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(vehicle.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-600 mb-2">
            Quản lý thông tin các phương tiện của bạn theo danh mục để dễ dàng tổ chức
          </p>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <span>Tổng cộng: {vehicles.length} xe</span>
            <span>•</span>
            <span>{categories.length} danh mục</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                Thêm danh mục
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục mới</DialogTitle>
              </DialogHeader>
              <CategoryForm />
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                <Plus className="h-4 w-4 mr-2" />
                Thêm xe mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm xe mới</DialogTitle>
              </DialogHeader>
              <VehicleForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-auto gap-1 h-auto p-1">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Folder className="h-4 w-4" />
            <span>Tất cả ({vehicles.length})</span>
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
              <span>{category.icon}</span>
              <span>
                {category.name} ({getVehiclesByCategory(category.id).length})
              </span>
            </TabsTrigger>
          ))}
          {getUncategorizedVehicles().length > 0 && (
            <TabsTrigger value="uncategorized" className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Chưa phân loại ({getUncategorizedVehicles().length})</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryVehicles = getVehiclesByCategory(category.id)
              if (categoryVehicles.length === 0) return null

              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-slate-900">{category.name}</h3>
                        {category.description && <p className="text-sm text-slate-600">{category.description}</p>}
                      </div>
                      <Badge className={category.color}>{categoryVehicles.length} xe</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {categoryVehicles.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                </div>
              )
            })}

            {getUncategorizedVehicles().length > 0 && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Tag className="h-5 w-5 text-slate-400" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Chưa phân loại</h3>
                    <p className="text-sm text-slate-600">Các xe chưa được phân vào danh mục nào</p>
                  </div>
                  <Badge variant="secondary">{getUncategorizedVehicles().length} xe</Badge>
                </div>
                <div className="grid gap-4">
                  {getUncategorizedVehicles().map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{category.name}</h3>
                    {category.description && <p className="text-sm text-slate-600">{category.description}</p>}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa danh mục
                </Button>
              </div>

              {getVehiclesByCategory(category.id).length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">{category.icon}</span>
                  <p className="text-slate-500">Chưa có xe nào trong danh mục này</p>
                  <p className="text-sm text-slate-400">Thêm xe mới hoặc chuyển xe từ danh mục khác</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {getVehiclesByCategory(category.id).map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="uncategorized" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Tag className="h-5 w-5 text-slate-400" />
              <div>
                <h3 className="font-semibold text-slate-900">Xe chưa phân loại</h3>
                <p className="text-sm text-slate-600">Các xe chưa được phân vào danh mục nào</p>
              </div>
            </div>

            {getUncategorizedVehicles().length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Tất cả xe đã được phân loại</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {getUncategorizedVehicles().map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có xe nào</h3>
          <p className="text-slate-500 mb-6">Thêm xe đầu tiên để bắt đầu quản lý phương tiện của bạn</p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <Plus className="h-4 w-4 mr-2" />
            Thêm xe đầu tiên
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin xe</DialogTitle>
          </DialogHeader>
          <VehicleForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
