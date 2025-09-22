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
      console.log('🚀 [EmergencyApi] Updating request status:', requestId, 'to', status);
      
      // Use specific endpoint for ACCEPTED status  
      if (status.toUpperCase() === 'ACCEPTED') {
        console.log('✅ [EmergencyApi] Using NO-AUTH accept endpoint - NO AUTH REQUIRED');
        const response = await axiosClient.get(`/noauth/emergency/accept/${requestId}`);
        console.log('🎉 [EmergencyApi] Accept request successful:', response.data);
        
        if (response.data && response.data.success) {
          console.log('✅ [EmergencyApi] Request accepted successfully:', response.data.message);
        } else {
          console.log('⚠️ [EmergencyApi] Accept response indicates failure:', response.data);
        }
        
        return response;
      }
      
      // For CANCELLED status, use delete endpoint
      if (status.toUpperCase() === 'CANCELLED') {
        console.log('🗑️ [EmergencyApi] Using delete-request endpoint for cancellation');
        const response = await axiosClient.delete(`/apis/emergency/delete-request/${requestId}`);
        console.log('✅ [EmergencyApi] Delete request successful:', response.data);
        return response;
      }
      
      // For other statuses, use change-status endpoint (public)
      console.log('🔄 [EmergencyApi] Using change-status endpoint for status:', status);
      const response = await axiosClient.get(`/apis/emergency/change-status/${requestId}/${status}`);
      console.log('✅ [EmergencyApi] Change status successful:', response.data);
      return response;
    } catch (error: any) {
      console.log('❌ [EmergencyApi] Error updating status:', error);
      console.log('❌ [EmergencyApi] Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  // Xóa yêu cầu cứu hộ (public endpoint for demo)
  async deleteRequest(requestId: number) {
    console.log('📡 [EmergencyApi] Deleting emergency request:', requestId);
    return axiosClient.delete(`/apis/emergency/delete-request/${requestId}`);
  }

  // Hoàn thành yêu cầu cứu hộ (sử dụng public endpoint)
  async completeRequest(requestId: number) {
    try {
      console.log('🚀 [EmergencyApi] Completing request:', requestId);
      
      // Use change-status endpoint to set status to COMPLETED (public)
      console.log('✅ [EmergencyApi] Using NO-AUTH change-status endpoint for COMPLETED - NO AUTH REQUIRED');
      const response = await axiosClient.get(`/noauth/emergency/change-status/${requestId}/COMPLETED`);
      console.log('🎉 [EmergencyApi] Complete request successful:', response.data);
      
      if (response.data && response.data.success) {
        console.log('✅ [EmergencyApi] Request completed successfully:', response.data.message);
      } else {
        console.log('⚠️ [EmergencyApi] Complete response indicates failure:', response.data);
      }
      
      return response;
    } catch (error: any) {
      console.log('❌ [EmergencyApi] Error completing request:', error);
      console.log('❌ [EmergencyApi] Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
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
