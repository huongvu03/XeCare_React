import axiosClient from '../axiosClient';

export interface EmergencyRequestDto {
  garageId?: number;
  description: string;
  latitude: number;
  longitude: number;
  imageUrls?: string[];
}

export interface EmergencyQuoteDto {
  emergencyRequestId: number;
  price: number;
  message: string;
}

export interface EmergencyRequest {
  id: number;
  user: {
    id: number;
    name: string;
    phone: string;
  } | null;
  garage?: {
    id: number;
    name: string;
    phone: string;
    address: string;
  } | null;
  description: string;
  latitude: number;
  longitude: number;
  status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  images: number | Array<{
    id: number;
    imageUrl: string;
  }>;
}

export interface EmergencyQuote {
  id: number;
  emergencyRequest: EmergencyRequest;
  garage: {
    id: number;
    name: string;
    phone: string;
    address: string;
  };
  price: number;
  message: string;
  accepted: boolean;
  createdAt: string;
}

class EmergencyApi {
  // Health check endpoint
  health() {
    return axiosClient.get<string>('/apis/emergency/health');
  }

  // Test endpoint
  test() {
    return axiosClient.get<any>('/apis/emergency/test');
  }

  // Tạo yêu cầu cứu hộ mới
  createEmergencyRequest(data: EmergencyRequestDto) {
    return axiosClient.post<EmergencyRequest>('/apis/emergency/request', data);
  }

  // Upload ảnh sự cố
  uploadEmergencyImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post<string>('/apis/emergency/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Lấy danh sách yêu cầu cứu hộ của user
  getMyRequests() {
    return axiosClient.get<EmergencyRequest[]>('/apis/emergency/my-requests');
  }

  // Lấy danh sách yêu cầu cứu hộ cho garage
  getGarageRequests() {
    return axiosClient.get<EmergencyRequest[]>('/apis/emergency/garage-requests');
  }

  // Lấy TẤT CẢ yêu cầu cứu hộ từ database (không cần auth)
  getAllRequests() {
    console.log('📡 [EmergencyApi] Calling getAllRequests - no auth required');
    return axiosClient.get<EmergencyRequest[]>('/apis/emergency/all-requests');
  }

  // Garage tạo báo giá (public endpoint for demo)
  async createQuote(data: EmergencyQuoteDto) {
    try {
      console.log('📡 [EmergencyApi] Creating quote with public endpoint:', data);
      const response = await axiosClient.post('/apis/emergency/create-quote', data);
      return response;
    } catch (error) {
      // Fallback to original endpoint (requires auth)
      console.log('📡 [EmergencyApi] Fallback to auth endpoint for quote creation');
      return axiosClient.post<EmergencyQuote>('/apis/emergency/quote', data);
    }
  }

  // Lấy danh sách báo giá cho một yêu cầu
  getQuotes(requestId: number) {
    return axiosClient.get<EmergencyQuote[]>(`/apis/emergency/quotes/${requestId}`);
  }

  // User chấp nhận báo giá
  acceptQuote(quoteId: number) {
    return axiosClient.post<EmergencyQuote>(`/apis/emergency/quotes/${quoteId}/accept`);
  }

  // Lấy danh sách garage gần nhất (sử dụng GarageApi)
  getNearbyGarages(latitude: number, longitude: number, radius: number = 10) {
    return axiosClient.get(`/apis/garages/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
  }

  // Cập nhật trạng thái yêu cầu cứu hộ - Chấp nhận request (public endpoint)
  async updateRequestStatus(requestId: number, status: string) {
    try {
      console.log('📡 [EmergencyApi] Updating request status:', requestId, 'to', status);
      
      // Use specific endpoint for ACCEPTED status  
      if (status.toUpperCase() === 'ACCEPTED') {
        console.log('📡 [EmergencyApi] Using accept-request endpoint');
        const response = await axiosClient.get(`/apis/emergency/accept-request/${requestId}`);
        return response;
      }
      
      // For other statuses, fallback to original endpoint
      console.log('📡 [EmergencyApi] Fallback to auth endpoint for other status updates');
      return axiosClient.put<EmergencyRequest>(`/apis/emergency/requests/${requestId}/status?status=${status}`);
    } catch (error) {
      console.log('📡 [EmergencyApi] Error updating status:', error);
      throw error;
    }
  }

  // Xóa yêu cầu cứu hộ (public endpoint for demo)
  async deleteRequest(requestId: number) {
    console.log('📡 [EmergencyApi] Deleting emergency request:', requestId);
    return axiosClient.delete(`/apis/emergency/delete-request/${requestId}`);
  }

  // Hoàn thành yêu cầu cứu hộ
  completeRequest(requestId: number) {
    return axiosClient.post<EmergencyRequest>(`/apis/emergency/requests/${requestId}/complete`);
  }

  // Lấy chi tiết yêu cầu cứu hộ
  async getRequestById(requestId: number) {
    try {
      // Strategy: Get all requests and find the specific one (no auth required)
      console.log('📡 [EmergencyApi] Getting request details via all-requests for ID:', requestId);
      const allRequestsResponse = await this.getAllRequests();
      
      if (allRequestsResponse.data && Array.isArray(allRequestsResponse.data)) {
        const foundRequest = allRequestsResponse.data.find(req => req.id === requestId);
        
        if (foundRequest) {
          console.log('✅ Found request in all-requests:', foundRequest.id);
          return { data: foundRequest };
        } else {
          console.log('❌ Request not found in all-requests for ID:', requestId);
          throw new Error('Request not found');
        }
      } else {
        throw new Error('No data received from all-requests');
      }
    } catch (error) {
      // Fallback to original endpoint (requires auth) 
      console.log('📡 [EmergencyApi] Fallback to auth endpoint for ID:', requestId);
      return axiosClient.get<EmergencyRequest>(`/apis/emergency/requests/${requestId}`);
    }
  }
}

export default new EmergencyApi();
