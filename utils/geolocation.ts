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
      timeout: 15000, // 15 seconds - increased timeout
      maximumAge: 60000 // 1 minute - shorter cache to get fresh location
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
        let message = 'Unable to get current location';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            message = 'Location access denied. Please click "Allow" in the browser permission popup or enable location access in browser settings.';
            break;
          case 2: // POSITION_UNAVAILABLE
            message = 'Location information is unavailable. Please check if location services are enabled on your device.';
            break;
          case 3: // TIMEOUT
            message = 'Location request timed out. Please make sure you are in an area with good GPS signal and try again.';
            break;
          default:
            message = `Location request failed: ${error.message}`;
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

/**
 * Force get user's current location with fresh settings (no cache)
 */
export const getFreshLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Browser does not support geolocation'
      });
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 20000, // 20 seconds for fresh location
      maximumAge: 0 // No cache - force fresh location
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
        let message = 'Unable to get fresh location';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            message = 'Location access denied. Please enable location permission in browser settings and try again.';
            break;
          case 2: // POSITION_UNAVAILABLE
            message = 'Location information is unavailable. Please check device location services.';
            break;
          case 3: // TIMEOUT
            message = 'Location request timed out. Please try again in an area with better GPS signal.';
            break;
          default:
            message = `Fresh location request failed: ${error.message}`;
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
