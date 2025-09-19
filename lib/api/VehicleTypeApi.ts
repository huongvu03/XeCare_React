import axiosClient from "../axiosClient"

export interface VehicleType {
  id: number
  name: string
  description?: string
  isActive: boolean
  createdAt: string
}

export interface VehicleTypeCategory {
  id: number
  name: string
  description?: string
  isActive: boolean
  createdAt: string
}

// Lấy tất cả vehicle types
export const getAllVehicleTypes = () =>
  axiosClient.get<VehicleType[]>("/apis/v1/vehicle")

// Lấy tất cả vehicle type categories
export const getAllVehicleTypeCategories = () =>
  axiosClient.get<VehicleTypeCategory[]>("/apis/v1/vehicle/categories")
