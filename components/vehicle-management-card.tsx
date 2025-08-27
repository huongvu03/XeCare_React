"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Edit, Trash2, Plus, Settings, Folder, Tag, Eye, Search } from "lucide-react"
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
  nextMaintenance?: string
  mileage?: number
  isLocked?: boolean
  lockReason?: string
  dateAdded?: string
}

// Predefined categories - cannot be modified
const predefinedCategories: Category[] = [
  {
    id: "personal",
    name: "Xe cá nhân",
    description: "Xe sử dụng hàng ngày",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "🚗",
  },
  {
    id: "work",
    name: "Xe công việc",
    description: "Xe phục vụ công việc",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "🚛",
  },
  {
    id: "family",
    name: "Xe gia đình",
    description: "Xe dùng chung gia đình",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "business",
    name: "Xe kinh doanh",
    description: "Xe phục vụ kinh doanh",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "💼",
  },
  {
    id: "rental",
    name: "Xe cho thuê",
    description: "Xe dùng để cho thuê",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "🔑",
  },
]

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Xe máy Honda Wave",
    type: "motorcycle",
    brand: "Honda",
    model: "Wave Alpha 110cc",
    year: 2022,
    licensePlate: "59H1-12345",
    color: "Đỏ",
    fuelType: "gasoline",
    categoryId: "personal",
    lastMaintenance: "2024-11-15",
    nextMaintenance: "2025-02-15",
    mileage: 15000,
    dateAdded: "2024-01-15",
    isLocked: false,
  },
  {
    id: "2",
    name: "Ô tô Toyota Vios",
    type: "car",
    brand: "Toyota",
    model: "Vios 1.5G CVT",
    year: 2021,
    licensePlate: "51A-98765",
    color: "Trắng ngọc trai",
    fuelType: "gasoline",
    categoryId: "family",
    lastMaintenance: "2024-10-20",
    nextMaintenance: "2025-01-20",
    mileage: 25000,
    dateAdded: "2024-02-10",
    isLocked: false,
  },
  {
    id: "3",
    name: "Xe tải Hyundai Porter",
    type: "truck",
    brand: "Hyundai",
    model: "Porter H150",
    year: 2020,
    licensePlate: "51C-11111",
    color: "Xanh dương",
    fuelType: "diesel",
    categoryId: "work",
    lastMaintenance: "2024-12-01",
    nextMaintenance: "2025-03-01",
    mileage: 45000,
    dateAdded: "2024-03-05",
    isLocked: false,
  },
]

const vehicleTypes = [
  { value: "car", label: "Ô tô", icon: "🚗" },
  { value: "motorcycle", label: "Xe máy", icon: "🏍️" },
  { value: "truck", label: "Xe tải", icon: "🚛" },
]

const fuelTypes = [
  { value: "gasoline", label: "Xăng", icon: "⛽" },
  { value: "diesel", label: "Dầu diesel", icon: "🛢️" },
  { value: "electric", label: "Điện", icon: "🔋" },
  { value: "hybrid", label: "Hybrid", icon: "🔋⛽" },
]

const lockReasons = [
  "Đã bán xe",
  "Xe hỏng nặng",
  "Bảo dưỡng lâu dài",
  "Không sử dụng tạm thời",
  "Chờ sửa chữa",
  "Xe cũ không dùng",
  "Lý do khác",
]

const getVehicleTypeIcon = (type: string) => {
  return vehicleTypes.find((t) => t.value === type)?.icon || "🚗"
}

const getVehicleTypeLabel = (type: string) => {
  return vehicleTypes.find((t) => t.value === type)?.label || type
}

const getFuelTypeLabel = (type: string) => {
  return fuelTypes.find((t) => t.value === type)?.label || type
}

const getFuelTypeIcon = (type: string) => {
  return fuelTypes.find((t) => t.value === type)?.icon || "⛽"
}

