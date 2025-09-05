export interface Notification {
  id: number;
  recipientType: 'USER' | 'GARAGE';
  recipientId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: number;
  relatedType?: string;
  actionUrl?: string;
  priority?: string;
  category?: string;
}

export interface NotificationCount {
  unreadCount: number;
  totalCount: number;
}

export enum NotificationType {
  // Emergency notifications
  EMERGENCY_REQUEST_CREATED = 'EMERGENCY_REQUEST_CREATED',
  EMERGENCY_QUOTE_RECEIVED = 'EMERGENCY_QUOTE_RECEIVED',
  EMERGENCY_STATUS_UPDATED = 'EMERGENCY_STATUS_UPDATED',
  EMERGENCY_COMPLETED = 'EMERGENCY_COMPLETED',
  EMERGENCY_CANCELLED = 'EMERGENCY_CANCELLED',
  
  // Favorite notifications
  FAVORITE_ADDED = 'FAVORITE_ADDED',
  FAVORITE_REMOVED = 'FAVORITE_REMOVED',
  
  // Appointment notifications
  APPOINTMENT_CREATED = 'APPOINTMENT_CREATED',
  APPOINTMENT_CONFIRMED = 'APPOINTMENT_CONFIRMED',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  APPOINTMENT_COMPLETED = 'APPOINTMENT_COMPLETED',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  
  // System notifications
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
  MAINTENANCE_NOTICE = 'MAINTENANCE_NOTICE',
  NEW_FEATURE = 'NEW_FEATURE',
  WELCOME_MESSAGE = 'WELCOME_MESSAGE',
  
  // General notifications
  GENERAL = 'GENERAL'
}

export const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.EMERGENCY_REQUEST_CREATED:
    case NotificationType.EMERGENCY_QUOTE_RECEIVED:
    case NotificationType.EMERGENCY_STATUS_UPDATED:
    case NotificationType.EMERGENCY_COMPLETED:
    case NotificationType.EMERGENCY_CANCELLED:
      return '🚨';
    
    case NotificationType.FAVORITE_ADDED:
    case NotificationType.FAVORITE_REMOVED:
      return '❤️';
    
    case NotificationType.APPOINTMENT_CREATED:
    case NotificationType.APPOINTMENT_CONFIRMED:
    case NotificationType.APPOINTMENT_CANCELLED:
    case NotificationType.APPOINTMENT_COMPLETED:
    case NotificationType.APPOINTMENT_REMINDER:
      return '📅';
    
    case NotificationType.SYSTEM_UPDATE:
    case NotificationType.MAINTENANCE_NOTICE:
    case NotificationType.NEW_FEATURE:
    case NotificationType.WELCOME_MESSAGE:
      return '⚙️';
    
    default:
      return '🔔';
  }
};

export const getNotificationColor = (type: NotificationType, priority?: string) => {
  // Ưu tiên theo priority trước
  if (priority === 'HIGH') {
    return 'text-red-600 bg-red-50 border-red-200';
  }
  
  switch (type) {
    case NotificationType.EMERGENCY_REQUEST_CREATED:
    case NotificationType.EMERGENCY_QUOTE_RECEIVED:
    case NotificationType.EMERGENCY_STATUS_UPDATED:
    case NotificationType.EMERGENCY_COMPLETED:
    case NotificationType.EMERGENCY_CANCELLED:
      return 'text-red-600 bg-red-50 border-red-200';
    
    case NotificationType.FAVORITE_ADDED:
    case NotificationType.FAVORITE_REMOVED:
      return 'text-pink-600 bg-pink-50 border-pink-200';
    
    case NotificationType.APPOINTMENT_CREATED:
    case NotificationType.APPOINTMENT_CONFIRMED:
    case NotificationType.APPOINTMENT_CANCELLED:
    case NotificationType.APPOINTMENT_COMPLETED:
    case NotificationType.APPOINTMENT_REMINDER:
      return 'text-blue-600 bg-blue-50 border-blue-200';
    
    case NotificationType.SYSTEM_UPDATE:
    case NotificationType.MAINTENANCE_NOTICE:
    case NotificationType.NEW_FEATURE:
    case NotificationType.WELCOME_MESSAGE:
      return 'text-purple-600 bg-purple-50 border-purple-200';
    
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getNotificationPriorityIcon = (priority?: string) => {
  switch (priority) {
    case 'HIGH':
      return '🔴';
    case 'MEDIUM':
      return '🟡';
    case 'LOW':
      return '🟢';
    default:
      return '⚪';
  }
};

export const getNotificationCategoryLabel = (category?: string) => {
  switch (category) {
    case 'EMERGENCY':
      return 'Khẩn cấp';
    case 'FAVORITE':
      return 'Yêu thích';
    case 'APPOINTMENT':
      return 'Lịch hẹn';
    case 'SYSTEM':
      return 'Hệ thống';
    case 'GARAGE':
      return 'Garage';
    default:
      return 'Chung';
  }
};
