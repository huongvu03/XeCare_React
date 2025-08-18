// lib/api/AppointmentApi.ts
import axiosClient from "../axiosClient"

export interface Appointment {
  id: number
  userId: number
  garageId: number
  vehicleTypeId: number
  appointmentDate: string
  appointmentTime: string
  description: string
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED"
  contactPhone: string
  contactEmail: string
  rejectionReason?: string
  rejectedAt?: string
  confirmedAt?: string
  completedAt?: string
  cancelledAt?: string
  notes?: string
  createdAt: string
  user?: {
    id: number
    name: string
    email: string
    phone: string
  }
  garage?: {
    id: number
    name: string
    address: string
    phone: string
  }
  vehicleType?: {
    id: number
    name: string
  }
  services?: AppointmentService[]
  images?: AppointmentImage[]
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
  images?: File[]
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
  axiosClient.get<AppointmentSearchResponse>("/apis/user/appointments", { params })

// Lấy chi tiết lịch hẹn
export const getAppointmentById = (id: number) =>
  axiosClient.get<Appointment>(`/apis/user/appointments/${id}`)

// Hủy lịch hẹn
export const cancelAppointment = (id: number) =>
  axiosClient.delete(`/apis/user/appointments/${id}`)

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
