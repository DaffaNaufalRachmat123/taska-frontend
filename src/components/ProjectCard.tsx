// src/components/ProjectCard.tsx
import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom'; // Impor useNavigate

interface ProjectCardProps {
  projectId: string; // Tambahkan projectId
  projectName: string;
  projectType: string;
  openWorkItemsCount?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectId,
  projectName,
  projectType,
  openWorkItemsCount = 0,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/admin/project/${projectId}`);
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
            {projectName}
          </h3>
          <p className="text-xs text-gray-500 truncate">{projectType}</p>
        </div>
      </div>
      <div className="py-2 px-4">
      {/* ... (quick links tetap sama) ... */}
        <h4 className="text-xs font-semibold text-gray-700 mb-1">
          Quick links
        </h4>
        <ul className="space-y-1 text-sm text-gray-600">
          <li className="flex justify-between items-center hover:bg-gray-50 rounded-sm py-1 px-2">
            <span>My open work items</span>
            <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium">{openWorkItemsCount}</span>
          </li>
          <li className="hover:bg-gray-50 rounded-sm py-1 px-2">
            <span>Done work items</span>
          </li>
        </ul>
      </div>
      <div className="border-t border-gray-200 py-2 px-4 text-sm text-gray-600 flex items-center justify-between hover:bg-gray-50 rounded-b-lg">
        <span>1 board</span>
        <ChevronDownIcon className="h-4 w-4" />
      </div>
    </div>
  );
};

export default ProjectCard;