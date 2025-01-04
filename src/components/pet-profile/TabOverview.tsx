import React from 'react';
import { Calendar, Heart, Activity, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { usePets } from '../../contexts/PetContext';
import { useHealthRecords } from '../../contexts/HealthRecordContext';
import { useActivities } from '../../contexts/ActivityContext';
import { format, parseISO, differenceInYears } from 'date-fns';

export function TabOverview() {
  const { id: petId } = useParams();
  const { getPet } = usePets();
  const { getRecordsForPet } = useHealthRecords();
  const { getActivitiesForPet } = useActivities();

  const pet = getPet(petId!);
  const healthRecords = getRecordsForPet(petId!);
  const activities = getActivitiesForPet(petId!);

  if (!pet) return null;

  // Get the next upcoming health record
  const upcomingHealthRecord = healthRecords
    .filter(record => record.nextDue)
    .sort((a, b) => new Date(a.nextDue!).getTime() - new Date(b.nextDue!).getTime())[0];

  // Get the latest activity
  const latestActivity = activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Calculate age
  const getAge = () => {
    if (!pet.dateOfBirth) return 'Age unknown';
    const years = differenceInYears(new Date(), parseISO(pet.dateOfBirth));
    return `${years} ${years === 1 ? 'year' : 'years'} old`;
  };

  // Get health status based on upcoming records
  const getHealthStatus = () => {
    if (!upcomingHealthRecord) return { status: 'healthy', message: 'All up to date' };
    const dueDate = new Date(upcomingHealthRecord.nextDue!);
    const today = new Date();
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) {
      return { status: 'attention', message: 'Overdue health records' };
    } else if (daysUntilDue < 7) {
      return { status: 'warning', message: 'Upcoming health records' };
    }
    return { status: 'healthy', message: 'All up to date' };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Next Checkup */}
        <div className="bg-blue-50 rounded-xl p-4 sm:p-5 md:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Next Checkup</h3>
          </div>
          {upcomingHealthRecord ? (
            <>
              <p className="text-sm sm:text-base text-blue-600 font-medium">
                {format(parseISO(upcomingHealthRecord.nextDue!), 'MMMM d, yyyy')}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">{upcomingHealthRecord.title}</p>
            </>
          ) : (
            <>
              <p className="text-sm sm:text-base text-blue-600 font-medium">No upcoming checkups</p>
              <p className="text-xs sm:text-sm text-gray-500">Schedule a checkup for your pet</p>
            </>
          )}
        </div>

        {/* Health Status */}
        <div className={`${
          healthStatus.status === 'healthy' ? 'bg-green-50' :
          healthStatus.status === 'warning' ? 'bg-yellow-50' : 'bg-red-50'
        } rounded-xl p-4 sm:p-5 md:p-6`}>
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className={`p-1.5 sm:p-2 ${
              healthStatus.status === 'healthy' ? 'bg-green-100' :
              healthStatus.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
            } rounded-lg`}>
              {healthStatus.status === 'attention' ? (
                <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  healthStatus.status === 'healthy' ? 'text-green-600' :
                  healthStatus.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`} />
              ) : (
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  healthStatus.status === 'healthy' ? 'text-green-600' :
                  healthStatus.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`} />
              )}
            </div>
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Health Status</h3>
          </div>
          <p className={`text-sm sm:text-base ${
            healthStatus.status === 'healthy' ? 'text-green-600' :
            healthStatus.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
          } font-medium`}>
            {healthStatus.status === 'healthy' ? 'Healthy' :
             healthStatus.status === 'warning' ? 'Needs Attention' : 'Requires Immediate Care'}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">{healthStatus.message}</p>
        </div>

        {/* Activity Level */}
        <div className="bg-purple-50 rounded-xl p-4 sm:p-5 md:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Recent Activity</h3>
          </div>
          {latestActivity ? (
            <>
              <p className="text-sm sm:text-base text-purple-600 font-medium">{latestActivity.type}</p>
              <p className="text-xs sm:text-sm text-gray-500">
                {format(parseISO(latestActivity.date), 'MMM d, h:mm a')}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm sm:text-base text-purple-600 font-medium">No recent activities</p>
              <p className="text-xs sm:text-sm text-gray-500">Start logging activities</p>
            </>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">About {pet.name}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <div>
            <dl className="space-y-3 sm:space-y-4">
              <div>
                <dt className="text-xs sm:text-sm text-gray-500">Species</dt>
                <dd className="text-sm sm:text-base text-gray-900">{pet.species}</dd>
              </div>
              {pet.breed && (
                <div>
                  <dt className="text-xs sm:text-sm text-gray-500">Breed</dt>
                  <dd className="text-sm sm:text-base text-gray-900">{pet.breed}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs sm:text-sm text-gray-500">Age</dt>
                <dd className="text-sm sm:text-base text-gray-900">{getAge()}</dd>
              </div>
            </dl>
          </div>
          <div>
            <dl className="space-y-3 sm:space-y-4">
              {pet.color && (
                <div>
                  <dt className="text-xs sm:text-sm text-gray-500">Color/Markings</dt>
                  <dd className="text-sm sm:text-base text-gray-900">{pet.color}</dd>
                </div>
              )}
              {pet.microchipId && (
                <div>
                  <dt className="text-xs sm:text-sm text-gray-500">Microchip ID</dt>
                  <dd className="text-sm sm:text-base text-gray-900">{pet.microchipId}</dd>
                </div>
              )}
              {pet.dateOfBirth && (
                <div>
                  <dt className="text-xs sm:text-sm text-gray-500">Birthday</dt>
                  <dd className="text-sm sm:text-base text-gray-900">
                    {format(parseISO(pet.dateOfBirth), 'MMMM d, yyyy')}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {pet.medicalNotes && (
        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4">Medical Notes</h3>
          <p className="text-xs sm:text-sm text-gray-500">{pet.medicalNotes}</p>
        </div>
      )}

      {!pet.medicalNotes && !pet.breed && !pet.color && !pet.microchipId && (
        <div className="text-center py-4 sm:py-5 md:py-6">
          <p className="text-sm text-gray-500">
            No additional information available.{' '}
            <button className="text-blue-500 hover:text-blue-600">
              Add more details
            </button>
          </p>
        </div>
      )}
    </div>
  );
}