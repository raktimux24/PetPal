import React from 'react';
import { Clock, CalendarCheck } from 'lucide-react';

interface ActivityItemProps {
  title: string;
  time: string;
  completed?: boolean;
}

export function ActivityItem({ title, time, completed = false }: ActivityItemProps) {
  return (
    <div className={`flex items-center p-3 rounded-lg ${completed ? 'bg-gray-50' : 'bg-blue-50'}`}>
      {completed ? (
        <CalendarCheck className="w-5 h-5 text-gray-400 mr-3" />
      ) : (
        <Clock className="w-5 h-5 text-blue-500 mr-3" />
      )}
      <div className="flex-1">
        <h3 className={`text-sm font-medium ${completed ? 'text-gray-500' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-xs ${completed ? 'text-gray-400' : 'text-gray-500'}`}>{time}</p>
      </div>
    </div>
  );
}