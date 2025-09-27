import { useState, useCallback, useEffect } from 'react';
import { UserLocation, LocationError, getCurrentLocation, getFreshLocation, isGeolocationSupported } from '@/utils/geolocation';

interface UseUserLocationReturn {
  userLocation: UserLocation | null;
  isLocating: boolean;
  locationError: LocationError | null;
  isSupported: boolean;
  requestLocation: () => Promise<void>;
  requestFreshLocation: () => Promise<void>;
  clearLocation: () => void;
}

export function useUserLocation(): UseUserLocationReturn {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Handle SSR by setting isSupported after hydration
  useEffect(() => {
    setIsSupported(isGeolocationSupported());
  }, []);

  const requestLocation = useCallback(async () => {
    if (!isSupported) {
      setLocationError({
        code: 0,
        message: 'Trình duyệt không hỗ trợ định vị địa lý'
      });
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      // Don't use console.log to avoid console pollution
    } catch (error) {
      const locationError = error as LocationError;
      setLocationError(locationError);
      
      // Handle different error types with better user feedback
      if (locationError.code === 1) {
        // Permission denied - show helpful message
        console.warn('Location permission denied. Please enable location access in browser settings.');
      } else if (locationError.code === 2) {
        // Position unavailable
        console.warn('Location unavailable. Please check if location services are enabled.');
      } else if (locationError.code === 3) {
        // Timeout
        console.warn('Location request timed out. Please try again.');
      } else {
        console.warn('Location request failed:', locationError.message);
      }
    } finally {
      setIsLocating(false);
    }
  }, [isSupported]);

  const requestFreshLocation = useCallback(async () => {
    if (!isSupported) {
      setLocationError({
        code: 0,
        message: 'Browser does not support geolocation'
      });
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    try {
      const location = await getFreshLocation();
      setUserLocation(location);
    } catch (error) {
      const locationError = error as LocationError;
      setLocationError(locationError);
      
      // Handle different error types with better user feedback
      if (locationError.code === 1) {
        console.warn('Fresh location permission denied. Please enable location access in browser settings.');
      } else if (locationError.code === 2) {
        console.warn('Fresh location unavailable. Please check if location services are enabled.');
      } else if (locationError.code === 3) {
        console.warn('Fresh location request timed out. Please try again.');
      } else {
        console.warn('Fresh location request failed:', locationError.message);
      }
    } finally {
      setIsLocating(false);
    }
  }, [isSupported]);

  const clearLocation = useCallback(() => {
    setUserLocation(null);
    setLocationError(null);
  }, []);

  return {
    userLocation,
    isLocating,
    locationError,
    isSupported,
    requestLocation,
    requestFreshLocation,
    clearLocation
  };
}
