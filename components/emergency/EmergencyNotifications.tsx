"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare,
  X,
  Clock,
  Car,
  DollarSign
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmergencyNotification {
  id: number
  type: 'EMERGENCY_REQUEST_CREATED' | 'EMERGENCY_QUOTE_RECEIVED' | 'EMERGENCY_STATUS_UPDATED' | 'EMERGENCY_COMPLETED' | 'EMERGENCY_CANCELLED'
  title: string
  message: string
  timestamp: string
  read: boolean
  relatedId?: number
}

interface EmergencyNotificationsProps {
  userId?: number
  onNotificationClick?: (notification: EmergencyNotification) => void
}

export function EmergencyNotifications({ userId, onNotificationClick }: EmergencyNotificationsProps) {
  const [notifications, setNotifications] = useState<EmergencyNotification[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Mock notifications for demo
  const mockNotifications: EmergencyNotification[] = [
    {
      id: 1,
      type: 'EMERGENCY_REQUEST_CREATED',
      title: 'New Emergency Request',
      message: 'Your emergency request has been created successfully. ID: #1',
      timestamp: new Date().toISOString(),
      read: false,
      relatedId: 1
    },
    {
      id: 2,
      type: 'EMERGENCY_QUOTE_RECEIVED',
      title: 'New Emergency Quote',
      message: 'You received a new quote for emergency request #1 from Lê Lợi garage',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: false,
      relatedId: 1
    },
    {
      id: 3,
      type: 'EMERGENCY_STATUS_UPDATED',
      title: 'Emergency Status Updated',
      message: 'Emergency request #2: Garage is on the way to your location',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      relatedId: 2
    }
  ]

  useEffect(() => {
    loadNotifications()
  }, [userId])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      // For demo, use mock data
      // In real app, call API: const response = await NotificationApi.getEmergencyNotifications()
      setTimeout(() => {
        setNotifications(mockNotifications)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error loading notifications:', error)
      // Use mock data as fallback
      setNotifications(mockNotifications)
      setLoading(false)
    }
  }

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
  }

  const dismissNotification = (notificationId: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    toast({
      title: "Notification",
      description: "Notification dismissed",
    })
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
    toast({
      title: "Success",
      description: "All notifications marked as read",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'EMERGENCY_REQUEST_CREATED':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'EMERGENCY_QUOTE_RECEIVED':
        return <DollarSign className="h-4 w-4 text-blue-600" />
      case 'EMERGENCY_STATUS_UPDATED':
        return <Car className="h-4 w-4 text-purple-600" />
      case 'EMERGENCY_COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'EMERGENCY_CANCELLED':
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'EMERGENCY_REQUEST_CREATED': return 'orange'
      case 'EMERGENCY_QUOTE_RECEIVED': return 'blue'
      case 'EMERGENCY_STATUS_UPDATED': return 'purple'
      case 'EMERGENCY_COMPLETED': return 'green'
      case 'EMERGENCY_CANCELLED': return 'red'
      default: return 'gray'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 0) return `${days} days ago`
    if (hours > 0) return `${hours} hours ago`
    if (minutes > 0) return `${minutes} minutes ago`
    return 'Just now'
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading notifications...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <span>Emergency Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark as Read
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertDescription>
              No emergency service notifications yet.
            </AlertDescription>
          </Alert>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                !notification.read 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
              onClick={() => {
                markAsRead(notification.id)
                onNotificationClick?.(notification)
              }}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-${getNotificationColor(notification.type)}-100 flex-shrink-0`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        dismissNotification(notification.id)
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(notification.timestamp)}</span>
                    {!notification.read && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
