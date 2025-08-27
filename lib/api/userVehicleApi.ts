// src/api/userVehicleApi.ts
import axiosClient from "../axiosClient";
import {
  UserVehicleTypeResponseDto,
  UserVehicleTypeCreateDto,
  UserVehicleTypeUpdateDto,
} from "@/types/users/userVehicle";

const userVehicleApi = {
  getAll: async (
  params?: {
    page?: number
    size?: number
    sortBy?: string
    direction?: string
    keyword?: string
  }
): Promise<UserVehicleTypeResponseDto[]> => {
  const res = await axiosClient.get("apis/user/vehicles", { params })

  // Nếu backend trả Page, lấy res.data.content; nếu trả List, lấy res.data
  return res.data.content ?? res.data
},

  create: (data: UserVehicleTypeCreateDto) =>
    axiosClient.post<UserVehicleTypeResponseDto>("apis/user/vehicles", data),

  update: (id: number, data: UserVehicleTypeUpdateDto) =>
    axiosClient.put<UserVehicleTypeResponseDto>(`apis/user/vehicles/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`apis/user/vehicles/${id}`),

  lock: (id: number, reason: string) =>
    axiosClient.post<UserVehicleTypeResponseDto>(
      `apis/user/vehicles/${id}/lock`,
      null,
      { params: { reason } }
    ),

  unlock: (id: number) =>
    axiosClient.post<UserVehicleTypeResponseDto>(`apis/user/vehicles/${id}/unlock`),
};

export default userVehicleApi;
