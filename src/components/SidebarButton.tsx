import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarButtonProps {
  Icon: LucideIcon;
  label: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function SidebarButton({ Icon, label, isActive = false, className = '', onClick }: SidebarButtonProps) {
  return (
    <div className={`relative group ${className}`}>
      <button 
        onClick={onClick}
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
          isActive ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 text-gray-400 hover:text-gray-600'
        }`}
      >
        <Icon className="w-5 h-5" />
      </button>
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[60]">
        {label}
      </div>
    </div>
  );
}