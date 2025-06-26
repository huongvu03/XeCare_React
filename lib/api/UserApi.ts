import axiosClient from "../axiosClient";
import type { User } from '@/types/Users/User';

const BASE_URL = "/apis/v1/users";

export const getAllUsers = () => axiosClient.get<User[]>(BASE_URL);
export const getUserById = (id: number) => axiosClient.get<User>(`${BASE_URL}/${id}`);
export const createUser = (user: User) => axiosClient.post<User>(BASE_URL, user);
export const updateUser = (id: number, user: User) => axiosClient.put<User>(`${BASE_URL}/${id}`, user);
export const deleteUser = (id: number) => axiosClient.delete(`${BASE_URL}/${id}`);