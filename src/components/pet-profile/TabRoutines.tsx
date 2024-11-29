import React, { useState } from 'react';
import { Clock, Plus, Check, Calendar, Trash2 } from 'lucide-react';
import { AddRoutineModal } from './AddRoutineModal';
import { DeleteRoutineModal } from './DeleteRoutineModal';
import { useRoutines } from '../../contexts/RoutineContext';
import { useParams } from 'react-router-dom';

export function TabRoutines() {
  const { id: petId } = useParams();
  const { getRoutinesForPet, loading, toggleRoutineCompletion, deleteRoutine } = useRoutines();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; routineId: string; routineName: string }>({
    isOpen: false,
    routineId: '',
    routineName: ''
  });

  const routines = petId ? getRoutinesForPet(petId) : [];
  const dailyRoutines = routines.filter(routine => routine.frequency === 'daily');
  const weeklyRoutines = routines.filter(routine => routine.frequency === 'weekly');
  const monthlyRoutines = routines.filter(routine => routine.frequency === 'monthly');
  const yearlyRoutines = routines.filter(routine => routine.frequency === 'yearly');
  const customRoutines = routines.filter(routine => routine.frequency === 'custom');

  const handleDeleteRoutine = async () => {
    if (deleteModal.routineId) {
      await deleteRoutine(deleteModal.routineId);
      setDeleteModal({ isOpen: false, routineId: '', routineName: '' });
    }
  };

  const RoutineItem = ({ routine }: { routine: Routine }) => (
    <div
      className={`flex items-center p-4 rounded-xl ${
        routine.completed ? 'bg-gray-50' : 'bg-white border border-gray-200'
      }`}
    >
      <div className="mr-4">
        <button
          onClick={() => toggleRoutineCompletion(routine.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            routine.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          {routine.completed && <Check className="w-4 h-4 text-white" />}
        </button>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-gray-900">{routine.title}</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{routine.time}</span>
            </div>
            <button
              onClick={() => setDeleteModal({ 
                isOpen: true, 
                routineId: routine.id, 
                routineName: routine.title 
              })}
              className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {routine.customDays && (
          <p className="text-sm text-gray-500">Every {routine.customDays.join(', ')}</p>
        )}
        {routine.monthlyDate && (
          <p className="text-sm text-gray-500">Every {routine.monthlyDate}th of the month</p>
        )}
        {routine.yearlyMonth && routine.yearlyDate && (
          <p className="text-sm text-gray-500">Every {routine.yearlyMonth} {routine.yearlyDate}</p>
        )}
      </div>
    </div>
  );

  const ScheduleSection = ({ 
    title, 
    icon: Icon, 
    routines 
  }: { 
    title: string; 
    icon: typeof Clock; 
    routines: Routine[] 
  }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-gray-900">
        <Icon className="w-5 h-5" />
        <h3 className="font-medium">{title}</h3>
      </div>
      {routines.length > 0 ? (
        <div className="grid gap-4">
          {routines.map(routine => (
            <RoutineItem key={routine.id} routine={routine} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">No routines scheduled</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading routines...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Routines</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Routine
        </button>
      </div>

      <div className="space-y-8">
        <ScheduleSection 
          title="Daily Schedule" 
          icon={Clock} 
          routines={dailyRoutines} 
        />
        
        <ScheduleSection 
          title="Weekly Schedule" 
          icon={Calendar} 
          routines={weeklyRoutines} 
        />

        <ScheduleSection 
          title="Monthly Schedule" 
          icon={Calendar} 
          routines={monthlyRoutines} 
        />

        <ScheduleSection 
          title="Yearly Schedule" 
          icon={Calendar} 
          routines={yearlyRoutines} 
        />

        {customRoutines.length > 0 && (
          <ScheduleSection 
            title="Custom Schedule" 
            icon={Calendar} 
            routines={customRoutines} 
          />
        )}
      </div>

      {petId && (
        <AddRoutineModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          petId={petId}
        />
      )}

      <DeleteRoutineModal
        isOpen={deleteModal.isOpen}
        routineName={deleteModal.routineName}
        onClose={() => setDeleteModal({ isOpen: false, routineId: '', routineName: '' })}
        onConfirm={handleDeleteRoutine}
      />
    </div>
  );
}