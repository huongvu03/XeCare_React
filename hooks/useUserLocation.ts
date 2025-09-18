import { useState, useCallback, useEffect } from 'react';
import { UserLocation, LocationError, getCurrentLocation, isGeolocationSupported } from '@/utils/geolocation';

interface UseUserLocationReturn {
  userLocation: UserLocation | null;
  isLocating: boolean;
  locationError: LocationError | null;
  isSupported: boolean;
  requestLocation: () => Promise<void>;
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
      console.log('User location:', location);
    } catch (error) {
      setLocationError(error as LocationError);
      console.error('Location error:', error);
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
    clearLocation
  };
}
