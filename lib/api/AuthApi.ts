// lib/api/AuthApi.ts
import axiosClient from "../axiosClient"

export interface SignInRequest {
  email: string
  password: string
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