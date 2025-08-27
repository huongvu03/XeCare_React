import axiosClient from "../axiosClient"

export interface ApprovalItem {
  status: "PENDING" | "APPROVED" | "REJECTED"
  rejectionReason?: string
  approvedBy?: string
  approvedAt?: string
  isModified?: boolean
  originalContent?: string
  modifiedContent?: string
}

export interface ApprovalDetails {
  approvalDetails: {
    [key: string]: ApprovalItem
    basicInfo: ApprovalItem
    businessInfo: ApprovalItem
    services: ApprovalItem
    vehicleTypes: ApprovalItem
  }
  overallStatus: "PENDING" | "APPROVED" | "REJECTED"
}

export interface GarageInfo {
  id: number
  name: string
  address: string
  phone: string
  email: string
  description: string
  imageUrl?: string
  openTime?: string
  closeTime?: string
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "PENDING_UPDATE"
  isVerified: boolean
  createdAt: string
  ownerId: number
  ownerName: string
  ownerEmail: string
  approvalDetails?: ApprovalDetails
  services?: Array<{
    id: number
    serviceId: number
    serviceName: string
    serviceDescription?: string
    basePrice?: number
    estimatedTimeMinutes?: number
    isActive?: boolean
  }>
  vehicleTypes?: Array<{
    id: number
    vehicleTypeId: number
    vehicleTypeName: string
    vehicleTypeDescription?: string
    isActive?: boolean
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
    url += `&status=${status}`
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

// Get garage approval details
export const getGarageApprovalDetails = (garageId: number) =>
  axiosClient.get<ApprovalDetails>(`/apis/admin/garages/${garageId}/approval-details`)

// Approve/reject garage item
export const approveGarageItem = (garageId: number, data: {
  itemKey: string
  action: "APPROVE" | "REJECT"
  rejectionReason?: string
}) =>
  axiosClient.post<GarageInfo>(`/apis/admin/garages/${garageId}/approve-item`, data)

// Get garage details by ID
export const getGarageById = (garageId: number) =>
  axiosClient.get<GarageInfo>(`/apis/admin/garages/${garageId}`)

// Search garages
export const searchGarages = (query: string) =>
  axiosClient.get<GarageInfo[]>(`/apis/admin/garages/search?q=${encodeURIComponent(query)}`)

// Get garage statistics
export const getGarageStats = () =>
  axiosClient.get<{
    totalGarages: number
    activeGarages: number
    pendingGarages: number
    inactiveGarages: number
  }>(`/apis/admin/garages/stats`)

// Update garage status
export const updateGarageStatus = (garageId: number, data: {
  status: string
  rejectionReason?: string
}) =>
  axiosClient.put<GarageInfo>(`/apis/admin/garages/${garageId}/status`, data)


