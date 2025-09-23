"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/use-notifications";

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { unreadCount, isLoading } = useNotifications();
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);
  const router = useRouter();
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Trigger animation when count changes (including from 0 to any number)
    if (unreadCount > previousCount && previousCount >= 0) {
      triggerBellAnimation();
    }
    setPreviousCount(unreadCount);
  }, [unreadCount, previousCount]);

  // Removed auto-refresh to prevent infinite loop

  // Listen for custom events from other components
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent) => {
      // Trigger animation immediately
      triggerBellAnimation();
    };

    const handleRefreshNotifications = () => {
      // Refresh unread count when notifications are updated
      // Removed recursive dispatch to prevent infinite loop
    };

    // Listen for custom events
    window.addEventListener('newNotification', handleNewNotification as EventListener);
    window.addEventListener('refreshNotifications', handleRefreshNotifications);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification as EventListener);
      window.removeEventListener('refreshNotifications', handleRefreshNotifications);
    };
  }, []);

  const triggerBellAnimation = () => {
    if (bellRef.current) {
      setIsAnimating(true);
      
      // Add animation classes
      bellRef.current.classList.add('animate-bell-ring', 'animate-bounce-in');
      
      // Remove animation classes after animation completes
      setTimeout(() => {
        if (bellRef.current) {
          bellRef.current.classList.remove('animate-bell-ring', 'animate-bounce-in');
        }
        setIsAnimating(false);
      }, 2000); // Tăng thời gian animation
    }
  };

  const handleClick = () => {
    router.push("/notifications");
  };



  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" className={className} disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      ref={bellRef}
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`relative transition-all duration-300 hover:scale-110 ${
        isAnimating ? 'animate-bell-ring' : ''
      } ${className}`}
      title="Thông báo"
    >
      <Bell className={`h-5 w-5 transition-all duration-300 ${
        isAnimating ? 'text-blue-600' : ''
      }`} />
      
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className={`absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            isAnimating ? 'animate-badge-pulse scale-125' : ''
          }`}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
      
      {/* Pulse ring effect when animating */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
      )}
    </Button>
  );
}
