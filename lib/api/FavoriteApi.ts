import axiosClient from "../axiosClient";
import type { FavoriteGarage, FavoriteStatus } from "@/types/Users/favorite";

// Get user's favorite garages
export const getMyFavorites = () => {
  console.log("🔍 [FavoriteApi] Getting user favorites");
  return axiosClient.get<FavoriteGarage[]>("/apis/favorites");
};

// Check if a garage is favorited by current user
export const checkFavoriteStatus = (garageId: number) => {
  console.log("🔍 [FavoriteApi] Checking favorite status for garage:", garageId);
  return axiosClient.get<FavoriteStatus>(`/apis/favorites/check/${garageId}`);
};

// Add a garage to favorites
export const addToFavorites = (garageId: number) => {
  console.log("💖 [FavoriteApi] Adding garage to favorites:", garageId);
  return axiosClient.post(`/apis/favorites/${garageId}`);
};

// Remove a garage from favorites
export const removeFromFavorites = (garageId: number) => {
  console.log("💔 [FavoriteApi] Removing garage from favorites:", garageId);
  return axiosClient.delete(`/apis/favorites/${garageId}`);
};

// Toggle favorite status (add if not favorited, remove if favorited)
export const toggleFavorite = async (garageId: number) => {
  try {
    console.log("🔄 [FavoriteApi] Toggling favorite for garage:", garageId);
    console.log("📊 [FavoriteApi] Checking current favorite status...");
    
    const statusResponse = await checkFavoriteStatus(garageId);
    const isCurrentlyFavorited = statusResponse.data.isFavorited;
    
    console.log("📊 [FavoriteApi] Current favorite status:", isCurrentlyFavorited);
    
    if (isCurrentlyFavorited) {
      // Remove from favorites
      console.log("💔 [FavoriteApi] Removing from favorites");
      return await removeFromFavorites(garageId);
    } else {
      // Add to favorites
      console.log("💖 [FavoriteApi] Adding to favorites");
      return await addToFavorites(garageId);
    }
  } catch (error: any) {
    // Không log gì cả - chỉ throw error
    throw error;
  }
};

// Get favorite count for a garage
export const getFavoriteCount = (garageId: number) => {
  console.log("📊 [FavoriteApi] Getting favorite count for garage:", garageId);
  return axiosClient.get<{ count: number }>(`/apis/favorites/count/${garageId}`);
};
