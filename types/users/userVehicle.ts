// src/interfaces/userVehicle.ts

// ========== Response từ backend ==========
export interface UserVehicleTypeResponseDto {
  id: number;
  vehicleName: string;
  brand: string;
  model: string;
  color: string;
  licensePlate: string;
  year: number;
  categoryId: number;
  categoryName: string;
  vehicleTypeId: number;
  vehicleTypeName: string;
  isLocked: boolean;
  lockReason: string | null;
  createdAt: string;
  updatedAt: string;
}

// ========== DTO khi tạo ==========
export interface UserVehicleTypeCreateDto {
  vehicleName: string;
  brand: string;
  model: string;
  licensePlate: string;
  year: number;
  color?: string;
  categoryId: number;
  vehicleTypeId: number;
}

// ========== DTO khi update ==========
export interface UserVehicleTypeUpdateDto {
  vehicleName: string;
  brand: string;
  model?: string;
  color?: string;
  licensePlate: string;
  year: number;
  categoryId: number;
  vehicleTypeId: number;
}

// ========== Model cho UI (form, card, detail) ==========
export interface Vehicle {
  id: number;               // match với response.id
  vehicleName: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  categoryId: number;
  categoryName?: string;
  vehicleTypeId: number;
  vehicleTypeName?: string;
  locked: boolean;
  lockReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ========== Data cho Form ==========
export interface VehicleFormData {
  vehicleName: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  categoryId: number;
  vehicleTypeId: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
}
export interface VehicleType {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}
