import { PublicGarageResponseDto, GarageStats } from './api';

// Mock data cho garage
export const mockGarages: PublicGarageResponseDto[] = [
  {
    id: 1,
    name: "Garage Ô Tô Minh Khai",
    address: "123 Đường Minh Khai, Quận Hai Bà Trưng, Hà Nội",
    description: "Chuyên sửa chữa, bảo dưỡng ô tô các loại. Đội ngũ kỹ thuật viên giàu kinh nghiệm, trang thiết bị hiện đại.",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    status: "ACTIVE",
    isVerified: true,
    averageRating: 4.5,
    totalReviews: 128,
    serviceNames: ["Sửa chữa động cơ", "Bảo dưỡng định kỳ", "Thay dầu nhớt", "Sửa điện"],
    vehicleTypeNames: ["Ô tô", "Xe tải nhẹ"],
    phone: "024-1234-5678",
    email: "minhkhai@garage.com",
    latitude: 21.0285,
    longitude: 105.8542
  },
  {
    id: 2,
    name: "Trung Tâm Bảo Dưỡng Xe Máy Hồng Hà",
    address: "456 Đường Hồng Hà, Quận Ba Đình, Hà Nội",
    description: "Chuyên bảo dưỡng, sửa chữa xe máy các hãng. Giá cả hợp lý, chất lượng đảm bảo.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    status: "ACTIVE",
    isVerified: true,
    averageRating: 4.2,
    totalReviews: 95,
    serviceNames: ["Bảo dưỡng xe máy", "Sửa chữa điện", "Thay phụ tùng", "Rửa xe"],
    vehicleTypeNames: ["Xe máy"],
    phone: "024-9876-5432",
    email: "hongha@garage.com",
    latitude: 21.0352,
    longitude: 105.8344
  },
  {
    id: 3,
    name: "Garage Xe Tải Thăng Long",
    address: "789 Đường Láng, Quận Đống Đa, Hà Nội",
    description: "Chuyên sửa chữa xe tải, xe khách. Có xưởng rộng rãi, thiết bị chuyên dụng.",
    imageUrl: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop",
    status: "ACTIVE",
    isVerified: false,
    averageRating: 3.8,
    totalReviews: 67,
    serviceNames: ["Sửa chữa xe tải", "Bảo dưỡng động cơ", "Thay phụ tùng", "Kiểm tra an toàn"],
    vehicleTypeNames: ["Xe tải", "Xe khách"],
    phone: "024-5555-1234",
    email: "thanglong@garage.com",
    latitude: 21.0122,
    longitude: 105.8019
  },
  {
    id: 4,
    name: "Garage Ô Tô Cao Cấp Mercedes",
    address: "321 Đường Trần Duy Hưng, Quận Cầu Giấy, Hà Nội",
    description: "Chuyên sửa chữa, bảo dưỡng xe Mercedes. Đội ngũ kỹ thuật viên được đào tạo chuyên sâu.",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop",
    status: "ACTIVE",
    isVerified: true,
    averageRating: 4.7,
    totalReviews: 203,
    serviceNames: ["Bảo dưỡng Mercedes", "Sửa chữa điện tử", "Thay dầu nhớt", "Kiểm tra hệ thống"],
    vehicleTypeNames: ["Ô tô"],
    phone: "024-8888-9999",
    email: "mercedes@garage.com",
    latitude: 21.0367,
    longitude: 105.7820
  },
  {
    id: 5,
    name: "Garage Xe Máy Điện Future",
    address: "654 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
    description: "Chuyên sửa chữa, bảo dưỡng xe máy điện. Cập nhật công nghệ mới nhất.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    status: "ACTIVE",
    isVerified: true,
    averageRating: 4.3,
    totalReviews: 156,
    serviceNames: ["Sửa chữa xe điện", "Thay pin", "Bảo dưỡng động cơ điện", "Sửa chữa điện tử"],
    vehicleTypeNames: ["Xe máy điện"],
    phone: "024-7777-8888",
    email: "future@garage.com",
    latitude: 21.0015,
    longitude: 105.8165
  },
  {
    id: 6,
    name: "Garage Ô Tô Nhật Bản",
    address: "987 Đường Lê Văn Lương, Quận Thanh Xuân, Hà Nội",
    description: "Chuyên sửa chữa xe Nhật: Toyota, Honda, Nissan, Mazda. Chất lượng Nhật Bản.",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    status: "ACTIVE",
    isVerified: true,
    averageRating: 4.6,
    totalReviews: 189,
    serviceNames: ["Sửa chữa xe Nhật", "Bảo dưỡng định kỳ", "Thay dầu nhớt", "Sửa điện"],
    vehicleTypeNames: ["Ô tô"],
    phone: "024-6666-7777",
    email: "nhatban@garage.com",
    latitude: 21.0015,
    longitude: 105.8165
  },
  {
    id: 7,
    name: "Garage Xe Tải Hà Nội",
    address: "147 Đường Võ Chí Công, Quận Tây Hồ, Hà Nội",
    description: "Chuyên sửa chữa xe tải, xe container. Có cần cẩu, thiết bị nâng hạ chuyên dụng.",
    imageUrl: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop",
    status: "ACTIVE",
    isVerified: false,
    averageRating: 3.9,
    totalReviews: 78,
    serviceNames: ["Sửa chữa xe tải", "Sửa chữa container", "Thay phụ tùng", "Bảo dưỡng động cơ"],
    vehicleTypeNames: ["Xe tải", "Xe container"],
    phone: "024-5555-6666",
    email: "hanoi@garage.com",
    latitude: 21.0819,
    longitude: 105.8234
  },
  {
    id: 8,
    name: "Garage Xe Máy Thể Thao",
    address: "258 Đường Nguyễn Văn Huyên, Quận Cầu Giấy, Hà Nội",
    description: "Chuyên sửa chữa xe máy thể thao, xe phân khối lớn. Đội ngũ kỹ thuật viên trẻ, năng động.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    status: "ACTIVE",
    isVerified: true,
    averageRating: 4.4,
    totalReviews: 112,
    serviceNames: ["Sửa chữa xe thể thao", "Tuning xe", "Thay phụ tùng", "Bảo dưỡng động cơ"],
    vehicleTypeNames: ["Xe máy"],
    phone: "024-4444-5555",
    email: "thethao@garage.com",
    latitude: 21.0367,
    longitude: 105.7820
  }
];

