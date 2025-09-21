// Service ID to Name mapping based on database structure
// Note: This mapping should match both database and mock data service names
export const SERVICE_ID_TO_NAME: Record<number, string> = {
  1: 'Sửa lốp',
  2: 'Thay dầu', // Database: "Thay dầu", Mock: "Thay dầu nhớt" - will need to handle both
  3: 'Thay nhớt hộp số',
  4: 'Kiểm tra phanh',
  5: 'Cứu hộ xe',
  6: 'Sửa điều hòa',
  7: 'Thay ắc quy',
  8: 'Rửa xe',
  9: 'Sơn xe',
  10: 'Cân chỉnh góc lái',
  11: 'Kiểm tra động cơ',
  12: 'Thay bugi'
};

// Vehicle Type ID to Name mapping based on database structure
export const VEHICLE_TYPE_ID_TO_NAME: Record<number, string> = {
  1: 'Xe máy số',
  2: 'Xe tay ga',
  3: 'Xe côn tay',
  4: 'Xe mô tô PKL',
  5: 'Ô tô con',
  6: 'Xe bán tải',
  7: 'Xe khách nhỏ',
  8: 'Xe khách lớn',
  9: 'Xe tải nhỏ',
  10: 'Xe tải trung',
  11: 'Xe tải lớn',
  12: 'Xe cứu thương',
  13: 'Xe chuyên dụng khác',
  14: 'Xe máy điện',
  15: 'Ô tô điện'
};

/**
 * Convert service ID to service name
 */
export function getServiceNameById(serviceId: number): string | null {
  return SERVICE_ID_TO_NAME[serviceId] || null;
}

/**
 * Get all possible service names for a given ID (for compatibility with both DB and mock data)
 */
export function getServiceNamesById(serviceId: number): string[] {
  const baseName = SERVICE_ID_TO_NAME[serviceId];
  if (!baseName) return [];
  
  // Handle variations between database and mock data
  const variations: Record<number, string[]> = {
    2: ['Thay dầu', 'Thay dầu nhớt'], // Database vs Mock
    // Add more variations as needed
  };
  
  return variations[serviceId] || [baseName];
}

/**
 * Convert vehicle type ID to vehicle type name
 */
export function getVehicleTypeNameById(vehicleTypeId: number): string | null {
  return VEHICLE_TYPE_ID_TO_NAME[vehicleTypeId] || null;
}

/**
 * Get service ID by name
 */
export function getServiceIdByName(serviceName: string): number | null {
  const entry = Object.entries(SERVICE_ID_TO_NAME).find(([_, name]) => name === serviceName);
  return entry ? parseInt(entry[0]) : null;
}

/**
 * Get vehicle type ID by name
 */
export function getVehicleTypeIdByName(vehicleTypeName: string): number | null {
  const entry = Object.entries(VEHICLE_TYPE_ID_TO_NAME).find(([_, name]) => name === vehicleTypeName);
  return entry ? parseInt(entry[0]) : null;
}
