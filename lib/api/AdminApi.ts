import axiosClient from "../axiosClient"

export interface GarageInfo {
  id: number
  name: string
  address: string
  phone: string
  email: string
  description: string
  imageUrl?: string
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "PENDING_UPDATE"
  isVerified: boolean
  createdAt: string
  owner: {
    id: number
    name: string
    email: string
  }
  services?: Array<{
    id: number
    name: string
  }>
  vehicleTypes?: Array<{
    id: number
    name: string
  }>
}

export interface GarageApprovalData {
  isApproved: boolean
  rejectionReason?: string
}

export interface GarageApprovalResponse {
  garageId: number
  status: string
  message: string
  approvedBy: string
  approvedAt: string
}

export interface DashboardStats {
  totalUsers: number
  totalGarages: number
  pendingGarages: number
  activeGarages: number
  totalAppointments: number
  totalRevenue: number
}

// Get all garages with optional status filter
export const getAllGarages = (status?: string, page = 0, size = 10) => {
  let url = `/apis/admin/garages?page=${page}&size=${size}`
  
  // Xử lý status filter
  if (status && status !== "") {
    if (status === "PENDING") {
      // Khi chọn "Chờ duyệt", gửi cả PENDING và PENDING_UPDATE
      url += `&status=${status}`
    } else if (status === "PENDING_UPDATE") {
      // Khi chọn "Chờ cập nhật", gửi PENDING_UPDATE
      url += `&status=${status}`
    } else {
      url += `&status=${status}`
    }
  }
  
  console.log("Frontend - getAllGarages URL:", url)
  console.log("Frontend - axiosClient baseURL:", axiosClient.defaults.baseURL)
  return axiosClient.get<{
    content: GarageInfo[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }>(url)
}

// Get pending garages only
export const getPendingGarages = (page = 0, size = 10) =>
  axiosClient.get<{
    content: GarageInfo[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }>(`/apis/admin/garages/pending?page=${page}&size=${size}`)

// Approve or reject a garage
export const approveGarage = (garageId: number, data: GarageApprovalData) =>
  axiosClient.post<GarageApprovalResponse>(`/apis/admin/garages/${garageId}/approve`, data)

// Get dashboard statistics
export const getDashboardStats = () =>
  axiosClient.get<DashboardStats>("/apis/admin/dashboard")
