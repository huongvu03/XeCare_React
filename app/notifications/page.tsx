"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Clock, Trash2, CheckCheck, Search, RefreshCw, AlertTriangle, Filter, Eye } from "lucide-react";
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchKeyword, notifications]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await getMyNotifications();
      setNotifications(response.data);
      setFilteredNotifications(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Cannot load notifications list",
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
      console.log('🔔 [NotificationsPage] Marking notification as read:', notificationId);
      
      // Update local state immediately for better UX
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
      const newUnreadCount = Math.max(0, unreadCount - 1);
      setUnreadCount(newUnreadCount);
      
      console.log('📊 [NotificationsPage] Updated unread count:', newUnreadCount);
      
      // Trigger animation cho chuông thông báo ngay lập tức
      window.dispatchEvent(new CustomEvent('newNotification', {
        detail: { count: newUnreadCount }
      }));
      
      // Trigger refresh cho NotificationBell component
      window.dispatchEvent(new Event('refreshNotifications'));
      
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
      
      // Gọi API ở background
      try {
        await markNotificationAsRead(notificationId);
        console.log('✅ [NotificationsPage] API call successful');
      } catch (apiError) {
        console.error('❌ [NotificationsPage] API call failed:', apiError);
        // Không revert UI vì user đã thấy thay đổi
      }
      
    } catch (error: any) {
      console.error('❌ [NotificationsPage] Error in handleMarkAsRead:', error);
      toast({
        title: "Error",
        description: "Cannot mark notification. Please try again.",
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
        title: "Error",
        description: "Cannot mark all notifications. Please try again.",
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
        title: "Success",
        description: "Old notifications cleaned up",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Cannot cleanup old notifications",
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


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto" suppressHydrationWarning>
          <div className="text-center py-32" suppressHydrationWarning>
            <div className="relative" suppressHydrationWarning>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6" suppressHydrationWarning></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} suppressHydrationWarning></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl mb-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          
          <div className="relative p-8 text-white text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Bell className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight mb-4">Notifications</h1>
                <p className="text-indigo-100 text-xl max-w-2xl leading-relaxed">
                  Manage all your notifications with modern and intuitive interface
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="group bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {notifications.length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Bell className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Unread</p>
                  <p className="text-3xl font-bold text-red-600">
                    {unreadCount}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">High Priority</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {notifications.filter(n => n.priority === 'HIGH').length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Today</p>
                  <p className="text-3xl font-bold text-green-600">
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

        {/* Enhanced Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
              >
                <CheckCheck className="h-5 w-5 mr-2" />
                {isMarkingAll ? "Processing..." : "Mark All as Read"}
              </Button>
            )}
            <Button
              onClick={handleCleanup}
              disabled={isCleaning}
              variant="outline"
              className="bg-white/90 border-gray-200 hover:bg-white hover:border-indigo-300 text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isCleaning ? 'animate-spin' : ''}`} />
              {isCleaning ? "Cleaning..." : "Cleanup Old"}
            </Button>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-8 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 h-5 w-5" />
              <Input
                placeholder="🔍 Search notifications..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-12 py-4 bg-white/80 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl text-lg shadow-sm"
              />
            </div>
          </CardContent>
        </Card>


        {/* Enhanced Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Bell className="w-12 h-12 text-indigo-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {searchKeyword 
                  ? "No notifications match your search" 
                  : "No notifications"}
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {searchKeyword
                  ? "Try changing your search keywords"
                  : "You don't have any notifications yet. Perform activities to receive notifications!"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredNotifications.map((notification, index) => (
              <Card 
                key={notification.id} 
                className={`group bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer rounded-2xl overflow-hidden ${
                  notification.isRead 
                    ? "" 
                    : "ring-2 ring-indigo-300 bg-gradient-to-r from-indigo-50/90 to-purple-50/90"
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
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                      }`}>
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className={`text-xl font-bold leading-tight ${
                              notification.isRead ? 'text-gray-900' : 'text-indigo-900'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg px-3 py-1 rounded-full text-sm font-semibold">
                                ✨ New
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
                        
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Summary */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 text-center">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl inline-block rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <p className="text-sm text-gray-700 font-medium">
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
