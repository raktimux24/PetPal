import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import { TabOverview } from '../components/pet-profile/TabOverview';
import { TabHealth } from '../components/pet-profile/TabHealth';
import { TabRoutines } from '../components/pet-profile/TabRoutines';
import { TabActivities } from '../components/pet-profile/TabActivities';
import { TabBehavior } from '../components/pet-profile/TabBehavior';
import { TabExpenses } from '../components/pet-profile/TabExpenses';
import { DeletePetModal } from '../components/pet-profile/DeletePetModal';
import { EditPetModal } from '../components/pet-profile/EditPetModal';
import { usePets } from '../contexts/PetContext';

type TabId = 'overview' | 'health' | 'routines' | 'activities' | 'behavior' | 'expenses';

const TABS = [
  { id: 'overview' as TabId, label: 'Overview' },
  { id: 'health' as TabId, label: 'Health Records' },
  { id: 'routines' as TabId, label: 'Routines' },
  { id: 'activities' as TabId, label: 'Activities' },
  { id: 'behavior' as TabId, label: 'Behavior Analysis' },
  { id: 'expenses' as TabId, label: 'Expenses' }
] as const;

export default function PetProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getPet, deletePet } = usePets();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const pet = getPet(id!);

  useEffect(() => {
    if (!pet) {
      navigate('/dashboard');
    }
  }, [pet, navigate]);

  const handleDeletePet = () => {
    if (id) {
      deletePet(id);
      navigate('/dashboard');
    }
  };

  if (!pet) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative h-28 sm:h-36 md:h-44 lg:h-48 bg-gradient-to-r from-blue-500 to-purple-500">
            <img
              src={pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1"}
              alt={pet.name}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            />
            <div className="absolute -bottom-10 sm:-bottom-12 md:-bottom-14 lg:-bottom-16 left-3 sm:left-5 md:left-6 lg:left-8">
              <div className="relative">
                <img
                  src={pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1"}
                  alt={pet.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <span className={`absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 border-4 border-white rounded-full ${
                  pet.status === 'healthy' ? 'bg-green-400' :
                  pet.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
              </div>
            </div>
          </div>

          <div className="pt-14 sm:pt-16 md:pt-18 lg:pt-20 px-3 sm:px-5 md:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{pet.name}</h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-500">
                  {pet.breed} • {pet.dateOfBirth ? `${new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear()} years old` : 'Age unknown'}
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-100"
                >
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="border-b border-gray-200 mt-4 sm:mt-6 md:mt-7 lg:mt-8">
              <div className="flex overflow-x-auto scrollbar-hide -mx-3 sm:-mx-5 md:-mx-6 lg:-mx-8">
                <div className="flex-none min-w-full px-3 sm:px-5 md:px-6 lg:px-8">
                  <nav className="flex space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8">
                    {TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 sm:py-4 px-1 border-b-2 whitespace-nowrap text-xs sm:text-sm font-medium ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            <div className="py-4 sm:py-5 md:py-6 lg:py-8">
              {activeTab === 'overview' && <TabOverview />}
              {activeTab === 'health' && <TabHealth />}
              {activeTab === 'routines' && <TabRoutines />}
              {activeTab === 'activities' && <TabActivities />}
              {activeTab === 'behavior' && <TabBehavior />}
              {activeTab === 'expenses' && <TabExpenses />}
            </div>
          </div>
        </div>
      </div>

      <DeletePetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePet}
      />

      <EditPetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        pet={pet}
      />
    </div>
  );
}