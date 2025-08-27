// src/api/userVehicleCategoryApi.ts
import axiosClient from "../axiosClient"

export interface UserVehicleTypeCategory {
  id: number
  name: string
  description?: string
}

const userVehicleCategoryApi = {
  getAll: () =>
    axiosClient.get<UserVehicleTypeCategory[]>("/apis/user/vehicles/categories"),
}

export default userVehicleCategoryApi
