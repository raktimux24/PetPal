import React from 'react';
import { Link } from 'react-router-dom';
import { differenceInYears, parseISO } from 'date-fns';

interface PetAvatarProps {
  id: string;
  name: string;
  breed: string;
  image: string;
  status?: 'healthy' | 'warning' | 'attention';
  dateOfBirth?: string;
  gender?: string;
}

export function PetAvatar({ id, name, breed, image, status = 'healthy', dateOfBirth, gender }: PetAvatarProps) {
  const statusColors = {
    healthy: 'bg-green-400',
    warning: 'bg-yellow-400',
    attention: 'bg-red-400'
  };

  const getAge = () => {
    if (!dateOfBirth) return null;
    const years = differenceInYears(new Date(), parseISO(dateOfBirth));
    return `${years}y`;
  };

  const age = getAge();

  return (
    <Link to={`/dashboard/pet/${id}`} className="block">
      <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="relative flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${statusColors[status]} border border-white`} />
        </div>
        <div className="ml-2 min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">{name}</h3>
            <div className="flex items-center gap-1">
              {age && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">
                  {age}
                </span>
              )}
              {gender && (
                <span className="px-1.5 py-0.5 text-xs bg-purple-50 text-purple-600 rounded">
                  {gender}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 truncate">{breed}</p>
        </div>
      </div>
    </Link>
  );
}