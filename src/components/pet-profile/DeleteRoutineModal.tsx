import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteRoutineModalProps {
  isOpen: boolean;
  routineName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteRoutineModal({ isOpen, routineName, onClose, onConfirm }: DeleteRoutineModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Routine</h3>
        <p className="text-gray-500 text-center mb-6">
          Are you sure you want to delete "{routineName}"? This action cannot be undone.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}