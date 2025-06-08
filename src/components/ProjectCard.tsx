// src/components/ProjectCard.tsx
import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom'; // Impor useNavigate
import { SprintData } from '../interfaces/sprint-interface'; // Pastikan Anda memiliki tipe SprintResponse yang sesuai

interface ProjectCardProps {
  sprint: SprintData; // Menggunakan tipe SprintResponse dari interface
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  sprint
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/sprint/${sprint.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Fungsi untuk menentukan warna badge berdasarkan status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    // Tambahkan onClick pada div terluar dan cursor-pointer
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={handleClick}>
      <div className="bg-gray-100 py-3 px-4 flex items-center space-x-2">
        {/* ... (ikon dan nama proyek tetap sama) ... */}
        <div className="bg-blue-500 rounded-md p-2 text-white">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </div>
        <div className="truncate">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {sprint.name || "Sprint Name"}
          </h3>
        </div>
      </div>
      <div className="py-3 px-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-1">Start Date</p>
            <p className="font-medium">{formatDate(sprint.start_date)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">End Date</p>
            <p className="font-medium">{formatDate(sprint.end_date)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sprint.status)}`}>
              {sprint.status || "new"}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Creator</p>
            <p className="font-medium truncate">{sprint.creator_name}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 py-2 px-4 text-sm text-gray-600 flex items-center justify-between hover:bg-gray-50 rounded-b-lg">
        <span>View board</span>
        <ChevronDownIcon className="h-4 w-4" />
      </div>
    </div>
  );
};

export default ProjectCard;