interface VehicleManagementProps {
  showCategories?: boolean
  allowDelete?: boolean
  allowLock?: boolean
  showSortFilter?: boolean
}

export function VehicleManagement({
  showCategories = true,
  allowDelete = true,
  allowLock = false,
  showSortFilter = false,
}: VehicleManagementProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null)
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
    mileage: 0,
  })
  const [sortBy, setSortBy] = useState<"name" | "brand" | "year" | "type" | "dateAdded">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterByType, setFilterByType] = useState<string>("all")
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false)
  const [lockingVehicle, setLockingVehicle] = useState<Vehicle | null>(null)
  const [lockReason, setLockReason] = useState("")
  const [showLocked, setShowLocked] = useState<"all" | "active" | "locked">("active")
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
      mileage: 0,
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
      mileage: formData.mileage,
      nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 months from now
      dateAdded: new Date().toISOString().split("T")[0],
      isLocked: false,
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
      mileage: vehicle.mileage || 0,
    })
    setIsEditDialogOpen(true)
  }

  const handleView = (vehicle: Vehicle) => {
    setViewingVehicle(vehicle)
    setIsViewDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id))
    toast({
      title: "Thành công",
      description: "Đã xóa xe thành công",
    })
  }

  const handleLock = (vehicle: Vehicle) => {
    setLockingVehicle(vehicle)
    setIsLockDialogOpen(true)
  }

  const handleConfirmLock = () => {
    if (!lockingVehicle) return

    const updatedVehicle: Vehicle = {
      ...lockingVehicle,
      isLocked: true,
      lockReason: lockReason || "Không có lý do",
    }

    setVehicles(vehicles.map((v) => (v.id === lockingVehicle.id ? updatedVehicle : v)))
    setIsLockDialogOpen(false)
    setLockingVehicle(null)
    setLockReason("")
    toast({
      title: "Thành công",
      description: "Đã khóa xe thành công",
    })
  }

  const handleUnlock = (id: string) => {
    setVehicles(vehicles.map((v) => (v.id === id ? { ...v, isLocked: false, lockReason: undefined } : v)))
    toast({
      title: "Thành công",
      description: "Đã mở khóa xe thành công",
    })
  }

  const handleUpdate = () => {
    if (!editingVehicle || !formData.name || !formData.type || !formData.brand || !formData.licensePlate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

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
      mileage: formData.mileage,
    }

    setVehicles(vehicles.map((v) => (v.id === editingVehicle.id ? updatedVehicle : v)))
    setIsEditDialogOpen(false)
    setEditingVehicle(null)
    resetForm()
    toast({
      title: "Thành công",
      description: "Đã cập nhật xe thành công",
    })
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setActiveCategory("all")
    setFilterByType("all")
    setShowLocked("all")
    setSortBy("name")
    setSortOrder("asc")
    toast({
      title: "Đã xóa bộ lọc",
      description: "Hiển thị tất cả xe",
    })
  }

  const getFilteredVehicles = () => {
    let filtered = vehicles

    // Filter by category
    if (activeCategory === "uncategorized") {
      filtered = filtered.filter((v) => !v.categoryId)
    } else if (activeCategory !== "all") {
      filtered = filtered.filter((v) => v.categoryId === activeCategory)
    }

    // Filter by type
    if (filterByType !== "all") {
      filtered = filtered.filter((v) => v.type === filterByType)
    }

    // Filter by locked status
    if (showLocked === "active") {
      filtered = filtered.filter((v) => !v.isLocked)
    } else if (showLocked === "locked") {
      filtered = filtered.filter((v) => v.isLocked)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "brand":
          aValue = a.brand.toLowerCase()
          bValue = b.brand.toLowerCase()
          break
        case "year":
          aValue = a.year
          bValue = b.year
          break
        case "type":
          aValue = a.type
          bValue = b.type
          break
        case "dateAdded":
          aValue = new Date(a.dateAdded || "2024-01-01")
          bValue = new Date(b.dateAdded || "2024-01-01")
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }

  const getVehiclesByCategory = (categoryId: string) => {
    return vehicles.filter((v) => v.categoryId === categoryId)
  }

  const getUncategorizedVehicles = () => {
    return vehicles.filter((v) => !v.categoryId)
  }

  const VehicleForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Tên xe *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Xe máy Honda của tôi"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Danh mục
          </Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Không phân loại</SelectItem>
              {predefinedCategories.map((category) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">
            Loại xe *
          </Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Chọn loại xe" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center space-x-2">
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm font-medium">
            Hãng xe *
          </Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="VD: Honda, Toyota, Yamaha"
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">
            Dòng xe
          </Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="VD: Wave Alpha 110cc, Vios 1.5G"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium">
            Năm sản xuất
          </Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: Number.parseInt(e.target.value) || new Date().getFullYear() })
            }
            min="1990"
            max={new Date().getFullYear() + 1}
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="licensePlate" className="text-sm font-medium">
            Biển số xe *
          </Label>
          <Input
            id="licensePlate"
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
            placeholder="VD: 59H1-12345"
            className="h-10 font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color" className="text-sm font-medium">
            Màu sắc
          </Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="VD: Đỏ, Trắng ngọc trai, Xanh dương"
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fuelType" className="text-sm font-medium">
            Loại nhiên liệu
          </Label>
          <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Chọn loại nhiên liệu" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((fuel) => (
                <SelectItem key={fuel.value} value={fuel.value}>
                  <div className="flex items-center space-x-2">
                    <span>{fuel.icon}</span>
                    <span>{fuel.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage" className="text-sm font-medium">
            Số km đã đi
          </Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage}
            onChange={(e) => setFormData({ ...formData, mileage: Number.parseInt(e.target.value) || 0 })}
            placeholder="VD: 15000"
            min="0"
            className="h-10"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
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
          className="px-6"
        >
          Hủy
        </Button>
        <Button
          onClick={isEdit ? handleUpdate : handleAdd}
          className="px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          {isEdit ? "Cập nhật" : "Thêm xe"}
        </Button>
      </div>
    </div>
  )

  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
    const category = predefinedCategories.find((c) => c.id === vehicle.categoryId)
    const isMaintenanceDue = vehicle.nextMaintenance && new Date(vehicle.nextMaintenance) <= new Date()

    return (
      <Card
        className={`border-slate-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300 ${vehicle.isLocked ? "opacity-60 bg-gray-50" : ""}`}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className={`text-3xl p-2 bg-slate-50 rounded-lg ${vehicle.isLocked ? "grayscale" : ""}`}>
                {getVehicleTypeIcon(vehicle.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="font-semibold text-slate-900 truncate">{vehicle.name}</h3>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {getVehicleTypeLabel(vehicle.type)}
                  </Badge>
                  {vehicle.isLocked && (
                    <Badge variant="destructive" className="text-xs shrink-0">
                      🔒 Đã khóa
                    </Badge>
                  )}
                  {category && (
                    <Badge className={`text-xs shrink-0 ${category.color}`}>
                      <span className="mr-1">{category.icon}</span>
                      {category.name}
                    </Badge>
                  )}
                  {isMaintenanceDue && !vehicle.isLocked && (
                    <Badge variant="destructive" className="text-xs shrink-0">
                      Cần bảo dưỡng
                    </Badge>
                  )}
                </div>

                {vehicle.isLocked && vehicle.lockReason && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Lý do khóa:</strong> {vehicle.lockReason}
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                  <div>
                    <p className="font-medium text-slate-800">Hãng xe</p>
                    <p className="truncate">
                      {vehicle.brand} {vehicle.model}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Biển số</p>
                    <p className="font-mono font-medium text-slate-900">{vehicle.licensePlate}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Năm SX</p>
                    <p>{vehicle.year}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Màu sắc</p>
                    <p className="truncate">{vehicle.color || "Chưa cập nhật"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getFuelTypeIcon(vehicle.fuelType)}</span>
                    <span className="text-slate-600">{getFuelTypeLabel(vehicle.fuelType)}</span>
                  </div>
                  {vehicle.mileage && (
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                  )}
                  {vehicle.nextMaintenance && !vehicle.isLocked && (
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span className={`text-sm ${isMaintenanceDue ? "text-red-600 font-medium" : "text-slate-600"}`}>
                        BĐ: {new Date(vehicle.nextMaintenance).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button size="sm" variant="outline" onClick={() => handleView(vehicle)} className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
              {!vehicle.isLocked && (
                <Button size="sm" variant="outline" onClick={() => handleEdit(vehicle)} className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {allowDelete && !vehicle.isLocked && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(vehicle.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              {allowLock && !vehicle.isLocked && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleLock(vehicle)}
                  className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  🔒
                </Button>
              )}
              {vehicle.isLocked && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUnlock(vehicle.id)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  🔓
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const VehicleDetailView = ({ vehicle }: { vehicle: Vehicle }) => {
    const category = predefinedCategories.find((c) => c.id === vehicle.categoryId)
    const isMaintenanceDue = vehicle.nextMaintenance && new Date(vehicle.nextMaintenance) <= new Date()

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="text-4xl p-3 bg-slate-50 rounded-xl">{getVehicleTypeIcon(vehicle.type)}</div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{vehicle.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">{getVehicleTypeLabel(vehicle.type)}</Badge>
              {category && (
                <Badge className={category.color}>
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Hãng xe:</span>
                <span className="font-medium">{vehicle.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Dòng xe:</span>
                <span className="font-medium">{vehicle.model || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Năm sản xuất:</span>
                <span className="font-medium">{vehicle.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Biển số:</span>
                <span className="font-mono font-medium">{vehicle.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Màu sắc:</span>
                <span className="font-medium">{vehicle.color || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nhiên liệu:</span>
                <span className="font-medium flex items-center space-x-1">
                  <span>{getFuelTypeIcon(vehicle.fuelType)}</span>
                  <span>{getFuelTypeLabel(vehicle.fuelType)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Thông tin bảo dưỡng</h3>
            <div className="space-y-3">
              {vehicle.mileage && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Số km đã đi:</span>
                  <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                </div>
              )}
              {vehicle.lastMaintenance && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Bảo dưỡng cuối:</span>
                  <span className="font-medium">{new Date(vehicle.lastMaintenance).toLocaleDateString("vi-VN")}</span>
                </div>
              )}
              {vehicle.nextMaintenance && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Bảo dưỡng tiếp theo:</span>
                  <span className={`font-medium ${isMaintenanceDue ? "text-red-600" : ""}`}>
                    {new Date(vehicle.nextMaintenance).toLocaleDateString("vi-VN")}
                    {isMaintenanceDue && <span className="ml-2 text-xs">(Đã đến hạn)</span>}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const filteredVehicles = getFilteredVehicles()

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm xe theo tên, hãng, model, biển số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Thêm xe mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Thêm xe mới</DialogTitle>
              </DialogHeader>
              <VehicleForm />
            </DialogContent>
          </Dialog>
        </div>

        {showSortFilter && (
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Tên xe</SelectItem>
                <SelectItem value="brand">Hãng xe</SelectItem>
                <SelectItem value="year">Năm sản xuất</SelectItem>
                <SelectItem value="type">Loại xe</SelectItem>
                <SelectItem value="dateAdded">Ngày thêm</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-10 px-3"
              title={`Sắp xếp ${sortOrder === "asc" ? "tăng dần" : "giảm dần"}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>

            <Select value={filterByType} onValueChange={setFilterByType}>
              <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Loại xe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={showLocked} onValueChange={(value: any) => setShowLocked(value)}>
              <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Xe hoạt động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả xe</SelectItem>
                <SelectItem value="active">
                  <div className="flex items-center space-x-2">
                    <span>🔓</span>
                    <span>Xe hoạt động</span>
                  </div>
                </SelectItem>
                <SelectItem value="locked">
                  <div className="flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Xe đã khóa</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="h-10 px-4 text-slate-600 hover:text-slate-900 bg-transparent"
              title="Xóa tất cả bộ lọc"
            >
              <span className="mr-2">🔄</span>
              Hiển thị tất cả
            </Button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
        <div className="flex items-center space-x-6 flex-wrap">
          <span>
            Tổng cộng: <strong className="text-slate-900">{vehicles.length}</strong> xe
          </span>
          <span>
            Hiển thị: <strong className="text-slate-900">{filteredVehicles.length}</strong> xe
          </span>
          <span>
            Hoạt động: <strong className="text-green-700">{vehicles.filter((v) => !v.isLocked).length}</strong> xe
          </span>
          <span>
            Đã khóa: <strong className="text-red-700">{vehicles.filter((v) => v.isLocked).length}</strong> xe
          </span>
          {predefinedCategories.map((category) => {
            const count = getVehiclesByCategory(category.id).length
            if (count === 0) return null
            return (
              <span key={category.id}>
                {category.icon} {category.name}: <strong className="text-slate-900">{count}</strong>
              </span>
            )
          })}
        </div>
      </div>

      {/* Category Tabs */}
      {showCategories && (
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-auto gap-1 h-auto p-1 bg-slate-100">
            <TabsTrigger value="all" className="flex items-center space-x-2 data-[state=active]:bg-white">
              <Folder className="h-4 w-4" />
              <span>Tất cả ({vehicles.length})</span>
            </TabsTrigger>
            {predefinedCategories.map((category) => {
              const count = getVehiclesByCategory(category.id).length
              if (count === 0) return null
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center space-x-2 data-[state=active]:bg-white"
                >
                  <span>{category.icon}</span>
                  <span>
                    {category.name} ({count})
                  </span>
                </TabsTrigger>
              )
            })}
            {getUncategorizedVehicles().length > 0 && (
              <TabsTrigger value="uncategorized" className="flex items-center space-x-2 data-[state=active]:bg-white">
                <Tag className="h-4 w-4" />
                <span>Chưa phân loại ({getUncategorizedVehicles().length})</span>
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      )}

      {/* Vehicle List */}
      <div className="space-y-4">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm ? "Không tìm thấy xe nào" : "Chưa có xe nào"}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm
                ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                : "Thêm xe đầu tiên để bắt đầu quản lý phương tiện của bạn"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm xe đầu tiên
              </Button>
            )}
          </div>
        ) : (
          filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin xe</DialogTitle>
          </DialogHeader>
          <VehicleForm isEdit={true} />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết xe</DialogTitle>
          </DialogHeader>
          {viewingVehicle && <VehicleDetailView vehicle={viewingVehicle} />}
        </DialogContent>
      </Dialog>

      {/* Lock Dialog */}
      <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Khóa xe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Bạn có chắc chắn muốn khóa xe <strong>{lockingVehicle?.name}</strong>?
            </p>
            <div className="space-y-2">
              <Label htmlFor="lockReason">Lý do khóa</Label>
              <Select value={lockReason} onValueChange={setLockReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lý do khóa" />
                </SelectTrigger>
                <SelectContent>
                  {lockReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {lockReason === "Lý do khác" && (
                <Input
                  placeholder="Nhập lý do cụ thể..."
                  value={lockReason === "Lý do khác" ? "" : lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                />
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsLockDialogOpen(false)
                  setLockingVehicle(null)
                  setLockReason("")
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleConfirmLock} disabled={!lockReason} className="bg-orange-600 hover:bg-orange-700">
                Khóa xe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
