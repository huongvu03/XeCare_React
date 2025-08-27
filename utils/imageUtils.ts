import { config } from '../config/env';

/**
 * Chuyển đổi relative URL từ backend thành full URL
 * @param imageUrl - Relative URL từ backend (ví dụ: /uploads/garages/...)
 * @returns Full URL để hiển thị hình ảnh
 */
export function getFullImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '/images/garage-placeholder.jpg';
  }

  // Nếu đã là full URL thì trả về nguyên
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Nếu là relative URL thì thêm base URL
  if (imageUrl.startsWith('/')) {
    return `${config.API_BASE_URL}${imageUrl}`;
  }

  // Nếu không có / ở đầu thì thêm
  return `${config.API_BASE_URL}/${imageUrl}`;
}

/**
 * Kiểm tra xem URL có phải là placeholder không
 * @param imageUrl - URL hình ảnh
 * @returns true nếu là placeholder
 */
export function isPlaceholderImage(imageUrl: string): boolean {
  return !imageUrl || 
         imageUrl.includes('placeholder') ||
         imageUrl === '/images/garage-placeholder.jpg';
}

/**
 * Lấy placeholder image URL
 * @returns URL của placeholder image
 */
export function getPlaceholderImageUrl(): string {
  return '/images/garage-placeholder.jpg';
}
