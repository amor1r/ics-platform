'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch notifications
    fetch('/api/notifications', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter((n: any) => !n.read).length);
        }
      })
      .catch(() => {
        // API not implemented yet, use empty state
      });
  }, []);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary-500 text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 w-80 z-50 max-h-96 overflow-y-auto">
            <CardContent className="p-4">
              <div className="space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-text-secondary text-sm text-center py-4">
                    لا توجد إشعارات
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-md border ${
                        !notification.read
                          ? 'bg-primary-500/10 border-primary-500/20'
                          : 'bg-background-secondary border-background-tertiary'
                      }`}
                    >
                      <p className="text-sm text-text-primary">
                        {notification.message}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {new Date(notification.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
