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
  verified: boolean; // Backend returns 'verified', not 'isVerified'
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
  service?: string | string[];
  vehicleType?: string | string[];
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
      if (Array.isArray(value)) {
        // Xử lý arrays - thêm từng giá trị riêng biệt
        value.forEach(item => {
          if (item !== undefined && item !== null && item !== '') {
            searchParams.append(key, item.toString());
          }
        });
      } else {
        searchParams.append(key, value.toString());
      }
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
    
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('API Request:', { url, options: defaultOptions });
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        console.error('API Error:', { url, status: response.status, statusText: response.statusText });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      // Check if response is HTML (error page) instead of JSON
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error('Server returned HTML instead of JSON:', { url, text: text.substring(0, 200) });
        throw new Error('Server returned HTML error page instead of JSON response. Please check if the backend server is running.');
      }

      // Try to parse JSON
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', { url, text: text.substring(0, 200), parseError });
        throw new Error(`Invalid JSON response from server: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      }
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Garage Search APIs
  async searchGaragesAdvanced(params: GarageSearchParams): Promise<PublicGarageResponseDto[]> {
    const queryString = buildQueryString(params);
    console.log('API: searchGaragesAdvanced called with params:', params);
    console.log('API: queryString:', queryString);
    const result = await this.fetchApi<PublicGarageResponseDto[]>(`/apis/garage/search/advanced?${queryString}`);
    console.log('API: searchGaragesAdvanced result:', result);
    return result;
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

