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

export interface Service {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
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

// Utility function để serialize error objects safely
function serializeError(error: any): Record<string, any> {
  const serialized: Record<string, any> = {};
  
  // Basic properties
  if (error?.message) serialized.message = error.message;
  if (error?.name) serialized.name = error.name;
  if (error?.code) serialized.code = error.code;
  if (error?.stack) serialized.stack = error.stack;
  
  // HTTP response properties
  if (error?.response) {
    serialized.response = {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    };
  }
  
  // Config/request properties
  if (error?.config) {
    serialized.config = {
      url: error.config.url,
      method: error.config.method,
      baseURL: error.config.baseURL
    };
  }
  
  // Additional properties
  if (error?.url) serialized.url = error.url;
  if (error?.status) serialized.status = error.status;
  if (error?.statusText) serialized.statusText = error.statusText;
  
  // Try to get all enumerable properties
  try {
    const enumerableProps = Object.getOwnPropertyNames(error);
    enumerableProps.forEach(prop => {
      if (!serialized[prop] && typeof error[prop] !== 'function') {
        try {
          serialized[prop] = error[prop];
        } catch (e) {
          serialized[prop] = '[Cannot serialize]';
        }
      }
    });
  } catch (e) {
    serialized.enumerablePropsError = 'Cannot enumerate properties';
  }
  
  return serialized;
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
        console.error('API Error:', { 
          url, 
          status: response.status, 
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        // Provide more specific error messages based on status
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        if (response.status === 404) {
          errorMessage = `Endpoint not found (404): ${url}. Please check if the backend server is running and the endpoint exists.`;
        } else if (response.status === 500) {
          errorMessage = `Server error (500): ${url}. The backend server encountered an internal error.`;
        } else if (response.status === 401) {
          errorMessage = `Unauthorized (401): ${url}. Please check your authentication token.`;
        } else if (response.status === 403) {
          errorMessage = `Forbidden (403): ${url}. You don't have permission to access this resource.`;
        }
        
        throw new Error(errorMessage);
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      // Check if response is HTML (error page) instead of JSON
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error('Server returned HTML instead of JSON:', { 
          url, 
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          text: text.substring(0, 200) 
        });
        
        // Provide more specific error messages based on status
        let errorMessage = 'Server returned HTML error page instead of JSON response.';
        if (response.status === 404) {
          errorMessage = `Endpoint not found (404): ${url}. Please check if the backend server is running and the endpoint exists.`;
        } else if (response.status === 500) {
          errorMessage = `Server error (500): ${url}. The backend server encountered an internal error.`;
        } else if (response.status === 0 || !response.status) {
          errorMessage = `Network error: Cannot connect to backend server at ${this.baseUrl}. Please check if the server is running.`;
        } else {
          errorMessage = `Server error (${response.status}): ${url}. Please check if the backend server is running.`;
        }
        
        throw new Error(errorMessage);
      }

      // Try to parse JSON
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', { url, text: text.substring(0, 200), parseError });
        throw new Error(`Invalid JSON response from server: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      }
    } catch (error: any) {
      // Create a more detailed error object for better debugging
      const errorDetails = {
        message: error?.message || 'Unknown error',
        name: error?.name || 'No error name',
        url: url,
        baseUrl: this.baseUrl,
        status: error?.response?.status || error?.status || 'No status',
        statusText: error?.response?.statusText || error?.statusText || 'No status text',
        code: error?.code || 'No error code',
        stack: error?.stack || 'No stack trace'
      };
      
      console.error('API call failed:', errorDetails);
      console.error('Serialized error:', serializeError(error));
      console.error('Raw error object:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      
      // Handle specific network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error(`Network error: Cannot connect to backend server at ${this.baseUrl}. Please check if the server is running.`);
        networkError.cause = error;
        throw networkError;
      } else if (error.name === 'AbortError') {
        const timeoutError = new Error(`Request timeout: The request to ${url} took too long to complete.`);
        timeoutError.cause = error;
        throw timeoutError;
      }
      
      // Create a new error with better information
      const enhancedError = new Error(errorDetails.message);
      enhancedError.cause = error;
      enhancedError.name = errorDetails.name;
      
      // Add custom properties for debugging
      (enhancedError as any).url = url;
      (enhancedError as any).baseUrl = this.baseUrl;
      (enhancedError as any).status = errorDetails.status;
      (enhancedError as any).statusText = errorDetails.statusText;
      (enhancedError as any).code = errorDetails.code;
      
      throw enhancedError;
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

  // Services API
  async getAllServices(): Promise<Service[]> {
    // Use public endpoint instead of admin endpoint to avoid authentication issues
    try {
      const serviceNames = await this.fetchApi<string[]>('/apis/garage/services/available');
      // Convert service names to Service objects
      return serviceNames.map((name, index) => ({
        id: index + 1,
        name: name,
        description: `Service: ${name}`,
        isActive: true
      }));
    } catch (error) {
      console.error('Error fetching services from public endpoint:', error);
      // Fallback to admin endpoint if public endpoint fails
      return this.fetchApi<Service[]>('/apis/admin/services');
    }
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

