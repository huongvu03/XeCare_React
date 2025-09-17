import axiosClient from "../axiosClient";
import type { Vehicle,VehicleFormData, UserVehicleTypeCreateDto,UserVehicleTypeUpdateDto } from "@/types/users/userVehicle";

const BASE_URL = "/apis/user/vehicles";

export const VehicleApi = {
  getAll: (params?: any) => axiosClient.get(BASE_URL, { params }),
  create: (dto: UserVehicleTypeCreateDto) => axiosClient.post(BASE_URL, dto),
  update: (id: number, dto: UserVehicleTypeUpdateDto) => axiosClient.put(`${BASE_URL}/${id}`, dto),
  remove: (id: number) => axiosClient.delete(`${BASE_URL}/${id}`),
  lock: (id: number, reason: string) =>
    axiosClient.post(`${BASE_URL}/${id}/lock?reason=${encodeURIComponent(reason)}`),
  unlock: (id: number) => axiosClient.post(`${BASE_URL}/${id}/unlock`),
  //categories: () => axiosClient.get(`${BASE_URL}/categories`)
};
