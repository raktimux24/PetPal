import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '../components/DashboardCard';
import { PetAvatar } from '../components/PetAvatar';
import { ActivityItem } from '../components/ActivityItem';
import { NotificationPopover } from '../components/NotificationPopover';
import { DashboardExpenseSummary } from '../components/DashboardExpenseSummary';
import { Bell, Plus, Activity, Calendar, ClipboardList, Clock } from 'lucide-react';
import { usePets } from '../contexts/PetContext';
import { useRoutines } from '../contexts/RoutineContext';
import { useActivities } from '../contexts/ActivityContext';
import { useNotifications } from '../contexts/NotificationContext';
import { format, isToday, isTomorrow, parseISO, addDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { pets, loading: petsLoading } = usePets();
  const { routines, loading: routinesLoading } = useRoutines();
  const { activities, loading: activitiesLoading } = useActivities();
  const { unreadCount } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const getUpcomingRoutines = () => {
    const today = startOfDay(new Date());
    const nextMonth = endOfDay(addDays(today, 30)); // Show next 30 days

    return routines
      .filter(routine => {
        if (routine.completed) return false;

        const routineTime = parseISO(`${format(today, 'yyyy-MM-dd')}T${routine.time}`);
        
        switch (routine.frequency) {
          case 'daily':
            return true;
          case 'weekly':
            return true;
          case 'monthly':
            if (!routine.monthlyDate) return false;
            const nextMonthlyDate = new Date(today.getFullYear(), today.getMonth(), routine.monthlyDate);
            if (nextMonthlyDate < today) {
              nextMonthlyDate.setMonth(nextMonthlyDate.getMonth() + 1);
            }
            return isWithinInterval(nextMonthlyDate, { start: today, end: nextMonth });
          case 'yearly':
            if (!routine.yearlyMonth || !routine.yearlyDate) return false;
            const monthIndex = new Date(Date.parse(`${routine.yearlyMonth} 1, 2000`)).getMonth();
            const nextYearlyDate = new Date(today.getFullYear(), monthIndex, routine.yearlyDate);
            if (nextYearlyDate < today) {
              nextYearlyDate.setFullYear(nextYearlyDate.getFullYear() + 1);
            }
            return isWithinInterval(nextYearlyDate, { start: today, end: nextMonth });
          case 'custom':
            if (!routine.customDays?.length) return false;
            const dayOfWeek = format(today, 'EEEE');
            return routine.customDays.includes(dayOfWeek);
          default:
            return false;
        }
      })
      .sort((a, b) => {
        const timeA = parseISO(`${format(today, 'yyyy-MM-dd')}T${a.time}`);
        const timeB = parseISO(`${format(today, 'yyyy-MM-dd')}T${b.time}`);
        return timeA.getTime() - timeB.getTime();
      });
  };

  const upcomingRoutines = getUpcomingRoutines();

  const recentActivities = activities
    .filter(activity => activity.date)
    .sort((a, b) => {
      try {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        return dateB.getTime() - dateA.getTime();
      } catch {
        return 0;
      }
    })
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) {
        return `Today at ${format(date, 'h:mm a')}`;
      }
      if (isTomorrow(date)) {
        return `Tomorrow at ${format(date, 'h:mm a')}`;
      }
      return format(date, 'MMM d, h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const getRoutineDescription = (routine: any) => {
    switch (routine.frequency) {
      case 'daily':
        return 'Every day';
      case 'weekly':
        return 'Every week';
      case 'monthly':
        return `Every ${routine.monthlyDate}${getOrdinalSuffix(routine.monthlyDate)} of the month`;
      case 'yearly':
        return `Every ${routine.yearlyMonth} ${routine.yearlyDate}${getOrdinalSuffix(routine.yearlyDate)}`;
      case 'custom':
        return `Every ${routine.customDays?.join(', ')}`;
      default:
        return '';
    }
  };

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">PetCare Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500">Monitor your pets' health and activities</p>
        </div>
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4">
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 relative"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <NotificationPopover
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>
          <button 
            onClick={() => navigate('/dashboard/add-pet')}
            className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-xl flex items-center gap-1.5 sm:gap-2 hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add Pet</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          <DashboardCard title="My Pets">
            {petsLoading ? (
              <div className="text-gray-500 text-center py-4">Loading pets...</div>
            ) : pets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {pets.map(pet => (
                  <PetAvatar
                    key={pet.id}
                    id={pet.id}
                    name={pet.name}
                    breed={pet.breed || 'Unknown breed'}
                    image={pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1"}
                    status={pet.status}
                    dateOfBirth={pet.dateOfBirth}
                    gender={pet.gender}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 mb-3 sm:mb-4">
                  <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No pets added yet</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Add your first pet to start tracking their care
                </p>
              </div>
            )}
          </DashboardCard>

          <DashboardCard title="Recent Activities">
            {activitiesLoading ? (
              <div className="text-gray-500 text-center py-4">Loading activities...</div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map(activity => (
                  <ActivityItem
                    key={activity.id}
                    title={activity.type}
                    time={formatDate(activity.date)}
                    completed={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 mb-3 sm:mb-4">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No recent activities</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Activities will appear here once you start logging them
                </p>
              </div>
            )}
          </DashboardCard>

          <DashboardCard title="Expense Summary">
            <DashboardExpenseSummary />
          </DashboardCard>
        </div>

        <div>
          <DashboardCard title="Upcoming Reminders">
            {routinesLoading ? (
              <div className="text-gray-500 text-center py-4">Loading reminders...</div>
            ) : upcomingRoutines.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {upcomingRoutines.map(routine => (
                  <div key={routine.id} className="bg-white border border-gray-100 rounded-lg p-3 sm:p-4">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">{routine.title}</h3>
                    <div className="mt-1 flex items-center text-xs sm:text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                      {routine.time}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {getRoutineDescription(routine)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 mb-3 sm:mb-4">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No upcoming routines</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Add routines to your pets to see reminders here
                </p>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}