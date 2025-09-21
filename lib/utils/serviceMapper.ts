import { Service } from '@/services/api'
import {
  Wrench,
  Droplets,
  Zap,
  Disc,
  Settings,
  Car,
  Paintbrush,
  Sparkles,
  Gauge,
  Wind,
  Hammer,
  Cog,
} from 'lucide-react'

// Mapping từ tên dịch vụ trong DB sang icon và metadata
const serviceIconMap: Record<string, any> = {
  'Sửa lốp': Car,
  'Thay dầu': Droplets,
  'Thay nhớt hộp số': Settings,
  'Kiểm tra phanh': Disc,
  'Cứu hộ xe': Wrench,
  'Sửa điều hòa': Wind,
  'Thay ắc quy': Zap,
  'Rửa xe': Sparkles,
  'Sơn xe': Paintbrush,
  'Cân chỉnh góc lái': Gauge,
  'Kiểm tra động cơ': Settings,
  'Thay bugi': Zap,
}

// Mapping từ tên dịch vụ sang thông tin bổ sung
const serviceMetadataMap: Record<string, any> = {
  'Sửa lốp': {
    vehicles: ['Xe máy', 'Ô tô'],
    priceRange: '50K - 500K',
    duration: '30-60 phút',
    popular: true,
    category: 'maintenance',
    details: {
      included: ['Sửa lốp', 'Vá lốp', 'Kiểm tra áp suất', 'Cân chỉnh'],
      process: ['Kiểm tra lốp', 'Xác định vị trí hư hỏng', 'Sửa chữa', 'Kiểm tra lại'],
      warranty: '1 tháng',
    },
  },
  'Thay dầu': {
    vehicles: ['Xe máy', 'Ô tô'],
    priceRange: '80K - 350K',
    duration: '30-60 phút',
    popular: true,
    category: 'maintenance',
    details: {
      included: ['Thay dầu động cơ', 'Thay lọc dầu', 'Kiểm tra mức dầu'],
      process: ['Kiểm tra tình trạng xe', 'Xả dầu cũ', 'Thay lọc dầu', 'Đổ dầu mới'],
      warranty: '3 tháng',
    },
  },
  'Thay nhớt hộp số': {
    vehicles: ['Ô tô'],
    priceRange: '150K - 500K',
    duration: '45-60 phút',
    popular: false,
    category: 'maintenance',
    details: {
      included: ['Thay nhớt hộp số', 'Kiểm tra hộp số', 'Điều chỉnh'],
      process: ['Kiểm tra hộp số', 'Xả nhớt cũ', 'Đổ nhớt mới', 'Test vận hành'],
      warranty: '6 tháng',
    },
  },
  'Kiểm tra phanh': {
    vehicles: ['Xe máy', 'Ô tô'],
    priceRange: '100K - 800K',
    duration: '45-90 phút',
    popular: true,
    category: 'safety',
    details: {
      included: ['Kiểm tra má phanh', 'Kiểm tra dầu phanh', 'Điều chỉnh phanh'],
      process: ['Tháo bánh xe', 'Kiểm tra má phanh', 'Kiểm tra dầu phanh', 'Lắp lại'],
      warranty: '3 tháng',
    },
  },
  'Cứu hộ xe': {
    vehicles: ['Xe máy', 'Ô tô', 'Xe tải'],
    priceRange: '200K - 1M',
    duration: '30-120 phút',
    popular: true,
    category: 'emergency',
    details: {
      included: ['Cứu hộ 24/7', 'Kéo xe', 'Sửa tại chỗ'],
      process: ['Nhận cuộc gọi', 'Di chuyển đến', 'Đánh giá tình trạng', 'Xử lý'],
      warranty: 'Theo dịch vụ',
    },
  },
  'Sửa điều hòa': {
    vehicles: ['Ô tô'],
    priceRange: '300K - 2M',
    duration: '60-180 phút',
    popular: false,
    category: 'comfort',
    details: {
      included: ['Sửa máy nén', 'Thay gas lạnh', 'Vệ sinh hệ thống'],
      process: ['Chẩn đoán lỗi', 'Tháo lắp', 'Sửa chữa', 'Test hoạt động'],
      warranty: '6 tháng',
    },
  },
  'Thay ắc quy': {
    vehicles: ['Xe máy', 'Ô tô'],
    priceRange: '400K - 3M',
    duration: '30-60 phút',
    popular: false,
    category: 'electrical',
    details: {
      included: ['Thay ắc quy mới', 'Kiểm tra hệ thống điện', 'Test khởi động'],
      process: ['Tháo ắc quy cũ', 'Lắp ắc quy mới', 'Kiểm tra kết nối', 'Test'],
      warranty: '12 tháng',
    },
  },
  'Rửa xe': {
    vehicles: ['Xe máy', 'Ô tô'],
    priceRange: '50K - 300K',
    duration: '30-120 phút',
    popular: true,
    category: 'cosmetic',
    details: {
      included: ['Rửa ngoài', 'Vệ sinh nội thất', 'Đánh bóng'],
      process: ['Xịt nước', 'Xà phòng', 'Chà rửa', 'Lau khô'],
      warranty: '1 tháng',
    },
  },
  'Sơn xe': {
    vehicles: ['Xe máy', 'Ô tô'],
    priceRange: '500K - 15M',
    duration: '1-5 ngày',
    popular: false,
    category: 'cosmetic',
    details: {
      included: ['Sơn toàn bộ', 'Sơn từng phần', 'Xử lý trầy xước'],
      process: ['Chuẩn bị bề mặt', 'Sơn lót', 'Sơn màu', 'Sơn bóng'],
      warranty: '12 tháng',
    },
  },
  'Cân chỉnh góc lái': {
    vehicles: ['Ô tô'],
    priceRange: '200K - 500K',
    duration: '30-60 phút',
    popular: false,
    category: 'maintenance',
    details: {
      included: ['Cân chỉnh góc lái', 'Kiểm tra độ chụm', 'Kiểm tra góc nghiêng'],
      process: ['Kiểm tra góc hiện tại', 'Điều chỉnh', 'Kiểm tra lại'],
      warranty: '6 tháng',
    },
  },
  'Kiểm tra động cơ': {
    vehicles: ['Xe máy', 'Ô tô'],
    priceRange: '100K - 1M',
    duration: '60-180 phút',
    popular: false,
    category: 'repair',
    details: {
      included: ['Chẩn đoán lỗi', 'Kiểm tra tổng quát', 'Báo cáo tình trạng'],
      process: ['Kết nối máy chẩn đoán', 'Kiểm tra từng bộ phận', 'Báo cáo kết quả'],
      warranty: 'Theo dịch vụ',
    },
  },
  'Thay bugi': {
    vehicles: ['Xe máy', 'Ô tô'],
    priceRange: '80K - 300K',
    duration: '30-60 phút',
    popular: false,
    category: 'maintenance',
    details: {
      included: ['Thay bugi mới', 'Kiểm tra dây bugi', 'Điều chỉnh khe hở'],
      process: ['Tháo bugi cũ', 'Kiểm tra tình trạng', 'Lắp bugi mới', 'Test'],
      warranty: '6 tháng',
    },
  },
}

export function mapServiceToUI(service: Service) {
  const metadata = serviceMetadataMap[service.name] || {
    vehicles: ['Xe máy', 'Ô tô'],
    priceRange: '100K - 500K',
    duration: '30-60 phút',
    popular: false,
    category: 'maintenance',
    details: {
      included: ['Dịch vụ chuyên nghiệp', 'Bảo hành', 'Hỗ trợ sau bán hàng'],
      process: ['Tiếp nhận', 'Thực hiện', 'Kiểm tra', 'Bàn giao'],
      warranty: '3 tháng',
    },
  }

  console.log('=== SERVICE MAPPER DEBUG ===');
  console.log('Raw service from API:', service);
  console.log('Service ID:', service.id, 'Type:', typeof service.id);
  console.log('Service Name:', service.name);
  console.log('Mapped ID will be:', service.id);
  console.log('============================');

  return {
    id: service.id, // Keep as number for URL parameters
    icon: serviceIconMap[service.name] || Wrench,
    title: service.name,
    description: service.description,
    vehicles: metadata.vehicles,
    priceRange: metadata.priceRange,
    duration: metadata.duration,
    popular: metadata.popular,
    category: metadata.category,
    details: metadata.details,
  }
}
