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
    router.push(`/garage/${garageId}`);
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh Sách Yêu Thích</h1>
          <p className="text-gray-600">Các garage bạn đã yêu thích</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
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
    );
  }

  // Show empty state
  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Chưa có garage yêu thích
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn chưa có garage nào trong danh sách yêu thích. Hãy khám phá và thêm garage yêu thích!
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push("/search")}>
              Tìm Kiếm Garage
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Về Trang Chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh Sách Yêu Thích</h1>
        <p className="text-gray-600">
          Bạn có {favorites.length} garage trong danh sách yêu thích
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Garage Image */}
            <div className="relative h-48 bg-gray-200">
              {favorite.garageImageUrl ? (
                <Image
                  src={favorite.garageImageUrl}
                  alt={favorite.garageName}
                  fill
                  className="object-cover"
                />
                               ) : (
                   <div className="flex items-center justify-center h-full text-gray-500">
                     <div className="h-16 w-16 bg-gray-300 rounded-lg flex items-center justify-center">
                       <span className="text-gray-500 text-sm">No Image</span>
                     </div>
                   </div>
                 )}
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <Badge 
                  variant={favorite.garageStatus === "ACTIVE" ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {favorite.garageStatus === "ACTIVE" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {favorite.garageStatus === "ACTIVE" ? "Hoạt động" : "Tạm ngưng"}
                </Badge>
              </div>

              {/* Verification Badge */}
              {favorite.garageIsVerified && (
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Star className="h-3 w-3 mr-1" />
                    Đã xác thực
                  </Badge>
                </div>
              )}

              {/* Remove Favorite Button */}
              <Button
                variant="destructive"
                size="sm"
                className="absolute bottom-3 right-3 opacity-90 hover:opacity-100"
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

            {/* Garage Info */}
            <CardHeader className="pb-3">
              <CardTitle 
                className="text-lg cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handleGarageClick(favorite.garageId)}
              >
                {favorite.garageName}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{favorite.garageAddress}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {favorite.garagePhone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{favorite.garagePhone}</span>
                  </div>
                )}
                {favorite.garageEmail && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{favorite.garageEmail}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {favorite.garageDescription && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {favorite.garageDescription}
                </p>
              )}

              {/* Location Info */}
              {favorite.garageLatitude && favorite.garageLongitude && (
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Navigation className="h-4 w-4 mr-2" />
                  <span>
                    {favorite.garageLatitude.toFixed(6)}, {favorite.garageLongitude.toFixed(6)}
                  </span>
                </div>
              )}

              {/* Added Date */}
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  Đã thêm {formatDistanceToNow(new Date(favorite.favoritedAt), { 
                    addSuffix: true, 
                    locale: vi 
                  })}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleGarageClick(favorite.garageId)}
                >
                  <Info className="h-4 w-4 mr-1" />
                  Xem Chi Tiết
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleRemoveFavorite(favorite.garageId)}
                  disabled={isRemoving === favorite.garageId}
                >
                  {isRemoving === favorite.garageId ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-1" />
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
  );
}
