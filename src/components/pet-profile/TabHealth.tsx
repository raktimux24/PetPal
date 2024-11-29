import React, { useState } from 'react';
import { Plus, FileText, Syringe, Stethoscope } from 'lucide-react';
import { AddHealthRecordModal } from './AddHealthRecordModal';
import { useHealthRecords } from '../../contexts/HealthRecordContext';
import { useParams } from 'react-router-dom';

export function TabHealth() {
  const { id: petId } = useParams();
  const { getRecordsForPet, loading } = useHealthRecords();
  const [activeType, setActiveType] = useState<'all' | 'vaccination' | 'medication' | 'visit'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const records = petId ? getRecordsForPet(petId) : [];
  const filteredRecords = records.filter(
    record => activeType === 'all' || record.type === activeType
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="w-5 h-5" />;
      case 'medication':
        return <FileText className="w-5 h-5" />;
      case 'visit':
        return <Stethoscope className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading health records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <button
            onClick={() => setActiveType('all')}
            className={`px-4 py-2 rounded-lg ${
              activeType === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Records
          </button>
          <button
            onClick={() => setActiveType('vaccination')}
            className={`px-4 py-2 rounded-lg ${
              activeType === 'vaccination'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Vaccinations
          </button>
          <button
            onClick={() => setActiveType('medication')}
            className={`px-4 py-2 rounded-lg ${
              activeType === 'medication'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Medications
          </button>
          <button
            onClick={() => setActiveType('visit')}
            className={`px-4 py-2 rounded-lg ${
              activeType === 'visit'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Vet Visits
          </button>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Record
        </button>
      </div>

      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <div
              key={record.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start">
                <div className="p-2 bg-blue-50 rounded-lg mr-4">
                  {getTypeIcon(record.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{record.title}</h3>
                    <span className="text-sm text-gray-500">{record.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{record.description}</p>
                  {record.nextDue && (
                    <div className="text-sm">
                      <span className="text-gray-500">Next due: </span>
                      <span className="text-blue-600 font-medium">{record.nextDue}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No health records found</p>
            <p className="text-sm text-gray-400 mt-1">
              Add a health record to start tracking your pet's health
            </p>
          </div>
        )}
      </div>

      {petId && (
        <AddHealthRecordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          petId={petId}
        />
      )}
    </div>
  );
}