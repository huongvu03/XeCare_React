"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { getMyNotifications, getUnreadNotificationCount } from "@/lib/api/NotificationApi";
import type { Notification } from "@/types/Users/notification";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getMyNotifications();
      setNotifications(response.data);
    } catch (error) {
      // Silent error handling
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadNotificationCount();
      setUnreadCount(response.data);
    } catch (error) {
      // Silent error handling
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  const refreshUnreadCount = useCallback(async () => {
    await loadUnreadCount();
  }, [loadUnreadCount]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Trigger animation cho chuông thông báo
      window.dispatchEvent(new CustomEvent('newNotification', {
        detail: { count: Math.max(0, unreadCount - 1) }
      }));
      
    } catch (error) {
      // Silent error handling
    }
  }, [unreadCount]);

  const markAllAsRead = useCallback(async () => {
    // Update local state immediately for better UX
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    
    // Refresh every 10 seconds để cập nhật nhanh hơn
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [loadNotifications, loadUnreadCount]);

  // Listen for refresh events from other components
  useEffect(() => {
    const handleRefresh = () => {
      loadUnreadCount();
    };

    window.addEventListener('refreshNotifications', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshNotifications', handleRefresh);
    };
  }, [loadUnreadCount]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    refreshNotifications,
    refreshUnreadCount,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
