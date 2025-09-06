// lib/api/AppointmentApi.ts
import axiosClient from "../axiosClient"

export interface Appointment {
  id: number
  userId: number
  userName: string
  userEmail: string
  userPhone: string
  garageId: number
  garageName: string
  garageAddress: string
  serviceId?: number
  serviceName: string
  vehicleTypeId: number
  vehicleTypeName: string
  vehicleBrand?: string
  vehicleModel?: string
  licensePlate?: string
  vehicleYear?: number
  appointmentDate: string
  appointmentTime?: string
  description?: string
  notes?: string
  estimatedPrice?: number
  finalPrice?: number
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "REJECTED"
  contactPhone: string
  contactEmail: string
  rejectionReason?: string
  imageUrls?: string[]
  createdAt: string
  updatedAt?: string
}

export interface AppointmentService {
  id: number
  appointmentId: number
  serviceId: number
  serviceName: string
  price: number
}

export interface AppointmentImage {
  id: number
  appointmentId: number
  imageUrl: string
}

export interface CreateAppointmentRequest {
  garageId: number
  vehicleTypeId: number
  appointmentDate: string
  appointmentTime: string
  description: string
  contactPhone: string
  contactEmail: string
  services: number[]
}

export interface AppointmentSearchResponse {
  content: Appointment[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// Tạo lịch hẹn mới
export const createAppointment = (data: CreateAppointmentRequest) =>
  axiosClient.post<Appointment>("/apis/user/appointments", data)

// Lấy danh sách lịch hẹn của user
export const getUserAppointments = (params?: {
  page?: number;
  size?: number;
  status?: string
}) =>
  axiosClient.get<AppointmentSearchResponse>("/apis/user/appointments/my", { params })

// Lấy số lượng lịch hẹn pending cho garage
export const getPendingAppointmentsCount = (garageId: number) =>
  axiosClient.get<{pendingCount: number}>(`/apis/user/appointments/garage/${garageId}/pending-count`)

// Lấy chi tiết lịch hẹn
export const getAppointmentById = (id: number) =>
  axiosClient.get<Appointment>(`/apis/user/appointments/${id}`)

// Hủy lịch hẹn
export const cancelAppointment = (id: number) =>
  axiosClient.delete(`/apis/user/appointments/${id}`)

// Lấy danh sách lịch hẹn của garage (cho garage owner)
export const getGarageAppointments = (garageId: number, params?: { 
  page?: number; 
  size?: number; 
  status?: string 
}) =>
  axiosClient.get<AppointmentSearchResponse>(`/apis/user/appointments/garage/${garageId}`, { params })

// Lấy chi tiết lịch hẹn
export const getAppointmentDetail = (appointmentId: number) =>
  axiosClient.get<Appointment>(`/apis/user/appointments/${appointmentId}`)

// Cập nhật trạng thái lịch hẹn (garage owner)
export const updateAppointmentStatus = (appointmentId: number, data: {
  status: "CONFIRMED" | "REJECTED"
  rejectionReason?: string
}) =>
  axiosClient.patch<Appointment>(`/apis/user/appointments/${appointmentId}/status`, data)

// Bắt đầu lịch hẹn (CONFIRMED -> IN_PROGRESS)
export const startAppointment = (appointmentId: number) =>
  axiosClient.patch<Appointment>(`/apis/user/appointments/${appointmentId}/start`)

// Hoàn thành lịch hẹn (IN_PROGRESS -> COMPLETED)
export const completeAppointment = (appointmentId: number) =>
  axiosClient.patch<Appointment>(`/apis/user/appointments/${appointmentId}/complete`)

// Hủy lịch hẹn bởi garage owner (CONFIRMED -> CANCELLED)
export const cancelAppointmentByGarage = (appointmentId: number) =>
  axiosClient.patch<Appointment>(`/apis/user/appointments/${appointmentId}/cancel-by-garage`)

// Upload hình ảnh cho lịch hẹn
export const uploadAppointmentImages = (appointmentId: number, files: File[]) => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })
  return axiosClient.post<AppointmentImage[]>(`/apis/user/appointments/${appointmentId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
