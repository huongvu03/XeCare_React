export type AccountType = 'USER' | 'ADMIN' | 'GARAGE';

export interface UserList {
  id: number;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  address?: string;
  role: AccountType; // 👈 đồng bộ với backend
  createdAt?: string; // Thêm trường createdAt nếu cần
}
export interface CreateUserDto {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  imageUrl?: string
}

export interface UpdateUserDto {
  name: string
  email: string
  phone?: string
  address?: string
  imageUrl?: string
}