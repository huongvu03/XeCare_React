// Export API client
export { apiClient } from './api';
export { apiWrapper, setUseMockData, isUsingMockData } from './apiWrapper';

// Export types
export type {
  PublicGarageResponseDto,
  GarageSearchParams,
  PaginatedResponse,
  GarageStats
} from './api';

// Export mock data
export {
  mockGarages,
  mockServices,
  mockVehicleTypes,
  mockStats,
  mockApiClient
} from './mockData';
