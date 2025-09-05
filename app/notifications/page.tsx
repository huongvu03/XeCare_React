"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, CheckCircle, Clock, Trash2, CheckCheck, Filter, X, Search, AlertTriangle, Star, Calendar, Settings, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  getMyNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  getUnreadNotificationCount,
  getNotificationsByType,
  getNotificationsByCategory,
  getNotificationsByPriority,
  getEmergencyNotifications,
  searchNotifications,
  cleanupOldNotifications
} from "@/lib/api/NotificationApi";
import type { Notification, NotificationType } from "@/types/Users/notification";
import { getNotificationIcon, getNotificationColor, getNotificationPriorityIcon, getNotificationCategoryLabel } from "@/types/Users/notification";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedType, selectedCategory, selectedPriority, showEmergencyOnly, searchKeyword, notifications]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await getMyNotifications();
      setNotifications(response.data);
      setFilteredNotifications(response.data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thông báo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadNotificationCount();
      setUnreadCount(response.data);
    } catch (error) {
      // Silent error handling
    }
  };

  // Function to refresh unread count (can be called from parent components)
  const refreshUnreadCount = useCallback(async () => {
    await loadUnreadCount();
  }, []);

  const applyFilters = () => {
    let filtered = [...notifications];

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(n => n.type === selectedType);
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(n => n.category === selectedCategory);
    }

    // Filter by priority
    if (selectedPriority) {
      filtered = filtered.filter(n => n.priority === selectedPriority);
    }

    // Filter emergency only
    if (showEmergencyOnly) {
      filtered = filtered.filter(n => n.priority === 'HIGH' || n.category === 'EMERGENCY');
    }

    // Filter by search keyword
    if (searchKeyword.trim()) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        n.message.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      // Update local state immediately for better UX (giống handleMarkAllAsRead)
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      
      // Update filtered notifications
      setFilteredNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Trigger animation cho chuông thông báo ngay lập tức
      window.dispatchEvent(new CustomEvent('newNotification', {
        detail: { count: Math.max(0, unreadCount - 1) }
      }));
      
      toast({
        title: "Thành công",
        description: "Đã đánh dấu thông báo là đã đọc",
      });
      
      // Gọi API ở background (không cần await)
      markNotificationAsRead(notificationId).catch(() => {
        // Không revert UI vì user đã thấy thay đổi
      });
      
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể đánh dấu thông báo. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAll(true);
      
      // Update all notifications to read immediately (giống handleMarkAsRead)
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      // Update filtered notifications
      setFilteredNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      // Trigger animation cho chuông thông báo
      window.dispatchEvent(new CustomEvent('newNotification', {
        detail: { count: 0 }
      }));
      
      toast({
        title: "Thành công",
        description: "Đã đánh dấu tất cả thông báo là đã đọc",
      });
      
      // Gọi API ở background (không cần await)
      markAllNotificationsAsRead().catch(() => {
        // Không revert UI vì user đã thấy thay đổi
      });
      
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đánh dấu tất cả thông báo. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleCleanup = async () => {
    try {
      setIsCleaning(true);
      await cleanupOldNotifications();
      await loadNotifications();
      toast({
        title: "Thành công",
        description: "Đã dọn dẹp thông báo cũ",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể dọn dẹp thông báo cũ",
        variant: "destructive",
      });
    } finally {
      setIsCleaning(false);
    }
  };



  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
    
    if (!notification.isRead) {
      // Gọi handleMarkAsRead để update UI ngay lập tức
      handleMarkAsRead(notification.id);
    }
  };

  const clearAllFilters = () => {
    setSelectedType(null);
    setSelectedCategory(null);
    setSelectedPriority(null);
    setShowEmergencyOnly(false);
    setSearchKeyword("");
  };

  const notificationTypes = [
    { value: 'EMERGENCY_REQUEST_CREATED', label: 'Tạo yêu cầu khẩn cấp', icon: '🚨' },
    { value: 'EMERGENCY_QUOTE_RECEIVED', label: 'Báo giá khẩn cấp', icon: '💰' },
    { value: 'EMERGENCY_STATUS_UPDATED', label: 'Cập nhật khẩn cấp', icon: '📊' },
    { value: 'FAVORITE_ADDED', label: 'Thêm yêu thích', icon: '❤️' },
    { value: 'FAVORITE_REMOVED', label: 'Xóa yêu thích', icon: '💔' },
    { value: 'APPOINTMENT_CREATED', label: 'Tạo lịch hẹn', icon: '📅' },
    { value: 'APPOINTMENT_CONFIRMED', label: 'Xác nhận lịch hẹn', icon: '✅' },
    { value: 'APPOINTMENT_CANCELLED', label: 'Hủy lịch hẹn', icon: '❌' },
    { value: 'APPOINTMENT_REMINDER', label: 'Nhắc nhở lịch hẹn', icon: '⏰' },
    { value: 'SYSTEM_UPDATE', label: 'Cập nhật hệ thống', icon: '⚙️' },
  ];

  const notificationCategories = [
    { value: 'EMERGENCY', label: 'Khẩn cấp', icon: '🚨', color: 'text-red-600 bg-red-50' },
    { value: 'FAVORITE', label: 'Yêu thích', icon: '❤️', color: 'text-pink-600 bg-pink-50' },
    { value: 'APPOINTMENT', label: 'Lịch hẹn', icon: '📅', color: 'text-blue-600 bg-blue-50' },
    { value: 'SYSTEM', label: 'Hệ thống', icon: '⚙️', color: 'text-purple-600 bg-purple-50' },
    { value: 'GARAGE', label: 'Garage', icon: '🔧', color: 'text-green-600 bg-green-50' },
  ];

  const notificationPriorities = [
    { value: 'HIGH', label: 'Cao', icon: '🔴', color: 'text-red-600 bg-red-50' },
    { value: 'MEDIUM', label: 'Trung bình', icon: '🟡', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'LOW', label: 'Thấp', icon: '🟢', color: 'text-green-600 bg-green-50' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Đang tải thông báo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header với animation */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Bell className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Thông Báo
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Quản lý tất cả thông báo của bạn với giao diện hiện đại và trực quan
          </p>
        </div>

        {/* Stats Cards với glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="group bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tổng cộng</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {notifications.length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Bell className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Chưa đọc</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                    {unreadCount}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Ưu tiên cao</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    {notifications.filter(n => n.priority === 'HIGH').length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Hôm nay</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    {notifications.filter(n => {
                      const today = new Date();
                      const notificationDate = new Date(n.createdAt);
                      return notificationDate.toDateString() === today.toDateString();
                    }).length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
              >
                <CheckCheck className="h-5 w-5 mr-2" />
                {isMarkingAll ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
              </Button>
            )}
            <Button
              onClick={handleCleanup}
              disabled={isCleaning}
              variant="outline"
              className="bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isCleaning ? 'animate-spin' : ''}`} />
              {isCleaning ? "Đang dọn dẹp..." : "Dọn dẹp cũ"}
            </Button>
            

          </div>
        </div>

        {/* Search Bar với glassmorphism */}
        <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="🔍 Tìm kiếm thông báo..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-12 py-3 bg-white/60 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filter Section với glassmorphism */}
        <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Filter className="h-6 w-6 text-gray-500" />
              <span className="text-lg font-semibold text-gray-700">Bộ lọc thông minh</span>
            </div>
            
            {/* Emergency Toggle */}
            <div className="mb-6">
              <Button
                variant={showEmergencyOnly ? "default" : "outline"}
                size="lg"
                onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
                className={`flex items-center space-x-2 rounded-xl px-6 py-3 ${
                  showEmergencyOnly 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg' 
                    : 'bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
                <span>🚨 Chỉ hiển thị khẩn cấp</span>
              </Button>
            </div>

            {/* Category Filters */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">📂 Theo danh mục:</h4>
              <div className="flex flex-wrap gap-3">
                {notificationCategories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedCategory(selectedCategory === category.value ? null : category.value)}
                    className={`flex items-center space-x-2 rounded-xl px-4 py-2 transition-all duration-300 ${
                      selectedCategory === category.value 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg' 
                        : 'bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300 hover:scale-105'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Type Filters */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">🎯 Theo loại:</h4>
              <div className="flex flex-wrap gap-3">
                {notificationTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedType(selectedType === type.value ? null : type.value)}
                    className={`flex items-center space-x-2 rounded-xl px-4 py-2 transition-all duration-300 ${
                      selectedType === type.value 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg' 
                        : 'bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300 hover:scale-105'
                    }`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span>{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Priority Filters */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">⚡ Theo độ ưu tiên:</h4>
              <div className="flex flex-wrap gap-3">
                {notificationPriorities.map((priority) => (
                  <Button
                    key={priority.value}
                    variant={selectedPriority === priority.value ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedPriority(selectedPriority === priority.value ? null : priority.value)}
                    className={`flex items-center space-x-2 rounded-xl px-4 py-2 transition-all duration-300 ${
                      selectedPriority === priority.value 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg' 
                        : 'bg-white/60 border-gray-200 hover:bg-white hover:border-gray-300 hover:scale-105'
                    }`}
                  >
                    <span className="text-lg">{priority.icon}</span>
                    <span>{priority.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedType || selectedCategory || selectedPriority || showEmergencyOnly || searchKeyword) && (
              <Button
                variant="ghost"
                size="lg"
                onClick={clearAllFilters}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl px-6 py-3"
              >
                <X className="h-5 w-5" />
                <span>🧹 Xóa tất cả bộ lọc</span>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Notifications List với animation */}
        {filteredNotifications.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="p-16 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-12 h-12 text-gray-500" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                {searchKeyword || selectedType || selectedCategory || showEmergencyOnly 
                  ? "Không có thông báo nào phù hợp với bộ lọc" 
                  : "Không có thông báo nào"}
              </h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                {searchKeyword || selectedType || selectedCategory || showEmergencyOnly
                  ? "Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Bạn chưa có thông báo nào. Hãy thực hiện các hoạt động để nhận thông báo!"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredNotifications.map((notification, index) => (
              <Card 
                key={notification.id} 
                className={`group bg-white/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
                  notification.isRead 
                    ? "" 
                    : "ring-2 ring-blue-300 bg-gradient-to-r from-blue-50/80 to-indigo-50/80"
                }`}
                onClick={() => handleNotificationClick(notification)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                        notification.isRead 
                          ? 'bg-gradient-to-r from-gray-100 to-gray-200' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`}>
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className={`text-xl font-bold leading-tight ${
                              notification.isRead ? 'text-gray-900' : 'text-blue-900'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg px-3 py-1 rounded-full text-sm font-semibold">
                                ✨ Mới
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-6">
                          {notification.priority && (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg px-3 py-1 rounded-full text-sm font-semibold">
                              <span className="mr-1">{getNotificationPriorityIcon(notification.priority)}</span>
                              {notification.priority}
                            </Badge>
                          )}
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg px-3 py-1 rounded-full text-sm font-semibold">
                            {notification.type.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: vi
                              })}
                            </span>
                          </div>
                          {notification.category && (
                            <div className="flex items-center gap-2">
                              <Filter className="w-5 h-5" />
                              <span className="font-medium">
                                {getNotificationCategoryLabel(notification.category)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-4 py-2"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Đã đọc
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 text-center">
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl inline-block">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">
                  📊 Hiển thị {filteredNotifications.length} / {notifications.length} thông báo
                  {unreadCount > 0 && ` • ${unreadCount} chưa đọc`}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
