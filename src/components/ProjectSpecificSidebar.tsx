// src/components/board/ProjectSpecificSidebar.tsx
import React from 'react';
import {
  HomeIcon, DocumentTextIcon, ClockIcon, ViewColumnsIcon, CalendarDaysIcon, ListBulletIcon,
  ClipboardDocumentListIcon, FlagIcon, BriefcaseIcon, PlusCircleIcon, CodeBracketIcon,
  BookOpenIcon, AcademicCapIcon, LinkIcon, Cog8ToothIcon
} from '@heroicons/react/24/outline'; // Menggunakan outline icons
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/20/solid';

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

const ProjectSpecificSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-4 overflow-y-auto flex flex-col">
      <div>
        { /* Back To Dashboard Button */}
        <a
          href="/"
          className="flex items-center space-x-2 mb-4 px-3 py-2.5 text-sm rounded-md hover:bg-blue-50 hover:text-blue-600 group text-gray-700"
          title="Back to Dashboard"
        >
          <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
          <span>Back to Dashboard</span>
        </a>

        {/* Project Overview Section */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-blue-100 p-2 rounded">
            <HomeIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 truncate">Sprint Board</h2>
          </div>
        </div>

        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">SPRINT</h3>
        <nav className="space-y-1">
          <SidebarLink icon={BriefcaseIcon} text="All work" isActive={true} />
        </nav>
      </div>

    </aside>
  );
};

export default ProjectSpecificSidebar;