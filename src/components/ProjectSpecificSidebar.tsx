// src/components/board/ProjectSpecificSidebar.tsx
import React from 'react';
import {
  HomeIcon, DocumentTextIcon, ClockIcon, ViewColumnsIcon, CalendarDaysIcon, ListBulletIcon,
  ClipboardDocumentListIcon, FlagIcon, BriefcaseIcon, PlusCircleIcon, CodeBracketIcon,
  BookOpenIcon, AcademicCapIcon, LinkIcon, Cog8ToothIcon
} from '@heroicons/react/24/outline'; // Menggunakan outline icons

interface SidebarLinkProps {
  icon: React.ElementType;
  text: string;
  href?: string;
  isActive?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, text, href = "#", isActive }) => (
  <a
    href={href}
    className={`flex items-center space-x-3 px-3 py-2.5 text-sm rounded-md hover:bg-blue-50 hover:text-blue-600 group ${
      isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
    }`}
  >
    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
    <span>{text}</span>
  </a>
);

interface SprintSpecificSidebarProps {
  sprintName?: string; // Nama proyek dari URL atau props
}

const ProjectSpecificSidebar: React.FC<SprintSpecificSidebarProps> = ({ sprintName = "Chatbot for Customer..." }) => {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-4 overflow-y-auto flex flex-col">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-blue-100 p-2 rounded">
             {/* Ganti dengan ikon proyek yang sesuai jika ada, atau inisial */}
            <HomeIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 truncate">{sprintName}</h2>
            <p className="text-xs text-gray-500">Software project</p>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default ProjectSpecificSidebar;