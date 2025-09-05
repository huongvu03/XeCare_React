import axiosClient from "../axiosClient";
import type { Notification } from "@/types/Users/notification";

// Get user's notifications
export const getMyNotifications = () =>
  axiosClient.get<Notification[]>("/apis/notifications/me");

// Get unread notification count
export const getUnreadNotificationCount = () =>
  axiosClient.get<number>("/apis/notifications/me/unread-count");

// Get notifications by type
export const getNotificationsByType = (type: string) =>
  axiosClient.get<Notification[]>(`/apis/notifications/me/type/${type}`);

// Get notifications by category
export const getNotificationsByCategory = (category: string) =>
  axiosClient.get<Notification[]>(`/apis/notifications/me/category/${category}`);

// Get notifications by priority
export const getNotificationsByPriority = (priority: string) =>
  axiosClient.get<Notification[]>(`/apis/notifications/me/priority/${priority}`);

// Get emergency notifications
export const getEmergencyNotifications = () =>
  axiosClient.get<Notification[]>("/apis/notifications/me/emergency");

// Search notifications by keyword
export const searchNotifications = (keyword: string) =>
  axiosClient.get<Notification[]>(`/apis/notifications/me/search?keyword=${encodeURIComponent(keyword)}`);

// Mark a notification as read
export const markNotificationAsRead = (notificationId: number) =>
  axiosClient.post(`/apis/notifications/${notificationId}/read`);

// Mark all notifications as read
export const markAllNotificationsAsRead = () =>
  axiosClient.post("/apis/notifications/mark-all-read");

// Cleanup old notifications
export const cleanupOldNotifications = () =>
  axiosClient.post("/apis/notifications/cleanup");

// Get unread notification count (legacy method for backward compatibility)
export const getUnreadNotificationCountLegacy = async () => {
  const notifications = await getMyNotifications();
  const unreadCount = notifications.data.filter(n => !n.isRead).length;
  return unreadCount;
};
