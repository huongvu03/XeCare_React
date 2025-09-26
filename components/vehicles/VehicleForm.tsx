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

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Validation functions
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'vehicleName':
        if (!value || value.trim().length === 0) {
          return 'Vehicle name is required'
        }
        if (value.trim().length < 2) {
          return 'Vehicle name must be at least 2 characters'
        }
        break
      case 'brand':
        if (!value || value.trim().length === 0) {
          return 'Brand is required'
        }
        if (value.trim().length < 2) {
          return 'Brand must be at least 2 characters'
        }
        break
      case 'model':
        if (!value || value.trim().length === 0) {
          return 'Model is required'
        }
        if (value.trim().length < 2) {
          return 'Model must be at least 2 characters'
        }
        break
      case 'licensePlate':
        if (!value || value.trim().length === 0) {
          return 'License plate is required'
        }
        if (value.trim().length < 4) {
          return 'License plate must be at least 4 characters'
        }
        break
      case 'categoryId':
        if (!value || value === 0) {
          return 'Please select a category'
        }
        break
      case 'vehicleTypeId':
        if (!value || value === 0) {
          return 'Please select a vehicle type'
        }
        break
      case 'year':
        if (!value || value < 1990 || value > new Date().getFullYear() + 1) {
          return `Year must be between 1990 and ${new Date().getFullYear() + 1}`
        }
        break
    }
    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof VehicleFormData])
      if (error) {
        newErrors[key] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]:
        name === "year"
          ? value === "" ? new Date().getFullYear() : Number(value)
          : value,
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear error when user makes selection
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    try {
      onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleName" className="text-sm font-medium">
              Vehicle Name *
            </Label>
            <Input
              id="vehicleName"
              name="vehicleName"
              value={formData.vehicleName || ""}
              onChange={handleChange}
              placeholder="e.g., My Honda motorcycle"
              className={`h-10 ${errors.vehicleName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.vehicleName && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicleName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-sm font-medium">
              Category *
            </Label>
            <select 
              className={`w-full h-10 px-3 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.categoryId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
              value={formData.categoryId || ""}
              onChange={(e) => {
                handleSelectChange('categoryId', Number(e.target.value))
              }}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
            )}
          </div>
        </div>
        {/* Vehicle Type */}
        <div className="space-y-2">
            <Label htmlFor="vehicleTypeId" className="text-sm font-medium">
              Vehicle Type *
            </Label>
            <select 
              className={`w-full h-10 px-3 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.vehicleTypeId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
              value={formData.vehicleTypeId || ""}
              onChange={(e) => {
                handleSelectChange('vehicleTypeId', Number(e.target.value))
              }}
            >
              <option value="">Select vehicle type</option>
              {vehicleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.vehicleTypeId && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicleTypeId}</p>
            )}
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-sm font-medium">
              Vehicle Brand *
            </Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand || ""}
              onChange={handleChange}
              placeholder="e.g., Honda, Toyota, Yamaha"
              className={`h-10 ${errors.brand ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="model" className="text-sm font-medium">
              Vehicle Model *
            </Label>
            <Input
              id="model"
              name="model"
              value={formData.model || ""}
              onChange={handleChange}
              placeholder="e.g., Wave Alpha 110cc, Vios 1.5G"
              className={`h-10 ${errors.model ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.model && (
              <p className="text-red-500 text-xs mt-1">{errors.model}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium">
              Year of Manufacture
            </Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={formData.year || new Date().getFullYear()}
              onChange={handleChange}
              min="1990"
              max={new Date().getFullYear() + 1}
              className={`h-10 ${errors.year ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.year && (
              <p className="text-red-500 text-xs mt-1">{errors.year}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate" className="text-sm font-medium">
              License Plate *
            </Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate || ""}
              onChange={(e) => {
                const upperValue = e.target.value.toUpperCase()
                setFormData({ ...formData, licensePlate: upperValue })
                // Clear error when user starts typing
                if (errors.licensePlate) {
                  setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.licensePlate
                    return newErrors
                  })
                }
              }}
              placeholder="e.g., 59H1-12345"
              className={`h-10 font-mono ${errors.licensePlate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.licensePlate && (
              <p className="text-red-500 text-xs mt-1">{errors.licensePlate}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="text-sm font-medium">
            Color
          </Label>
          <Input
            id="color"
            name="color"
            value={formData.color || ""}
            onChange={handleChange}
            placeholder="e.g., Red, Pearl White, Sky Blue"
            className="h-10"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-6"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : (initialData ? "Update" : "Create")}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default VehicleForm
