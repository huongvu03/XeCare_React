import { apiClient } from './api';
import { mockApiClient } from './mockData';
import { config } from '../config/env';

// Environment variable để chuyển đổi giữa real API và mock data
const USE_MOCK_DATA = config.USE_MOCK_DATA;

// API Wrapper class
class ApiWrapper {
  private useMock: boolean;
  private fallbackToMock: boolean;

  constructor(useMock: boolean = USE_MOCK_DATA) {
    this.useMock = useMock;
    this.fallbackToMock = false;
  }

  // Helper method to handle API calls with fallback
  private async callWithFallback<T>(
    realApiCall: () => Promise<T>,
    mockApiCall: () => Promise<T>
  ): Promise<T> {
    if (this.useMock || this.fallbackToMock) {
      return mockApiCall();
    }

    try {
      return await realApiCall();
    } catch (error) {
      console.warn('Real API failed, falling back to mock data:', error);
      this.fallbackToMock = true;
      return mockApiCall();
    }
  }

  // Garage Search APIs
  async searchGaragesAdvanced(params: any) {
    return this.callWithFallback(
      () => apiClient.searchGaragesAdvanced(params),
      () => mockApiClient.searchGaragesAdvanced(params)
    );
  }

  async searchGaragesWithPagination(params: any) {
    return this.callWithFallback(
      () => apiClient.searchGaragesWithPagination(params),
      async () => {
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
    );
  }

  async getActiveGarages() {
    return this.callWithFallback(
      () => apiClient.getActiveGarages(),
      () => mockApiClient.searchGaragesAdvanced({})
    );
  }

  async getGarageById(id: number) {
    return this.callWithFallback(
      () => apiClient.getGarageById(id),
      async () => {
        const garages = await mockApiClient.searchGaragesAdvanced({});
        const garage = garages.find(g => g.id === id);
        if (!garage) {
          throw new Error('Garage not found');
        }
        return garage;
      }
    );
  }

  // Filter Options APIs
  async getAvailableServices() {
    return this.callWithFallback(
      () => apiClient.getAvailableServices(),
      () => mockApiClient.getAvailableServices()
    );
  }

  async getAvailableVehicleTypes() {
    return this.callWithFallback(
      () => apiClient.getAvailableVehicleTypes(),
      () => mockApiClient.getAvailableVehicleTypes()
    );
  }

  // Statistics API
  async getGarageStats() {
    return this.callWithFallback(
      () => apiClient.getGarageStats(),
      () => mockApiClient.getGarageStats()
    );
  }

  // Nearby Search APIs
  async findNearbyGarages(latitude: number, longitude: number, radius: number = 10.0) {
    return this.callWithFallback(
      () => apiClient.findNearbyGarages(latitude, longitude, radius),
      () => mockApiClient.searchGaragesAdvanced({}) // Mock nearby search - return all garages for now
    );
  }

  async findNearbyGaragesWithPagination(
    latitude: number,
    longitude: number,
    radius: number = 10.0,
    page: number = 0,
    size: number = 10
  ) {
    return this.callWithFallback(
      () => apiClient.findNearbyGaragesWithPagination(latitude, longitude, radius, page, size),
      async () => {
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
    );
  }

  // Basic Search APIs
  async searchGaragesByName(name: string) {
    return this.callWithFallback(
      () => apiClient.searchGaragesByName(name),
      () => mockApiClient.searchGaragesAdvanced({ name })
    );
  }

  async searchGaragesByAddress(address: string) {
    return this.callWithFallback(
      () => apiClient.searchGaragesByAddress(address),
      () => mockApiClient.searchGaragesAdvanced({ address })
    );
  }

  // Method để chuyển đổi mode
  setUseMock(useMock: boolean) {
    this.useMock = useMock;
    if (useMock) {
      this.fallbackToMock = false; // Reset fallback when explicitly using mock
    }
  }

  // Method để kiểm tra mode hiện tại
  isUsingMock() {
    return this.useMock || this.fallbackToMock;
  }

  // Method để reset fallback state (khi backend server được khởi động lại)
  resetFallback() {
    this.fallbackToMock = false;
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

export const resetApiFallback = () => {
  apiWrapper.resetFallback();
};
