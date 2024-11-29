import React, { useState } from 'react';
import { Plus, PlayCircle, Trash2 } from 'lucide-react';
import { LogActivityModal } from './LogActivityModal';
import { useActivities } from '../../contexts/ActivityContext';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

export function TabActivities() {
  const { id: petId } = useParams();
  const { getActivitiesForPet, loading, deleteActivity } = useActivities();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activities = petId ? getActivitiesForPet(petId) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Activity Log</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log Activity
        </button>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map(activity => (
            <div
              key={activity.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start">
                <div className="p-2 bg-purple-50 rounded-lg mr-4">
                  <PlayCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{activity.type}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {format(new Date(activity.date), 'MMM d, yyyy h:mm a')}
                      </span>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Duration: {activity.duration}
                  </div>
                  {activity.notes && (
                    <p className="text-sm text-gray-500">{activity.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <PlayCircle className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No activities logged yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start logging your pet's activities to track their daily routine
            </p>
          </div>
        )}
      </div>

      {petId && (
        <LogActivityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          petId={petId}
        />
      )}
    </div>
  );
}