import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { useHealthRecords } from '../../contexts/HealthRecordContext';
import { usePets } from '../../contexts/PetContext';
import { getAvailableVaccines } from '../../lib/vaccinations';

interface AddHealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
}

export function AddHealthRecordModal({ isOpen, onClose, petId }: AddHealthRecordModalProps) {
  const { addRecord } = useHealthRecords();
  const { getPet } = usePets();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'vaccination' as const,
    title: '',
    date: '',
    nextDue: '',
    description: ''
  });
  const [customVaccine, setCustomVaccine] = useState('');

  const pet = getPet(petId);
  const availableVaccines = pet ? getAvailableVaccines(pet) : [];
  const selectedVaccine = availableVaccines.find(v => v.name === formData.title);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addRecord(petId, {
        ...formData,
        title: formData.type === 'vaccination' && formData.title === 'other' 
          ? customVaccine 
          : formData.title
      });
      onClose();
      setFormData({
        type: 'vaccination',
        title: '',
        date: '',
        nextDue: '',
        description: ''
      });
      setCustomVaccine('');
    } catch (error) {
      console.error('Error adding health record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add Health Record for {pet.name}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Record Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="vaccination">Vaccination</option>
              <option value="medication">Medication</option>
              <option value="visit">Vet Visit</option>
            </select>
          </div>

          {formData.type === 'vaccination' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vaccine *
                </label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select vaccine</option>
                  <optgroup label="Core Vaccines">
                    {availableVaccines
                      .filter(v => v.type === 'core')
                      .map(vaccine => (
                        <option key={vaccine.id} value={vaccine.name} title={vaccine.description}>
                          {vaccine.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Non-Core Vaccines">
                    {availableVaccines
                      .filter(v => v.type === 'non-core')
                      .map(vaccine => (
                        <option key={vaccine.id} value={vaccine.name} title={vaccine.description}>
                          {vaccine.name}
                        </option>
                      ))}
                  </optgroup>
                  <option value="other">Other (specify)</option>
                </select>
              </div>

              {selectedVaccine && (
                <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-900">{selectedVaccine.description}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Type: {selectedVaccine.type === 'core' ? 'Core Vaccine' : 'Non-Core Vaccine'}
                    </p>
                  </div>
                </div>
              )}

              {formData.title === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specify Vaccine *
                  </label>
                  <input
                    type="text"
                    value={customVaccine}
                    onChange={(e) => setCustomVaccine(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter vaccine name"
                    required={formData.title === 'other'}
                  />
                </div>
              )}
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Due Date
            </label>
            <input
              type="date"
              name="nextDue"
              value={formData.nextDue}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}