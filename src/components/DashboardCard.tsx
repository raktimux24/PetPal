import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className = '' }: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 sm:p-5 lg:p-6 ${className}`}>
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{title}</h2>
      {children}
    </div>
  );
}