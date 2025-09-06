import { useMemo } from 'react';
import { PublicGarageResponseDto } from '@/services/api';
import { UserLocation, calculateDistance } from '@/utils/geolocation';

interface GarageWithDistance extends PublicGarageResponseDto {
  distanceFromUser?: number;
}

interface UseNearbyGaragesOptions {
  maxDistance?: number; // Maximum distance in km
  sortByDistance?: boolean;
}

interface UseNearbyGaragesReturn {
  sortedGarages: GarageWithDistance[];
  nearbyGarages: GarageWithDistance[];
  averageDistance: number;
}

export function useNearbyGarages(
  garages: PublicGarageResponseDto[],
  userLocation: UserLocation | null,
  options: UseNearbyGaragesOptions = {}
): UseNearbyGaragesReturn {
  const {
    maxDistance = 50, // Default 50km
    sortByDistance = true
  } = options;

  const result = useMemo(() => {
    if (!userLocation || !garages.length) {
      return {
        sortedGarages: garages as GarageWithDistance[],
        nearbyGarages: garages as GarageWithDistance[],
        averageDistance: 0
      };
    }

    // Calculate distance for each garage
    const garagesWithDistance: GarageWithDistance[] = garages.map(garage => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        garage.latitude,
        garage.longitude
      );

      return {
        ...garage,
        distanceFromUser: distance
      };
    });

    // Filter nearby garages (within maxDistance)
    const nearbyGarages = garagesWithDistance.filter(
      garage => garage.distanceFromUser! <= maxDistance
    );

    // Sort by distance if requested
    const sortedGarages = sortByDistance
      ? [...garagesWithDistance].sort((a, b) => 
          (a.distanceFromUser || Infinity) - (b.distanceFromUser || Infinity)
        )
      : garagesWithDistance;

    // Calculate average distance
    const totalDistance = garagesWithDistance.reduce(
      (sum, garage) => sum + (garage.distanceFromUser || 0), 
      0
    );
    const averageDistance = garagesWithDistance.length > 0 
      ? Math.round((totalDistance / garagesWithDistance.length) * 100) / 100
      : 0;

    return {
      sortedGarages,
      nearbyGarages,
      averageDistance
    };
  }, [garages, userLocation, maxDistance, sortByDistance]);

  return result;
}
