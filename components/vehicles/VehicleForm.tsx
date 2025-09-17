import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
        vehicleName: initialData.vehicleName,
        brand: initialData.brand,
        model: initialData.model,
        year: initialData.year,
        licensePlate: initialData.licensePlate,
        color: initialData.color,
        categoryId: initialData.categoryId,
        vehicleTypeId: initialData.vehicleTypeId,
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]:
        name === "year" //|| name === "categoryId" || name === "vehicleTypeId"
          ? value === "" ? null : Number(value)
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
              value={formData.vehicleName}
              onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
              placeholder="VD: Xe máy Honda của tôi"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-sm font-medium">
              Danh mục
            </Label>
            <Select
              value={formData.categoryId.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: Number(value) })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="0" disabled>Đang tải danh mục...</SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Vehicle Type */}
        <div className="space-y-2">
            <Label htmlFor="vehicleTypeId" className="text-sm font-medium">
              Loại xe
            </Label>
            <Select
              value={formData.vehicleTypeId.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, vehicleTypeId: Number(value) })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Chọn loại xe" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.length === 0 ? (
                  <SelectItem value="0" disabled>Đang tải loại xe...</SelectItem>
                ) : (
                  vehicleTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <span>{type.icon}</span>
                        <span>{type.name}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
