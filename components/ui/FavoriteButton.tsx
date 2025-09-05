"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { toggleFavorite, checkFavoriteStatus } from "@/lib/api/FavoriteApi"
import { useToast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
  garageId: number
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
  onFavoriteChange?: (isFavorited: boolean) => void
}

export function FavoriteButton({ 
  garageId, 
  size = "default", 
  variant = "ghost",
  className = "",
  onFavoriteChange 
}: FavoriteButtonProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Refresh favorite status từ server
  const refreshFavoriteStatus = async () => {
    try {
      console.log("🔄 [FavoriteButton] Refreshing favorite status for garage:", garageId)
      const response = await checkFavoriteStatus(garageId)
      const serverStatus = response.data.isFavorited
      console.log("🔄 [FavoriteButton] Server status:", serverStatus, "Local status:", isFavorited)
      
      if (serverStatus !== isFavorited) {
        console.log("✅ [FavoriteButton] Updating local state to match server")
        setIsFavorited(serverStatus)
        
        // Gọi callback nếu có
        if (onFavoriteChange) {
          onFavoriteChange(serverStatus)
        }
      }
    } catch (error) {
      console.error("❌ [FavoriteButton] Error refreshing status:", error)
    }
  }

  // Check initial favorite status
  useEffect(() => {
    if (user && !isInitialized) {
      checkInitialStatus()
    }
  }, [user, isInitialized])

  const checkInitialStatus = async () => {
    try {
      setIsLoading(true)
      console.log("🔍 [FavoriteButton] Checking initial favorite status for garage:", garageId)
      
      const response = await checkFavoriteStatus(garageId)
      console.log("✅ [FavoriteButton] Initial status response:", response.data)
      
      setIsFavorited(response.data.isFavorited)
      setIsInitialized(true)
    } catch (error: any) {
      console.error("❌ [FavoriteButton] Error checking initial status:", error)
      
      if (error.response?.status === 401) {
        console.log("🔑 [FavoriteButton] User not authenticated, redirecting to login")
        router.push("/auth")
        return
      }
      
      if (error.response?.status === 403) {
        console.log("🚫 [FavoriteButton] Access forbidden - user may not have permission")
        toast({
          title: "Không có quyền truy cập",
          description: "Bạn không có quyền sử dụng tính năng yêu thích. Vui lòng liên hệ admin.",
          variant: "destructive",
        })
        return
      }
      
      // For other errors, still set as initialized to avoid infinite loading
      setIsInitialized(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để sử dụng tính năng yêu thích",
        variant: "destructive",
      })
      router.push("/auth")
      return
    }

    setIsLoading(true)
    try {
      console.log("💖 [FavoriteButton] Toggling favorite for garage:", garageId)
      
      const response = await toggleFavorite(garageId)
      console.log("✅ [FavoriteButton] Toggle response:", response)
      
      // Cập nhật state ngay lập tức dựa trên response
      let newFavoriteStatus = isFavorited
      
      if (response.status === 201) {
        // POST thành công - đã thêm vào favorites
        newFavoriteStatus = true
        console.log("💖 [FavoriteButton] Successfully added to favorites")
      } else if (response.status === 204) {
        // DELETE thành công - đã xóa khỏi favorites  
        newFavoriteStatus = false
        console.log("💔 [FavoriteButton] Successfully removed from favorites")
      } else {
        // Fallback: toggle ngược lại
        newFavoriteStatus = !isFavorited
        console.log("🔄 [FavoriteButton] Fallback toggle to:", newFavoriteStatus)
      }
      
      // Cập nhật state
      setIsFavorited(newFavoriteStatus)
      
      // Hiển thị thông báo thành công
      if (newFavoriteStatus) {
        toast({
          title: "Đã thêm vào yêu thích",
          description: "Garage đã được thêm vào danh sách yêu thích",
        })
      } else {
        toast({
          title: "Đã xóa khỏi yêu thích",
          description: "Garage đã được xóa khỏi danh sách yêu thích",
        })
      }
      
      // Gọi callback để cập nhật parent component nếu có
      if (onFavoriteChange) {
        onFavoriteChange(newFavoriteStatus)
      }
      
    } catch (error: any) {
      // Không log gì cả - chỉ xử lý lỗi cần thiết
      
      // Kiểm tra xem có phải lỗi 403 không
      if (error.response?.status === 403) {
        console.log("🚫 [FavoriteButton] 403 Forbidden - nhưng database có thể đã được cập nhật");
        
        // Thử refresh status từ server để xem có thay đổi không
        await refreshFavoriteStatus();
        
        // Hiển thị thông báo 403
        toast({
          title: "Không có quyền truy cập",
          description: "Bạn không có quyền sử dụng tính năng yêu thích. Vui lòng liên hệ admin hoặc thử lại sau.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        if (error.response?.status === 401) {
          console.log("🔐 [FavoriteButton] Unauthorized");
          toast({
            title: "Vui lòng đăng nhập",
            description: "Bạn cần đăng nhập để sử dụng tính năng yêu thích",
            variant: "destructive",
          });
          router.push("/auth");
          return;
        }
        
        if (error.response?.status === 500) {
          const errorMessage = error.response?.data;
          if (errorMessage && typeof errorMessage === 'string') {
            if (errorMessage.includes("Database table 'Favorites' does not exist")) {
              console.log("🗄️ [FavoriteButton] Database table missing");
              toast({
                title: "Lỗi hệ thống",
                description: "Bảng dữ liệu yêu thích chưa được tạo. Vui lòng liên hệ admin.",
                variant: "destructive",
              });
            } else if (errorMessage.includes("Cannot access database")) {
              console.log("🔌 [FavoriteButton] Database connection error");
              toast({
                title: "Lỗi kết nối",
                description: "Không thể kết nối database. Vui lòng thử lại sau.",
                variant: "destructive",
              });
            } else if (errorMessage.includes("Invalid user or garage ID")) {
              console.log("🆔 [FavoriteButton] Invalid ID error");
              toast({
                title: "Dữ liệu không hợp lệ",
                description: "Thông tin user hoặc garage không chính xác. Vui lòng thử lại.",
                variant: "destructive",
              });
            } else {
              console.log("💥 [FavoriteButton] Server error");
              toast({
                title: "Lỗi server",
                description: "Có lỗi xảy ra ở server. Vui lòng thử lại sau.",
                variant: "destructive",
              });
            }
          } else {
            console.log("💥 [FavoriteButton] Server error (unknown format)");
            toast({
              title: "Lỗi server",
              description: "Có lỗi xảy ra ở server. Vui lòng thử lại sau.",
              variant: "destructive",
            });
          }
          return;
        }
        
        // Lỗi khác
        console.log("❓ [FavoriteButton] Unknown error");
        toast({
          title: "Lỗi không xác định",
          description: "Có lỗi xảy ra. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } catch (toastError) {
        // Không log gì cả
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${className} transition-all duration-200 ${
        isFavorited 
          ? "text-red-500 hover:text-red-600 hover:bg-red-50" 
          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
      }`}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorited ? "fill-current" : ""} ${
          isLoading ? "animate-pulse" : ""
        }`} 
      />
    </Button>
  )
}