// Mock data cho services
export const mockServices: string[] = [
  "Sửa chữa động cơ",
  "Bảo dưỡng định kỳ",
  "Thay dầu nhớt",
  "Sửa điện",
  "Bảo dưỡng xe máy",
  "Sửa chữa điện",
  "Thay phụ tùng",
  "Rửa xe",
  "Sửa chữa xe tải",
  "Bảo dưỡng động cơ",
  "Kiểm tra an toàn",
  "Bảo dưỡng Mercedes",
  "Sửa chữa điện tử",
  "Kiểm tra hệ thống",
  "Sửa chữa xe điện",
  "Thay pin",
  "Bảo dưỡng động cơ điện",
  "Sửa chữa xe Nhật",
  "Sửa chữa container",
  "Sửa chữa xe thể thao",
  "Tuning xe"
];

// Mock data cho vehicle types
export const mockVehicleTypes: string[] = [
  "Ô tô",
  "Xe máy",
  "Xe tải",
  "Xe khách",
  "Xe máy điện",
  "Xe container"
];

// Mock data cho stats
export const mockStats: GarageStats = {
  totalGarages: 156,
  activeGarages: 142,
  pendingGarages: 8,
  inactiveGarages: 6
};

// Mock API functions
export const mockApiClient = {
  searchGaragesAdvanced: async (params: any): Promise<PublicGarageResponseDto[]> => {
    // Debug log
    console.log('MockAPI: searchGaragesAdvanced called with params:', JSON.stringify(params, null, 2));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredGarages = [...mockGarages];
    
    if (params.name) {
      filteredGarages = filteredGarages.filter(garage => 
        garage.name.toLowerCase().includes(params.name.toLowerCase())
      );
    }
    
    if (params.address) {
      filteredGarages = filteredGarages.filter(garage => 
        garage.address.toLowerCase().includes(params.address.toLowerCase())
      );
    }
    
    if (params.service) {
      filteredGarages = filteredGarages.filter(garage => 
        garage.serviceNames.some(service => 
          service.toLowerCase().includes(params.service.toLowerCase())
        )
      );
    }
    
    if (params.vehicleType) {
      filteredGarages = filteredGarages.filter(garage => 
        garage.vehicleTypeNames.some(type => 
          type.toLowerCase().includes(params.vehicleType.toLowerCase())
        )
      );
    }
    
    if (params.minRating) {
      filteredGarages = filteredGarages.filter(garage => 
        garage.averageRating >= params.minRating
      );
    }
    
    if (params.maxRating) {
      filteredGarages = filteredGarages.filter(garage => 
        garage.averageRating <= params.maxRating
      );
    }
    
    if (params.isVerified !== undefined) {
      filteredGarages = filteredGarages.filter(garage => 
        garage.isVerified === params.isVerified
      );
    }
    
    console.log(`MockAPI: Returning ${filteredGarages.length} garages out of ${mockGarages.length} total`);
    return filteredGarages;
  },
  
  getAvailableServices: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockServices;
  },
  
  getAvailableVehicleTypes: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockVehicleTypes;
  },
  
  getGarageStats: async (): Promise<GarageStats> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStats;
  }
};
