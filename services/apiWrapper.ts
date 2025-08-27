import { apiClient } from './api';
import { mockApiClient } from './mockData';
import { config } from '../config/env';

// Environment variable để chuyển đổi giữa real API và mock data
const USE_MOCK_DATA = config.USE_MOCK_DATA;

// API Wrapper class
class ApiWrapper {
  private useMock: boolean;

  constructor(useMock: boolean = USE_MOCK_DATA) {
    this.useMock = useMock;
  }

  // Garage Search APIs
  async searchGaragesAdvanced(params: any) {
    if (this.useMock) {
      return mockApiClient.searchGaragesAdvanced(params);
    }
    return apiClient.searchGaragesAdvanced(params);
  }

  async searchGaragesWithPagination(params: any) {
    if (this.useMock) {
      // Mock pagination
      const allData = await mockApiClient.searchGaragesAdvanced(params);
      const page = params.page || 0;
      const size = params.size || 10;
      const start = page * size;
      const end = start + size;
      const content = allData.slice(start, end);
      
      return {
        content,
        totalElements: allData.length,
        totalPages: Math.ceil(allData.length / size),
        size,
        number: page,
        first: page === 0,
        last: end >= allData.length
      };
    }
    return apiClient.searchGaragesWithPagination(params);
  }

  async getActiveGarages() {
    if (this.useMock) {
      return mockApiClient.searchGaragesAdvanced({});
    }
    return apiClient.getActiveGarages();
  }

  async getGarageById(id: number) {
    if (this.useMock) {
      const garages = await mockApiClient.searchGaragesAdvanced({});
      const garage = garages.find(g => g.id === id);
      if (!garage) {
        throw new Error('Garage not found');
      }
      return garage;
    }
    return apiClient.getGarageById(id);
  }

  // Filter Options APIs
  async getAvailableServices() {
    if (this.useMock) {
      return mockApiClient.getAvailableServices();
    }
    return apiClient.getAvailableServices();
  }

  async getAvailableVehicleTypes() {
    if (this.useMock) {
      return mockApiClient.getAvailableVehicleTypes();
    }
    return apiClient.getAvailableVehicleTypes();
  }

  // Statistics API
  async getGarageStats() {
    if (this.useMock) {
      return mockApiClient.getGarageStats();
    }
    return apiClient.getGarageStats();
  }

  // Nearby Search APIs
  async findNearbyGarages(latitude: number, longitude: number, radius: number = 10.0) {
    if (this.useMock) {
      // Mock nearby search - return all garages for now
      return mockApiClient.searchGaragesAdvanced({});
    }
    return apiClient.findNearbyGarages(latitude, longitude, radius);
  }

  async findNearbyGaragesWithPagination(
    latitude: number,
    longitude: number,
    radius: number = 10.0,
    page: number = 0,
    size: number = 10
  ) {
    if (this.useMock) {
      const allData = await mockApiClient.searchGaragesAdvanced({});
      const start = page * size;
      const end = start + size;
      const content = allData.slice(start, end);
      
      return {
        content,
        totalElements: allData.length,
        totalPages: Math.ceil(allData.length / size),
        size,
        number: page,
        first: page === 0,
        last: end >= allData.length
      };
    }
    return apiClient.findNearbyGaragesWithPagination(latitude, longitude, radius, page, size);
  }

  // Basic Search APIs
  async searchGaragesByName(name: string) {
    if (this.useMock) {
      return mockApiClient.searchGaragesAdvanced({ name });
    }
    return apiClient.searchGaragesByName(name);
  }

  async searchGaragesByAddress(address: string) {
    if (this.useMock) {
      return mockApiClient.searchGaragesAdvanced({ address });
    }
    return apiClient.searchGaragesByAddress(address);
  }

  // Method để chuyển đổi mode
  setUseMock(useMock: boolean) {
    this.useMock = useMock;
  }

  // Method để kiểm tra mode hiện tại
  isUsingMock() {
    return this.useMock;
  }
}

// Export singleton instance
export const apiWrapper = new ApiWrapper();

// Export để có thể thay đổi mode
export const setUseMockData = (useMock: boolean) => {
  apiWrapper.setUseMock(useMock);
};

export const isUsingMockData = () => {
  return apiWrapper.isUsingMock();
};
