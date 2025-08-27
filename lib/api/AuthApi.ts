// lib/api/AuthApi.ts
import axiosClient from "../axiosClient"

export interface SignInRequest {
  email: string
  password: string
}

export interface ApprovalItem {
  status: "PENDING" | "APPROVED" | "REJECTED"
  rejectionReason?: string
  approvedBy?: string
  approvedAt?: string
}

export interface ApprovalDetails {
  overallStatus: "PENDING" | "APPROVED" | "REJECTED"
  approvalDetails: {
    [key: string]: ApprovalItem
  }
}

export interface GarageInfo {
  id: number
  name: string
  address: string
  phone: string
  email: string
  description: string
  imageUrl: string
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "PENDING_UPDATE"
  isVerified: boolean
  createdAt: string
  rejectionReason?: string
  rejectedAt?: string
  approvedAt?: string
  approvalDetails?: ApprovalDetails
  openTime?: string
  closeTime?: string
  latitude?: number
  longitude?: number
  operatingHours?: string
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

export interface User {
  id: number
  email: string
  name: string
  role: "ADMIN" | "USER" | "GARAGE"
  phone?: string
  imageUrl?: string
  address?: string
  createdAt?: string
  garages?: GarageInfo[]
}

export interface SignInResponse {
  id: number
  name: string
  email: string
  role: "ADMIN" | "USER" | "GARAGE" | "USER_AND_GARAGE"
  phone?: string
  address?: string
  imageUrl?: string
  createdAt: string
  token?: string
  tokenType?: string
  garages?: GarageInfo[]
}

export const loginApi = (data: SignInRequest) =>
  axiosClient.post<SignInResponse>("/apis/v1/login", data)

export const registerApi = (data: {
  name: string
  email: string
  password: string
  phone: string
  address: string
}) =>
  axiosClient.post<SignInResponse>("/apis/user/register", data)