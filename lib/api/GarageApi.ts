// lib/api/GarageApi.ts
import axiosClient from "../axiosClient"

export interface DaySchedule {
  isOpen?: boolean  // TypeScript interface format
  open?: boolean    // Database format
  openTime: string
  closeTime: string
}

export interface OperatingHours {
  defaultOpenTime: string
  defaultCloseTime: string
  useCustomSchedule: boolean
  customSchedule?: {
    [key: string]: DaySchedule
  }
}

export interface Garage {
  id: number
  name: string
  address: string
  phone: string
  email: string
  description?: string
  imageUrl?: string
  latitude: number
  longitude: number
  openTime: string
  closeTime: string
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "PENDING_UPDATE"
  isVerified: boolean
  createdAt: string
  distance?: number
  services?: GarageService[]
  vehicleTypes?: GarageVehicleType[]
  ownerId: number
  operatingHours?: OperatingHours
}

export interface GarageService {
  id: number
  serviceId: number
  serviceName: string
  description: string
  basePrice: number
  estimatedTimeMinutes: number
  isActive: boolean
}

export interface GarageVehicleType {
  id: number
  vehicleTypeId: number
  vehicleTypeName: string
  vehicleTypeDescription: string
  isActive: boolean
}

export interface NearbyGarageRequest {
  latitude: number
  longitude: number
  radius?: number
  page?: number
  size?: number
}

export interface GarageSearchResponse {
  content: Garage[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// Tìm garage gần nhất
export const findNearbyGarages = (params: NearbyGarageRequest) =>
  axiosClient.get<GarageSearchResponse>("/apis/garage/nearby/paginated", { params })

// Tìm garage gần nhất (simple version)
export const getNearbyGarages = (latitude: number, longitude: number, radius: number = 10) =>
  axiosClient.get<Garage[]>("/apis/garage/nearby", { 
    params: { latitude, longitude, radius } 
  })

// Lấy danh sách tất cả garage
export const getAllGarages = (params?: { page?: number; size?: number; status?: string }) =>
  axiosClient.get<GarageSearchResponse>("/apis/garage", { params })

// Lấy chi tiết garage
export const getGarageById = (id: number) =>
  axiosClient.get<Garage>(`/apis/garage/${id}`)

// Check address availability
export interface AddressValidationResponse {
  address: string
  isTaken: boolean
  message: string
}

export const checkAddressAvailability = (address: string) =>
  axiosClient.get<AddressValidationResponse>(`/apis/garage/validation/address?address=${encodeURIComponent(address)}`)

// Đăng ký garage (cho user có role garage)
export const registerGarage = (data: {
  name: string
  address: string
  phone: string
  email: string
  description: string
  openTime: string
  closeTime: string
  latitude?: number
  longitude?: number
  services: number[]
  vehicleTypes: number[]
  operatingHours?: OperatingHours
}) =>
  axiosClient.post<Garage>("/apis/garage/register", data)

// Cập nhật garage
export const updateGarage = (id: number, data: {
  name?: string
  address?: string
  phone?: string
  email?: string
  description?: string
  openTime?: string
  closeTime?: string
  latitude?: number
  longitude?: number
  operatingHours?: OperatingHours
}) =>
  axiosClient.put<Garage>(`/apis/garage/${id}`, data)

// Upload hình ảnh garage
export const uploadGarageImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return axiosClient.post<string>("/apis/garage/upload/image", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// Upload hình ảnh tạm thời cho user đang đăng ký garage
export const uploadTempGarageImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return axiosClient.post<string>("/apis/garage/upload/temp-image", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// Lấy thông tin garage của user hiện tại
export const getMyGarage = () =>
  axiosClient.get<Garage>("/apis/garage/my-garage")

// Lấy danh sách tất cả garage của user hiện tại
export const getGaragesByOwner = () =>
  axiosClient.get<Garage[]>("/apis/garage/my-garages")
