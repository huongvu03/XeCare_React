import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Category,VehicleType, Vehicle, VehicleFormData } from "@/types/users/userVehicle"
import React, { useEffect, useState } from "react"
interface VehicleFormProps {
  initialData?: Vehicle
  onSubmit: (data: VehicleFormData) => void
  onCancel: () => void
  categories?: Category[]
  vehicleTypes?: VehicleType[]
}

const VehicleForm: React.FC<VehicleFormProps> = ({ initialData, onSubmit, onCancel, categories = [], vehicleTypes = [] }) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleName: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    color: "",
    categoryId: 0,
    vehicleTypeId: 0,

  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicleName: initialData.vehicleName || "",
        brand: initialData.brand || "",
        model: initialData.model || "",
        year: initialData.year || new Date().getFullYear(),
        licensePlate: initialData.licensePlate || "",
        color: initialData.color || "",
        categoryId: initialData.categoryId || 0,
        vehicleTypeId: initialData.vehicleTypeId || 0,
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]:
        name === "year"
          ? value === "" ? new Date().getFullYear() : Number(value)
          : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleName" className="text-sm font-medium">
              Tên xe *
            </Label>
            <Input
              id="vehicleName"
              value={formData.vehicleName || ""}
              onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
              placeholder="VD: Xe máy Honda của tôi"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-sm font-medium">
              Danh mục
            </Label>
            <select 
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.categoryId || ""}
              onChange={(e) => {
                setFormData({ ...formData, categoryId: Number(e.target.value) })
              }}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Vehicle Type */}
        <div className="space-y-2">
            <Label htmlFor="vehicleTypeId" className="text-sm font-medium">
              Loại xe
            </Label>
            <select 
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.vehicleTypeId || ""}
              onChange={(e) => {
                setFormData({ ...formData, vehicleTypeId: Number(e.target.value) })
              }}
            >
              <option value="">Chọn loại xe</option>
              {vehicleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-sm font-medium">
              Hãng xe *
            </Label>
            <Input
              id="brand"
              value={formData.brand || ""}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="VD: Honda, Toyota, Yamaha"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model" className="text-sm font-medium">
              Dòng xe
            </Label>
            <Input
              id="model"
              value={formData.model || ""}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="VD: Wave Alpha 110cc, Vios 1.5G"
              className="h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium">
              Năm sản xuất
            </Label>
            <Input
              id="year"
              type="number"
              value={formData.year || new Date().getFullYear()}
              onChange={(e) =>
                setFormData({ ...formData, year: Number.parseInt(e.target.value) || new Date().getFullYear() })
              }
              min="1990"
              max={new Date().getFullYear() + 1}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate" className="text-sm font-medium">
              Biển số xe *
            </Label>
            <Input
              id="licensePlate"
              value={formData.licensePlate || ""}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
              placeholder="VD: 59H1-12345"
              className="h-10 font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="text-sm font-medium">
            Màu sắc
          </Label>
          <Input
            id="color"
            value={formData.color || ""}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="VD: Đỏ, Trắng ngọc trai, Xanh dương"
            className="h-10"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-6"
          >
            Hủy
          </Button>
          <Button
            className="px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {initialData ? "Cập nhật" : "Tạo mới"}

          </Button>
        </div>
      </div>
    </form>
  )
}

export default VehicleForm
