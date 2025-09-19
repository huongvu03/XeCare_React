import axiosClient from "../axiosClient"

export interface Service {
  id: number
  name: string
  description?: string
  category?: string
  isActive: boolean
  createdAt: string
  garageId?: number
}

// Lấy tất cả system services
export const getAllSystemServices = () =>
  axiosClient.get<Service[]>("/apis/admin/services")

// Tìm kiếm services theo keyword
export const searchServices = (keyword: string) =>
  axiosClient.get<Service[]>(`/apis/garage-services/search?keyword=${encodeURIComponent(keyword)}`)

// Lấy services của một garage cụ thể
export const getGarageServices = (garageId: number) =>
  axiosClient.get<Service[]>(`/apis/garage-services/garage/${garageId}`)
