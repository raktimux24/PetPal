import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useHealthRecords } from './HealthRecordContext';
import { useRoutines } from './RoutineContext';
import { addDays, isWithinInterval, parseISO, startOfDay, endOfDay, format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'health' | 'routine';
  date: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const { records } = useHealthRecords();
  const { routines } = useRoutines();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const today = new Date();
    const nextWeek = addDays(today, 7);
    const newNotifications: Notification[] = [];

    // Check health records due in the next week
    records.forEach(record => {
      if (record.nextDue) {
        const dueDate = parseISO(record.nextDue);
        if (isWithinInterval(dueDate, { start: startOfDay(today), end: endOfDay(nextWeek) })) {
          newNotifications.push({
            id: `health-${record.id}`,
            title: 'Upcoming Health Record',
            message: `${record.title} is due on ${format(dueDate, 'MMM d, yyyy')}`,
            type: 'health',
            date: record.nextDue,
            read: false
          });
        }
      }
    });

    // Check routines for today
    routines.forEach(routine => {
      const routineTime = parseISO(`${format(today, 'yyyy-MM-dd')}T${routine.time}`);
      if (
        routine.frequency === 'daily' ||
        (routine.frequency === 'weekly' && format(today, 'EEEE') === format(routineTime, 'EEEE')) ||
        (routine.frequency === 'custom' && routine.customDays?.includes(format(today, 'EEEE')))
      ) {
        newNotifications.push({
          id: `routine-${routine.id}`,
          title: 'Today\'s Routine',
          message: `${routine.title} at ${format(routineTime, 'h:mm a')}`,
          type: 'routine',
          date: routineTime.toISOString(),
          read: false
        });
      }
    });

    setNotifications(newNotifications.sort((a, b) => 
      parseISO(a.date).getTime() - parseISO(b.date).getTime()
    ));
  }, [currentUser, records, routines]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}