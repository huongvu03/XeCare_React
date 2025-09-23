// lib/api/GarageServiceApi.ts
import axiosClient from "../axiosClient"

// Interface cho dịch vụ hệ thống (Services)
export interface SystemService {
  id: number
  name: string
  description: string
  category: string
  isActive: boolean
}

// Interface cho dịch vụ của garage (GarageService)
export interface GarageService {
  id: number
  serviceId: number
  serviceName: string
  serviceDescription: string
  price: number
  estimatedTimeMinutes: number | null
  isActive: boolean
}

// Interface cho request tạo/cập nhật dịch vụ
export interface GarageServiceRequest {
  serviceId: number
  price: number
  estimatedTimeMinutes?: number
  isActive?: boolean
}

// Interface cho request tạo custom service
export interface CreateCustomServiceRequest {
  name: string
  description?: string
  basePrice: number
  estimatedTimeMinutes: number
  isActive?: boolean
}

// Interface cho thống kê dịch vụ
export interface GarageServiceStats {
  totalServices: number
  activeServices: number
  inactiveServices: number
}

// Lấy danh sách dịch vụ của garage
export const getGarageServices = (garageId: number) =>
  axiosClient.get<GarageService[]>(`/apis/garage/management/services`)

// Lấy chi tiết dịch vụ
export const getGarageServiceById = (serviceId: number) =>
  axiosClient.get<GarageService>(`/apis/garage-services/${serviceId}`)

// Thêm dịch vụ mới cho garage
export const createGarageService = (data: GarageServiceRequest) =>
  axiosClient.post<GarageService>("/apis/garage/management/services", data)

// Tạo custom service mới
export const createCustomService = (garageId: number, data: CreateCustomServiceRequest) =>
  axiosClient.post<GarageService>(`/apis/garage-services/custom?garageId=${garageId}`, data)

// Cập nhật thông tin dịch vụ
export const updateGarageService = (serviceId: number, data: GarageServiceRequest) =>
  axiosClient.put<GarageService>(`/apis/garage/management/services/${serviceId}`, data)

// Bật/tắt trạng thái dịch vụ
export const toggleGarageServiceStatus = (serviceId: number) =>
  axiosClient.put<GarageService>(`/apis/garage-services/${serviceId}/toggle`)

// Lấy thống kê dịch vụ của garage
export const getGarageServiceStats = (garageId: number) =>
  axiosClient.get<GarageServiceStats>(`/apis/garage/management/services/stats`)

// Lấy danh sách dịch vụ hệ thống (cho dropdown)
export const getSystemServices = () =>
  axiosClient.get<SystemService[]>("/apis/admin/services")

// Tìm kiếm dịch vụ (system + custom)
export const searchServices = (keyword: string) =>
  axiosClient.get<GarageService[]>(`/apis/garage-services/search?keyword=${encodeURIComponent(keyword)}`)

// Debug endpoint để kiểm tra thông tin user và garage
export const debugUser = () =>
  axiosClient.get<any>("/apis/garage-services/debug/user")

// Debug endpoint để kiểm tra garage cụ thể
export const debugGarage = (garageId: number) =>
  axiosClient.get<any>(`/apis/garage-services/debug/garage/${garageId}`)

// Simple test endpoint để kiểm tra authentication
export const testAuth = () =>
  axiosClient.get<any>("/apis/garage-services/test-auth")

// Super simple test endpoint
export const simpleTest = () =>
  axiosClient.get<string>("/apis/garage-services/simple-test")

// Test JSON endpoint
export const testJson = () =>
  axiosClient.get<any>("/apis/garage-services/test-json")
