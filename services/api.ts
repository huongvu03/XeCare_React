// API Client cho XeCare2 Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Types cho API responses
export interface PublicGarageResponseDto {
  id: number;
  name: string;
  address: string;
  description: string;
  imageUrl: string;
  status: string;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  serviceNames: string[];
  vehicleTypeNames: string[];
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
}

export interface GarageSearchParams {
  name?: string;
  address?: string;
  service?: string;
  vehicleType?: string;
  minRating?: number;
  maxRating?: number;
  status?: string;
  isVerified?: boolean;
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface GarageStats {
  totalGarages: number;
  activeGarages: number;
  pendingGarages: number;
  inactiveGarages: number;
}

// Utility function để tạo query string
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
}

// API Client class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Helper method để gọi API
  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      return JSON.parse(text);
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Garage Search APIs
  async searchGaragesAdvanced(params: GarageSearchParams): Promise<PublicGarageResponseDto[]> {
    const queryString = buildQueryString(params);
    return this.fetchApi<PublicGarageResponseDto[]>(`/apis/garage/search/advanced?${queryString}`);
  }

  async searchGaragesWithPagination(params: GarageSearchParams): Promise<PaginatedResponse<PublicGarageResponseDto>> {
    const queryString = buildQueryString(params);
    return this.fetchApi<PaginatedResponse<PublicGarageResponseDto>>(`/apis/garage/search/paginated?${queryString}`);
  }

  async getActiveGarages(): Promise<PublicGarageResponseDto[]> {
    return this.fetchApi<PublicGarageResponseDto[]>('/apis/garage/active');
  }

  async getGarageById(id: number): Promise<PublicGarageResponseDto> {
    return this.fetchApi<PublicGarageResponseDto>(`/apis/garage/${id}`);
  }

  // Filter Options APIs
  async getAvailableServices(): Promise<string[]> {
    return this.fetchApi<string[]>('/apis/garage/services/available');
  }

  async getAvailableVehicleTypes(): Promise<string[]> {
    return this.fetchApi<string[]>('/apis/garage/vehicle-types/available');
  }

  // Statistics API
  async getGarageStats(): Promise<GarageStats> {
    return this.fetchApi<GarageStats>('/apis/garage/stats');
  }

  // Nearby Search APIs
  async findNearbyGarages(
    latitude: number,
    longitude: number,
    radius: number = 10.0
  ): Promise<PublicGarageResponseDto[]> {
    return this.fetchApi<PublicGarageResponseDto[]>(
      `/apis/garage/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
  }

  async findNearbyGaragesWithPagination(
    latitude: number,
    longitude: number,
    radius: number = 10.0,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<PublicGarageResponseDto>> {
    return this.fetchApi<PaginatedResponse<PublicGarageResponseDto>>(
      `/apis/garage/nearby/paginated?latitude=${latitude}&longitude=${longitude}&radius=${radius}&page=${page}&size=${size}`
    );
  }

  // Basic Search APIs
  async searchGaragesByName(name: string): Promise<PublicGarageResponseDto[]> {
    return this.fetchApi<PublicGarageResponseDto[]>(`/apis/garage/search/name?name=${encodeURIComponent(name)}`);
  }

  async searchGaragesByAddress(address: string): Promise<PublicGarageResponseDto[]> {
    return this.fetchApi<PublicGarageResponseDto[]>(`/apis/garage/search/address?address=${encodeURIComponent(address)}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { PublicGarageResponseDto, GarageSearchParams, PaginatedResponse, GarageStats };
