// lib/api/AuthApi.ts
import axiosClient from "../axiosClient"

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  id: number
  name: string
  email: string
  role: "Admin" | "User" | "Garage"
  token: string
  phone?: string
  address?: string
  imageUrl?: string
  tokenType: string
  createdAt: string
}

export const loginApi = (data: SignInRequest) =>
  axiosClient.post<SignInResponse>("/apis/v1/login", data)