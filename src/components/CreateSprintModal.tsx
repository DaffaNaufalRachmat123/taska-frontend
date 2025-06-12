// src/components/CreateSprintModal.tsx

import React, { FormEvent, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

// Definisikan tipe props untuk komponen modal
interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: (sprintData: { name: string, description: string, startDate: string, endDate: string }) => void;
}

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({ isOpen, onClose, isLoading, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const sprintData = { name, description, startDate, endDate };
    onSubmit(sprintData);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl transform transition-all duration-300 ease-in-out"
      >
        {/* 2. Tambahkan Tampilan Loading di sini */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white bg-opacity-75">
            <svg className="h-10 w-10 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* 3. Bungkus konten modal agar bisa diberi efek blur */}
        <div className={`transition-filter duration-300 ${isLoading ? 'blur-xs' : ''}`}>
          {/* Header Modal */}
          <div className="flex items-start justify-between pb-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Create New Sprint
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center"
            >
              <XMarkIcon className="h-5 w-5" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Body Modal (Form) */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* ... (semua input form Anda tetap di sini) ... */}
             {/* Name Input */}
            <div>
              <label htmlFor="sprint-name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="sprint-name" value={name} onChange={(e) => setName(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5" placeholder="e.g., Sprint Alpha - Week 1" required />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="sprint-description" className="block mb-2 text-sm font-medium text-gray-700">Description</label>
              <textarea id="sprint-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5" placeholder="Describe the main goal of this sprint..."></textarea>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="start-date" className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5" required />
              </div>
              <div>
                <label htmlFor="end-date" className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5" required />
              </div>
            </div>

            {/* Footer Modal (Tombol Aksi) */}
            <div className="flex items-center justify-end pt-6 border-t border-gray-200 space-x-4">
              <button type="button" onClick={onClose} disabled={isLoading} className="rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={isLoading} className="rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Creating...' : 'Create Sprint'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSprintModal;