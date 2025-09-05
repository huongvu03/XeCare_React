export interface FavoriteGarage {
  id: number;
  garageId: number;
  garageName: string;
  garageAddress: string;
  garagePhone: string;
  garageEmail: string;
  garageDescription: string;
  garageImageUrl?: string;
  garageStatus: string;
  garageIsVerified: boolean;
  garageLatitude?: number;
  garageLongitude?: number;
  favoritedAt: string;
}

export interface FavoriteStatus {
  garageId: number;
  isFavorited: boolean;
}
