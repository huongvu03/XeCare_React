import axiosClient from "../axiosClient"
import { GarageInfo } from "./AuthApi"
import type { UserList } from '@/types/users/user';
import type { CreateUserDto, UpdateUserDto } from '@/types/users/user';

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  imageUrl?: string
  role: "ADMIN" | "USER" | "GARAGE"
  createdAt?: string
  garages?: GarageInfo[]
}

// Public garage info - thông tin cơ bản cho tất cả user
export interface PublicGarageInfo {
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
  averageRating: number
  totalReviews: number
  serviceNames: string[]
  vehicleTypeNames: string[]
  latitude: number
  longitude: number
}

export interface GarageRegistrationData {
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
  serviceIds: number[]
  vehicleTypeIds: number[]
}

// Get user profile with garage information
export const getUserProfile = () =>
  axiosClient.get<User>("/apis/user/profile")

// Register a new garage for the current user
export const registerGarage = (data: GarageRegistrationData) =>
  axiosClient.post("/apis/user/register-garage", data)

// Get all garages owned by the current user
export const getUserGarages = () =>
  axiosClient.get<GarageInfo[]>("/apis/user/garages")

// Get specific garage owned by the current user
export const getUserGarage = (garageId: number) =>
  axiosClient.get<GarageInfo>(`/apis/user/garages/${garageId}`)

// Get any garage by ID (public endpoint - thông tin cơ bản)
export const getPublicGarageById = (garageId: number) =>
  axiosClient.get<PublicGarageInfo>(`/apis/garage/${garageId}`)

// Get detailed garage info (owner only - thông tin chi tiết)
export const getMyGarageById = (garageId: number) =>
  axiosClient.get<GarageInfo>(`/apis/garage/my-garages/${garageId}`)

// Get all active garages (for browsing)
export const getAllActiveGarages = () =>
  axiosClient.get<PublicGarageInfo[]>("/apis/garage/active")

// Update garage information
export const updateGarage = (garageId: number, data: Partial<GarageRegistrationData>) =>
  axiosClient.put<GarageInfo>(`/apis/garage/${garageId}`, data)

//HƯƠNG
const BASE_URL = "/apis/v1/users";
export const getAllUsers = () => axiosClient.get<UserList[]>(BASE_URL)
export const getUserById = (id: number) =>
  axiosClient.get<UserList>(`${BASE_URL}/${id}`)
export const createUser = (user: CreateUserDto) =>
  axiosClient.post<UserList>(BASE_URL, user)
export const updateUserInfoApi = (id: number, dto: UpdateUserDto) => {
  return axiosClient.put(`${BASE_URL}/${id}`, dto)
}
export const updateUserImageApi = (id: number, image: File) => {
  const formData = new FormData()
  formData.append("image", image)
  return axiosClient.put(`/apis/v1/users/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
}
