export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationError {
  code: number;
  message: string;
}

/**
 * Get user's current location using Geolocation API
 */
export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Trình duyệt không hỗ trợ định vị địa lý'
      });
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let message = 'Không thể lấy vị trí hiện tại';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Bạn đã từ chối quyền truy cập vị trí. Vui lòng bật định vị trong cài đặt trình duyệt.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Thông tin vị trí không khả dụng';
            break;
          case error.TIMEOUT:
            message = 'Yêu cầu lấy vị trí đã hết thời gian chờ';
            break;
        }
        
        reject({
          code: error.code,
          message
        });
      },
      options
    );
  });
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}km`;
};

/**
 * Check if geolocation is supported
 */
export const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator;
};
