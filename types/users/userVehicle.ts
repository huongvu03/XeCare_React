// src/interfaces/userVehicle.ts
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
  vehicleTypeName: string;
  isLocked: boolean;
  lockReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserVehicleTypeCreateDto {
  vehicleName: string;
  brand: string;
  model: string;
  licensePlate: string;
  year: number;
  categoryId: number;
}

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
