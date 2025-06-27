import axiosClient from "../axiosClient";
import type { UserList } from '@/types/users/user';
import type { CreateUserDto, UpdateUserDto } from '@/types/users/user';

const BASE_URL = "/apis/v1/users";

export const getAllUsers = () => axiosClient.get<UserList[]>(BASE_URL)

export const getUserById = (id: number) =>
  axiosClient.get<UserList>(`${BASE_URL}/${id}`)

export const createUser = (user: CreateUserDto) =>
  axiosClient.post<UserList>(BASE_URL, user)

// export const updateUser = (id: number, user: UpdateUserDto) =>
//   axiosClient.put<User>(`${BASE_URL}/${id}`, user)

export const deleteUser = (id: number) =>
  axiosClient.delete(`${BASE_URL}/${id}`)

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

