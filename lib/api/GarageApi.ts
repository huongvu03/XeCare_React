// lib/api/GarageApi.ts
import axiosClient from "../axiosClient"
import axios from "axios"

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
  // Thông tin về loại cập nhật (cho frontend)
  updateType?: "REQUIRES_APPROVAL" | "IMMEDIATE_UPDATE"
  updateMessage?: string
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
  imageUrl?: string
  services: number[]
  vehicleTypes: number[]
  operatingHours?: OperatingHours
}) =>
  axiosClient.post<Garage>("/apis/user/register-garage", data)

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
  serviceIds?: number[]
  vehicleTypeIds?: number[]
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

// Tìm garage có dịch vụ cứu hộ gần nhất với ưu tiên yêu thích
export const getEmergencyRescueGarages = async (latitude: number, longitude: number, radius: number = 10) => {
  try {
    // Tạo axios instance riêng cho public endpoints (không có token)
    const publicAxios = axios.create({
      baseURL: 'http://localhost:8080',
      timeout: 10000,
    })
    
    let nearbyGarages: Garage[] = []
    
    try {
      // Thử endpoint nearby trước
      console.log('🔍 Trying /apis/garage/nearby endpoint...')
      const nearbyResponse = await publicAxios.get<Garage[]>("/apis/garage/nearby", { 
        params: { latitude, longitude, radius } 
      })
      
      // Đảm bảo response.data là một array
      const responseData = nearbyResponse.data
      if (Array.isArray(responseData)) {
        nearbyGarages = responseData
      } else {
        console.warn('⚠️ Nearby endpoint returned non-array data:', typeof responseData, responseData)
        nearbyGarages = []
      }
      console.log('✅ Nearby endpoint success:', nearbyGarages.length, 'garages')
    } catch (nearbyError: any) {
      console.log('⚠️ Nearby endpoint failed:', nearbyError.response?.status, nearbyError.response?.statusText)
      
      try {
        // Fallback: sử dụng endpoint active garages
        console.log('🔍 Trying /apis/garage/active endpoint as fallback...')
        const activeResponse = await publicAxios.get<Garage[]>("/apis/garage/active")
        
        // Đảm bảo response.data là một array
        const responseData = activeResponse.data
        if (Array.isArray(responseData)) {
          nearbyGarages = responseData
        } else {
          console.warn('⚠️ Active endpoint returned non-array data:', typeof responseData, responseData)
          nearbyGarages = []
        }
        console.log('✅ Active endpoint success:', nearbyGarages.length, 'garages')
        
        // Tính toán khoảng cách cho active garages (giả lập)
        nearbyGarages = nearbyGarages.map(garage => ({
          ...garage,
          distance: Math.random() * 10 // Giả lập khoảng cách 0-10km
        }))
        
      } catch (activeError: any) {
        console.log('❌ Both endpoints failed:', activeError.response?.status)
        throw new Error('Không thể lấy danh sách garage từ server')
      }
    }

    // Đảm bảo nearbyGarages là một array trước khi filter
    if (!Array.isArray(nearbyGarages)) {
      console.error('❌ nearbyGarages is not an array:', typeof nearbyGarages, nearbyGarages)
      nearbyGarages = []
    }

    // Lọc garage có dịch vụ cứu hộ
    const emergencyGarages = nearbyGarages.filter(garage => 
      garage.services?.some(service => 
        service.serviceName.toLowerCase().includes('cứu hộ') || 
        service.serviceName.toLowerCase().includes('emergency') ||
        service.serviceName.toLowerCase().includes('rescue')
      )
    )

    // Lấy danh sách garage yêu thích của user (nếu có token)
    let favoriteGarages: number[] = []
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const favoritesResponse = await axiosClient.get<{id: number}[]>("/apis/favorites")
        favoriteGarages = favoritesResponse.data.map(fav => fav.id)
      } catch (error) {
        console.log('Không thể lấy danh sách yêu thích:', error)
      }
    }

    // Sắp xếp theo ưu tiên: yêu thích trước, sau đó theo khoảng cách
    const sortedGarages = emergencyGarages.sort((a, b) => {
      const aIsFavorite = favoriteGarages.includes(a.id)
      const bIsFavorite = favoriteGarages.includes(b.id)
      
      // Ưu tiên garage yêu thích
      if (aIsFavorite && !bIsFavorite) return -1
      if (!aIsFavorite && bIsFavorite) return 1
      
      // Nếu cùng trạng thái yêu thích, sắp xếp theo khoảng cách
      return (a.distance || 0) - (b.distance || 0)
    })

    return sortedGarages
  } catch (error: any) {
    // Improved error logging
    console.error('Lỗi khi lấy garage cứu hộ:', {
      message: error?.message || 'Unknown error',
      status: error?.response?.status || 'No status',
      statusText: error?.response?.statusText || 'No status text',
      data: error?.response?.data || 'No response data',
      code: error?.code || 'No error code',
      name: error?.name || 'No error name',
      url: error?.config?.url || 'No URL',
      method: error?.config?.method || 'No method'
    })
    
    // Create a more descriptive error
    let errorMessage = 'Không thể lấy danh sách garage từ server'
    if (error?.message) {
      errorMessage = error.message
    } else if (error?.response?.status) {
      errorMessage = `Server error: ${error.response.status} ${error.response.statusText || ''}`
    } else if (error?.code === 'ERR_NETWORK') {
      errorMessage = 'Network error: Cannot connect to server'
    } else if (error?.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout: Server took too long to respond'
    }
    
    const enhancedError = new Error(errorMessage)
    enhancedError.cause = error
    throw enhancedError
  }
}