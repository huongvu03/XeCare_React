"use client";

import { useState, useEffect } from "react";
import { Heart, MapPin, Phone, Mail, Star, CheckCircle, Clock, Navigation, Info, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getMyFavorites, removeFromFavorites } from "@/lib/api/FavoriteApi";
import type { FavoriteGarage } from "@/types/Users/favorite";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteGarage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      // Redirect to login if not authenticated
      router.push("/auth");
    }
  }, [user, router]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      console.log("🔍 [FavoritesPage] Loading user favorites...");
      
      const response = await getMyFavorites();
      console.log("✅ [FavoritesPage] Favorites loaded:", response.data);
      
      setFavorites(response.data);
    } catch (error: any) {
      console.error("❌ [FavoritesPage] Error loading favorites:", error);
      
      try {
        if (error.response?.status === 401) {
          console.log("🔐 [FavoritesPage] Unauthorized");
          toast({
            title: "Vui lòng đăng nhập",
            description: "Bạn cần đăng nhập để xem danh sách yêu thích",
            variant: "destructive",
          });
          router.push("/auth");
          return;
        }
        
        if (error.response?.status === 403) {
          console.log("🚫 [FavoritesPage] Access forbidden");
          toast({
            title: "Không có quyền truy cập",
            description: "Bạn không có quyền xem danh sách yêu thích",
            variant: "destructive",
          });
          return;
        }
        
        if (error.response?.status === 500) {
          const errorMessage = error.response?.data;
          if (errorMessage && typeof errorMessage === 'string') {
            if (errorMessage.includes("Database table 'Favorites' does not exist")) {
              console.log("🗄️ [FavoritesPage] Database table missing");
              toast({
                title: "Lỗi hệ thống",
                description: "Bảng dữ liệu yêu thích chưa được tạo. Vui lòng liên hệ admin.",
                variant: "destructive",
              });
            } else if (errorMessage.includes("Cannot access database")) {
              console.log("🔌 [FavoritesPage] Database connection error");
              toast({
                title: "Lỗi kết nối",
                description: "Không thể kết nối database. Vui lòng thử lại sau.",
                variant: "destructive",
              });
            } else {
              console.log("💥 [FavoritesPage] Server error");
              toast({
                title: "Lỗi server",
                description: "Có lỗi xảy ra ở server. Vui lòng thử lại sau.",
                variant: "destructive",
              });
            }
          } else {
            console.log("💥 [FavoritesPage] Server error (unknown format)");
            toast({
              title: "Lỗi server",
              description: "Có lỗi xảy ra ở server. Vui lòng thử lại sau.",
              variant: "destructive",
            });
          }
          return;
        }
        
        // Lỗi khác
        console.log("❓ [FavoritesPage] Unknown error");
        toast({
          title: "Lỗi không xác định",
          description: "Có lỗi xảy ra khi tải danh sách yêu thích. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } catch (toastError) {
        console.error("❌ [FavoritesPage] Toast error failed:", toastError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (garageId: number) => {
    try {
      setIsRemoving(garageId);
      console.log("💔 [FavoritesPage] Removing favorite for garage:", garageId);
      
      await removeFromFavorites(garageId);
      console.log("✅ [FavoritesPage] Favorite removed successfully");
      
      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav.garageId !== garageId));
      
      toast({
        title: "Đã bỏ yêu thích",
        description: "Garage đã được bỏ khỏi danh sách yêu thích",
        variant: "default",
      });
    } catch (error: any) {
      console.error("❌ [FavoritesPage] Error removing favorite:", error);
      
      if (error.response?.status === 401) {
        console.log("🔑 [FavoritesPage] Token expired, redirecting to login");
        toast({
          title: "Phiên đăng nhập hết hạn",
          description: "Vui lòng đăng nhập lại để tiếp tục",
          variant: "destructive",
        });
        router.push("/auth");
        return;
      }
      
      toast({
        title: "Lỗi",
        description: "Không thể bỏ yêu thích. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(null);
    }
  };

  const handleGarageClick = (garageId: number) => {
    console.log("🔍 [FavoritesPage] Navigating to garage:", garageId);
    router.push(`/garage-detail/${garageId}`);
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          {/* Professional Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 shadow-2xl mb-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
            
            <div className="relative p-8 text-white">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Danh Sách Yêu Thích</h1>
                  <p className="text-pink-100 text-lg mt-2">Các garage bạn đã yêu thích</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border-0">
                <Skeleton className="h-48 w-full" />
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          {/* Professional Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 shadow-2xl mb-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
            
            <div className="relative p-8 text-white">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Danh Sách Yêu Thích</h1>
                  <p className="text-pink-100 text-lg mt-2">Các garage bạn đã yêu thích</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Empty State */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-0 overflow-hidden">
            <div className="p-12 text-center">
              <div className="relative mx-auto w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-r from-pink-100 to-red-100 rounded-full flex items-center justify-center shadow-xl">
                  <Heart className="h-16 w-16 text-pink-500" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Chưa có garage yêu thích
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Bạn chưa có garage nào trong danh sách yêu thích. Hãy khám phá và thêm garage yêu thích!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => router.push("/search")}
                  className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Tìm Kiếm Garage
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/")}
                  className="border-pink-200 text-pink-700 hover:bg-pink-50 px-8 py-3 rounded-xl transition-all duration-300"
                >
                  Về Trang Chủ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Professional Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 shadow-2xl mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative p-8 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Danh Sách Yêu Thích</h1>
                  <p className="text-pink-100 text-lg mt-2">Các garage bạn đã yêu thích</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold">{favorites.length}</div>
                <div className="text-pink-100 text-sm">Garage yêu thích</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            {/* Enhanced Garage Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              {favorite.garageImageUrl ? (
                <Image
                  src={favorite.garageImageUrl}
                  alt={favorite.garageName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Heart className="h-8 w-8 text-pink-500" />
                    </div>
                    <span className="text-gray-500 text-sm font-medium">No Image</span>
                  </div>
                </div>
              )}
              
              {/* Enhanced Status Badge */}
              <div className="absolute top-3 left-3">
                <Badge 
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                    favorite.garageStatus === "ACTIVE" 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                  }`}
                >
                  {favorite.garageStatus === "ACTIVE" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {favorite.garageStatus === "ACTIVE" ? "Hoạt động" : "Tạm ngưng"}
                </Badge>
              </div>

              {/* Enhanced Verification Badge */}
              {favorite.garageIsVerified && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    Đã xác thực
                  </Badge>
                </div>
              )}

              {/* Enhanced Remove Favorite Button */}
              <Button
                size="sm"
                className="absolute bottom-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => handleRemoveFavorite(favorite.garageId)}
                disabled={isRemoving === favorite.garageId}
              >
                {isRemoving === favorite.garageId ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Enhanced Garage Info */}
            <CardHeader className="pb-4">
              <CardTitle 
                className="text-xl font-bold cursor-pointer hover:text-pink-600 transition-colors duration-300"
                onClick={() => handleGarageClick(favorite.garageId)}
              >
                {favorite.garageName}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <span className="truncate font-medium">{favorite.garageAddress}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {/* Enhanced Contact Info */}
              <div className="space-y-3">
                {favorite.garagePhone && (
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">{favorite.garagePhone}</span>
                  </div>
                )}
                {favorite.garageEmail && (
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Mail className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="truncate font-medium">{favorite.garageEmail}</span>
                  </div>
                )}
              </div>

              {/* Enhanced Description */}
              {favorite.garageDescription && (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                    {favorite.garageDescription}
                  </p>
                </div>
              )}

              {/* Enhanced Location Info */}
              {favorite.garageLatitude && favorite.garageLongitude && (
                <div className="flex items-center text-xs text-gray-600 bg-blue-50 rounded-lg p-2">
                  <Navigation className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-mono">
                    {favorite.garageLatitude.toFixed(6)}, {favorite.garageLongitude.toFixed(6)}
                  </span>
                </div>
              )}

              {/* Enhanced Added Date */}
              <div className="flex items-center text-xs text-gray-500 bg-pink-50 rounded-lg p-2">
                <Calendar className="h-4 w-4 mr-2 text-pink-600" />
                <span className="font-medium">
                  Đã thêm {formatDistanceToNow(new Date(favorite.favoritedAt), { 
                    addSuffix: true, 
                    locale: vi 
                  })}
                </span>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 rounded-xl transition-all duration-300"
                  onClick={() => handleGarageClick(favorite.garageId)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Xem Chi Tiết
                </Button>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 hover:scale-105"
                  onClick={() => handleRemoveFavorite(favorite.garageId)}
                  disabled={isRemoving === favorite.garageId}
                >
                  {isRemoving === favorite.garageId ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Bỏ Yêu Thích
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
}
