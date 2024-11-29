import React from 'react';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { format, isToday, isTomorrow } from 'date-fns';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPopover({ isOpen, onClose }: NotificationPopoverProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const formatDate = (date: string) => {
    const notifDate = new Date(date);
    if (isToday(notifDate)) {
      return `Today at ${format(notifDate, 'h:mm a')}`;
    } else if (isTomorrow(notifDate)) {
      return `Tomorrow at ${format(notifDate, 'h:mm a')}`;
    }
    return format(notifDate, 'MMM d, h:mm a');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />

      {/* Notification panel */}
      <div className={`
        fixed md:absolute
        inset-x-0 top-0 md:top-auto md:right-0 md:left-auto
        h-[100dvh] md:h-auto
        md:mt-2 md:w-80
        bg-white
        md:rounded-xl
        shadow-lg
        ring-1 ring-black ring-opacity-5
        z-50
        flex flex-col
      `}>
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    notification.read ? 'opacity-60' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'health' 
                        ? 'bg-blue-50' 
                        : 'bg-purple-50'
                    }`}>
                      <Bell className={`w-5 h-5 ${
                        notification.type === 'health'
                          ? 'text-blue-500'
                          : 'text-purple-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No new notifications
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </>
  );
}